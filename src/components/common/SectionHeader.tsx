'use client';

import React from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export type SectionHeaderProps = {
    /** Section number shown in the label, e.g. "03" */
    index: string;
    /** Section name shown in the label, e.g. "Experience" */
    label: string;
    /** Plain part of the title, e.g. "My" */
    title: string;
    /** Gradient part of the title, e.g. "Journey" */
    highlight: string;
    /** Optional supporting text under the title */
    description?: string;
    align?: 'left' | 'center';
    /** Heading level, defaults to h2 */
    as?: 'h1' | 'h2' | 'h3';
    className?: string;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({
    index,
    label,
    title,
    highlight,
    description,
    align = 'left',
    as: Heading = 'h2',
    className = '',
}) => {
    const reduce = useReducedMotion();
    const centered = align === 'center';

    return (
        <motion.header
            variants={container}
            initial={reduce ? 'show' : 'hidden'}
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className={`flex flex-col ${centered ? 'items-center text-center' : 'items-start'} ${className}`}
        >
            <motion.p
                variants={fadeUp}
                className="font-mono text-xs uppercase tracking-[0.25em] text-primary"
            >
                {'//'} {index} · {label}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-3">
                <Heading className="text-3xl font-extrabold uppercase tracking-tight text-foreground sm:text-4xl">
                    {title}{' '}
                    <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
                        {highlight}
                    </span>
                </Heading>
            </motion.div>

            {description && (
                <motion.p
                    variants={fadeUp}
                    className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground"
                >
                    {description}
                </motion.p>
            )}
        </motion.header>
    );
};

export default SectionHeader;
