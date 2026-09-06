import { appendWeights, handleUpload, requireFile } from "@/src/lib/cvGuestimator";
import type { MatchResponse } from "@/src/types/cv";

/**
 * POST /api/cv/match
 *
 * The only scoring endpoint. Send a job listing; it is scored against Sonny's
 * CV, which the upstream service pins at build time (see its
 * serving/redacted_cv.json). There is no CV upload and no `cv_id` to pass:
 * visitors cannot submit their own CV, so this site never receives, redacts
 * or stores anyone else's personal data.
 *
 * The CV was redacted offline before it was ever deployed, so no PII detector
 * runs on this request path at all.
 *
 * Body: multipart/form-data
 *   job_listing            file, .pdf or .txt, <= 10 MB   (required)
 *   skills_weight          number 0.0-1.0                 (optional)
 *   work_experience_weight number 0.0-1.0                 (optional)
 */
export async function POST(request: Request): Promise<Response> {
  return handleUpload<MatchResponse>(request, "/api/match", (form) => {
    const outbound = new FormData();
    outbound.set("job_listing", requireFile(form, "job_listing", "job listing"));
    appendWeights(form, outbound);
    return outbound;
  });
}
