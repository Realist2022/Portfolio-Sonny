const focusAreas = [
	"Frontend systems with React and Next.js",
	"Backend APIs and service integration",
	"Developer-friendly tooling and automation",
	"Responsive interfaces with strong visual structure",
];

export default function HeroSection() {
	return (
		<section className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
			<div className="space-y-8">
				<div className="inline-flex rounded-full border border-[rgba(255,75,31,0.55)] bg-[rgba(255,75,31,0.08)] px-4 py-2 text-sm font-medium tracking-[0.14em] text-[#f6d7cc] uppercase">
					Full-Stack Developer and Software Engineer
				</div>

				<div className="space-y-6">
					<h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.05em] text-[#f5ece7] md:text-7xl">
						Building reliable digital products with clean systems thinking.
					</h1>
					<p className="max-w-2xl text-lg leading-8 text-[rgba(245,236,231,0.8)] md:text-xl">
						I design and ship practical software across the stack, from
						intuitive frontends to the backend services and automation that
						keep them resilient.
					</p>
				</div>

				<div className="flex flex-wrap gap-4">
					<a
						href="#about"
						className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(255,75,31,0.7)] bg-[#ff4b1f] px-6 font-semibold text-[#1b0905] transition hover:-translate-y-px hover:bg-[#ff5a37]"
					>
						View About Section
					</a>
					<a
						href="#featured-work"
						className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/4 px-6 font-semibold text-[#f5ece7] transition hover:-translate-y-px hover:border-[rgba(255,75,31,0.35)] hover:bg-[rgba(255,75,31,0.08)]"
					>
						Explore Work
					</a>
				</div>
			</div>

			<div className="relative overflow-hidden rounded-[28px] border border-[rgba(255,69,0,0.32)] bg-[linear-gradient(180deg,rgba(16,16,19,0.96),rgba(8,8,10,0.96))] p-7 shadow-[0_24px_120px_rgba(0,0,0,0.35)]">
				<div className="absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,75,31,0.55),transparent)]" />
				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-sm tracking-[0.16em] text-[#ff4b1f] uppercase">
							Current Focus
						</p>
						<h2 className="text-2xl font-semibold text-[#f5ece7]">
							Shipping software that is sharp, stable, and easy to extend.
						</h2>
					</div>

					<div className="grid gap-3">
						{focusAreas.map((area) => (
							<div
								key={area}
								className="rounded-2xl border border-[rgba(255,69,0,0.32)] bg-[linear-gradient(180deg,rgba(16,16,19,0.96),rgba(8,8,10,0.96))] px-4 py-4 text-[rgba(245,236,231,0.8)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
							>
								{area}
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
