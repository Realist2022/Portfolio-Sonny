import { clientIp, rateLimit } from "@/src/lib/rateLimit";

/**
 * POST /api/chat
 *
 * The chat widget's only endpoint. The browser never calls the chat backend
 * directly, so its URL and bearer key stay on the server.
 *
 * Body: { message: string, history: { role: "user" | "assistant", content }[] }
 * Answer: server-sent events, always —
 *   data: {"type":"delta","text":"..."}                 as the reply is written
 *   data: {"type":"done","reply":"...","sources":[...]} once, at the end
 *   data: {"type":"error","message":"..."}              instead of done, on failure
 * Errors before the stream starts (bad body, rate limit) are JSON { detail }.
 *
 * Two upstreams, so switching is a Vercel setting, not a deploy:
 *   CHAT_API_URL set   -> portfolio-chat-rag's /api/chat/stream (retrieval,
 *                         citations, streaming), with CHAT_API_KEY as bearer.
 *   otherwise          -> the original backend at NEXT_PUBLIC_API_URL, whose
 *                         JSON { reply } is replayed as one delta + done.
 */
export const maxDuration = 120;

const LIMIT = 20;
const WINDOW_MS = 10 * 60_000;
const TIMEOUT_MS = 90_000;
const MAX_MESSAGE_CHARS = 1000;
const MAX_HISTORY = 12;
const MAX_HISTORY_CHARS = 4000;
const UNAVAILABLE = "The assistant is unavailable right now. Please try again shortly.";

interface HistoryMessage {
  role: "user" | "assistant";
  content: string;
}

function fail(detail: string, status: number, headers: HeadersInit = {}): Response {
  return Response.json({ detail }, { status, headers });
}

/** The request, checked here so a malformed one never reaches the model. */
function parse(body: unknown): { message: string; history: HistoryMessage[] } | null {
  if (typeof body !== "object" || body === null) return null;
  const { message, history = [] } = body as { message?: unknown; history?: unknown };
  if (typeof message !== "string") return null;
  const trimmed = message.trim();
  if (!trimmed || trimmed.length > MAX_MESSAGE_CHARS) return null;
  if (!Array.isArray(history)) return null;
  const turns: HistoryMessage[] = [];
  for (const turn of history.slice(-MAX_HISTORY)) {
    const { role, content } = (turn ?? {}) as { role?: unknown; content?: unknown };
    // Only user and assistant turns: a "system" turn could rewrite the bot's rules.
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    turns.push({ role, content: content.slice(0, MAX_HISTORY_CHARS) });
  }
  return { message: trimmed, history: turns };
}

/** The upstream's own message for a 4xx (e.g. its rate limit), else a generic one. */
async function upstreamError(upstream: Response): Promise<Response> {
  let detail = UNAVAILABLE;
  if (upstream.status < 500) {
    try {
      const data = await upstream.json();
      if (typeof data?.detail === "string") detail = data.detail;
    } catch {
      // keep the generic message
    }
  }
  return fail(detail, upstream.status === 429 ? 429 : 502);
}

const SSE_HEADERS = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  "X-Accel-Buffering": "no",
};

function sse(events: object[]): Response {
  const body = events.map((e) => `data: ${JSON.stringify(e)}\n\n`).join("");
  return new Response(body, { headers: SSE_HEADERS });
}

export async function POST(request: Request): Promise<Response> {
  const ip = clientIp(request);
  const limit = rateLimit(`chat:${ip}`, LIMIT, WINDOW_MS);
  if (!limit.allowed) {
    return fail(
      "You're sending messages quickly. Please wait a few minutes and try again.",
      429,
      { "Retry-After": String(limit.retryAfterSeconds) }
    );
  }

  let parsed;
  try {
    parsed = parse(await request.json());
  } catch {
    parsed = null;
  }
  if (!parsed) return fail("Please send a message of up to 1000 characters.", 400);

  const ragUrl = process.env.CHAT_API_URL;
  const legacyUrl = process.env.NEXT_PUBLIC_API_URL;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    // The visitor's address, so the backend's own per-IP limit counts visitors
    // rather than this server.
    "X-Forwarded-For": ip,
  };

  try {
    if (ragUrl) {
      if (process.env.CHAT_API_KEY) headers.Authorization = `Bearer ${process.env.CHAT_API_KEY}`;
      const upstream = await fetch(`${ragUrl}/api/chat/stream`, {
        method: "POST",
        headers,
        body: JSON.stringify(parsed),
        cache: "no-store",
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!upstream.ok || !upstream.body) return upstreamError(upstream);
      return new Response(upstream.body, { headers: SSE_HEADERS });
    }

    if (!legacyUrl) return fail(UNAVAILABLE, 503);
    const upstream = await fetch(`${legacyUrl}/api/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify(parsed),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!upstream.ok) return upstreamError(upstream);
    const data = await upstream.json();
    const reply = typeof data?.reply === "string" ? data.reply : "";
    return sse([
      { type: "delta", text: reply },
      { type: "done", reply, sources: [] },
    ]);
  } catch (err) {
    console.error("Chat upstream failed:", err);
    return fail(UNAVAILABLE, 502);
  }
}
