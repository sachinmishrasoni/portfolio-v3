// 'use client';

import React, { useRef, useState } from 'react';
import {
    motion,
    useMotionTemplate,
    useMotionValue,
    useReducedMotion,
    useSpring,
    useTransform,
    type Variants,
} from 'motion/react';
import type { IconType } from 'react-icons';
import { FiDatabase, FiLayers, FiServer } from 'react-icons/fi';

const EASE = [0.22, 1, 0.36, 1] as const;
const MAX_TILT = 9; // degrees

/* -------------------------------------------------------------------------- */
/*  3D tilt wrapper (mouse only — touch devices skip it)                      */
/* -------------------------------------------------------------------------- */

const TiltCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = '',
}) => {
    const reduce = useReducedMotion();
    const ref = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState(false);

    // Pointer position inside the card, 0 → 1
    const px = useMotionValue(0.5);
    const py = useMotionValue(0.5);

    const spring = { stiffness: 220, damping: 20, mass: 0.5 };
    const rotateX = useSpring(useTransform(py, [0, 1], [MAX_TILT, -MAX_TILT]), spring);
    const rotateY = useSpring(useTransform(px, [0, 1], [-MAX_TILT, MAX_TILT]), spring);

    // Soft light that follows the cursor
    const glareX = useTransform(px, (v) => v * 100);
    const glareY = useTransform(py, (v) => v * 100);
    const glare = useMotionTemplate`radial-gradient(380px circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.09), transparent 65%)`;

    const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (reduce || e.pointerType !== 'mouse' || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        px.set((e.clientX - rect.left) / rect.width);
        py.set((e.clientY - rect.top) / rect.height);
    };

    const handleLeave = () => {
        setHovered(false);
        px.set(0.5);
        py.set(0.5);
    };

    return (
        <div style={{ perspective: 1000 }} className={className}>
            <motion.div
                ref={ref}
                onPointerMove={handleMove}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
                onPointerLeave={handleLeave}
                whileHover={reduce ? undefined : { scale: 1.02 }}
                transition={{ duration: 0.3, ease: EASE }}
                style={reduce ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
                className="relative will-change-transform"
            >
                {children}

                {/* Glare overlay */}
                <motion.div
                    aria-hidden
                    animate={{ opacity: hovered ? 1 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ background: glare }}
                    className="pointer-events-none absolute inset-0 rounded-3xl"
                />
            </motion.div>
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*  Floating card                                                              */
/*  Mobile: full-width, stacked under the window, still floating               */
/*  sm+   : absolutely positioned around the window                            */
/* -------------------------------------------------------------------------- */

type FloatingCardProps = {
    index: string;
    title: string;
    icon: IconType;
    className: string; // sm+ position classes (must be prefixed with `sm:`)
    delay: number;
    floatDuration: number;
};

const FloatingCard: React.FC<FloatingCardProps> = ({
    index,
    title,
    icon: Icon,
    className,
    delay,
    floatDuration,
}) => {
    const reduce = useReducedMotion();

    return (
        // Plain div owns positioning so Tailwind translate classes never clash with motion transforms.
        <div className={`relative z-10 w-full sm:absolute sm:w-auto ${className}`}>
            {/* Outer: entrance. Inner: endless float. */}
            <motion.div
                initial={reduce ? false : { opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay, duration: 0.6, ease: EASE }}
            >
                <motion.div
                    animate={reduce ? undefined : { y: [0, -6, 0] }}
                    transition={{ duration: floatDuration, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-background/80 px-4 py-3 shadow-lg  backdrop-blur-md"
                >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 font-mono text-xs font-semibold text-primary">
                        {index}
                    </span>
                    <span className="text-sm font-medium leading-tight text-foreground">
                        {title}
                    </span>
                    <Icon className="ml-auto size-4 shrink-0 text-muted-foreground sm:ml-1" />
                </motion.div>
            </motion.div>
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*  Code reveal                                                                */
/* -------------------------------------------------------------------------- */

const codeContainer: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.18, delayChildren: 0.9 } },
};

const codeLine: Variants = {
    hidden: { opacity: 0, x: -12 },
    show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
};

/* -------------------------------------------------------------------------- */
/*  HeroRight                                                                  */
/* -------------------------------------------------------------------------- */

const HeroRight: React.FC = () => {
    const reduce = useReducedMotion();

    return (
        <motion.div
            initial={reduce ? false : { opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            className="relative mx-auto w-full max-w-lg py-0 lg:px-0"
        >
            {/* Code window with 3D hover */}
            <TiltCard>
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d0f17]/95 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl">
                    {/* Title bar */}
                    <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
                        <div className="flex gap-2">
                            <span className="size-2.5 rounded-full bg-red-500" />
                            <span className="size-2.5 rounded-full bg-amber-400" />
                            <span className="size-2.5 rounded-full bg-emerald-500" />
                        </div>
                        <span className="font-mono text-xs text-zinc-500">developer.ts</span>
                    </div>

                    {/* Code */}
                    <motion.pre
                        variants={codeContainer}
                        initial={reduce ? 'show' : 'hidden'}
                        animate="show"
                        className="overflow-x-auto px-6 py-8 font-mono text-[11px] leading-6"
                    >
                        <motion.code className="block" variants={codeLine}>
                            <span className="text-violet-400">const</span>{' '}
                            <span className="text-sky-300">developer</span>{' '}
                            <span className="text-zinc-400">= {'{'}</span>
                        </motion.code>
                        <motion.code className="block pl-6" variants={codeLine}>
                            <span className="text-zinc-300">name</span>
                            <span className="text-zinc-500">: </span>
                            <span className="text-emerald-400">"Sachin"</span>
                            <span className="text-zinc-500">,</span>
                        </motion.code>
                        <motion.code className="block pl-6" variants={codeLine}>
                            <span className="text-zinc-300">role</span>
                            <span className="text-zinc-500">: </span>
                            <span className="text-emerald-400">"Full Stack Developer"</span>
                            <span className="text-zinc-500">,</span>
                        </motion.code>
                        <motion.code className="block pl-6" variants={codeLine}>
                            <span className="text-zinc-300">stack</span>
                            <span className="text-zinc-500">: [</span>
                            <span className="text-emerald-400">"React"</span>
                            <span className="text-zinc-500">, </span>
                            <span className="text-emerald-400">"Node"</span>
                            <span className="text-zinc-500">, </span>
                            <span className="text-emerald-400">"TypeScript"</span>
                            <span className="text-zinc-500">],</span>
                        </motion.code>
                        <motion.code className="block pl-6" variants={codeLine}>
                            <span className="text-zinc-300">mindset</span>
                            <span className="text-zinc-500">: </span>
                            <span className="text-emerald-400">"Build. Learn. Improve."</span>
                            <span className="text-zinc-500">,</span>
                        </motion.code>
                        <motion.code className="block text-zinc-400" variants={codeLine}>
                            {'};'}
                            <motion.span
                                aria-hidden
                                animate={reduce ? undefined : { opacity: [1, 0, 1] }}
                                transition={{ duration: 1.1, repeat: Infinity }}
                                className="ml-1 inline-block h-3.5 w-1.5 translate-y-0.5 bg-primary"
                            />
                        </motion.code>
                    </motion.pre>
                </div>
            </TiltCard>

            {/* Floating cards: stacked under the window on mobile, orbiting it on sm+ */}
            <div className="mt-6 flex flex-col gap-4 sm:contents">
                <FloatingCard
                    index="01"
                    title="Frontend Architecture"
                    icon={FiLayers}
                    delay={1.4}
                    floatDuration={4.5}
                    className="sm:-top-2 sm:-left-10"
                />
                <FloatingCard
                    index="02"
                    title="API Development"
                    icon={FiServer}
                    delay={1.6}
                    floatDuration={5.5}
                    className="sm:top-1/2 sm:-right-10 sm:-translate-y-1/2"
                />
                <FloatingCard
                    index="03"
                    title="Database Design"
                    icon={FiDatabase}
                    delay={1.8}
                    floatDuration={5}
                    className="sm:-bottom-2 sm:-left-4"
                />
            </div>
        </motion.div>
    );
};

export default HeroRight;
