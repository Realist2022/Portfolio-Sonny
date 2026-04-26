const sectionBlockClass = "flex flex-col items-center gap-7";
const contactButtonClass =
  "inline-flex min-h-11 min-w-[132px] items-center justify-center rounded-full border border-[rgba(255,75,31,0.65)] bg-[rgba(255,75,31,0.08)] px-5 font-semibold text-[#ffc3b1] no-underline transition hover:-translate-y-px hover:border-[rgba(255,75,31,0.9)] hover:bg-[rgba(255,75,31,0.16)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#ffc3b1] max-[480px]:w-full";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="grid gap-10 rounded-[32px] border border-[rgba(255,75,31,0.14)] bg-[#0b0b0d] px-6 py-[72px] text-[#f5ece7] max-[480px]:px-4 max-[480px]:pb-[72px]"
    >
      <div className={sectionBlockClass}>
        <h2 className="m-0 text-center text-[clamp(1.8rem,2.5vw,2.4rem)] leading-[1.1] text-[#ff4b1f]">
          Let&apos;s Connect
        </h2>
        <p className="m-0 w-full max-w-[760px] text-center text-base leading-[1.8] text-[rgba(245,236,231,0.8)]">
          I&apos;m always interested in discussing new opportunities,
          collaborating on interesting projects, or simply connecting with
          fellow developers.
        </p>
        <div className="flex flex-wrap justify-center gap-[14px] max-[480px]:w-full max-[480px]:flex-col">
          <a
            href="https://www.linkedin.com/in/sonny-tapara-245481170/"
            target="_blank"
            rel="noreferrer"
            className={contactButtonClass}
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/Realist2022"
            target="_blank"
            rel="noreferrer"
            className={contactButtonClass}
          >
            GitHub
          </a>
          <a
            href="https://www.youtube.com/@ProjectManic"
            target="_blank"
            rel="noreferrer"
            className={contactButtonClass}
          >
            YouTube
          </a>
          <a href="mailto:sonny@example.com" className={contactButtonClass}>
            Email Me
          </a>
        </div>
      </div>
    </section>
  );
}