const socialLinks = [
	{
		href: "https://github.com/Realist2022",
		label: "GitHub",
	},
	{
		href: "https://www.linkedin.com/in/sonny-tapara-245481170/",
		label: "LinkedIn",
	},
	{
		href: "https://www.youtube.com/@ProjectManic",
		label: "YouTube",
	},
];

export default function Footer() {
	return (
		<footer className="border-t border-white/10 bg-[#070709]">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-[#c7b0a8] max-[480px]:px-4">
				<div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
					<div className="space-y-2">
						<p className="text-base font-semibold tracking-[0.16em] text-[#ffc3b1] uppercase">
							Sonny Tapara
						</p>
						<p className="max-w-xl leading-7 text-[rgba(245,236,231,0.8)]">
							Full-stack developer building resilient, human-centered products
							with clean systems thinking and practical execution.
						</p>
					</div>

					<div className="flex flex-wrap gap-3">
						{socialLinks.map((link) => (
							<a
								key={link.label}
								href={link.href}
								target="_blank"
								rel="noreferrer"
								className="rounded-full border border-[rgba(255,75,31,0.28)] bg-[rgba(255,75,31,0.08)] px-4 py-2 text-[#ffc3b1] transition hover:border-[rgba(255,75,31,0.6)] hover:bg-[rgba(255,75,31,0.14)] hover:text-white"
							>
								{link.label}
							</a>
						))}
					</div>
				</div>

				<div className="flex flex-col gap-2 border-t border-white/8 pt-5 text-[#8d7870] md:flex-row md:items-center md:justify-between">
					<p>Designed and built in Next.js with Tailwind CSS.</p>
					<p>Focused on fast interfaces, clear structure, and strong polish.</p>
				</div>
			</div>
		</footer>
	);
}
