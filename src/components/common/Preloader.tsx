'use client';

import React, { useEffect, useState } from 'react';
import {
    AnimatePresence,
    animate,
    motion,
    useMotionValue,
    useMotionValueEvent,
    useReducedMotion,
} from 'motion/react';
import LoadingScreen from './LoadingScreen';

const EASE = [0.22, 1, 0.36, 1] as const;
const SESSION_KEY = 'portfolio-preloader-seen';

const statusFor = (value: number) =>
    value < 30
        ? 'initializing…'
        : value < 60
            ? 'loading components…'
            : value < 90
                ? 'compiling styles…'
                : 'ready.';

type PreloaderProps = {
    /** The loader stays at least this long (ms), so it never just flashes */
    minDuration?: number;
    /** …and never longer than this (ms), even if the page is slow to finish loading */
    maxDuration?: number;
    /** Show it only on the first visit of a browser session */
    oncePerSession?: boolean;
};

/**
 * Full-screen intro that waits for the page to finish loading, counts up to 100%,
 * then slides away. Put it once in app/layout.tsx, above {children}.
 */
const Preloader: React.FC<PreloaderProps> = ({
    minDuration = 1600,
    maxDuration = 5000,
    oncePerSession = false,
}) => {
    const reduce = useReducedMotion();
    const [visible, setVisible] = useState(true);
    const [status, setStatus] = useState(statusFor(0));
    const progress = useMotionValue(0);

    useMotionValueEvent(progress, 'change', (value) => setStatus(statusFor(value)));

    // Stop the page from scrolling behind the loader
    useEffect(() => {
        if (!visible) return;
        const root = document.documentElement;
        const previous = root.style.overflow;
        root.style.overflow = 'hidden';
        return () => {
            root.style.overflow = previous;
        };
    }, [visible]);

    useEffect(() => {
        if (oncePerSession && sessionStorage.getItem(SESSION_KEY)) {
            setVisible(false);
            return;
        }

        const minMs = reduce ? 300 : minDuration;
        const start = performance.now();
        let loaded = document.readyState === 'complete';
        const onLoad = () => {
            loaded = true;
        };
        window.addEventListener('load', onLoad);

        // 1. Climb to 90% while the page loads
        const climb = animate(progress, 90, { duration: minMs / 1000, ease: 'easeOut' });

        let finish: ReturnType<typeof animate> | undefined;
        let hideTimer: number | undefined;

        // 2. Once it has loaded (and the minimum time has passed), or the max time is up, finish to 100%
        const interval = window.setInterval(() => {
            const elapsed = performance.now() - start;
            if (!((loaded && elapsed >= minMs) || elapsed >= maxDuration)) return;

            window.clearInterval(interval);
            climb.stop();
            finish = animate(progress, 100, {
                duration: 0.4,
                ease: 'easeOut',
                onComplete: () => {
                    hideTimer = window.setTimeout(
                        () => {
                            if (oncePerSession) sessionStorage.setItem(SESSION_KEY, '1');
                            setVisible(false);
                        },
                        reduce ? 0 : 300,
                    );
                },
            });
        }, 100);

        return () => {
            window.removeEventListener('load', onLoad);
            window.clearInterval(interval);
            climb.stop();
            finish?.stop();
            window.clearTimeout(hideTimer);
        };
    }, [minDuration, maxDuration, oncePerSession, reduce, progress]);

    return (
        <>
            {/* Without JavaScript the loader could never finish, so hide it */}
            <noscript>
                <style>{'.preloader{display:none!important}'}</style>
            </noscript>

            <AnimatePresence>
                {visible && (
                    <motion.div
                        key="preloader"
                        className="preloader fixed inset-0 z-[100] bg-background"
                        exit={
                            reduce
                                ? { opacity: 0, transition: { duration: 0.3 } }
                                : { y: '-100%', transition: { duration: 0.8, ease: EASE } }
                        }
                    >
                        <LoadingScreen progress={progress} status={status} />
                        {/* Thin line on the bottom edge while it slides away */}
                        <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-primary/40" />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Preloader;
