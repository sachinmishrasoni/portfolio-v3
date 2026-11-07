'use client';

import React, {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
    type RefObject,
} from 'react';
import {
    motion,
    useAnimationFrame,
    useMotionValue,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
    useVelocity,
} from 'motion/react';

// useLayoutEffect warns during SSR, so fall back to useEffect on the server
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/** Tracks an element's width and keeps it up to date when it resizes */
function useElementWidth(ref: RefObject<HTMLElement | null>): number {
    const [width, setWidth] = useState(0);

    useIsoLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;

        const update = () => setWidth(el.offsetWidth);
        update();

        const observer = new ResizeObserver(update);
        observer.observe(el);
        return () => observer.disconnect();
    }, [ref]);

    return width;
}

/**
 * How the page scroll affects the marquee:
 * - 'none'    runs at a constant speed and ignores scrolling
 * - 'boost'   runs in `direction`, speeds up while scrolling (either way), never changes direction
 * - 'reverse' speeds up while scrolling AND follows the scroll direction: scrolling down moves it in
 *             `direction` (left by default), scrolling up moves it the opposite way
 * - 'only'    doesn't run on its own: it moves only while scrolling, and stops when you stop
 */
export type MarqueeScrollMode = 'none' | 'boost' | 'reverse' | 'only';

export type MarqueeProps = {
    /** Content to scroll */
    children: ReactNode;

    /* ---------- movement ---------- */
    /** Speed in px per second (ignored in 'only' mode) */
    baseVelocity?: number;
    /** The direction it moves (and the direction while scrolling down in 'reverse' mode). Defaults to 'left'. */
    direction?: 'left' | 'right';
    /** Pause from outside, e.g. from a button. Hover pausing is separate (`pauseOnHover`). */
    paused?: boolean;
    /** Pause while the pointer is over the marquee */
    pauseOnHover?: boolean;

    /* ---------- scroll behaviour ---------- */
    /**
     * See MarqueeScrollMode. Defaults to 'reverse', so scrolling affects the marquee whether or not
     * a `direction` is passed. Use 'none' for a marquee that ignores scrolling.
     */
    scrollMode?: MarqueeScrollMode;
    /** 'boost' / 'reverse': extra speed while scrolling. 5 means 5× extra at 1000px/s of scrolling. */
    scrollBoost?: number;
    /** 'only': how many px it moves per px scrolled (use a negative number to flip it) */
    scrollSpeed?: number;
    /** Use a scrolling element other than the window as the scroll source */
    scrollContainerRef?: RefObject<HTMLElement | null>;
    /** Spring damping for the scroll effect (higher = settles sooner) */
    damping?: number;
    /** Spring stiffness for the scroll effect (higher = follows scroll more tightly) */
    stiffness?: number;

    /* ---------- layout ---------- */
    /** Space between items in px (also used as the space at the loop point) */
    gap?: number;
    /** Force a number of copies. By default just enough copies are rendered to fill the width. */
    numCopies?: number;
    /** Fade out the left and right edges */
    fade?: boolean;
    /** How wide each faded edge is, as a % of the width */
    fadeSize?: number;
    /** Classes for the outer wrapper */
    className?: string;
    /** Styles for each copy of the content */
    style?: CSSProperties;
};

const Marquee: React.FC<MarqueeProps> = ({
    children,
    baseVelocity = 100,
    direction,
    paused = false,
    pauseOnHover = false,
    scrollMode,
    scrollBoost = 5,
    scrollSpeed = 0.6,
    scrollContainerRef,
    damping = 50,
    stiffness = 400,
    gap = 8,
    numCopies,
    fade = false,
    fadeSize = 8,
    className = '',
    style,
}) => {
    const reduce = useReducedMotion();
    const mode: MarqueeScrollMode = scrollMode ?? 'reverse';

    /* ---------------- scroll → numbers ---------------- */

    const baseX = useMotionValue(0);
    const { scrollY } = useScroll(scrollContainerRef ? { container: scrollContainerRef } : undefined);

    // Scroll VELOCITY → a factor used by 'boost' / 'reverse' (sign = scroll direction)
    const smoothVelocity = useSpring(useVelocity(scrollY), { damping, stiffness });
    const velocityFactor = useTransform(smoothVelocity, (v) => (v / 1000) * scrollBoost);

    // Scroll POSITION → an offset used by 'only' (down → one way, up → the other)
    const smoothScrollY = useSpring(scrollY, { damping, stiffness });
    const scrollOffset = useTransform(
        smoothScrollY,
        (y) => y * scrollSpeed * (direction === 'right' ? -1 : 1),
    );

    // The position that is actually used
    const position = useTransform([baseX, scrollOffset], ([base, scrolled]: number[]) =>
        reduce ? 0 : mode === 'only' ? scrolled : base,
    );

    /* ---------------- sizes ---------------- */

    const wrapperRef = useRef<HTMLDivElement>(null);
    const firstCopyRef = useRef<HTMLDivElement>(null);
    const wrapperWidth = useElementWidth(wrapperRef);
    const copyWidth = useElementWidth(firstCopyRef);

    const copies = reduce
        ? 1
        : (numCopies ??
            (copyWidth && wrapperWidth ? Math.max(2, Math.ceil(wrapperWidth / copyWidth) + 1) : 2));

    // Wrap the position so it loops seamlessly every `copyWidth` px
    const x = useTransform(position, (value) => {
        if (!copyWidth) return '0px';
        const wrapped = ((value % copyWidth) + copyWidth) % copyWidth;
        return `${-wrapped}px`;
    });

    /* ---------------- the running loop ---------------- */

    // +1 = moves left, -1 = moves right. `baseDirection` is the one set by the `direction` prop.
    const baseDirection = direction === 'right' ? -1 : 1;
    const directionFactor = useRef(baseDirection);
    const hovering = useRef(false);

    useAnimationFrame((_time, delta) => {
        if (!copyWidth || reduce || paused || hovering.current || mode === 'only') return;

        const factor = velocityFactor.get();

        if (mode === 'reverse') {
            // Scrolling down → `direction`, scrolling up → the opposite way. When scrolling stops it keeps
            // the last direction. The small dead zone stops the spring settling around zero from flipping it.
            if (factor > 0.02) directionFactor.current = baseDirection;
            else if (factor < -0.02) directionFactor.current = -baseDirection;
        } else {
            directionFactor.current = baseDirection;
        }

        // 'none' ignores scrolling; the other modes add a speed-up while scrolling
        const boost = mode === 'none' ? 1 : 1 + Math.abs(factor);

        baseX.set(baseX.get() + directionFactor.current * baseVelocity * boost * (delta / 1000));
    });

    /* ---------------- render ---------------- */

    const fadeMask = fade
        ? `linear-gradient(to right, transparent, black ${fadeSize}%, black ${100 - fadeSize}%, transparent)`
        : undefined;

    return (
        <div
            ref={wrapperRef}
            onPointerEnter={pauseOnHover ? () => (hovering.current = true) : undefined}
            onPointerLeave={pauseOnHover ? () => (hovering.current = false) : undefined}
            style={fadeMask ? { maskImage: fadeMask, WebkitMaskImage: fadeMask } : undefined}
            className={`w-full overflow-hidden ${className}`}
        >
            <motion.div style={{ x }} className="flex w-max whitespace-nowrap will-change-transform">
                {Array.from({ length: copies }).map((_, i) => (
                    <div
                        key={i}
                        ref={i === 0 ? firstCopyRef : undefined}
                        // The extra copies are only there for the loop; screen readers should read the content once
                        aria-hidden={i > 0 ? true : undefined}
                        // paddingRight equals the gap, so the spacing is identical at the loop point
                        style={{ gap, paddingRight: gap, ...style }}
                        className="flex shrink-0 items-center"
                    >
                        {children}
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default Marquee;
