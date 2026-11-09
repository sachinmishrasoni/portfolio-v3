'use client';

import { useEffect } from 'react';
import ErrorScreen, { type ErrorDetail } from '@/components/common/ErrorScreen';

type AdminErrorProps = {
    error: Error & { digest?: string };
    unstable_retry?: () => void;
    reset?: () => void;
};

/**
 * Same error screen, but sized to sit inside the admin panel (sidebar and header stay visible)
 * instead of taking over the whole screen.
 */
export default function AdminError({ error, unstable_retry, reset }: AdminErrorProps) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    const details: ErrorDetail[] = [
        ...(process.env.NODE_ENV !== 'production' && error.message
            ? [{ label: 'message', value: error.message }]
            : []),
        ...(error.digest ? [{ label: 'error id', value: error.digest }] : []),
    ];

    return (
        <ErrorScreen
            fullScreen={false}
            code="500"
            title="This page hit an error"
            description="Something went wrong while loading this admin page. Your other pages are fine."
            onRetry={unstable_retry ?? reset}
            details={details}
            homeHref="/admin"
            homeLabel="Back to dashboard"
        />
    );
}
