"use client";

import { motion } from "framer-motion";

const focusAreas = [
  "Designing and implementing scalable software architectures",
  "Frontend systems with React Native Expo and Next.js",
  "Backend APIs and service integration",
  "AI Engineering and LLMs",
];

export default function HeroSection() {
  return (
    <section className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
      <div
        className="pointer-events-none absolute inset-y-0 left-1/2 z-0 w-screen -translate-x-1/2 overflow-hidden"
        style={{ filter: "drop-shadow(0 0 15px rgba(239, 68, 68, 0.3))" }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover mix-blend-screen pointer-events-none"
        >
          <source src="/videos/dragonVideo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black/0 via-black/30 to-black/90" />
      </div>

      <div className="relative z-10 space-y-8">
        <div className="inline-flex rounded-full border border-[rgba(255,75,31,0.55)] bg-[rgba(255,75,31,0.08)] px-4 py-2 text-sm font-medium tracking-[0.14em] text-[#f6d7cc] uppercase">
          Full-Stack Developer and AI Engineer
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} // So it only animates once when they scroll to it
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.05em] text-[#f5ece7] md:text-7xl">
              Building reliable digital products.
            </h1>
          </motion.div>

          <p className="max-w-2xl text-lg leading-8 text-[rgba(245,236,231,0.8)] md:text-xl">
            I design and ship practical software across the stack, from
            intuitive frontends to the backend services and automation that keep
            them resilient.
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

      <div className="relative z-10 overflow-hidden rounded-[28px] border border-[rgba(255,69,0,0.32)] bg-black/40 backdrop-blur-md p-7 shadow-[0_24px_120px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,75,31,0.55),transparent)]" />
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm tracking-[0.16em] text-[#ff4b1f] uppercase">
              Current Focus
            </p>
            <h2 className="text-2xl font-semibold text-[#f5ece7]">
              Creating Full-Stack applications and implementing scalable cloud
              architectures with AI Engineering.
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
