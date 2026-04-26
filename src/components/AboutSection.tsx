"use client"; // Critical for Next.js

import Image from "next/image";
import React, { useEffect, useRef, useState, ReactNode } from "react";

const sectionBlockClass = "flex flex-col items-center gap-7";
const panelClass =
  "h-full rounded-[14px] border border-[rgba(255,69,0,0.32)] bg-[linear-gradient(180deg,rgba(16,16,19,0.96),rgba(8,8,10,0.96))] px-5 py-[22px] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]";
const chipClass =
  "inline-flex min-h-8 items-center justify-center rounded-full border border-[rgba(255,75,31,0.55)] bg-[rgba(255,75,31,0.08)] px-3 text-[0.86rem] leading-none font-semibold whitespace-nowrap text-[#f6d7cc]";
const contactButtonClass =
  "inline-flex min-h-11 min-w-[132px] items-center justify-center rounded-full border border-[rgba(255,75,31,0.65)] bg-[rgba(255,75,31,0.08)] px-5 font-semibold text-[#ffc3b1] no-underline transition hover:-translate-y-px hover:border-[rgba(255,75,31,0.9)] hover:bg-[rgba(255,75,31,0.16)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#ffc3b1] max-[480px]:w-full";

const skillGroups = [
  {
    title: "Frontend",
    skills: [
      "React",
      "React Native",
      "Mobile Development",
      "JavaScript ES6+",
      "Bootstrap",
      "HTML5",
      "CSS",
      "Power BI",
      "Responsive Design",
    ],
  },
  {
    title: "Backend",
    skills: [
      "Node.js",
      "Firebase",
      "Express.js",
      "Python",
      "RESTful APIs",
      "MongoDB",
      "SQL Server",
    ],
  },
  {
    title: "Tools & Platforms",
    skills: [
      "Git/GitHub",
      "Docker",
      "Kubernetes",
      "Firebase Studio",
      "Azure",
      "VS Code",
      "Google Cloud Platform",
      "JIRA",
      "DevOps",
    ],
  },
];

const values = [
  {
    title: "Innovation",
    text: "I love exploring new technologies and finding creative solutions to complex problems.",
  },
  {
    title: "Quality",
    text: "Writing clean, maintainable code and following best practices is fundamental to my approach.",
  },
  {
    title: "Collaboration",
    text: "Great software is built by great teams. I thrive in collaborative environments.",
  },
  {
    title: "Growth",
    text: "Continuous learning and improvement are essential in the ever-evolving tech landscape.",
  },
];

type AnimationDirection = "left" | "right" | "none";
type ScrollDirection = "down" | "up";

interface AnimatedOnScrollProps {
  children: ReactNode;
  dir?: AnimationDirection;
  threshold?: number;
  delay?: number;
  useScrollDirection?: boolean;
  flipOnReenter?: boolean;
}

const AnimatedOnScroll: React.FC<AnimatedOnScrollProps> = ({
  children,
  dir = "left",
  threshold = 0.2,
  delay = 0,
  useScrollDirection = false,
  flipOnReenter = false,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState<boolean>(false);
  const [dirState, setDirState] = useState<AnimationDirection>(dir);
  
  // Start at 0 to match Server-Side Rendering
  const lastYRef = useRef<number>(0); 
  const [scrollDir, setScrollDir] = useState<ScrollDirection>("down");

  useEffect(() => {
    // Correctly initialize scroll position once on the client
    lastYRef.current = window.scrollY;

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;

        if (isIntersecting && !inView) {
          if (useScrollDirection) {
            setDirState(scrollDir === "down" ? "left" : "right");
          } else if (flipOnReenter) {
            setDirState((prev) => (prev === "left" ? "right" : "left"));
          } else {
            setDirState(dir);
          }
        }

        setInView(isIntersecting);
      },
      { threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [dir, flipOnReenter, inView, scrollDir, threshold, useScrollDirection]);

  useEffect(() => {
    let raf: number = 0;
    const onScroll = () => {
      const y = window.scrollY;
      const prev = lastYRef.current;
      lastYRef.current = y;
      
      const dirNow: ScrollDirection = y > prev ? "down" : y < prev ? "up" : scrollDir;
      
      if (dirNow !== scrollDir) {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => setScrollDir(dirNow));
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [scrollDir]);

  const offTransform =
    dirState === "left"
      ? "translateX(-40px)"
      : dirState === "right"
      ? "translateX(40px)"
      : "none";

  const style: React.CSSProperties = {
    opacity: inView ? 1 : 0,
    transform: inView ? "none" : offTransform,
    transition: `transform 600ms ease-out ${delay}ms, opacity 600ms ease-out ${delay}ms`,
    willChange: "transform, opacity",
  };

return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
};

const AboutSection: React.FC = () => {
  const [avatarFailed, setAvatarFailed] = useState<boolean>(false);

  return (
    <section
      id="about"
      className="min-h-screen w-full bg-[#0b0b0d] px-6 py-[72px] text-[#f5ece7] max-[960px]:pt-16 max-[480px]:px-4 max-[480px]:pb-[72px]"
    >
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-[72px] max-[720px]:gap-14">
        <div className="flex justify-center">
          <div className="flex items-center justify-center gap-[18px] text-left max-[720px]:flex-col max-[720px]:text-center">
            <AnimatedOnScroll useScrollDirection>
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#ff4b1f] bg-[linear-gradient(145deg,rgba(255,75,31,0.22),rgba(11,11,13,0.92))] p-1 shadow-[0_0_0_4px_rgba(255,75,31,0.08)]">
                {avatarFailed ? (
                  <div
                    className="grid h-full w-full place-items-center rounded-full bg-[linear-gradient(135deg,#2e1110,#121317)] text-[1.4rem] font-bold tracking-[0.08em] text-[#ffc3b1]"
                    aria-hidden="true"
                  >
                    ST
                  </div>
                ) : (
                  <Image
                    src="/selfie.jpg"
                    alt="Sonny Tapara"
                    className="block h-full w-full rounded-full bg-[#16161a] object-cover"
                    width={72}
                    height={72}
                    onError={() => setAvatarFailed(true)}
                  />
                )}
              </div>
            </AnimatedOnScroll>
            <AnimatedOnScroll useScrollDirection delay={60}>
              <div className="flex flex-col gap-1.5 max-[720px]:items-center">
                <h2 className="m-0 text-[clamp(2rem,3vw,3rem)] leading-[1.05] tracking-[-0.03em] text-[#ffc3b1]">
                  About Sonny Tapara
                </h2>
                <p className="m-0 text-base text-[#ff4b1f]">
                  Full-Stack Developer & Software Engineer
                </p>
              </div>
            </AnimatedOnScroll>
          </div>
        </div>

        <div className={sectionBlockClass}>
          <h3 className="m-0 text-center text-[clamp(1.8rem,2.5vw,2.4rem)] leading-[1.1] text-[#ff4b1f]">
            My Story
          </h3>
          <div className="flex w-full max-w-[760px] flex-col gap-[18px] text-center">
            <AnimatedOnScroll flipOnReenter>
              <p className="m-0 text-[1.03rem] leading-[1.9] text-[rgba(245,236,231,0.8)]">
                I&apos;m a full-stack developer whose journey began not just with
                code, but with a deep curiosity for solving tangible problems.
                My background in electronics and systems engineering gives me a
                unique, diagnostic mindset that I now apply to architecting
                secure, scalable software from the ground up.
              </p>
            </AnimatedOnScroll>
            <AnimatedOnScroll flipOnReenter delay={100}>
              <p className="m-0 text-[1.03rem] leading-[1.9] text-[rgba(245,236,231,0.8)]">
                Through intensive, project-based training at Mission Ready, I
                translated this hands-on experience into a professional software
                development skill set. This foundation was invaluable when
                engineering resilient data pipelines at Foodstuffs and building
                fully automated systems with MicroPython. I thrive on turning
                complex challenges into clean, efficient, and user-centric
                applications.
              </p>
            </AnimatedOnScroll>
          </div>
        </div>

        <div className={sectionBlockClass}>
          <h3 className="m-0 text-center text-[clamp(1.8rem,2.5vw,2.4rem)] leading-[1.1] text-[#ff4b1f]">
            Technical Expertise
          </h3>
          <div className="grid w-full grid-cols-3 gap-[18px] items-stretch max-[960px]:grid-cols-2 max-[720px]:grid-cols-1">
            {skillGroups.map((group, index) => (
              <AnimatedOnScroll key={group.title} dir="none" delay={index * 50}>
                <div className={`${panelClass} flex flex-col items-center gap-[18px]`}>
                  <h4 className="m-0 text-center text-xl text-[#ff4b1f]">
                    {group.title}
                  </h4>
                  <div className="flex flex-wrap justify-center gap-2.5">
                    {group.skills.map((skill) => (
                      <span key={skill} className={chipClass}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedOnScroll>
            ))}
          </div>
        </div>

        <div className={sectionBlockClass}>
          <h3 className="m-0 text-center text-[clamp(1.8rem,2.5vw,2.4rem)] leading-[1.1] text-[#ff4b1f]">
            What Drives Me
          </h3>
          <div className="grid w-full grid-cols-4 gap-[18px] max-[960px]:grid-cols-2 max-[720px]:grid-cols-1">
            {values.map((val, index) => (
              <AnimatedOnScroll key={val.title} dir="none" delay={index * 50}>
                <div className={`${panelClass} flex flex-col items-center gap-3 text-center`}>
                  <h4 className="m-0 text-center text-xl text-[#ff4b1f]">
                    {val.title}
                  </h4>
                  <p className="m-0 text-[0.98rem] leading-[1.7] text-[rgba(245,236,231,0.8)]">
                    {val.text}
                  </p>
                </div>
              </AnimatedOnScroll>
            ))}
          </div>
        </div>

        <div className={sectionBlockClass}>
          <h3 className="m-0 text-center text-[clamp(1.8rem,2.5vw,2.4rem)] leading-[1.1] text-[#ff4b1f]">
            Let&apos;s Connect
          </h3>
          <AnimatedOnScroll useScrollDirection>
            <p className="m-0 w-full max-w-[760px] text-center text-base leading-[1.8] text-[rgba(245,236,231,0.8)]">
              I&apos;m always interested in discussing new opportunities,
              collaborating on interesting projects, or simply connecting with
              fellow developers.
            </p>
          </AnimatedOnScroll>
          <AnimatedOnScroll useScrollDirection delay={80}>
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
            </div>
          </AnimatedOnScroll>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;