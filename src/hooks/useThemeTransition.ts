'use client';

import { useCallback } from 'react';
import { flushSync } from 'react-dom';
import { useTheme } from 'next-themes';

type Origin = { x: number; y: number };

// Typed locally so it works on any TypeScript version
type DocumentWithViewTransition = Document & {
    startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

const REVEAL_MS = 600;
const FALLBACK_MS = 500;

/**
 * Switches the theme with a transition:
 * - circular reveal from `origin` where the View Transitions API exists
 * - a short colour fade everywhere else
 * - no animation at all if the user prefers reduced motion
 */
export function useThemeTransition() {
    const { resolvedTheme, setTheme } = useTheme();

    const switchTheme = useCallback(
        (next: 'light' | 'dark', origin?: Origin) => {
            const root = document.documentElement;
            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            if (reduceMotion) {
                setTheme(next);
                return;
            }

            const doc = document as DocumentWithViewTransition;

            if (typeof doc.startViewTransition === 'function') {
                const x = origin?.x ?? window.innerWidth / 2;
                const y = origin?.y ?? window.innerHeight / 2;
                // Radius of the circle that reaches the farthest corner of the screen
                const radius = Math.hypot(
                    Math.max(x, window.innerWidth - x),
                    Math.max(y, window.innerHeight - y),
                );

                // flushSync makes sure the <html> class has changed before the browser takes the "after" snapshot
                const transition = doc.startViewTransition(() => {
                    flushSync(() => setTheme(next));
                });

                transition.ready
                    .then(() => {
                        root.animate(
                            {
                                clipPath: [
                                    `circle(0px at ${x}px ${y}px)`,
                                    `circle(${radius}px at ${x}px ${y}px)`,
                                ],
                            },
                            {
                                duration: REVEAL_MS,
                                easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                                pseudoElement: '::view-transition-new(root)',
                            },
                        );
                    })
                    .catch(() => {
                        // Transition was skipped (e.g. another one started); the theme still changed
                    });
                return;
            }

            // Fallback: enable the CSS fade just for this switch
            root.classList.add('theme-switching');
            setTheme(next);
            window.setTimeout(() => root.classList.remove('theme-switching'), FALLBACK_MS);
        },
        [setTheme],
    );

    return { resolvedTheme, switchTheme };
}
