import AboutSection from "@/features/portfolio/about/AboutSection";
import HeroSection from "@/features/portfolio/hero/HeroSection";
import SkillsSection from "@/features/portfolio/skills/SkillsSection";
import ExperienceSection from "@/features/portfolio/experience";
import ProjectsSection from "@/features/portfolio/projects";
import ServicesSection from "@/features/portfolio/services";
import CtaSection from "@/features/portfolio/CtaSection";
import DeveloperProfileSection from "@/features/portfolio/developerprofile";
import ContactSection from "@/features/portfolio/contact";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <ServicesSection />
      <CtaSection />
      <DeveloperProfileSection />
      <ContactSection />
    </main>
  );
}
