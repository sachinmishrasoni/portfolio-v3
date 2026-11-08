import React from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { redirect } from "next/navigation";

import LoginForm from "@/features/admin/auth/LoginForm";
import { requireAdmin } from "@/features/admin/auth/require-admin";

// Allow blocking, request-time rendering
export const instant = false;

export default async function Login() {
    let isAuthenticated = false;

    try {
        await requireAdmin();
        isAuthenticated = true;
    } catch {
        isAuthenticated = false;
    }

    if (isAuthenticated) {
        redirect("/admin");
    }

    return (
        <div className="relative mx-auto w-full max-w-md">
            <LoginForm />

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
    );
}
