'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { LuBriefcase, LuGraduationCap } from 'react-icons/lu';
import SectionHeader from '@/components/common/SectionHeader';
import StretchTabs, { type StretchTabItem } from '@/components/ui/stretchtabs';
import Education from './Education';
import WorkExperience from './WorkExperience';
import type { ExperienceTab } from './experience.data';

const EASE = [0.22, 1, 0.36, 1] as const;

const TAB_ITEMS: StretchTabItem[] = [
    { value: 'work', label: 'Work', icon: <LuBriefcase /> },
    { value: 'education', label: 'Education', icon: <LuGraduationCap /> },
];

const ExperienceSection: React.FC = () => {
    const reduce = useReducedMotion();
    const [tab, setTab] = useState<ExperienceTab>('work');

    return (
        <section
            id="experience"
            data-testid="experience-section"
            className="relative py-24 lg:py-32"
        >
            <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
                <SectionHeader
                    index="03"
                    label="Experience"
                    title="My"
                    highlight="Journey"
                    description="A technical system log of roles, training and education — in chronological order."
                />

                <StretchTabs
                    items={TAB_ITEMS}
                    value={tab}
                    onChange={(value) => setTab(value as ExperienceTab)}
                    aria-label="Switch between work experience and education"
                    className="mt-10"
                />

                <div className="mt-12">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={tab}
                            initial={reduce ? false : { opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduce ? undefined : { opacity: 0, y: -14 }}
                            transition={{ duration: 0.3, ease: EASE }}
                        >
                            {tab === 'work' ? <WorkExperience /> : <Education />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default ExperienceSection;
