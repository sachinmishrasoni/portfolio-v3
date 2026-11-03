
"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

type ShootingStarsProps = {
    count?: number;
    color?: string;
    minDuration?: number;
    maxDuration?: number;
    minTrailLength?: number;
    maxTrailLength?: number;
    className?: string;
    diagonal?: boolean;
};

type Star = {
    id: number;
    startY: number;
    endY: number;
    duration: number;
    delay: number;
    trailLength: number;
};

const random = (min: number, max: number) =>
    Math.random() * (max - min) + min;

export default function ShootingStars({
    count = 3,
    color = "#f4fff9",
    minDuration = 2.5,
    maxDuration = 5,
    minTrailLength = 100,
    maxTrailLength = 220,
    className = "",
    diagonal = false,
}: ShootingStarsProps) {
    const [stars, setStars] = useState<Star[]>([]);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        const safeCount = Math.max(0, Math.floor(count));

        setStars(
            Array.from({ length: safeCount }, (_, id) => {
                const startY = random(8, 92);
                const drift = diagonal ? random(-12, 12) : 0;

                return {
                    id,
                    startY,
                    endY: Math.max(0, Math.min(100, startY + drift)),
                    duration: random(
                        Math.max(0.5, Math.min(minDuration, maxDuration)),
                        Math.max(0.5, Math.max(minDuration, maxDuration)),
                    ),
                    delay: random(0, Math.max(0, maxDuration)),
                    trailLength: random(
                        Math.max(20, Math.min(minTrailLength, maxTrailLength)),
                        Math.max(20, Math.max(minTrailLength, maxTrailLength)),
                    ),
                };
            }),
        );
    }, [
        count,
        minDuration,
        maxDuration,
        minTrailLength,
        maxTrailLength,
        diagonal,
    ]);

    if (reducedMotion) return null;

    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
        >
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    className="absolute h-px"
                    style={{
                        top: `${star.startY}%`,
                        left: "-25%",
                        width: star.trailLength,
                        background: `linear-gradient(90deg, transparent 0%, ${color}18 48%, ${color}90 88%, ${color} 100%)`,
                        boxShadow: `0 0 4px ${color}30`,
                        willChange: "left, top, opacity",
                    }}
                    initial={{
                        left: "-25%",
                        top: `${star.startY}%`,
                        opacity: 0,
                    }}
                    animate={{
                        left: ["-25%", "110%"],
                        top: [`${star.startY}%`, `${star.endY}%`],
                        opacity: [0, 0.85, 0.85, 0],
                    }}
                    transition={{
                        duration: star.duration,
                        delay: star.delay,
                        repeat: Infinity,
                        repeatDelay: random(1, 3),
                        ease: "linear",
                        times: [0, 0.12, 0.82, 1],
                    }}
                >
                    <span
                        className="absolute -right-px -top-px h-px w-5"
                        style={{
                            background: `linear-gradient(90deg, ${color}40, ${color})`,
                            boxShadow: `0 0 5px ${color}90, 0 0 12px ${color}45`,
                        }}
                    />
                </motion.div>
            ))}
        </div>
    );
}

