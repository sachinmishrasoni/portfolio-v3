'use client';

import { useEffect } from 'react';
import ErrorScreen, { type ErrorDetail } from '@/components/common/ErrorScreen';

type ErrorPageProps = {
    error: Error & { digest?: string };
    /** Next.js 16.2+: re-fetches and re-renders the page (the preferred retry) */
    unstable_retry?: () => void;
    /** Older Next.js versions: re-renders only */
    reset?: () => void;
};

/**
 * Catches an error in any page below it and shows this instead of a white screen.
 * (Errors in the root layout itself are caught by global-error.tsx.)
 */
export default function ErrorPage({ error, unstable_retry, reset }: ErrorPageProps) {
    useEffect(() => {
        console.error(error);
        // TODO: send the error to your tracker (Sentry, LogRocket…) here
    }, [error]);

    const details: ErrorDetail[] = [
        // In production Next.js hides the real message (it could leak server details), so show it only in development
        ...(process.env.NODE_ENV !== 'production' && error.message
            ? [{ label: 'message', value: error.message }]
            : []),
        // The digest is the id to look for in your server logs
        ...(error.digest ? [{ label: 'error id', value: error.digest }] : []),
    ];

    return (
        <ErrorScreen
            code="500"
            title="Something went wrong"
            description="An unexpected error stopped this page from loading. You can try again, or head back to the home page."
            onRetry={unstable_retry ?? reset}
            details={details}
        />
    );
}
