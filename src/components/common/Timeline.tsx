'use client';

import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, type Variants } from 'motion/react';

const EASE = [0.22, 1, 0.36, 1] as const;

export type TimelineItem = {
    id: string;
    /** Badge text, e.g. "Apr 2023 — Present" */
    period: string;
    title: string;
    /** Company / institution line (monospace) */
    subtitle: string;
    description: string;
    /** Optional pills under the description */
    tags?: string[];
};

type TimelineProps = {
    items: TimelineItem[];
    className?: string;
};

/**
 * Each row (<li>) is the single scroll trigger. The dot and the card are its children
 * and animate from the row's variants, so they always reveal together, even after a tab switch.
 */
const cardVariants: Variants = {
    hidden: (isLeft: boolean) => ({ opacity: 0, x: isLeft ? -40 : 40 }),
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
};

const dotVariants: Variants = {
    hidden: { opacity: 0, scale: 0.3 },
    show: {
        opacity: 1,
        scale: 1,
        transition: { type: 'spring', stiffness: 300, damping: 18, delay: 0.1 },
    },
};

const Timeline: React.FC<TimelineProps> = ({ items, className = '' }) => {
    const reduce = useReducedMotion();
    const listRef = useRef<HTMLOListElement>(null);

    // The centre line fills in as the section scrolls into view
    const { scrollYProgress } = useScroll({
        target: listRef,
        offset: ['start 75%', 'end 60%'],
    });
    const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

    return (
        <ol
            ref={listRef}
            className={`relative space-y-10 overflow-x-clip md:space-y-14 ${className}`}
        >
            {/* Vertical line: left on mobile, centred from md up */}
            <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-4 w-px -translate-x-1/2 bg-border [mask-image:linear-gradient(to_bottom,black_85%,transparent)] md:left-1/2"
            >
                <motion.span
                    style={{ scaleY: reduce ? 1 : progress }}
                    className="absolute inset-0 origin-top bg-primary/70"
                />
            </span>

            {items.map((item, index) => {
                const isLeft = index % 2 === 0;

                return (
                    <motion.li
                        key={item.id}
                        initial={reduce ? false : 'hidden'}
                        whileInView="show"
                        viewport={{ once: true, margin: '-60px' }}
                        className="relative pl-12 md:grid md:grid-cols-2 md:gap-x-20 md:pl-0"
                    >
                        {/*
                          Dot. Vertically centred on the period badge:
                          card padding (p-4 = 16px) + half the badge height (h-6 = 24px → 12px) = 28px = top-7.
                          The outer span positions, the inner span animates, so transforms never clash.
                        */}
                        <span
                            aria-hidden
                            className="absolute left-4 top-7 z-10 -translate-x-1/2 -translate-y-1/2 md:left-1/2"
                        >
                            <motion.span
                                variants={dotVariants}
                                className="block size-4 rounded-full border-2 border-primary bg-background shadow-[0_0_0_4px] shadow-primary/15"
                            />
                        </span>

                        {/* Card */}
                        <motion.article
                            custom={isLeft}
                            variants={cardVariants}
                            className={`flex flex-col items-start rounded-2xl border border-border bg-card p-4 transition-colors duration-300 hover:border-primary/40 ${isLeft ? 'md:col-start-1 md:items-end md:text-right' : 'md:col-start-2'
                                }`}
                        >
                            {/* Fixed height (h-6) keeps the dot alignment above exact */}
                            <span className="inline-flex h-6 items-center rounded-full border border-primary/30 bg-primary/10 px-3 font-mono text-xs text-primary">
                                {item.period}
                            </span>

                            <h3 className="mt-4 text-xl font-bold leading-snug text-foreground">
                                {item.title}
                            </h3>
                            <p className="mt-1 font-mono text-xs text-muted-foreground">
                                {item.subtitle}
                            </p>

                            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                                {item.description}
                            </p>

                            {item.tags && item.tags.length > 0 && (
                                <ul
                                    className={`mt-5 flex flex-wrap gap-2 ${isLeft ? 'md:justify-end' : ''
                                        }`}
                                >
                                    {item.tags.map((tag) => (
                                        <li
                                            key={tag}
                                            className="rounded-full border border-border bg-muted px-2.5 py-0.5 font-mono text-[11px] font-semibold text-foreground"
                                        >
                                            {tag}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </motion.article>
                    </motion.li>
                );
            })}
        </ol>
    );
};

export default Timeline;
