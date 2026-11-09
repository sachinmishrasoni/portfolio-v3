'use client';

import { useEffect } from 'react';
import { Geist_Mono, Inter, Space_Grotesk } from 'next/font/google';
import ErrorScreen from '@/components/common/ErrorScreen';
// global-error REPLACES the root layout, so it has to load the styles and fonts itself.
// Adjust the path if your globals.css lives somewhere else.
import "../styles/globals.css";
import { fontVariables } from '@/lib/fonts';


// ThemeProvider isn't running here either, so apply the saved theme (next-themes' default key is "theme") by hand
const THEME_SCRIPT = `try{var t=localStorage.getItem('theme');var d=t==='dark'||((!t||t==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}`;

type GlobalErrorProps = {
    error: Error & { digest?: string };
    unstable_retry?: () => void;
    reset?: () => void;
};

/** The last safety net: used only when the root layout itself crashes. Needs its own <html> and <body>. */
export default function GlobalError({ error, unstable_retry, reset }: GlobalErrorProps) {
    useEffect(() => {
        console.error(error);
        // TODO: send the error to your tracker here
    }, [error]);

    return (
        <html
            lang="en"
            data-scroll-behavior="smooth"
            className={`${fontVariables} h-full antialiased`}
            suppressHydrationWarning
        >
            <head>
                <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
            </head>
            <body className="bg-background text-foreground antialiased">
                <ErrorScreen
                    code="500"
                    title="Something went seriously wrong"
                    description="The site hit a problem it couldn’t recover from. Please try again in a moment."
                    onRetry={unstable_retry ?? reset}
                    details={error.digest ? [{ label: 'error id', value: error.digest }] : []}
                />
            </body>
        </html>
    );
}