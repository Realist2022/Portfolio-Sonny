"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
	const glowRef = useRef<HTMLDivElement>(null);
	const frameRef = useRef<number | null>(null);

	useEffect(() => {
		const el = glowRef.current;
		if (!el) return;

		const handleMove = (e: MouseEvent) => {
			if (frameRef.current) cancelAnimationFrame(frameRef.current);
			frameRef.current = requestAnimationFrame(() => {
				el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
				el.style.opacity = "1";
			});
		};

		const handleLeave = () => {
			el.style.opacity = "0";
		};

		window.addEventListener("mousemove", handleMove);
		window.addEventListener("mouseleave", handleLeave);

		return () => {
			if (frameRef.current) cancelAnimationFrame(frameRef.current);
			window.removeEventListener("mousemove", handleMove);
			window.removeEventListener("mouseleave", handleLeave);
		};
	}, []);

	return (
		<div
			ref={glowRef}
			aria-hidden
			className="pointer-events-none fixed left-0 top-0 z-[9999] opacity-0 transition-opacity duration-300"
			style={{
				width: 500,
				height: 500,
				marginLeft: -250,
				marginTop: -250,
				background:
					"radial-gradient(circle, rgba(255,75,31,0.12) 0%, rgba(255,75,31,0.04) 40%, transparent 70%)",
				borderRadius: "50%",
				willChange: "transform",
			}}
		/>
	);
}
