'use client';

import React from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { FiArrowUpRight } from 'react-icons/fi';

const EASE = [0.22, 1, 0.36, 1] as const;

const EMAIL = 'sachunmishraf103@gmail.com';
const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent(
    'Let’s build something',
)}&body=${encodeURIComponent('Hi Sachin,\n\nI’d like to talk about…')}`;

const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const CtaSection: React.FC = () => {
    const reduce = useReducedMotion();

    return (
        <section id="collaborate" data-testid="cta-section" className="relative py-24 lg:py-32 bg-primary/2">
            <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
                {/* <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-14 text-center sm:px-12 sm:py-20 lg:py-24"> */}
                <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-3xl border border-border bg-card px-5 py-14 text-center sm:px-8 sm:py-20 lg:px-12 lg:py-24">
                    {/* Background: faded grid + soft glow from the top */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
                    />
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_0%,color-mix(in_oklab,var(--primary)_20%,transparent),transparent)]"
                    />

                    <motion.div
                        variants={container}
                        initial={reduce ? false : 'hidden'}
                        whileInView="show"
                        viewport={{ once: true, margin: '-80px' }}
                        className="relative mx-auto flex max-w-3xl flex-col items-center"
                    >
                        <motion.p
                            variants={fadeUp}
                            className="font-mono text-xs uppercase tracking-[0.22em] text-sky-600 dark:text-sky-400"
                        >
                            Open to collaborate
                        </motion.p>

                        <motion.h2
                            variants={fadeUp}
                            className="mt-5 text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl"
                        >
                            Have an idea? Let’s turn it into a{' '}
                            <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
                                working product
                            </span>
                            <span className="text-sky-500">.</span>
                        </motion.h2>

                        <motion.p
                            variants={fadeUp}
                            className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base"
                        >
                            From MERN applications to marketing sites that actually convert —
                            tell me what you’re building and I’ll help you ship it.
                        </motion.p>

                        <motion.div
                            variants={fadeUp}
                            className="mt-10 flex flex-wrap items-center justify-center gap-4"
                        >
                            <motion.a
                                href={MAILTO}
                                whileHover={reduce ? undefined : { scale: 1.04 }}
                                whileTap={reduce ? undefined : { scale: 0.97 }}
                                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            >
                                Start a Conversation
                                <FiArrowUpRight className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </motion.a>

                            <motion.a
                                href={`mailto:${EMAIL}`}
                                whileHover={reduce ? undefined : { scale: 1.04 }}
                                whileTap={reduce ? undefined : { scale: 0.97 }}
                                className="inline-flex items-center rounded-full border border-border bg-transparent px-7 py-3.5 text-sm font-medium text-foreground backdrop-blur transition-all duration-300 hover:border-primary/40 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            >
                                {EMAIL}
                            </motion.a>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CtaSection;
