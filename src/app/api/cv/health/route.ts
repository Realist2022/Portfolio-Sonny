import { baseUrl, isConfigured, timeoutMs } from "@/src/lib/cvGuestimator";
import type { HealthResponse } from "@/src/types/cv";

/**
 * GET /api/cv/health
 *
 * Is the Guestimator service configured and answering? Hits FastAPI's
 * `/openapi.json`, which never touches the GPU, so the UI can hide or disable
 * the CV feature when the Python side is down without paying for a cold start
 * to find out.
 *
 * Short timeout on purpose: this answers "is anything listening", not "is the
 * model warm". Never cached — the answer changes when a service restarts.
 */
export async function GET(): Promise<Response> {
  if (!isConfigured()) {
    return Response.json(
      {
        configured: false,
        reachable: false,
        detail: "CV_GUESTIMATOR_API_URL is not set.",
      } satisfies HealthResponse,
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const response = await fetch(`${baseUrl()}/openapi.json`, {
      cache: "no-store",
      signal: AbortSignal.timeout(Math.min(timeoutMs(), 5_000)),
    });
    return Response.json(
      {
        configured: true,
        reachable: response.ok,
        detail: response.ok ? undefined : `Upstream returned ${response.status}.`,
      } satisfies HealthResponse,
      { status: response.ok ? 200 : 502, headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return Response.json(
      {
        configured: true,
        reachable: false,
        detail: "The service did not respond.",
      } satisfies HealthResponse,
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
