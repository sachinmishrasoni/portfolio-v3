'use client';

import React from 'react';
import Link from 'next/link';
import Portrait from '@/components/ui/portrait';
import NavMenu from '@/components/common/NavMenu';
import { ADMIN_BASE, ADMIN_NAV, type AdminUser } from '@/config/admin.config';
import SidebarText from './SidebarText';

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

const SidebarContent: React.FC<SidebarContentProps> = ({
    collapsed,
    user,
    badges,
    layoutId,
    onNavigate,
    brandAction,
}) => (
    <div className="flex h-full min-h-0 flex-col">
        {/* Brand: the logo keeps the same position in both states (20px + 36px + 20px = 76px) */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border pl-5 pr-4">
            <Link
                href={ADMIN_BASE}
                onClick={onNavigate}
                aria-label="Admin dashboard"
                className="flex items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-sky-500 font-heading text-base font-bold text-white shadow-md shadow-primary/30">
                    S
                </span>
                <SidebarText show={!collapsed} className="flex flex-col leading-none">
                    <span className="font-heading text-lg font-bold tracking-tight text-foreground">
                        SAM
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        Admin panel
                    </span>
                </SidebarText>
            </Link>
            {!collapsed && brandAction}
        </div>

        {/* Navigation */}
        <NavMenu
            aria-label="Admin"
            items={ADMIN_NAV}
            collapsed={collapsed}
            badges={badges}
            layoutId={layoutId}
            onClick={() => onNavigate?.()}
            className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-4"
        />

        {/* User: the avatar sits in a 52px box, on the same centre line as the nav icons */}
        <div className="shrink-0 border-t border-border px-3 py-1">
            <Link
                href={`${ADMIN_BASE}/profile`}
                onClick={onNavigate}
                title={collapsed ? user.name : undefined}
                className="flex h-12 items-center rounded-xl transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary"
            >
                <span className="flex w-[52px] shrink-0 items-center justify-center">
                    <Portrait name={user.name} src={user.avatar} size="xs" status="online" />
                </span>
                <SidebarText show={!collapsed} className="flex min-w-0 flex-col pr-3">
                    <span className="truncate text-xs font-medium leading-relaxed text-foreground">
                        {user.name}
                    </span>
                    <span className="truncate font-mono text-[10px] leading-2 text-muted-foreground">
                        {user.role}
                    </span>
                </SidebarText>
            </Link>
        </div>
    </div>
);

export default SidebarContent;