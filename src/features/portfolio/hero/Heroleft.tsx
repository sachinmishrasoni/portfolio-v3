// 'use client';

import React from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { FiArrowRight, FiDownload, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { Button } from '@/components/ui/button';

const EASE = [0.22, 1, 0.36, 1] as const;

const SOCIALS = [
    { label: 'GitHub', href: 'https://github.com/sachinmishrasoni', icon: FiGithub },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/your-handle', icon: FiLinkedin },
    { label: 'Email', href: 'mailto:you@example.com', icon: FiMail },
];

const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const downloadResume = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Sachin-Resume.pdf';
    link.click();
};

const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

// Each headline line slides up from behind a mask
const lineReveal: Variants = {
    hidden: { y: '110%' },
    show: { y: 0, transition: { duration: 0.8, ease: EASE } },
};

const HeadlineLine: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = '',
}) => (
    <span className="block overflow-hidden">
        <motion.span variants={lineReveal} className={`block ${className}`}>
            {children}
        </motion.span>
    </span>
);

const HeroLeft: React.FC = () => {
    const reduce = useReducedMotion();

    return (
        <motion.div
            variants={container}
            initial={reduce ? 'show' : 'hidden'}
            animate="show"
            className="flex flex-col items-start"
        >
            {/* Availability badge */}
            <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur"
            >
                <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                    Available for opportunities
                </span>
            </motion.div>

            {/* Greeting */}
            <motion.p
                variants={fadeUp}
                className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-primary"
            >
                Hello, I'm Sachin
            </motion.p>

            {/* Headline */}
            <h1 className="mt-4 font-heading text-[clamp(2.5rem,7.5vw,5rem)] font-bold uppercase leading-[1.06] tracking-tight text-foreground">
                <HeadlineLine>Building</HeadlineLine>
                <HeadlineLine className="bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                    Digital
                </HeadlineLine>
                <HeadlineLine className="bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent">
                    Experiences
                </HeadlineLine>
                <HeadlineLine>That actually</HeadlineLine>
                <HeadlineLine>Work.</HeadlineLine>
            </h1>

            {/* Description */}
            <motion.p
                variants={fadeUp}
                className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
                MERN Stack Developer building modern, scalable and user-focused web
                applications with <strong className="font-semibold text-foreground">React</strong>,{' '}
                <strong className="font-semibold text-foreground">Node.js</strong> and{' '}
                <strong className="font-semibold text-foreground">TypeScript</strong> — from
                pixel-perfect frontends to production-ready APIs.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                    size="lg"
                    onClick={() => scrollToSection('projects')}
                    className="group rounded-xl shadow-lg shadow-indigo-500/25"
                >
                    View My Work
                    <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </Button>

                <Button
                    size="lg"
                    variant="outline"
                    onClick={() => scrollToSection('contact')}
                    className="rounded-xl text-foreground hover:bg-white/10"
                >
                    Let's Connect
                </Button>

                <Button
                    size="lg"
                    variant="ghost"
                    onClick={downloadResume}
                    className="rounded-xl text-foreground hover:bg-white/5"
                >
                    <FiDownload />
                    Download Resume
                </Button>
            </motion.div>

            {/* Socials */}
            <motion.div variants={fadeUp} className="mt-10 flex items-center gap-3">
                {SOCIALS.map(({ label, href, icon: Icon }) => (
                    <motion.a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={label}
                        whileHover={reduce ? undefined : { y: -3 }}
                        whileTap={reduce ? undefined : { scale: 0.95 }}
                        className="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-background text-muted-foreground transition-colors hover:border-indigo-400/50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-indigo-400"
                    >
                        <Icon className="size-4.5" />
                    </motion.a>
                ))}
                <span className="ml-2 hidden font-mono text-xs text-muted-foreground sm:inline">
                    github.com/sachinmishrasoni
                </span>
            </motion.div>
        </motion.div>
    );
};

export default HeroLeft;
