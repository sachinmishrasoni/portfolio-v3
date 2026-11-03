"use client";

import { useRef } from "react";
import {
    motion,
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
    useSpring,
} from "motion/react";
import { cn } from "@/lib/utils";

type ScrollProgressProps = {
    className?: string;
};

export default function ScrollProgress({ className }: ScrollProgressProps) {
    const barRef = useRef<HTMLDivElement>(null);
    const reduceMotion = useReducedMotion();

    // Raw page scroll progress from 0 to 1
    const { scrollYProgress } = useScroll();

    // Spring smooths out scroll jumps so the bar glides instead of snapping
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 28,
        mass: 0.4,
        restDelta: 0.001,
    });

    // Follow the raw value directly when the user prefers reduced motion
    const scaleX = reduceMotion ? scrollYProgress : smoothProgress;

    // Keep the accessible value in sync without re-rendering
    useMotionValueEvent(scrollYProgress, "change", (value) => {
        barRef.current?.setAttribute(
            "aria-valuenow",
            String(Math.round(Math.min(1, Math.max(0, value)) * 100))
        );
    });

    return (
        <div
            ref={barRef}
            role="progressbar"
            aria-label="Page scroll progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
            className={cn(
                "pointer-events-none fixed inset-x-0 top-0 z-[9999] h-[2px] bg-transparent",
                className
            )}
        >
            <motion.div
                style={{ scaleX }}
                className="h-full w-full origin-left bg-gradient-to-r from-[#7772ff] via-[#6366f1] via-45% to-[#06b6d4] shadow-[0_0_8px_rgba(99,102,241,0.45),0_0_16px_rgba(6,182,212,0.25)] will-change-transform"
            />
        </div>
    );
}
