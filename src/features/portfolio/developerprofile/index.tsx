'use client';

import React from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import CodeWindow from './CodeWindow';

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const DeveloperProfileSection: React.FC = () => {
    const reduce = useReducedMotion();

    return (
        <section id="profile" data-testid="profile-section" className="relative py-24 lg:py-32">
            <div className="mx-auto w-full max-w-4xl px-4 lg:px-6">
                {/* Centred header (the title stays lowercase, so it doesn't use SectionHeader) */}
                <motion.header
                    variants={container}
                    initial={reduce ? 'show' : 'hidden'}
                    whileInView="show"
                    viewport={{ once: true, margin: '-80px' }}
                    className="flex flex-col items-center text-center"
                >
                    <motion.p
                        variants={fadeUp}
                        className="font-mono text-xs uppercase tracking-[0.25em] text-primary"
                    >
                        {'//'} 06 · The person behind the stack
                    </motion.p>

                    <motion.h2
                        variants={fadeUp}
                        className="mt-3 bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl"
                    >
                        sachin.ts
                    </motion.h2>

                    <motion.p
                        variants={fadeUp}
                        className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base"
                    >
                        Every project, every commit — an object with a build method.
                    </motion.p>
                </motion.header>

                <div className="mt-12">
                    <CodeWindow />
                </div>
            </div>
        </section>
    );
};

export default DeveloperProfileSection;
