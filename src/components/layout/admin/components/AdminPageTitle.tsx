'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { findActiveNavMenuItem } from '@/components/common/NavMenu';
import { ADMIN_BASE, ADMIN_NAV } from '@/config/admin.config';

const EASE = [0.22, 1, 0.36, 1] as const;
const MAX_CRUMBS = 2;

const titleCase = (segment: string) =>
    decodeURIComponent(segment)
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

/** Long mixed letter/number strings (Mongo/cuid/uuid style) are treated as IDs */
const isIdLike = (segment: string) => /^(?=.*\d)[A-Za-z0-9_-]{12,}$/.test(segment);

const labelFor = (segment: string) => (isIdLike(segment) ? 'Details' : titleCase(segment));

const AdminPageTitle: React.FC = () => {
    const pathname = usePathname();
    const reduce = useReducedMotion();
    const segments = pathname.replace(ADMIN_BASE, '').split('/').filter(Boolean);

    const crumbs = [
        { label: 'Dashboard', href: ADMIN_BASE },
        ...segments.map((segment, i) => ({
            label: labelFor(segment),
            href: `${ADMIN_BASE}/${segments.slice(0, i + 1).join('/')}`,
        })),
    ];

    // Title: the active nav item's label (same source as the sidebar), with a URL fallback
    const activeItem = findActiveNavMenuItem(pathname, ADMIN_NAV);
    const title = activeItem?.label ?? crumbs[1]?.label ?? crumbs[0].label;

    const visibleCrumbs = crumbs.length > 1 ? crumbs.slice(-MAX_CRUMBS) : [];

    // Shared motion settings (everything becomes instant with "reduce motion")
    const transition = reduce ? { duration: 0 } : { duration: 0.25, ease: EASE };

    return (
        <div className="min-w-0 flex-1">
            {/* Title: slides/fades when the module changes */}
            <div className="relative">
                <AnimatePresence initial={false} mode="popLayout">
                    <motion.h1
                        key={title}
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, y: -8 }}
                        transition={transition}
                        className="truncate text-sm font-semibold leading-tight text-foreground sm:text-base"
                    >
                        {title}
                    </motion.h1>
                </AnimatePresence>
            </div>

            {/* Breadcrumb: items fade in/out and slide into place */}
            <nav aria-label="Breadcrumb">
                <ol className="relative flex items-center gap-1 text-[11px] leading-tight">
                    <AnimatePresence initial={false} mode="popLayout">
                        {visibleCrumbs.map((crumb, i) => {
                            const last = i === visibleCrumbs.length - 1;
                            return (
                                <motion.li
                                    key={crumb.href}
                                    layout={reduce ? false : 'position'}
                                    initial={reduce ? false : { opacity: 0, x: -6 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={reduce ? undefined : { opacity: 0, x: 6 }}
                                    transition={transition}
                                    className="flex min-w-0 items-center gap-1"
                                >
                                    {i > 0 && (
                                        <span aria-hidden className="text-muted-foreground/50">
                                            /
                                        </span>
                                    )}
                                    {last ? (
                                        <span
                                            aria-current="page"
                                            className="max-w-[10rem] truncate text-muted-foreground sm:max-w-[16rem]"
                                        >
                                            {crumb.label}
                                        </span>
                                    ) : (
                                        <Link
                                            href={crumb.href}
                                            className="max-w-[7rem] truncate text-muted-foreground/70 transition-colors hover:text-foreground sm:max-w-[12rem]"
                                        >
                                            {crumb.label}
                                        </Link>
                                    )}
                                </motion.li>
                            );
                        })}
                    </AnimatePresence>
                </ol>
            </nav>
        </div>
    );
};

export default AdminPageTitle;
