'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
    animate,
    motion,
    useInView,
    useReducedMotion,
    type Variants,
} from 'motion/react';

const EASE = [0.22, 1, 0.36, 1] as const;

type Stat = { value: number | '∞'; suffix?: string; label: string };

const STATS: Stat[] = [
    { value: 3, suffix: '+', label: 'Years Experience' },
    { value: 19, suffix: '+', label: 'Technologies' },
    { value: '∞', label: 'Curiosity' },
    { value: 100, suffix: '%', label: 'Commitment to Craft' },
];

const CountUp: React.FC<{ to: number; suffix?: string }> = ({ to, suffix = '' }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });
    const reduce = useReducedMotion();
    const [val, setVal] = useState(0);

    useEffect(() => {
        if (reduce) {
            setVal(to);
            return;
        }
        if (!inView) return;

        const controls = animate(0, to, {
            duration: 1.6,
            ease: EASE,
            onUpdate: (v) => setVal(Math.round(v)),
        });
        return () => controls.stop();
    }, [inView, reduce, to]);

    return (
        <span ref={ref}>
            {val}
            {suffix}
        </span>
    );
};

const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};

const cell: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const AboutStats: React.FC = () => {
    const reduce = useReducedMotion();

    return (
        <motion.div
            variants={container}
            initial={reduce ? 'show' : 'hidden'}
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            // gap-px over a border-coloured background draws hairline dividers at any column count
            className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4"
        >
            {STATS.map(({ value, suffix, label }) => (
                <motion.div
                    key={label}
                    variants={cell}
                    className="flex flex-col items-center gap-2 bg-card px-4 py-8 text-center"
                >
                    <span className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        {value === '∞' ? '∞' : <CountUp to={value} suffix={suffix} />}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        {label}
                    </span>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default AboutStats;