
'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

type AdminAuthShellProps = {
    children: React.ReactNode;
};

const EASE = [0.22, 1, 0.36, 1] as const;

const AdminAuthShell: React.FC<AdminAuthShellProps> = ({ children }) => {
    const reduce = useReducedMotion();

    return (
        <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">

            {/* Grid Background */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-50
                [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)]
                [background-size:32px_32px]
                [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]"
            />

            {/* Glow Background */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0
                bg-[radial-gradient(50%_40%_at_50%_30%,color-mix(in_oklab,var(--primary)_16%,transparent),transparent)]"
            />

            {/* Page Content */}
            <motion.div
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="relative z-10 w-full"
            >
                {children}
            </motion.div>

        </main>
    );
};

export default AdminAuthShell;
