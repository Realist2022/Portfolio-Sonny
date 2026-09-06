/**
 * Response shapes returned by the CV to Job Guestimator FastAPI service.
 *
 * These mirror the Pydantic models in that project's `src/api/schemas.py` and
 * `src/schemas/*.py`. They are hand-maintained: if the Python models change,
 * these change too. Fields use the Python snake_case names because the payload
 * is proxied through untouched.
 */

export interface CheckResult {
  name: string;
  expected: string;
  actual: string;
  passed: boolean;
}

/** PASS/FAIL against the service's configured thresholds. Null when none apply. */
export interface EvaluationReport {
  passed: boolean;
  checks: CheckResult[];
}

export interface ScorePillar {
  /** 0-100. */
  score: number;
  raw: string;
  applicable: boolean;
}

export interface Scorecard {
  /** 0-100. The headline number. */
  final_relevance: number;
  pillar_a: ScorePillar;
  pillar_b: ScorePillar;
  counted_roles: string[];
}

export interface PipelineMetrics {
  total_requirements: number;
  total_matched: number;
  /** 0-100. */
  match_percentage: number;
  /** 0-100. Same value as `Scorecard.final_relevance`. */
  final_relevance: number;
}

export interface JobRequirement {
  skill_name: string;
}

export interface SkillMatchResult {
  requirement_category: string;
  job_requirements: JobRequirement[];
  matched_cv_skills: string[];
  missing_cv_skills: string[];
  rationale: string;
}

export interface WorkRole {
  role_title: string;
  start_date: string | null;
  end_date: string | null;
  match_rationale: string;
  is_relevant: boolean;
}

export interface OverallExperienceOutput {
  target_job_title: string;
  target_overall_years: number | null;
  candidate_roles: WorkRole[];
}

/** The shape POST /api/cv/match returns. */
interface ScoredRun {
  engine: string;
  execution_seconds: number;
  metrics: PipelineMetrics;
  scorecard: Scorecard;
  scoring_weights: Record<string, number>;
  skills_evaluation: SkillMatchResult;
  overall_experience: OverallExperienceOutput;
  evaluation: EvaluationReport | null;
}

/**
 * POST /api/cv/match — a job listing in, a score against Sonny's pinned CV out.
 *
 * No `pii_engine` here, unlike the retired /api/cv/compare: that field named
 * the detector that ran during the request. Nothing redacts anything on this
 * path — the CV was redacted offline before deployment — so there is no
 * this-run detector to report, and claiming one would be false.
 */
export type MatchResponse = ScoredRun;

/** GET /api/cv/health */
export interface HealthResponse {
  configured: boolean;
  reachable: boolean;
  detail?: string;
}

/** Every non-2xx response from these routes. */
export interface ApiErrorResponse {
  error: string;
}
