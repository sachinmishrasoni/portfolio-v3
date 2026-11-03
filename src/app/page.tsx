import AboutSection from "@/features/portfolio-v1/about/AboutSection";
import HeroSection from "@/features/portfolio-v1/hero/HeroSection";
import SkillsSection from "@/features/portfolio-v1/skills/SkillsSection";
import ExperienceSection from "@/features/portfolio-v1/experience";
import ProjectsSection from "@/features/portfolio-v1/projects";
import ServicesSection from "@/features/portfolio-v1/services";
import CtaSection from "@/features/portfolio-v1/CtaSection";
import DeveloperProfileSection from "@/features/portfolio-v1/developerprofile";
import ContactSection from "@/features/portfolio-v1/contact";

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
