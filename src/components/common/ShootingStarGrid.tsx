"use client";

import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// Avoids the SSR warning for useLayoutEffect
const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Types

type Range = [min: number, max: number];
type Direction = "right" | "left" | "down" | "up";
type Size = { width: number; height: number };
type Offset = { x: number; y: number };

type ShootingStarGridProps = {
    className?: string;
    showParticles?: boolean;
    showNoise?: boolean;
    noiseOpacity?: "subtle" | "medium" | "strong";
    // Preset or a custom cell size in px
    gridSize?: "sm" | "md" | "lg" | number;

    showStars?: boolean;
    // Number of stars travelling at any one time
    starCount?: number;
    // Any valid CSS colors, one is picked at random per star
    starColors?: string[];
    // Tail length in px [min, max]
    starLength?: Range;
    // Travel speed in px/second [min, max]
    starSpeed?: Range;
    // Pause between runs in seconds [min, max]
    starDelay?: Range;
    // Star thickness at the head in px
    starThickness?: number;
    // Minimum gap in grid cells between stars travelling on the same axis
    starSpacing?: number;
};

type StarConfig = {
    id: number;
    dir: Direction;
    // Pixel position of the grid line the star rides on
    line: number;
    length: number;
    speed: number;
    color: string;
};

// Constants

const GRID_PX = { sm: 24, md: 32, lg: 48 } as const;

const NOISE_OPACITY = {
    subtle: "opacity-[0.03]",
    medium: "opacity-[0.05]",
    strong: "opacity-[0.08]",
} as const;

const GRID_LINE = "var(--grid-line, rgb(255 255 255 / 0.06))";

const NOISE_IMAGE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")`;

// Defaults live at module level so their identity is stable between renders
const DEFAULT_STAR_COLORS = ["#22d3ee", "#a78bfa", "#ffffff", "#34d399"];
const DEFAULT_STAR_LENGTH: Range = [90, 240];
const DEFAULT_STAR_SPEED: Range = [260, 620];
const DEFAULT_STAR_DELAY: Range = [0.5, 4];

const DIRECTIONS: Direction[] = ["right", "left", "down", "up"];

// Gradient runs tail to head, so it points in the travel direction
const GRADIENT_TO: Record<Direction, string> = {
    right: "to right",
    left: "to left",
    down: "to bottom",
    up: "to top",
};

// Triangle with its wide end at the head and a point at the tail
const TAPER_CLIP: Record<Direction, string> = {
    right: "polygon(0 50%, 100% 0, 100% 100%)",
    left: "polygon(100% 50%, 0 0, 0 100%)",
    down: "polygon(50% 0, 0 100%, 100% 100%)",
    up: "polygon(50% 100%, 0 0, 100% 0)",
};

const glowingParticles = [
    { id: 1, left: "12%", top: "22%", delay: 0.4 },
    { id: 2, left: "82%", top: "14%", delay: 1.1 },
    { id: 3, left: "6%", top: "68%", delay: 1.8 },
    { id: 4, left: "70%", top: "78%", delay: 0.7 },
    { id: 5, left: "90%", top: "55%", delay: 2.2 },
];

// Helpers

const rand = ([min, max]: Range) => Math.random() * (max - min) + min;

const pick = <T,>(items: readonly T[]) =>
    items[Math.floor(Math.random() * items.length)];

const isHorizontal = (dir: Direction) => dir === "right" || dir === "left";

// Mirrors `background-position: center` so stars land exactly on the drawn lines
const lineOffset = (total: number, cell: number) =>
    ((((total - cell) / 2) % cell) + cell) % cell;

let starId = 0;

function createStar(
    size: Size,
    cell: number,
    offset: Offset,
    colors: string[],
    length: Range,
    speed: Range,
    active: StarConfig[],
    spacing: number
): StarConfig {
    // Prefer the direction used by the fewest active stars to keep motion varied
    const usage = DIRECTIONS.map((d) => active.filter((s) => s.dir === d).length);
    const least = Math.min(...usage);
    const dir = pick(DIRECTIONS.filter((_, i) => usage[i] === least));
    const horizontal = isHorizontal(dir);

    const span = horizontal ? size.height : size.width;
    const start = horizontal ? offset.y : offset.x;
    const lineCount = Math.max(1, Math.floor((span - start - 1) / cell) + 1);
    const lines = Array.from({ length: lineCount }, (_, i) => start + i * cell);

    // Skip lines too close to a star already travelling on the same axis
    const minGap = spacing * cell;
    const free = lines.filter((candidate) =>
        active.every(
            (s) =>
                isHorizontal(s.dir) !== horizontal ||
                Math.abs(s.line - candidate) >= minGap
        )
    );
    const line = pick(free.length ? free : lines);

    return {
        id: ++starId,
        dir,
        line,
        length: rand(length),
        speed: rand(speed),
        color: pick(colors),
    };
}

// Shooting star

type ShootingStarProps = {
    size: Size;
    cell: number;
    offset: Offset;
    colors: string[];
    length: Range;
    speed: Range;
    delay: Range;
    thickness: number;
    spacing: number;
    // Shared map of stars currently in flight, keyed by slot
    registry: Map<number, StarConfig>;
    slot: number;
};

function ShootingStar({
    size,
    cell,
    offset,
    colors,
    length,
    speed,
    delay,
    thickness,
    spacing,
    registry,
    slot,
}: ShootingStarProps) {
    const [star, setStar] = useState<StarConfig | null>(null);
    const timer = useRef<number | undefined>(undefined);

    // Wait a random time, then launch a new star on a free grid line
    const schedule = useCallback(
        (initial = false) => {
            window.clearTimeout(timer.current);
            const wait = initial ? rand([0, delay[1]]) : rand(delay);
            timer.current = window.setTimeout(() => {
                const next = createStar(
                    size,
                    cell,
                    offset,
                    colors,
                    length,
                    speed,
                    Array.from(registry.values()),
                    spacing
                );
                registry.set(slot, next);
                setStar(next);
            }, wait * 1000);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [size.width, size.height, cell, offset.x, offset.y, colors, length, speed, delay, spacing]
    );

    useEffect(() => {
        // Wait for a real measurement so stars never start on a zero-size layout
        if (size.width === 0 || size.height === 0) return;
        schedule(true);
        return () => {
            window.clearTimeout(timer.current);
            registry.delete(slot);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [schedule, size.width, size.height]);

    if (!star || size.width === 0) return null;

    const horizontal = isHorizontal(star.dir);
    const forward = star.dir === "right" || star.dir === "down";
    const total = horizontal ? size.width : size.height;

    const from = forward ? -star.length : total;
    const to = forward ? total : -star.length;
    const duration = (total + star.length) / star.speed;

    return (
        <motion.span
            key={star.id}
            className="absolute block will-change-transform"
            style={{
                left: horizontal ? 0 : star.line,
                top: horizontal ? star.line : 0,
                width: horizontal ? star.length : thickness,
                height: horizontal ? thickness : star.length,
                // Drop shadow lives on the wrapper so the taper clip does not cut it off
                filter: `drop-shadow(0 0 2px color-mix(in srgb, ${star.color} 50%, transparent))`,
            }}
            initial={horizontal ? { x: from } : { y: from }}
            animate={horizontal ? { x: to } : { y: to }}
            transition={{ duration, ease: "linear" }}
            onAnimationComplete={() => {
                registry.delete(slot);
                setStar(null);
                schedule();
            }}
        >
            {/* Tapered body: full thickness at the head, thinning to a point at the tail */}
            <span
                className="block h-full w-full"
                style={{
                    clipPath: TAPER_CLIP[star.dir],
                    background: `linear-gradient(${GRADIENT_TO[star.dir]}, transparent, ${star.color} 70%, #fff)`,
                }}
            />
        </motion.span>
    );
}

// Shooting star grid

export default function ShootingStarGrid({
    className,
    showParticles = true,
    showNoise = true,
    noiseOpacity = "medium",
    gridSize = "md",
    showStars = true,
    starCount = 5,
    starColors = DEFAULT_STAR_COLORS,
    starLength = DEFAULT_STAR_LENGTH,
    starSpeed = DEFAULT_STAR_SPEED,
    starDelay = DEFAULT_STAR_DELAY,
    starThickness = 1.5,
    starSpacing = 4,
}: ShootingStarGridProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const registry = useRef(new Map<number, StarConfig>()).current;
    const [size, setSize] = useState<Size>({ width: 0, height: 0 });
    const reduceMotion = useReducedMotion();

    const cell = typeof gridSize === "number" ? gridSize : GRID_PX[gridSize];
    const offset: Offset = {
        x: lineOffset(size.width, cell),
        y: lineOffset(size.height, cell),
    };

    useIsomorphicLayoutEffect(() => {
        const el = rootRef.current;
        if (!el) return;

        // Measure before first paint so stars never start from a zero-size layout
        const measure = () =>
            setSize({ width: el.clientWidth, height: el.clientHeight });

        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={rootRef}
            aria-hidden="true"
            className={cn(
                "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
                className
            )}
        >
            {/* Grid lines with radial fade */}
            <div
                className="absolute inset-0 [-webkit-mask-image:radial-gradient(ellipse_90%_70%_at_50%_30%,#000_30%,transparent_80%)] [mask-image:radial-gradient(ellipse_90%_70%_at_50%_30%,#000_30%,transparent_80%)]"
                style={{
                    backgroundImage: `linear-gradient(to right, ${GRID_LINE} 1px, transparent 1px), linear-gradient(to bottom, ${GRID_LINE} 1px, transparent 1px)`,
                    backgroundSize: `${cell}px ${cell}px`,
                    // Pure CSS centring, so the grid never jumps while the size is measured
                    backgroundPosition: "center",
                }}
            />

            {/* Ambient glow */}
            <div className="absolute -top-40 left-1/4 h-[28rem] w-[28rem] rounded-full bg-indigo-500/25 blur-[130px] dark:bg-indigo-600/20" />
            <div className="absolute right-[-10%] top-1/3 h-96 w-96 rounded-full bg-sky-400/20 blur-[120px] dark:bg-sky-500/10" />

            {/* Shooting stars */}
            {showStars && !reduceMotion && (
                <div className="absolute inset-0">
                    {Array.from({ length: starCount }, (_, i) => (
                        <ShootingStar
                            key={i}
                            size={size}
                            cell={cell}
                            offset={offset}
                            colors={starColors}
                            length={starLength}
                            speed={starSpeed}
                            delay={starDelay}
                            thickness={starThickness}
                            spacing={starSpacing}
                            registry={registry}
                            slot={i}
                        />
                    ))}
                </div>
            )}

            {/* Noise texture */}
            {showNoise && (
                <div
                    className={cn(
                        "absolute inset-0 bg-repeat mix-blend-screen",
                        NOISE_OPACITY[noiseOpacity]
                    )}
                    style={{
                        backgroundImage: NOISE_IMAGE,
                        backgroundSize: "180px 180px",
                    }}
                />
            )}

            {/* Glowing particles */}
            {showParticles && (
                <div className="absolute inset-0">
                    {glowingParticles.map((particle) => (
                        <motion.span
                            key={particle.id}
                            className="absolute h-1 w-1 rounded-full bg-primary/70 shadow-[0_0_6px_rgba(99,102,241,0.5),0_0_12px_rgba(99,102,241,0.3)]"
                            style={{ left: particle.left, top: particle.top }}
                            animate={
                                reduceMotion
                                    ? { opacity: 0.8 }
                                    : { opacity: [1, 0.55, 1], scale: [1, 0.82, 1] }
                            }
                            transition={{
                                duration: 2.4,
                                ease: "easeInOut",
                                repeat: Infinity,
                                delay: particle.delay,
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
