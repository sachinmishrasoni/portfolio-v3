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
                className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_50%_45%,color-mix(in_oklab,var(--primary)_16%,transparent),transparent)]"
            />

            <div role="status" aria-live="polite" className="relative flex flex-col items-center">
                <span className="sr-only">Loading portfolio</span>

                {/* Logo */}
                <div className="flex items-baseline gap-3" aria-hidden>
                    <span className="flex overflow-hidden pb-2">
                        {'SAM'.split('').map((char, i) => (
                            <motion.span
                                key={i}
                                initial={reduce ? false : { y: '110%' }}
                                animate={{ y: 0 }}
                                transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: EASE }}
                                className="block text-6xl font-extrabold tracking-tight text-foreground sm:text-7xl"
                            >
                                {char}
                            </motion.span>
                        ))}
                    </span>
                    <motion.span
                        initial={reduce ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="font-mono text-sm uppercase tracking-[0.3em] text-muted-foreground"
                    >
                        / Sachin
                    </motion.span>
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
