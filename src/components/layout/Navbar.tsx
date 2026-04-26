const navLinks = [
	{ href: "#top", label: "Home" },
	{ href: "#about", label: "About" },
	{ href: "#featured-work", label: "Projects" },
	{ href: "#contact", label: "Contact" },
];

export default function Navbar() {
	return (
		<header className="sticky top-0 z-50 border-b border-white/10 bg-[#09090b]/80 backdrop-blur-xl">
			<div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4 max-[480px]:px-4">
				<img src="/SonnyTaparaLogo.png" alt="Logo" className="h-30 w-30" />
				<a
					href="#top"
					className="text-lg font-semibold tracking-[0.18em] text-[#ffc3b1] uppercase transition hover:text-[#ff4b1f]"
				>
					Sonny Tapara
				</a>

				<nav className="flex flex-wrap items-center justify-end gap-2 text-sm font-medium text-[rgba(245,236,231,0.8)]">
					{navLinks.map((link) => {
						return (
							<a
								key={link.label}
								href={link.href}
								className="rounded-full border border-transparent px-4 py-2 transition hover:border-[rgba(255,75,31,0.35)] hover:bg-[rgba(255,75,31,0.08)] hover:text-white"
							>
								{link.label}
							</a>
						);
					})}
				</nav>
			</div>
		</header>
	);
}
