'use client';

import React, { type CSSProperties } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CATEGORY_LABEL, type Skill } from './skills.data';

const SkillCard: React.FC<{ skill: Skill }> = ({ skill }) => {
    const reduce = useReducedMotion();
    const Icon = skill.icon;

    return (
        <motion.div
            whileHover={reduce ? undefined : { y: -4, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            // Skills without a brand colour fall back to the theme's primary
            style={{ '--card-glow': skill.color ?? 'var(--primary)' } as CSSProperties}
            className="group relative h-full overflow-hidden rounded-xl border border-border bg-card/70  p-4 sm:p-5 transition-shadow duration-300 hover:shadow-[0_0_25px_color-mix(in_srgb,var(--card-glow)_10%,transparent)]"
        >
            {/* Spotlight: fixed behind the icon (top-left), fades in on hover */}
            <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background:
                        'radial-gradient(220px at 18% 0%, color-mix(in oklab, var(--card-glow) 15%, transparent), transparent 70%)',
                }}
            />

            {/* Tinted border on hover */}
            <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[inherit] border border-[color:var(--card-glow)] opacity-0 transition-opacity duration-300 group-hover:opacity-20"
            />

            <div className="relative">
                <div className="flex items-center justify-between">
                    <span
                        style={skill.color ? { color: skill.color } : undefined}
                        className="flex size-10 items-center justify-center rounded-xl border border-border bg-background/70 text-xl text-foreground transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
                    >
                        <Icon aria-hidden />
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                        {CATEGORY_LABEL[skill.category]}
                    </span>
                </div>

                <h3 className="mt-3 text-sm font-semibold text-foreground sm:text-[15px]">
                    {skill.name}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {skill.description}
                </p>
            </div>
        </motion.div>
    );
};

export default SkillCard;
