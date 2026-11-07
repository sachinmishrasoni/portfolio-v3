import AboutSection from "@/features/portfolio/about/AboutSection";
import HeroSection from "@/features/portfolio/hero/HeroSection";
import SkillsSection from "@/features/portfolio/skills/SkillsSection";
import ExperienceSection from "@/features/portfolio/experience";
import ProjectsSection from "@/features/portfolio/projects";
import ServicesSection from "@/features/portfolio/services";
import CtaSection from "@/features/portfolio/CtaSection";
import DeveloperProfileSection from "@/features/portfolio/developerprofile";
import ContactSection from "@/features/portfolio/contact";
import HeroSectionMarquee from "@/features/portfolio/hero/HeroSectionMarquee";
import QualitiesMarquee from "@/features/portfolio/CtaSection/QualitiesMarquee";

export default function Home() {
    return (
        <main>
            <HeroSection />
            <HeroSectionMarquee />
            <AboutSection />
            <SkillsSection />
            <ExperienceSection />
            <ProjectsSection />
            <ServicesSection />
            <QualitiesMarquee />
            <CtaSection />
            <DeveloperProfileSection />
            <ContactSection />
        </main>
    );
}
