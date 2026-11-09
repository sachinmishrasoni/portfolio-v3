'use client';

import React from 'react';
import { FiHome, FiRefreshCw } from 'react-icons/fi';

export type ErrorDetail = { label: string; value: string };

type ErrorScreenProps = {
    /** The big number, e.g. "404" or "500" */
    code: string;
    title: string;
    description: string;
    /** Shows a "Try again" button */
    onRetry?: () => void;
    /** Small terminal-style lines under the text, e.g. the error id */
    details?: ErrorDetail[];
    /** true: fills the screen (pages). false: sits inside an existing layout, e.g. the admin panel. */
    fullScreen?: boolean;
    homeHref?: string;
    homeLabel?: string;
};

/**
 * One look for every error page (404, a crashed page, a crashed layout).
 * Deliberately has no data fetching and no router: it has to keep working when something else is broken.
 * Animations use the tw-animate-css classes, so it doesn't even depend on the motion library.
 */
const ErrorScreen: React.FC<ErrorScreenProps> = ({
    code,
    title,
    description,
    onRetry,
    details = [],
    fullScreen = true,
    homeHref = '/',
    homeLabel = 'Back to home',
}) => (
    <main
        role="alert"
        className={`relative flex flex-col items-center justify-center overflow-hidden bg-background px-4 py-16 text-foreground ${fullScreen ? 'min-h-dvh' : 'min-h-[60vh] rounded-3xl border border-border'
            }`}
    >
        {/* Faded grid + soft glow, same as the loader and the login page */}
        <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]"
        />
        <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_50%_40%,color-mix(in_oklab,var(--primary)_16%,transparent),transparent)]"
        />

        <div className="relative flex w-full max-w-xl flex-col items-center text-center duration-700 animate-in fade-in slide-in-from-bottom-4">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                {'//'} error
            </p>

            <p
                aria-hidden
                className="mt-4 bg-gradient-to-r from-primary to-sky-500 bg-clip-text font-heading text-7xl font-bold leading-none tracking-tighter text-transparent sm:text-8xl"
            >
                {code}
            </p>

            <h1 className="mt-6 text-xl font-bold tracking-tight sm:text-2xl">{title}</h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                {description}
            </p>

            {details.length > 0 && (
                <dl className="mt-6 w-full rounded-2xl border border-border bg-card/60 p-4 text-left font-mono text-xs backdrop-blur-sm">
                    {details.map(({ label, value }) => (
                        <div key={label} className="flex gap-2 py-0.5">
                            <dt className="shrink-0 text-primary">&gt; {label}:</dt>
                            <dd className="min-w-0 break-words text-muted-foreground">{value}</dd>
                        </div>
                    ))}
                </dl>
            )}

            <div className="mt-8 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center">
                {/* A plain link (full page load) is the safest way out of a broken page */}
                <a
                    href={homeHref}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card/60 px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                    <FiHome aria-hidden />
                    {homeLabel}
                </a>

                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                        <FiRefreshCw aria-hidden />
                        Try again
                    </button>
                )}
            </div>
        </div>
    </main>
);

export default ErrorScreen;
