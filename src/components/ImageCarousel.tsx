"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const AUTOPLAY_MS = 4000;

interface ImageCarouselProps {
	images: string[];
	alt: string;
	/** "contain" shows each photo whole on a dark backdrop instead of cropping it */
	fit?: "cover" | "contain";
}

/**
 * Swipeable photo strip for a project card. Uses native horizontal scroll
 * with snap points, so touch swipe works without a library; the arrows and
 * dots scroll the same strip. It advances on its own every few seconds,
 * pausing while the pointer is over it or it has focus, and stays still for
 * visitors who prefer reduced motion.
 */
export default function ImageCarousel({ images, alt, fit = "cover" }: ImageCarouselProps) {
	const trackRef = useRef<HTMLDivElement>(null);
	const [index, setIndex] = useState(0);
	const [paused, setPaused] = useState(false);

	const goTo = (i: number) => {
		const track = trackRef.current;
		if (!track) return;
		const next = (i + images.length) % images.length;
		track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
	};

	// Restarts whenever the photo changes, so a manual swipe or tap gets a
	// full interval before the next automatic move.
	useEffect(() => {
		if (paused || images.length < 2) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const id = window.setTimeout(() => {
			const track = trackRef.current;
			if (!track || track.clientWidth === 0) return;
			const next = (index + 1) % images.length;
			track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
		}, AUTOPLAY_MS);
		return () => window.clearTimeout(id);
	}, [index, paused, images.length]);

	const onScroll = () => {
		const track = trackRef.current;
		if (!track || track.clientWidth === 0) return;
		setIndex(Math.round(track.scrollLeft / track.clientWidth));
	};

	const arrow =
		"absolute top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-lg leading-none text-[#f6d7cc] transition hover:bg-black/75";

	return (
		<div
			className="relative aspect-[4/3] w-full overflow-hidden rounded-t-[22px]"
			onPointerEnter={() => setPaused(true)}
			onPointerLeave={() => setPaused(false)}
			onFocus={() => setPaused(true)}
			onBlur={() => setPaused(false)}
		>
			<div
				ref={trackRef}
				onScroll={onScroll}
				className="flex h-full w-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			>
				{images.map((src, i) => (
					<div key={src} className="relative h-full w-full shrink-0 snap-center">
						<Image
							src={src}
							alt={`${alt}, photo ${i + 1} of ${images.length}`}
							fill
							className={fit === "contain" ? "bg-black object-contain" : "object-cover"}
							sizes="(max-width: 768px) 100vw, 33vw"
						/>
					</div>
				))}
			</div>

			{images.length > 1 && (
				<>
					<button
						type="button"
						aria-label="Previous photo"
						onClick={() => goTo(index - 1)}
						className={`${arrow} left-2`}
					>
						‹
					</button>
					<button
						type="button"
						aria-label="Next photo"
						onClick={() => goTo(index + 1)}
						className={`${arrow} right-2`}
					>
						›
					</button>
					<div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
						{images.map((src, i) => (
							<button
								key={src}
								type="button"
								aria-label={`Show photo ${i + 1}`}
								onClick={() => goTo(i)}
								className={`h-1.5 rounded-full transition-all ${
									i === index ? "w-4 bg-[#ff4b1f]" : "w-1.5 bg-white/60"
								}`}
							/>
						))}
					</div>
				</>
			)}
		</div>
	);
}
