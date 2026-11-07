'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Portrait from '@/components/ui/portrait';
import { cn } from '@/lib/utils';
import { ADMIN_BASE, ADMIN_NAV, isNavActive, type AdminUser } from '@/config/admin.config';

const EASE = [0.22, 1, 0.36, 1] as const;

export const SIDEBAR_WIDTH = 264;
export const SIDEBAR_WIDTH_COLLAPSED = 76;

/* -------------------------------------------------------------------------- */
/*  Shared content: used by the desktop sidebar and the mobile drawer          */
/* -------------------------------------------------------------------------- */

type SidebarContentProps = {
    collapsed: boolean;
    user: AdminUser;
    /** Unread counters by nav item id, e.g. { messages: 3 } */
    badges?: Record<string, number>;
    /** Unique per instance so the animated active highlight doesn't jump between desktop and mobile */
    layoutId: string;
    /** Called after a link is clicked (the mobile drawer uses it to close itself) */
    onNavigate?: () => void;
    /** Extra control in the brand row, e.g. the drawer's close button */
    brandAction?: React.ReactNode;
};

const Fade: React.FC<{ show: boolean; children: React.ReactNode; className?: string }> = ({
    show,
    children,
    className,
}) => (
    <AnimatePresence initial={false}>
        {show && (
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className={className}
            >
                {children}
            </motion.span>
        )}
    </AnimatePresence>
);

export const SidebarContent: React.FC<SidebarContentProps> = ({
    collapsed,
    user,
    badges = {},
    layoutId,
    onNavigate,
    brandAction,
}) => {
    const pathname = usePathname();
    const reduce = useReducedMotion();

    return (
        <div className="flex h-full min-h-0 flex-col">
            {/* Brand */}
            <div
                className={cn(
                    'flex h-16 shrink-0 items-center border-b border-border',
                    collapsed ? 'justify-center px-0' : 'justify-between px-4',
                )}
            >
                <Link
                    href={ADMIN_BASE}
                    onClick={onNavigate}
                    aria-label="Admin dashboard"
                    className="flex items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-sky-500 font-heading text-base font-bold text-white shadow-md shadow-primary/30">
                        S
                    </span>
                    <Fade show={!collapsed} className="flex flex-col leading-none">
                        <span className="font-heading text-lg font-bold tracking-tight text-foreground">
                            SAM
                        </span>
                        <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                            Admin panel
                        </span>
                    </Fade>
                </Link>
                {!collapsed && brandAction}
            </div>

            {/* Navigation */}
            <nav aria-label="Admin" className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
                <ul className="space-y-5">
                    {ADMIN_NAV.map((group, groupIndex) => (
                        <li key={group.label}>
                            {collapsed ? (
                                // In the icon rail the group titles become thin dividers (none above the first group)
                                groupIndex > 0 && (
                                    <div aria-hidden className="mx-3 mb-3 h-px bg-border" />
                                )
                            ) : (
                                <p className="mb-2 px-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                                    {group.label}
                                </p>
                            )}

                            <ul className="space-y-1">
                                {group.items.map((item) => {
                                    const active = isNavActive(pathname, item);
                                    const badge = badges[item.id];
                                    const Icon = item.icon;

                                    return (
                                        <li key={item.id}>
                                            <Link
                                                href={item.href}
                                                onClick={onNavigate}
                                                // Collapsed: the label is hidden, so it moves to a tooltip + accessible name
                                                title={collapsed ? item.label : undefined}
                                                aria-label={collapsed ? item.label : undefined}
                                                aria-current={active ? 'page' : undefined}
                                                className={cn(
                                                    'relative flex h-10 items-center gap-3 rounded-xl text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                                                    collapsed ? 'justify-center px-0' : 'px-3',
                                                    active
                                                        ? 'text-primary'
                                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                                )}
                                            >
                                                {active && (
                                                    <motion.span
                                                        layoutId={layoutId}
                                                        transition={
                                                            reduce
                                                                ? { duration: 0 }
                                                                : { duration: 0.35, ease: EASE }
                                                        }
                                                        className="absolute inset-0 rounded-xl bg-primary/10 ring-1 ring-primary/20"
                                                    />
                                                )}

                                                <span className="relative flex shrink-0 items-center">
                                                    <Icon className="size-[18px]" aria-hidden />
                                                    {/* In the collapsed rail the unread count becomes a dot on the icon */}
                                                    {collapsed && badge ? (
                                                        <span className="absolute -right-1 -top-1 size-2 rounded-full bg-primary ring-2 ring-background" />
                                                    ) : null}
                                                </span>

                                                <Fade show={!collapsed} className="relative truncate">
                                                    {item.label}
                                                </Fade>

                                                {!collapsed && badge ? (
                                                    <span className="relative ml-auto rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold leading-none text-primary-foreground">
                                                        {badge}
                                                    </span>
                                                ) : null}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* User */}
            <div className="shrink-0 border-t border-border p-3">
                <Link
                    href={`${ADMIN_BASE}/settings`}
                    onClick={onNavigate}
                    title={collapsed ? user.name : undefined}
                    className={cn(
                        'flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary',
                        collapsed && 'justify-center',
                    )}
                >
                    <Portrait name={user.name} src={user.avatar} size="md" status="online" />
                    <Fade show={!collapsed} className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-medium text-foreground">
                            {user.name}
                        </span>
                        <span className="truncate font-mono text-[11px] text-muted-foreground">
                            {user.role}
                        </span>
                    </Fade>
                </Link>
            </div>
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*  Desktop sidebar: sticky, collapses to an icon rail                         */
/* -------------------------------------------------------------------------- */

type AdminSidebarProps = {
    collapsed: boolean;
    /** False until the saved collapsed state has been read, so it doesn't animate on first load */
    animated: boolean;
    user: AdminUser;
    badges?: Record<string, number>;
};

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, animated, user, badges }) => (
    <motion.aside
        initial={false}
        animate={{ width: collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH }}
        transition={{ duration: animated ? 0.3 : 0, ease: EASE }}
        className="sticky top-0 hidden h-dvh shrink-0 overflow-hidden border-r border-border bg-card/40 lg:block"
    >
        <SidebarContent collapsed={collapsed} user={user} badges={badges} layoutId="admin-nav-desktop" />
    </motion.aside>
);

export default AdminSidebar;
