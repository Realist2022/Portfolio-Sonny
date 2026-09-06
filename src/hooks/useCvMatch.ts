import { useCallback, useEffect, useRef, useState } from "react";
import { matchJobToCv } from "@/src/lib/cv.api";
import type { MatchResponse } from "@/src/types/cv";

/**
 * Drives one /api/cv/match run.
 *
 * A run can take minutes when Modal has to cold-start the GPU, so it is
 * abortable and the request is cancelled if the component unmounts — otherwise
 * closing the modal mid-run would leave a fetch resolving into a dead
 * component.
 */
export function useCvMatch() {
	const [result, setResult] = useState<MatchResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const controllerRef = useRef<AbortController | null>(null);

	useEffect(() => {
		return () => controllerRef.current?.abort();
	}, []);

	const run = useCallback(async (jobListing: File) => {
		controllerRef.current?.abort();
		const controller = new AbortController();
		controllerRef.current = controller;

		setLoading(true);
		setError(null);
		setResult(null);

		try {
			const data = await matchJobToCv({
				jobListing,
				signal: controller.signal,
			});
			setResult(data);
		} catch (err) {
			// An abort is a deliberate cancel, not a failure to report.
			if (err instanceof DOMException && err.name === "AbortError") return;
			setError(err instanceof Error ? err.message : "The match failed. Please try again.");
			console.error(err);
		} finally {
			if (controllerRef.current === controller) {
				controllerRef.current = null;
				setLoading(false);
			}
		}
	}, []);

	const cancel = useCallback(() => {
		controllerRef.current?.abort();
		controllerRef.current = null;
		setLoading(false);
	}, []);

	const reset = useCallback(() => {
		controllerRef.current?.abort();
		controllerRef.current = null;
		setResult(null);
		setError(null);
		setLoading(false);
	}, []);

	return { result, loading, error, run, cancel, reset };
}
