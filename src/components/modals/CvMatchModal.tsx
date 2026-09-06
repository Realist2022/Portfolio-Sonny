"use client";

import { useEffect, useRef, useState } from "react";
import { useCvMatch } from "@/src/hooks/useCvMatch";
import { validateUpload } from "@/src/lib/cv.api";
import type { MatchResponse } from "@/src/types/cv";

interface CvMatchModalProps {
	open: boolean;
	onClose: () => void;
}

function bandFor(score: number): { label: string; color: string } {
	if (score >= 70) return { label: "Strong match", color: "#34d399" };
	if (score >= 40) return { label: "Partial match", color: "#fbbf24" };
	return { label: "Weak match", color: "#f87171" };
}

/** File picker that reports its own validation error rather than failing at submit. */
function FilePicker({
	id,
	label,
	hint,
	file,
	onPick,
	disabled,
}: {
	id: string;
	label: string;
	hint: string;
	file: File | null;
	onPick: (file: File | null, error: string | null) => void;
	disabled: boolean;
}) {
	return (
		<div className="flex flex-col gap-2">
			<label htmlFor={id} className="text-sm font-semibold text-[#f5ece7]">
				{label}
			</label>
			<input
				id={id}
				type="file"
				accept=".pdf,.txt"
				disabled={disabled}
				onChange={(e) => {
					const picked = e.target.files?.[0] ?? null;
					onPick(picked, picked ? validateUpload(picked, label.toLowerCase()) : null);
				}}
				className="block w-full cursor-pointer rounded-xl border border-[rgba(255,75,31,0.25)] bg-[rgba(255,255,255,0.03)] text-sm text-[rgba(245,236,231,0.7)] transition file:mr-3 file:cursor-pointer file:rounded-l-xl file:border-0 file:bg-[rgba(255,75,31,0.16)] file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-[#ffc3b1] hover:border-[rgba(255,75,31,0.5)] disabled:opacity-50"
			/>
			<p className="text-xs text-[rgba(245,236,231,0.4)]">
				{file ? `${file.name} · ${(file.size / 1024).toFixed(0)} KB` : hint}
			</p>
		</div>
	);
}

function SkillChips({
	title,
	skills,
	tone,
}: {
	title: string;
	skills: string[];
	tone: "matched" | "missing";
}) {
	if (skills.length === 0) return null;
	const chip =
		tone === "matched"
			? "border-[rgba(52,211,153,0.4)] bg-[rgba(52,211,153,0.1)] text-[#a7f3d0]"
			: "border-[rgba(248,113,113,0.4)] bg-[rgba(248,113,113,0.1)] text-[#fecaca]";

	return (
		<div className="flex flex-col gap-2">
			<h4 className="text-xs font-semibold tracking-[0.12em] text-[rgba(245,236,231,0.5)] uppercase">
				{title} ({skills.length})
			</h4>
			<div className="flex flex-wrap gap-2">
				{skills.map((skill) => (
					<span
						key={skill}
						className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${chip}`}
					>
						{skill}
					</span>
				))}
			</div>
		</div>
	);
}

function Result({ data }: { data: MatchResponse }) {
	const score = data.scorecard.final_relevance;
	const band = bandFor(score);
	// 2*pi*r for the r=52 ring below, so the dash offset maps 0-100 onto the arc.
	const circumference = 2 * Math.PI * 52;

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col items-center gap-3">
				<div className="relative h-32 w-32">
					<svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
						<circle
							cx="60"
							cy="60"
							r="52"
							fill="none"
							stroke="rgba(255,255,255,0.08)"
							strokeWidth="10"
						/>
						<circle
							cx="60"
							cy="60"
							r="52"
							fill="none"
							stroke={band.color}
							strokeWidth="10"
							strokeLinecap="round"
							strokeDasharray={circumference}
							strokeDashoffset={circumference * (1 - Math.min(100, score) / 100)}
						/>
					</svg>
					<div className="absolute inset-0 flex flex-col items-center justify-center">
						<span className="text-3xl font-semibold text-[#f5ece7]">
							{score.toFixed(0)}
						</span>
						<span className="text-xs text-[rgba(245,236,231,0.4)]">/ 100</span>
					</div>
				</div>
				<p className="text-sm font-semibold" style={{ color: band.color }}>
					{band.label}
				</p>
				<p className="text-center text-xs text-[rgba(245,236,231,0.45)]">
					{data.metrics.total_matched} of {data.metrics.total_requirements}{" "}
					requirements matched ({data.metrics.match_percentage.toFixed(0)}%)
				</p>
			</div>

			<div className="grid grid-cols-2 gap-3">
				{[
					{ name: "Skills", pillar: data.scorecard.pillar_a },
					{ name: "Experience", pillar: data.scorecard.pillar_b },
				].map(({ name, pillar }) => (
					<div
						key={name}
						className="rounded-2xl border border-[rgba(255,75,31,0.2)] bg-[rgba(255,75,31,0.05)] p-4"
					>
						<p className="text-xs tracking-[0.1em] text-[rgba(245,236,231,0.5)] uppercase">
							{name}
						</p>
						<p className="mt-1 text-2xl font-semibold text-[#f5ece7]">
							{pillar.applicable ? pillar.score.toFixed(0) : "n/a"}
						</p>
						{pillar.raw && (
							<p className="mt-1 text-xs text-[rgba(245,236,231,0.4)]">{pillar.raw}</p>
						)}
					</div>
				))}
			</div>

			{data.overall_experience.target_job_title && (
				<div className="rounded-2xl border border-[rgba(255,75,31,0.2)] bg-[rgba(255,255,255,0.02)] p-4">
					<p className="text-xs tracking-[0.1em] text-[rgba(245,236,231,0.5)] uppercase">
						Target role
					</p>
					<p className="mt-1 text-sm text-[#f5ece7]">
						{data.overall_experience.target_job_title}
						{data.overall_experience.target_overall_years !== null &&
							` · ${data.overall_experience.target_overall_years} yrs wanted`}
					</p>
				</div>
			)}

			<SkillChips
				title="Matched skills"
				skills={data.skills_evaluation.matched_cv_skills}
				tone="matched"
			/>
			<SkillChips
				title="Missing skills"
				skills={data.skills_evaluation.missing_cv_skills}
				tone="missing"
			/>

			{data.skills_evaluation.rationale && (
				<div className="flex flex-col gap-2">
					<h4 className="text-xs font-semibold tracking-[0.12em] text-[rgba(245,236,231,0.5)] uppercase">
						Rationale
					</h4>
					<p className="text-sm leading-relaxed text-[rgba(245,236,231,0.75)]">
						{data.skills_evaluation.rationale}
					</p>
				</div>
			)}

			<p className="border-t border-[rgba(255,75,31,0.15)] pt-3 text-center text-[11px] text-[rgba(245,236,231,0.35)]">
				{data.engine} · CV redacted before deployment ·{" "}
				{data.execution_seconds.toFixed(1)}s
			</p>
		</div>
	);
}

export default function CvMatchModal({ open, onClose }: CvMatchModalProps) {
	const { result, loading, error, run, reset } = useCvMatch();
	const [jobListing, setJobListing] = useState<File | null>(null);
	const [fileError, setFileError] = useState<string | null>(null);
	const [slow, setSlow] = useState(false);
	const closeRef = useRef<HTMLButtonElement>(null);

	// Escape closes, but not mid-run: an accidental keypress should not throw
	// away a request that is already burning GPU time.
	useEffect(() => {
		if (!open) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && !loading) onClose();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [open, loading, onClose]);

	// Stop the page behind the dialog from scrolling with it.
	useEffect(() => {
		if (!open) return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = previous;
		};
	}, [open]);

	useEffect(() => {
		if (open) closeRef.current?.focus();
	}, [open]);

	// A cold Modal container takes minutes to boot vLLM. Say so, rather than
	// letting it look hung. Cleared when a run starts, not here, so the effect
	// body never sets state synchronously.
	useEffect(() => {
		if (!loading) return;
		const timer = setTimeout(() => setSlow(true), 20_000);
		return () => clearTimeout(timer);
	}, [loading]);

	if (!open) return null;

	const canRun = Boolean(jobListing && !fileError && !loading);

	const startOver = () => {
		reset();
		setJobListing(null);
		setFileError(null);
		setSlow(false);
	};

	const startRun = () => {
		if (!jobListing) return;
		setSlow(false);
		run(jobListing);
	};

	return (
		<div
			className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
			onClick={() => {
				if (!loading) onClose();
			}}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="cv-match-title"
				onClick={(e) => e.stopPropagation()}
				className="flex max-h-[86vh] w-[min(620px,100%)] flex-col overflow-hidden rounded-3xl border border-[rgba(255,75,31,0.35)] bg-[#09090b] shadow-[0_24px_80px_rgba(0,0,0,0.7)]"
			>
				<header className="flex items-start justify-between gap-4 border-b border-[rgba(255,75,31,0.2)] p-5">
					<div>
						<h2 id="cv-match-title" className="font-semibold text-[#f5ece7]">
							CV → Job Match
						</h2>
						<p className="mt-0.5 text-xs text-[rgba(245,236,231,0.5)]">
							Scored by my fine-tuned Llama 3.2 running on Modal
						</p>
					</div>
					<button
						ref={closeRef}
						onClick={onClose}
						aria-label="Close CV matcher"
						className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[rgba(245,236,231,0.5)] transition hover:bg-[rgba(255,255,255,0.08)] hover:text-[#f5ece7]"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
							className="h-4 w-4"
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
						</svg>
					</button>
				</header>

				<div className="flex-1 overflow-y-auto p-5 [scrollbar-color:rgba(255,75,31,0.3)_transparent] [scrollbar-width:thin]">
					{result ? (
						<Result data={result} />
					) : loading ? (
						<div className="flex min-h-[280px] flex-col items-center justify-center gap-4 text-center">
							<div className="flex items-center gap-1.5">
								<span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#ff4b1f] [animation-delay:0ms]" />
								<span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#ff4b1f] [animation-delay:150ms]" />
								<span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#ff4b1f] [animation-delay:300ms]" />
							</div>
							<p className="text-sm text-[#f5ece7]">
								Extracting requirements and scoring…
							</p>
							<p className="max-w-sm text-xs text-[rgba(245,236,231,0.45)]">
								{slow
									? "Still going — the GPU is cold-starting. The first run after a quiet spell can take a few minutes."
									: "Three model calls run back to back. This usually takes under a minute."}
							</p>
						</div>
					) : (
						<div className="flex flex-col gap-5">
							<p className="text-sm leading-relaxed text-[rgba(245,236,231,0.7)]">
								Drop in a job listing and it gets scored against my CV. The
								listing&apos;s requirements are extracted, then matched against my
								experience. My CV was redacted of personal details long before it
								was deployed, and yours is never asked for — nothing you upload
								here is stored.
							</p>

							<FilePicker
								id="cv-match-job-listing"
								label="Job listing"
								hint="PDF or TXT, up to 10 MB"
								file={jobListing}
								disabled={loading}
								onPick={(file, err) => {
									setJobListing(err ? null : file);
									setFileError(err);
								}}
							/>

							{(fileError || error) && (
								<p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
									{fileError ?? error}
								</p>
							)}
						</div>
					)}
				</div>

				<footer className="border-t border-[rgba(255,75,31,0.2)] p-5">
					{result ? (
						<button
							onClick={startOver}
							className="w-full rounded-full border border-[rgba(255,75,31,0.5)] bg-[rgba(255,75,31,0.1)] px-5 py-3 text-sm font-semibold text-[#ffc3b1] transition hover:bg-[rgba(255,75,31,0.18)]"
						>
							Run another match
						</button>
					) : (
						<button
							onClick={startRun}
							disabled={!canRun}
							className="w-full rounded-full bg-[#ff4b1f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff5a37] disabled:cursor-not-allowed disabled:opacity-40"
						>
							{loading ? "Scoring…" : "Score this match"}
						</button>
					)}
				</footer>
			</div>
		</div>
	);
}
