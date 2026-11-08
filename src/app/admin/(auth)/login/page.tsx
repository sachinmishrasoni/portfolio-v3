import React from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function Login() {
    return (
        <div className="relative mx-auto w-full max-w-md">

            {/* Login Card */}
            <div className="rounded-3xl border border-border bg-card/50 p-6 shadow-2xl shadow-primary/5 backdrop-blur-sm sm:p-8">

                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Welcome Back
                </h1>

                <p className="mt-1.5 text-sm text-muted-foreground">
                    Sign in to manage your portfolio.
                </p>

                <div className="mt-6">
                    {/* Your Login Form Component */}
                </div>

            </div>

            {/* Back to Website */}
            <p className="mt-6 text-center">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                    <FiArrowLeft aria-hidden />
                    Back to site
                </Link>
            </p>

        </div>
    )
}
