import type { HealthResponse, MatchResponse } from "@/src/types/cv";

/**
 * Client for the CV Guestimator routes in `src/app/api/cv/*`.
 *
 * These are same-origin Next.js routes, so there is no base URL to configure
 * here (unlike chat.api.ts, which talks to an external service): the upstream
 * address and key live on the server.
 */

/** Mirrors MAX_UPLOAD_BYTES in the route handlers and the Python API. */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const ALLOWED_EXTENSIONS = [".pdf", ".txt"];

/** Reject an obviously bad file before spending a request on it. */
export function validateUpload(file: File, label: string): string | null {
	const name = file.name.toLowerCase();
	if (!ALLOWED_EXTENSIONS.some((extension) => name.endsWith(extension))) {
		return `The ${label} must be a PDF or TXT file.`;
	}
	if (file.size === 0) return `The ${label} is empty.`;
	if (file.size > MAX_UPLOAD_BYTES) return `The ${label} is over the 10 MB limit.`;
	return null;
}

async function readError(response: Response): Promise<string> {
	try {
		const data = await response.json();
		return data?.error || data?.message || "Something went wrong";
	} catch {
		return "Server error occurred";
	}
}

export interface MatchInput {
	jobListing: File;
	skillsWeight?: number;
	workExperienceWeight?: number;
	signal?: AbortSignal;
}

/**
 * Score a job listing against Sonny's CV.
 *
 * Only the listing is uploaded. The CV is fixed on the upstream service and
 * cannot be chosen from here, so a visitor never submits a CV of their own.
 */
export async function matchJobToCv({
	jobListing,
	skillsWeight,
	workExperienceWeight,
	signal,
}: MatchInput): Promise<MatchResponse> {
	const body = new FormData();
	body.set("job_listing", jobListing);
	if (skillsWeight !== undefined) body.set("skills_weight", String(skillsWeight));
	if (workExperienceWeight !== undefined) {
		body.set("work_experience_weight", String(workExperienceWeight));
	}

	const response = await fetch("/api/cv/match", { method: "POST", body, signal });

	if (!response.ok) {
		throw new Error(await readError(response));
	}

	return response.json() as Promise<MatchResponse>;
}

/**
 * Ask the service to start waking its GPU. Returns as soon as the request is
 * queued, never when the model is ready.
 *
 * Deliberately swallows every error: this is an optimisation fired on a
 * dialog opening, before the visitor has asked for anything, so a failure
 * must be invisible. The worst case is the match pays the cold start it
 * would have paid regardless.
 */
export async function warmCvService(signal?: AbortSignal): Promise<void> {
	try {
		// An explicit body so Content-Length is always set. A POST with no
		// body is rejected with 411 by Google's front end in front of Cloud
		// Run, which would silently disable warming in production while
		// looking fine locally.
		await fetch("/api/cv/warm", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: "{}",
			signal,
		});
	} catch {
		// Ignored on purpose — see above.
	}
}

/** Is the Python service up? Cheap — never touches the GPU. */
export async function fetchCvServiceHealth(signal?: AbortSignal): Promise<HealthResponse> {
	const response = await fetch("/api/cv/health", { signal });
	return response.json() as Promise<HealthResponse>;
}
