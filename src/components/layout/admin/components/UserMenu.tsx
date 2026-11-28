'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { FiChevronDown, FiExternalLink, FiLogOut, FiSettings, FiUser } from 'react-icons/fi';
import Portrait from '@/components/ui/portrait';
import { Button } from '@/components/ui/button';
import { ADMIN_BASE, SITE_URL, type AdminUser } from '@/config/admin.config';

type UserMenuProps = {
    user: AdminUser;
    onSignOut: () => void;
};

const itemClass =
    'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none';

const UserMenu: React.FC<UserMenuProps> = ({ user, onSignOut }) => {
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

    return (
        <div ref={ref} className="relative">
            <Button
                type="button"
                variant="ghost"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="h-auto gap-2 rounded-xl p-1 md:pr-2"
            >
                <Portrait name={user.name} src={user.avatar} size="sm" />
                <span className="hidden text-sm font-medium text-foreground md:block">
                    {user.name}
                </span>
                <FiChevronDown
                    aria-hidden
                    className={`hidden size-4 text-muted-foreground transition-transform md:block ${open ? 'rotate-180' : ''
                        }`}
                />
            </Button>

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
                            <p className="truncate font-mono text-xs text-muted-foreground">
                                {user.role}
                            </p>
                        </div>
                        <div aria-hidden className="my-1 h-px bg-border" />

                        <Link
                            href={`${ADMIN_BASE}/profile`}
                            role="menuitem"
                            onClick={() => setOpen(false)}
                            className={itemClass}
                        >
                            <FiUser aria-hidden className="text-muted-foreground" />
                            Profile
                        </Link>
                        <Link
                            href={`${ADMIN_BASE}/settings`}
                            role="menuitem"
                            onClick={() => setOpen(false)}
                            className={itemClass}
                        >
                            <FiSettings aria-hidden className="text-muted-foreground" />
                            Settings
                        </Link>
                        <a
                            href={SITE_URL}
                            target="_blank"
                            rel="noreferrer"
                            role="menuitem"
                            onClick={() => setOpen(false)}
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

export default UserMenu;
