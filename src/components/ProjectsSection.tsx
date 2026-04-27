"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import projects from "../data/projects";
import TechScrollBar from "./TechScrollBar";

// Collect all unique tech tags across every project
const allFilters = Array.from(
	new Set(projects.flatMap((p) => p.techStack ?? []))
).sort();

export default function ProjectsSection() {
	const [selectedFilter, setSelectedFilter] = useState<string>("");

	const filtered = useMemo(
		() =>
			selectedFilter
				? projects.filter((p) => p.techStack?.includes(selectedFilter))
				: projects,
		[selectedFilter]
	);

	return (
		<section id="featured-work" className="flex flex-col gap-8">
			<div className="flex flex-col gap-3">
				<p className="text-sm tracking-[0.16em] text-[#ff4b1f] uppercase">
					Featured Work
				</p>
				<h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#f5ece7] md:text-4xl">
					A portfolio built around practical impact.
				</h2>
			</div>

			<TechScrollBar
				filters={allFilters}
				selectedFilter={selectedFilter}
				onSelect={setSelectedFilter}
			/>

			<div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
				{filtered.map((project) => (
					<article
						key={project.id}
						className="flex flex-col rounded-[22px] border border-[rgba(255,69,0,0.32)] bg-[linear-gradient(180deg,rgba(16,16,19,0.96),rgba(8,8,10,0.96))] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:-translate-y-1 hover:border-[rgba(255,75,31,0.55)]"
					>
						{/* Cover image */}
						{project.image && (
							<div className="relative h-44 w-full overflow-hidden rounded-t-[22px]">
								<Image
									src={project.image}
									alt={project.title}
									fill
									className="object-cover"
									sizes="(max-width: 768px) 100vw, 33vw"
									{...(project.id === projects[0].id ? { priority: true } : {})}
								/>
							</div>
						)}

						{/* Carousel preview — shows first image as cover */}
						{!project.image && project.carouselImages && project.carouselImages.length > 0 && (
							<div className="relative h-44 w-full overflow-hidden rounded-t-[22px]">
								<Image
									src={project.carouselImages[0]}
									alt={project.title}
									fill
									className="object-cover"
									sizes="(max-width: 768px) 100vw, 33vw"
									{...(project.id === projects[0].id ? { priority: true } : {})}
								/>
								<div className="absolute bottom-2 right-3 rounded-full bg-black/60 px-2 py-0.5 text-xs text-[#f6d7cc]">
									{project.carouselImages.length} photos
								</div>
							</div>
						)}

						<div className="flex flex-1 flex-col gap-4 p-6">
							<h3 className="text-xl font-semibold text-[#f5ece7]">
								{project.title}
							</h3>
							<p className="flex-1 leading-7 text-[rgba(245,236,231,0.8)]">
								{project.description}
							</p>

							{/* Tech stack chips */}
							{project.techStack && project.techStack.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{project.techStack.map((tech) => (
										<span
											key={tech}
											className="inline-flex items-center rounded-full border border-[rgba(255,75,31,0.55)] bg-[rgba(255,75,31,0.08)] px-3 py-0.5 text-xs font-semibold text-[#f6d7cc]"
										>
											{tech}
										</span>
									))}
								</div>
							)}

							{/* Links */}
							{project.links && project.links.length > 0 && (
								<div className="flex flex-wrap gap-2 pt-1">
									{project.links.map((link) => (
										<a
											key={link.url}
											href={link.url}
											target="_blank"
											rel="noreferrer"
											className="inline-flex items-center rounded-full border border-[rgba(255,75,31,0.65)] bg-[rgba(255,75,31,0.08)] px-4 py-1.5 text-sm font-semibold text-[#ffc3b1] transition hover:border-[rgba(255,75,31,0.9)] hover:bg-[rgba(255,75,31,0.16)] hover:text-white"
										>
											{link.label}
										</a>
									))}
								</div>
							)}
						</div>
					</article>
				))}
			</div>
		</section>
	);
}
