import { baseUrl, isConfigured, timeoutMs } from "@/src/lib/cvGuestimator";
import { clientIp, rateLimit } from "@/src/lib/rateLimit";

/**
 * POST /api/cv/warm
 *
 * Ask the upstream service to start waking its model backend, and return
 * immediately. Called when the CV match dialog opens, so the GPU's ~90s cold
 * start happens while the visitor reads the blurb and picks a file, instead
 * of after they hit the button.
 *
 * Fire-and-forget by design: the response says a wake-up was requested, never
 * that the model is ready. Nothing in the UI should wait on it — a failed
 * warm-up just means the match pays the cold start it would have paid anyway.
 *
 * Rate limited separately from the scoring endpoints, and more loosely: this
 * is cheap to serve, but each wake-up still costs GPU minutes, so an open/
 * close loop shouldn't be able to hold a GPU up indefinitely. It deliberately
 * does NOT spend from the visitor's 5 scoring runs — being warmed should
 * never cost someone a match they haven't run yet.
 */
const WARM_LIMIT = 10;
const WARM_WINDOW_MS = 15 * 60_000;

export async function POST(request: Request): Promise<Response> {
  if (!isConfigured()) {
    // Not an error worth surfacing: the feature is simply unavailable here,
    // and the match request will say so properly if one is attempted.
    return Response.json({ warming: false, detail: "Not configured." }, { status: 200 });
  }

  const limit = rateLimit(`cv-warm:${clientIp(request)}`, WARM_LIMIT, WARM_WINDOW_MS);
  if (!limit.allowed) {
    return Response.json(
      { warming: false, detail: "Warm-up rate limit reached." },
      { status: 200 }
    );
  }

  try {
    const upstream = await fetch(`${baseUrl()}/api/warm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.CV_GUESTIMATOR_API_KEY
          ? { Authorization: `Bearer ${process.env.CV_GUESTIMATOR_API_KEY}` }
          : {}),
      },
      // Never send a bodyless POST: Google's front end in front of Cloud Run
      // answers those with 411 Length Required, which would leave warming
      // quietly broken in production.
      body: "{}",
      cache: "no-store",
      // Short on purpose: the upstream returns 202 the moment it has queued
      // the wake-up, so anything slower than this means the API itself is
      // cold — and waiting longer would not help the visitor.
      signal: AbortSignal.timeout(Math.min(timeoutMs(), 10_000)),
    });
    return Response.json(
      { warming: upstream.ok, detail: upstream.ok ? "Warming." : "Upstream declined." },
      { status: 200 }
    );
  } catch {
    // Swallowed on purpose. A warm-up is an optimisation; surfacing its
    // failure would put an error in front of a visitor who has not yet
    // asked for anything.
    return Response.json({ warming: false, detail: "Could not reach the service." }, {
      status: 200,
    });
  }
}
