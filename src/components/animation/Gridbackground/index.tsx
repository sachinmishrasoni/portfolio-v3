
import { cn } from "@/lib/utils";
import "./GridBackground.css";

type GridBackgroundProps = {
    className?: string;
    showParticles?: boolean;
    showNoise?: boolean;
    noiseOpacity?: "subtle" | "medium" | "strong";
    gridSize?: "sm" | "md" | "lg";
};

const glowingParticles = [
    { id: 1, left: "12%", top: "22%", delay: "0.4s" },
    { id: 2, left: "82%", top: "14%", delay: "1.1s" },
    { id: 3, left: "6%", top: "68%", delay: "1.8s" },
    { id: 4, left: "70%", top: "78%", delay: "0.7s" },
    { id: 5, left: "90%", top: "55%", delay: "2.2s" },
];

const gridSizes = {
    sm: "grid-size-sm",
    md: "grid-size-md",
    lg: "grid-size-lg",
};

const noiseOpacities = {
    subtle: "noise-subtle",
    medium: "noise-medium",
    strong: "noise-strong",
};

export default function GridBackground({
    className,
    showParticles = true,
    showNoise = true,
    noiseOpacity = "medium",
    gridSize = "md",
}: GridBackgroundProps) {
    return (
        <div
            aria-hidden="true"
            className={cn(
                "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
                className
            )}
        >
            {/* Grid lines */}
            <div
                className={cn(
                    "grid-glow-lines absolute inset-0",
                    gridSizes[gridSize]
                )}
            />

            {/* Ambient glow */}
            <div className="absolute -top-40 left-1/4 h-[28rem] w-[28rem] rounded-full bg-indigo-500/25 blur-[130px] dark:bg-indigo-600/20" />

            <div className="absolute right-[-10%] top-1/3 h-96 w-96 rounded-full bg-sky-400/20 blur-[120px] dark:bg-sky-500/10" />

            {/* Noise texture */}
            {showNoise && (
                <div
                    className={cn(
                        "bg-noise absolute inset-0",
                        noiseOpacities[noiseOpacity]
                    )}
                />
            )}

            {/* Glowing particles */}
            {showParticles && (
                <div className="absolute inset-0">
                    {glowingParticles.map((particle) => (
                        <span
                            key={particle.id}
                            className="animate-pulse-soft absolute h-1 w-1 rounded-full bg-primary/70"
                            style={{
                                left: particle.left,
                                top: particle.top,
                                animationDelay: particle.delay,
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
