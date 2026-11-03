'use client';

import React from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const lineReveal: Variants = {
    hidden: { y: '110%' },
    show: { y: 0, transition: { duration: 0.8, ease: EASE } },
};

const Line: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = '',
}) => (
    <span className="block overflow-hidden pb-1">
        <motion.span variants={lineReveal} className={`block ${className}`}>
            {children}
        </motion.span>
    </span>
);

const AboutLeft: React.FC = () => {
    const reduce = useReducedMotion();

    return (
        <motion.div
            variants={container}
            initial={reduce ? 'show' : 'hidden'}
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
        >
            <motion.p
                variants={fadeUp}
                className="font-mono text-xs uppercase tracking-[0.25em] text-primary"
            >
                // 01 · About
            </motion.p>

            <h2 className="mt-4 text-4xl font-extrabold uppercase leading-[1.05] tracking-tight text-foreground sm:text-5xl">
                <Line>A developer</Line>
                <Line>who likes to</Line>
                <Line className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
                    build things.
                </Line>
            </h2>
        </motion.div>
    );
};

export default AboutLeft;