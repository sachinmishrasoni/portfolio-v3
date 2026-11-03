'use client';

import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import SectionHeader from '@/components/common/SectionHeader';
import SkillCard from './SkillCard';
import StretchTabs, { type StretchTabItem } from '@/components/ui/stretchtabs';
import { SKILLS, SKILL_FILTERS, type SkillFilterValue } from './skills.data';

const FILTER_ITEMS: StretchTabItem[] = SKILL_FILTERS.map(({ label, value }) => ({
    label,
    value,
}));

// Bouncy stretch: squashed → overshoots tall → small rebound → original size
const STRETCH_TIMES = [0, 0.35, 0.6, 0.8, 1];

const SkillsSection: React.FC = () => {
    const reduce = useReducedMotion();
    const [active, setActive] = useState<SkillFilterValue>('all');
    // Bumped on every filter change: re-keys the cards (replays the animation) and flips the direction
    const [changeCount, setChangeCount] = useState(0);

    // All cards bounce the same way per change: 1st change → down, 2nd → up, 3rd → down ...
    // "down" grows from the top edge, "up" grows from the bottom edge (initial load = up)
    const stretchDown = changeCount % 2 === 1;

    const visible = useMemo(
        () => (active === 'all' ? SKILLS : SKILLS.filter((s) => s.category === active)),
        [active],
    );

    return (
        <section id="skills" data-testid="skills-section" className="relative py-24 lg:py-32">
            <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
                <SectionHeader
                    index="02"
                    label="Skills"
                    title="My Tech"
                    highlight="Stack"
                    description="The technologies I use to take products from idea to production — organized by discipline."
                />

                <StretchTabs
                    items={FILTER_ITEMS}
                    value={active}
                    onChange={(value) => {
                        setActive(value as SkillFilterValue);
                        setChangeCount((n) => n + 1);
                    }}
                    aria-label="Filter skills by category"
                    className="mt-10"
                />

                <ul className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {visible.map((skill, i) => {
                        const delay = (i % 4) * 0.05 + Math.min(Math.floor(i / 4), 3) * 0.05;

                        return (
                            <motion.li
                                key={`${active}-${skill.id}`}
                                initial={
                                    reduce ? false : { opacity: 0, scaleY: 0.8, scaleX: 0.97 }
                                }
                                whileInView={{
                                    opacity: 1,
                                    scaleY: [null, 1.15, 0.97, 1.02, 1],
                                    scaleX: [null, 0.98, 1.01, 0.995, 1],
                                }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{
                                    delay,
                                    opacity: { duration: 0.25 },
                                    scaleY: { duration: 0.8, times: STRETCH_TIMES, ease: 'easeOut' },
                                    scaleX: { duration: 0.8, times: STRETCH_TIMES, ease: 'easeOut' },
                                }}
                                style={{ transformOrigin: stretchDown ? 'top' : 'bottom' }}
                                className="will-change-transform"
                            >
                                <SkillCard skill={skill} />
                            </motion.li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
};

export default SkillsSection;
