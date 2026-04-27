import AboutSection from "../components/AboutSection";
import ApproachSection from "../components/ApproachSection";
import ContactSection from "../components/ContactSection";
import HeroSection from "../components/HeroSection";
import ProjectsSection from "../components/ProjectsSection";

export default function Home() {
  return (
    <main
      id="top"
      className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 py-16 max-[480px]:gap-18 max-[480px]:px-4"
    >
      <HeroSection />

      <AboutSection />

      <ProjectsSection />

      <ApproachSection />

      <ContactSection />
    </main>
  );
}
