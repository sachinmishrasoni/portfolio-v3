'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export type PortraitSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type PortraitStatus = 'online' | 'away' | 'busy' | 'offline';

type PortraitProps = {
    /** Used for the alt text and to build the initials fallback */
    name: string;
    /** Image URL or a path inside /public. Falls back to initials when missing or broken. */
    src?: string | null;
    size?: PortraitSize;
    shape?: 'circle' | 'rounded';
    /** Small status dot in the bottom-right corner */
    status?: PortraitStatus;
    /** Gradient ring around the picture */
    ring?: boolean;
    /** Set on above-the-fold portraits so Next.js preloads the image */
    priority?: boolean;
    className?: string;
};

const SIZES: Record<PortraitSize, { box: string; px: number; text: string; dot: string }> = {
    xs: { box: 'size-6', px: 24, text: 'text-[10px]', dot: 'size-2' },
    sm: { box: 'size-8', px: 32, text: 'text-xs', dot: 'size-2' },
    md: { box: 'size-10', px: 40, text: 'text-sm', dot: 'size-2.5' },
    lg: { box: 'size-14', px: 56, text: 'text-lg', dot: 'size-3' },
    xl: { box: 'size-20', px: 80, text: 'text-2xl', dot: 'size-4' },
    '2xl': { box: 'size-28', px: 112, text: 'text-4xl', dot: 'size-5' },
};

const STATUS: Record<PortraitStatus, { color: string; label: string }> = {
    online: { color: 'bg-emerald-500', label: 'Online' },
    away: { color: 'bg-amber-400', label: 'Away' },
    busy: { color: 'bg-red-500', label: 'Busy' },
    offline: { color: 'bg-muted-foreground', label: 'Offline' },
};

/** "Sachin Mishra Soni" → "SM" */
const getInitials = (name: string) =>
    name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join('') || '?';

const Portrait: React.FC<PortraitProps> = ({
    name,
    src,
    size = 'md',
    shape = 'circle',
    status,
    ring = false,
    priority = false,
    className = '',
}) => {
    // Remember which src failed, so a new src gets a fresh try
    const [failedSrc, setFailedSrc] = useState<string | null>(null);
    const showImage = Boolean(src) && failedSrc !== src;

    const { box, px, text, dot } = SIZES[size];
    const radius = shape === 'circle' ? 'rounded-full' : size === 'xs' || size === 'sm' ? 'rounded-md' : 'rounded-2xl';

    return (
        <span
            className={`relative inline-flex shrink-0 ${radius} ${ring ? 'bg-gradient-to-br from-primary to-sky-500 p-[2px]' : ''
                } ${className}`}
        >
            <span
                className={`relative flex select-none items-center justify-center overflow-hidden bg-primary/15 font-semibold text-primary ${radius} ${box} ${text} ${ring ? 'border-2 border-background' : ''
                    }`}
            >
                {showImage && src ? (
                    <Image
                        src={src}
                        alt={name}
                        fill
                        sizes={`${px}px`}
                        priority={priority}
                        onError={() => setFailedSrc(src)}
                        className="object-cover"
                    />
                ) : (
                    <span role="img" aria-label={name}>
                        {getInitials(name)}
                    </span>
                )}
            </span>

            {status && (
                <span
                    className={`absolute bottom-0 right-0 rounded-full ring-2 ring-background ${dot} ${STATUS[status].color}`}
                >
                    <span className="sr-only">{STATUS[status].label}</span>
                </span>
            )}
        </span>
    );
};

export default Portrait;
