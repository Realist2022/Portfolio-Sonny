import Link from "next/link";

export default function ApproachSection() {
  return (
    <section className="grid gap-6 rounded-[28px] border border-[rgba(255,75,31,0.14)] bg-[#0b0b0d] p-8 md:grid-cols-[1fr_auto] md:items-center">
      <div className="space-y-3">
        <p className="text-sm tracking-[0.16em] text-[#ff4b1f] uppercase">
          My Approach
        </p>
        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#f5ece7]">
          Thoughtful architecture, direct communication, reliable delivery.
        </h2>
        <p className="max-w-3xl leading-8 text-[rgba(245,236,231,0.8)]">
          I like software that stays understandable as it grows. That means
          choosing tools deliberately, shaping interfaces with intent, and
          keeping implementation details disciplined enough for the next
          iteration to move quickly.
        </p>
      </div>

      <Link
        href="#contact"
        className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(255,75,31,0.65)] bg-[rgba(255,75,31,0.08)] px-6 font-semibold text-[#ffc3b1] transition hover:border-[rgba(255,75,31,0.9)] hover:bg-[rgba(255,75,31,0.16)] hover:text-white"
      >
        Learn More
      </Link>
    </section>
  );
}
