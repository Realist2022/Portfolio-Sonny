/**
 * Server-side proxy to the CV to Job Guestimator FastAPI service
 * (the `src/api/routes.py` app in the CV_to_Job_Guestimator project).
 *
 * The browser never talks to that service directly. Everything goes through the
 * route handlers in `src/app/api/cv/*` so that:
 *   - the upstream URL and API key stay on the server,
 *   - uploads are validated before they can wake a GPU on Modal,
 *   - one visitor cannot run up the bill (see rateLimit),
 *   - errors come back in one shape instead of leaking FastAPI internals.
 *
 * Required env: CV_GUESTIMATOR_API_URL — see .env.example.
 */

import { clientIp, peekRateLimit, rateLimit } from "@/src/lib/rateLimit";
import type { RateLimitResult } from "@/src/lib/rateLimit";
import type { ApiErrorResponse } from "@/src/types/cv";

/** Mirrors MAX_UPLOAD_BYTES in the Python API. */
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/** The Python `_load_document` accepts these two and nothing else. */
const ALLOWED_EXTENSIONS = [".pdf", ".txt"];

/**
 * A Modal cold start is minutes, not seconds: the container has to boot vLLM
 * and load the LoRA before it can answer. Three minutes rides one out instead
 * of failing halfway through it.
 */
const DEFAULT_TIMEOUT_MS = 180_000;

/** Per-IP budget for the GPU-backed endpoints. */
const DEFAULT_RATE_LIMIT = 5;
const DEFAULT_RATE_WINDOW_MS = 15 * 60_000;

export class GuestimatorError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "GuestimatorError";
    this.status = status;
  }
}

function readInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function isConfigured(): boolean {
  return Boolean(process.env.CV_GUESTIMATOR_API_URL);
}

export function baseUrl(): string {
  const url = process.env.CV_GUESTIMATOR_API_URL;
  if (!url) {
    throw new GuestimatorError(
      "The CV Guestimator service is not configured on this deployment.",
      503
    );
  }
  return url.replace(/\/+$/, "");
}

export function timeoutMs(): number {
  return readInt("CV_GUESTIMATOR_TIMEOUT_MS", DEFAULT_TIMEOUT_MS);
}

/* ── request validation ─────────────────────────────────────────────────── */

/**
 * Validate an upload against the same rules the Python endpoint applies, so a
 * bad file is rejected here rather than after a round trip — which, against a
 * cold endpoint, is a multi-minute wait for a predictable error.
 */
export function requireFile(form: FormData, field: string, label: string): File {
  const value = form.get(field);
  if (!(value instanceof File)) {
    throw new GuestimatorError(
      `Missing ${label} upload (expected a file in the "${field}" field).`,
      400
    );
  }
  if (value.size === 0) {
    throw new GuestimatorError(`The ${label} upload is empty.`, 400);
  }
  if (value.size > MAX_UPLOAD_BYTES) {
    throw new GuestimatorError(`The ${label} upload exceeds the 10 MB limit.`, 413);
  }
  const name = value.name.toLowerCase();
  if (!ALLOWED_EXTENSIONS.some((extension) => name.endsWith(extension))) {
    throw new GuestimatorError(`The ${label} must be a PDF or TXT file.`, 400);
  }
  return value;
}

export function requireText(form: FormData, field: string, label: string): string {
  const value = form.get(field);
  if (typeof value !== "string" || value.trim() === "") {
    throw new GuestimatorError(`Missing ${label} (form field "${field}").`, 400);
  }
  if (value.length > 200) {
    throw new GuestimatorError(`The ${label} is too long.`, 400);
  }
  return value.trim();
}

/**
 * Copy the optional scoring weights across if present. The Python
 * `_scoring_engine` rejects anything outside 0.0-1.0; checking here too keeps
 * the error message ours and skips a pointless round trip.
 */
export function appendWeights(form: FormData, outbound: FormData): void {
  for (const field of ["skills_weight", "work_experience_weight"]) {
    const raw = form.get(field);
    if (raw === null || raw === "") continue;
    if (typeof raw !== "string") {
      throw new GuestimatorError(`"${field}" must be a number.`, 400);
    }
    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
      throw new GuestimatorError(
        `"${field}" must be a number between 0.0 and 1.0.`,
        400
      );
    }
    outbound.set(field, String(parsed));
  }
}

/* ── upstream call ──────────────────────────────────────────────────────── */

function authHeaders(): HeadersInit {
  const key = process.env.CV_GUESTIMATOR_API_KEY;
  // Optional: the FastAPI app is currently unauthenticated. Set the env var
  // once it is not and this starts sending the bearer token, no code change.
  return key ? { Authorization: `Bearer ${key}` } : {};
}

/** Pull a human-readable message out of a FastAPI error body. */
function upstreamDetail(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null) return null;
  const detail = (payload as { detail?: unknown }).detail;
  if (typeof detail === "string") return detail;
  // 422s from FastAPI's own validation arrive as a list of error objects.
  if (Array.isArray(detail)) {
    const messages = detail
      .map((entry) =>
        typeof entry === "object" && entry !== null
          ? String((entry as { msg?: unknown }).msg ?? "")
          : ""
      )
      .filter(Boolean);
    if (messages.length) return messages.join("; ");
  }
  return null;
}

/**
 * POST a form to the upstream service and return its parsed JSON.
 *
 * `artifact_path` is stripped from the response: it is an absolute path on the
 * Python host, of no use to a browser, and not something to hand to the public
 * internet. Drop the omission below if you ever want it back.
 */
export async function forwardJson<T>(path: string, body: FormData): Promise<T> {
  let upstream: Response;
  try {
    upstream = await fetch(`${baseUrl()}${path}`, {
      method: "POST",
      body,
      headers: authHeaders(),
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs()),
    });
  } catch (error) {
    if (error instanceof GuestimatorError) throw error;
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new GuestimatorError(
        "The model did not respond in time. The GPU may be cold-starting — try again in a minute.",
        504
      );
    }
    throw new GuestimatorError("Could not reach the CV Guestimator service.", 502);
  }

  const text = await upstream.text();
  let payload: unknown = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = null;
  }

  if (!upstream.ok) {
    // A 4xx is the caller's fault and its message is safe to relay. A 5xx is
    // the upstream's, so it becomes a 502 with a generic message rather than
    // surfacing a Python exception to the browser.
    if (upstream.status >= 500) {
      console.error(
        `CV Guestimator ${path} failed: ${upstream.status} ${text.slice(0, 500)}`
      );
      throw new GuestimatorError(
        "The CV Guestimator service failed to process that request.",
        502
      );
    }
    throw new GuestimatorError(
      upstreamDetail(payload) ??
        `The CV Guestimator service rejected the request (${upstream.status}).`,
      upstream.status
    );
  }

  if (payload === null || typeof payload !== "object") {
    throw new GuestimatorError(
      "The CV Guestimator service returned an unreadable response.",
      502
    );
  }

  const safe = { ...(payload as Record<string, unknown>) };
  delete safe.artifact_path;
  return safe as T;
}

/* ── route wrapper ──────────────────────────────────────────────────────── */

export function errorResponse(
  message: string,
  status: number,
  headers?: HeadersInit
): Response {
  return Response.json({ error: message } satisfies ApiErrorResponse, {
    status,
    headers,
  });
}

function rateHeadersFor(limit: RateLimitResult): Record<string, string> {
  return {
    "RateLimit-Limit": String(limit.limit),
    "RateLimit-Remaining": String(limit.remaining),
    "RateLimit-Reset": String(limit.retryAfterSeconds),
  };
}

/**
 * Shared shell for the three upload endpoints: rate limit, parse the multipart
 * body, build the upstream form, forward it, and turn any GuestimatorError into
 * a clean JSON error.
 *
 * `build` validates and returns the form to send upstream. It runs BEFORE the
 * rate-limit slot is spent, so a rejected upload (wrong file type, missing
 * field) costs the visitor nothing — only a request that actually reaches the
 * GPU is charged.
 */
export async function handleUpload<T>(
  request: Request,
  path: string,
  build: (form: FormData) => FormData
): Promise<Response> {
  const key = `cv:${clientIp(request)}`;
  const max = readInt("CV_GUESTIMATOR_RATE_LIMIT", DEFAULT_RATE_LIMIT);
  const window = readInt("CV_GUESTIMATOR_RATE_WINDOW_MS", DEFAULT_RATE_WINDOW_MS);

  const projected = peekRateLimit(key, max, window);
  if (!projected.allowed) {
    const minutes = Math.ceil(projected.retryAfterSeconds / 60);
    return errorResponse(
      `Rate limit reached (${projected.limit} runs per window). Try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`,
      429,
      {
        ...rateHeadersFor(projected),
        "Retry-After": String(projected.retryAfterSeconds),
      }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return errorResponse("Expected a multipart/form-data request body.", 400);
  }

  let outbound: FormData;
  try {
    outbound = build(form);
  } catch (error) {
    if (error instanceof GuestimatorError) {
      return errorResponse(error.message, error.status, rateHeadersFor(projected));
    }
    throw error;
  }

  const spent = rateLimit(key, max, window);
  const headers = rateHeadersFor(spent);

  try {
    return Response.json(await forwardJson<T>(path, outbound), { headers });
  } catch (error) {
    if (error instanceof GuestimatorError) {
      return errorResponse(error.message, error.status, headers);
    }
    console.error("CV Guestimator route failed:", error);
    return errorResponse("Something went wrong handling that request.", 500, headers);
  }
}
