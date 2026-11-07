'use client';

import React from 'react';
import {
    motion,
    useMotionValue,
    useReducedMotion,
    useTransform,
    type MotionValue,
} from 'motion/react';

const EASE = [0.22, 1, 0.36, 1] as const;

type LoadingScreenProps = {
    /** 0–100. Leave it out for an endless "loading" bar (e.g. in app/loading.tsx). */
    progress?: MotionValue<number>;
    /** Terminal-style status line under the bar */
    status?: string;
};

/** The look of the loader. The Preloader feeds it a real progress value. */
const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress, status = 'loading…' }) => {
    const reduce = useReducedMotion();

    // Hooks can't be conditional, so fall back to a dummy value when there is no progress
    const fallback = useMotionValue(0);
    const value = progress ?? fallback;
    const width = useTransform(value, (v) => `${v}%`);
    const rounded = useTransform(value, (v) => Math.round(v));

    return (
        <div className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden bg-background">
            {/* Faded grid + soft glow, same language as the rest of the site */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_50%_45%,color-mix(in_oklab,var(--primary)_16%,transparent),transparent)]"
            />

            <div role="status" aria-live="polite" className="relative flex flex-col items-center">
                <span className="sr-only">Loading the portfolio of Sachin Mishra Soni</span>

                {/*
                  Stacked logo: big nickname, full name underneath. The name row is `w-0 min-w-full`, so it takes
                  its width from "SAM" and its words spread to line up flush with it at every size.
                  Everything is sized in em from the text-6xl / text-7xl on this wrapper.
                */}
                <div aria-hidden className="inline-flex flex-col items-stretch text-5xl sm:text-6xl">
                    <span className="flex justify-center overflow-hidden">
                        {'SAM'.split('').map((char, i) => (
                            <motion.span
                                key={i}
                                initial={reduce ? false : { y: '110%' }}
                                animate={{ y: 0 }}
                                transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: EASE }}
                                className="block font-heading text-[1em] font-bold leading-12 tracking-tight text-foreground"
                            >
                                {char}
                            </motion.span>
                        ))}
                    </span>

                    <span className="mt-0 flex w-0 min-w-full justify-between whitespace-nowrap text-[0.19em] font-medium tracking-wide font-mono text-muted-foreground">
                        {['Sachin', 'Mishra', 'Soni'].map((word, i) => (
                            <motion.span
                                key={word}
                                initial={reduce ? false : { opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.45 + i * 0.1, duration: 0.5, ease: EASE }}
                            >
                                {word}
                            </motion.span>
                        ))}
                    </span>
                </div>

                {/* Bar */}
                <div
                    aria-hidden
                    className="relative mt-8 h-0.5 w-56 overflow-hidden rounded-full bg-border sm:w-72"
                >
                    {progress ? (
                        <motion.span
                            style={{ width }}
                            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-sky-500"
                        />
                    ) : (
                        <motion.span
                            animate={reduce ? undefined : { x: ['-100%', '260%'] }}
                            transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute inset-y-0 left-0 w-2/5 rounded-full bg-gradient-to-r from-primary to-sky-500"
                        />
                    )}
                </div>

                {/* Status + counter */}
                <div
                    aria-hidden
                    className="mt-3 flex w-56 items-center justify-between font-mono text-xs text-muted-foreground sm:w-72"
                >
                    <span className="flex items-center">
                        &gt; {status}
                        <motion.span
                            animate={reduce ? undefined : { opacity: [1, 0, 1] }}
                            transition={{ duration: 0.9, repeat: Infinity }}
                            className="ml-1 inline-block h-3 w-1.5 bg-primary"
                        />
                    </span>
                    {progress && (
                        <span className="tabular-nums">
                            <motion.span>{rounded}</motion.span>%
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
