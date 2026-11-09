'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { FiChevronDown, FiExternalLink, FiLogOut, FiMenu, FiUser } from 'react-icons/fi';
import { LuBell, LuPanelLeftClose, LuPanelLeftOpen } from 'react-icons/lu';
import Portrait from '@/components/ui/portrait';
// Same toggle with the circular theme transition. Adjust the path to where yours lives.
import ThemeToggle from '@/components/common/ThemeToggle';
import { ADMIN_BASE, SITE_URL, type AdminUser } from '@/config/admin.config';
import { CgMenuLeft } from 'react-icons/cg';

/* ---------------------------------- helpers --------------------------------- */

const titleCase = (segment: string) =>
    decodeURIComponent(segment)
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

/** /admin/projects/new → Dashboard / Projects / New */
const useBreadcrumbs = () => {
    const pathname = usePathname();
    const segments = pathname.replace(ADMIN_BASE, '').split('/').filter(Boolean);

    return [
        { label: 'Dashboard', href: ADMIN_BASE },
        ...segments.map((segment, i) => ({
            label: titleCase(segment),
            href: `${ADMIN_BASE}/${segments.slice(0, i + 1).join('/')}`,
        })),
    ];
};

const iconButton =
    'relative flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

/* -------------------------------- user menu --------------------------------- */

const UserMenu: React.FC<{ user: AdminUser; onSignOut: () => void }> = ({ user, onSignOut }) => {
    const reduce = useReducedMotion();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click or Escape
    useEffect(() => {
        if (!open) return;
        const handlePointerDown = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) setOpen(false);
        };
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleKey);
        };
    }, [open]);

    const itemClass =
        'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none';

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl p-1 cursor-pointer transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:pr-2"
            >
                <Portrait name={user.name} src={user.avatar} size="sm" />
                <span className="hidden text-sm font-medium text-foreground md:block">{user.name}</span>
                <FiChevronDown
                    aria-hidden
                    className={`hidden size-4 text-muted-foreground transition-transform md:block ${open ? 'rotate-180' : ''
                        }`}
                />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        role="menu"
                        initial={reduce ? false : { opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={reduce ? undefined : { opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full z-50 mt-2 w-60 origin-top-right rounded-xl border border-border bg-popover p-1.5 shadow-xl"
                    >
                        <div className="px-3 py-2">
                            <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                            <p className="truncate font-mono text-xs text-muted-foreground">{user.role}</p>
                        </div>
                        <div aria-hidden className="my-1 h-px bg-border" />

                        <Link
                            href={`${ADMIN_BASE}/settings`}
                            role="menuitem"
                            onClick={() => setOpen(false)}
                            className={itemClass}
                        >
                            <FiUser aria-hidden className="text-muted-foreground" />
                            Profile & settings
                        </Link>
                        <a
                            href={SITE_URL}
                            target="_blank"
                            rel="noreferrer"
                            role="menuitem"
                            className={itemClass}
                        >
                            <FiExternalLink aria-hidden className="text-muted-foreground" />
                            View live site
                        </a>

                        <div aria-hidden className="my-1 h-px bg-border" />
                        <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                                setOpen(false);
                                onSignOut();
                            }}
                            className={`${itemClass} text-destructive hover:bg-destructive/10`}
                        >
                            <FiLogOut aria-hidden />
                            Sign out
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

/* ---------------------------------- header ---------------------------------- */

type AdminHeaderProps = {
    user: AdminUser;
    collapsed: boolean;
    unreadMessages?: number;
    onOpenMobileNav: () => void;
    onToggleSidebar: () => void;
    onSignOut: () => void;
};

const AdminHeader: React.FC<AdminHeaderProps> = ({
    user = { name: '', role: '', avatar: '' },
    collapsed,
    unreadMessages = 0,
    onOpenMobileNav,
    onToggleSidebar,
    onSignOut,
}) => {
    const crumbs = useBreadcrumbs();
    const current = crumbs[crumbs.length - 1];

    return (
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-2 backdrop-blur-md sm:px-4">
            {/* Mobile: open the drawer */}
            <button
                type="button"
                onClick={onOpenMobileNav}
                aria-label="Open navigation"
                className={`${iconButton} lg:hidden`}
            >
                <CgMenuLeft className="size-5" />
            </button>

            {/* Desktop: collapse / expand the sidebar (Ctrl/⌘ + B) */}
            <button
                type="button"
                onClick={onToggleSidebar}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-keyshortcuts="Control+B Meta+B"
                title={`${collapsed ? 'Expand' : 'Collapse'} sidebar (Ctrl/⌘ B)`}
                className={`${iconButton} hidden lg:flex`}
            >
                {collapsed ? (
                    <LuPanelLeftOpen className="size-[18px]" />
                ) : (
                    <LuPanelLeftClose className="size-[18px]" />
                )}
            </button>

            <div aria-hidden className="mx-1 hidden h-5 w-px bg-border sm:block" />

            {/* Breadcrumbs: the full trail from sm up, just the page name on phones */}
            <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
                <ol className="hidden items-center gap-1.5 text-sm sm:flex">
                    {crumbs.map((crumb, i) => {
                        const last = i === crumbs.length - 1;
                        return (
                            <li key={crumb.href} className="flex min-w-0 items-center gap-1.5">
                                {i > 0 && (
                                    <span aria-hidden className="text-muted-foreground/50">
                                        /
                                    </span>
                                )}
                                {last ? (
                                    <span aria-current="page" className="truncate font-medium text-foreground">
                                        {crumb.label}
                                    </span>
                                ) : (
                                    <Link
                                        href={crumb.href}
                                        className="truncate text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        {crumb.label}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
                <p className="truncate text-sm font-medium text-foreground sm:hidden">{current.label}</p>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
                <a
                    href={SITE_URL}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="View live site"
                    title="View live site"
                    className={`${iconButton} hidden sm:flex`}
                >
                    <FiExternalLink className="size-[18px]" />
                </a>

                <Link
                    href={`${ADMIN_BASE}/messages`}
                    aria-label={
                        unreadMessages > 0 ? `Messages, ${unreadMessages} unread` : 'Messages'
                    }
                    className={iconButton}
                >
                    <LuBell className="size-[18px]" />
                    {unreadMessages > 0 && (
                        <span className="absolute right-2 top-2 size-2 rounded-full bg-primary ring-2 ring-background" />
                    )}
                </Link>

                <ThemeToggle />

                <div aria-hidden className="mx-1 hidden h-5 w-px bg-border sm:block" />
                <UserMenu user={user} onSignOut={onSignOut} />
            </div>
        </header>
    );
};

export default AdminHeader;
