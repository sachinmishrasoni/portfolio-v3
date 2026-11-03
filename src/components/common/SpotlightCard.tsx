'use client';

import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'motion/react';

type SpotlightCardProps = {
    children: React.ReactNode;
    /** Extra classes. The card already has rounded-2xl, border and bg-card. */
    className?: string;
    /** Spotlight diameter in px */
    size?: number;
};

// Cuts out the middle so only a 1px ring is painted
const RING_MASK = 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)';

/**
 * Card with a cursor-following spotlight: a soft glow inside the card plus a bright ring on the edge.
 * Uses the theme's --primary, so it works in light and dark mode.
 */
const SpotlightCard: React.FC<SpotlightCardProps> = ({ children, className = '', size = 360 }) => {
    const ref = useRef<HTMLDivElement>(null);
    const mx = useMotionValue(0);
    const my = useMotionValue(0);

    const glow = useMotionTemplate`radial-gradient(${size}px circle at ${mx}px ${my}px, color-mix(in oklab, var(--primary) 13%, transparent), transparent 70%)`;
    const ring = useMotionTemplate`radial-gradient(${size * 0.7}px circle at ${mx}px ${my}px, color-mix(in oklab, var(--primary) 80%, transparent), transparent 65%)`;

    const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set(e.clientX - rect.left);
        my.set(e.clientY - rect.top);
    };

    return (
        <div
            ref={ref}
            onPointerMove={handleMove}
            className={`group relative overflow-hidden rounded-2xl border border-border bg-card ${className}`}
        >
            {children}

            {/* Inner glow */}
            <motion.span
                aria-hidden
                style={{ background: glow }}
                className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            {/* Edge ring */}
            <motion.span
                aria-hidden
                style={{
                    background: ring,
                    padding: 1,
                    WebkitMask: RING_MASK,
                    WebkitMaskComposite: 'xor',
                    mask: RING_MASK,
                    maskComposite: 'exclude',
                }}
                className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
        </div>
    );
};

export default SpotlightCard;
