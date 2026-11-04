'use client';

import React from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { RiDoubleQuotesL } from 'react-icons/ri';
import AboutTerminal from './Aboutterminal';

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const Strong: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
);

const AboutRight: React.FC = () => {
    const reduce = useReducedMotion();

    return (
        <div className="space-y-6">
            <motion.div
                variants={container}
                initial={reduce ? 'show' : 'hidden'}
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
                className="space-y-6 text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
                <motion.p variants={fadeUp}>
                    I'm a passionate Full Stack Developer with a strong foundation in{' '}
                    <Strong>JavaScript, TypeScript and React</Strong>. With a keen eye for design
                    and a knack for problem-solving, I bring a blend of creativity and technical
                    expertise to every project — from responsive frontends to the APIs and data
                    models behind them.
                </motion.p>

                <motion.p variants={fadeUp}>
                    My work spans the full lifecycle: shaping frontend architecture, building and
                    integrating REST APIs, managing MongoDB and MySQL databases, and keeping
                    applications fast, secure and maintainable in production.
                </motion.p>

                <motion.figure
                    variants={fadeUp}
                    className="flex items-start gap-3 rounded-xl border border-border bg-card/50 p-4"
                >
                    <RiDoubleQuotesL className="mt-0.5 size-5 shrink-0 text-primary" />
                    <blockquote
                        className="text-sm italic leading-relaxed text-foreground/90"
                    >"I'm not a great programmer; I'm just a good programmer with great habits."</blockquote>
                </motion.figure>
            </motion.div>

            <AboutTerminal />
        </div>
    );
};

export default AboutRight;
