'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { LuBriefcase, LuUser } from 'react-icons/lu';
import SectionHeader from '@/components/common/SectionHeader';
import StretchTabs, { type StretchTabItem } from '@/components/ui/stretchtabs';
import ProjectsPanel from './ProjectsPanel';
import { PROJECT_TABS, PROJECTS, type ProjectTab } from './projects.data';

const EASE = [0.22, 1, 0.36, 1] as const;

const TAB_ICONS: Record<ProjectTab, React.ReactNode> = {
    professional: <LuBriefcase />,
    personal: <LuUser />,
};

const TAB_ITEMS: StretchTabItem[] = PROJECT_TABS.map(({ value, label }) => ({
    value,
    label,
    icon: TAB_ICONS[value],
}));

const ProjectsSection: React.FC = () => {
    const reduce = useReducedMotion();
    const [tab, setTab] = useState<ProjectTab>('professional');

    return (
        <section id="projects" data-testid="projects-section" className="relative py-24 lg:py-32">
            <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
                <SectionHeader
                    index="04"
                    label="Projects"
                    title="Selected"
                    highlight="Work"
                    description="A collection of things I've built, shipped and learned from."
                />

                <StretchTabs
                    items={TAB_ITEMS}
                    value={tab}
                    onChange={(value) => setTab(value as ProjectTab)}
                    aria-label="Switch between professional and personal projects"
                    className="mt-10"
                />

                <div className="mt-10">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={tab}
                            initial={reduce ? false : { opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduce ? undefined : { opacity: 0, y: -14 }}
                            transition={{ duration: 0.3, ease: EASE }}
                        >
                            <ProjectsPanel group={PROJECTS[tab]} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default ProjectsSection;
