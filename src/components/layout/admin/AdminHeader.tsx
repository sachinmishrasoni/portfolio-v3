'use client';

import React from 'react';
import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';
import { CgMenuLeft } from 'react-icons/cg';
import { LuBell, LuPanelLeftClose, LuPanelLeftOpen } from 'react-icons/lu';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
// Same toggle with the circular theme transition. Adjust the path to where yours lives.
import ThemeToggle from '@/components/common/ThemeToggle';
import { ADMIN_BASE, SITE_URL, type AdminUser } from '@/config/admin.config';
import AdminPageTitle from './components/AdminPageTitle';
import UserMenu from './components/UserMenu';


const iconButtonClass = 'relative size-8 text-muted-foreground hover:text-foreground';

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
}) => (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-2 backdrop-blur-md sm:px-4">
        {/* Mobile: open the drawer */}
        <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onOpenMobileNav}
            aria-label="Open navigation"
            className={cn(iconButtonClass, 'lg:hidden')}
        >
            <CgMenuLeft className="size-5" />
        </Button>

        {/* Desktop: collapse / expand the sidebar (Ctrl/⌘ + B) */}
        <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-keyshortcuts="Control+B Meta+B"
            title={`${collapsed ? 'Expand' : 'Collapse'} sidebar (Ctrl/⌘ B)`}
            className={cn(iconButtonClass, 'hidden lg:inline-flex')}
        >
            {collapsed ? (
                <LuPanelLeftOpen className="size-[18px]" />
            ) : (
                <LuPanelLeftClose className="size-[18px]" />
            )}
        </Button>

        <div aria-hidden className="mx-1 hidden h-5 w-px bg-border sm:block" />

        {/* Page title + breadcrumb */}
        <AdminPageTitle />

        {/* Actions */}
        <div className="flex items-center gap-1">
            <a
                href={SITE_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="View live site"
                title="View live site"
                className={cn(
                    buttonVariants({ variant: 'ghost', size: 'icon' }),
                    iconButtonClass,
                    'hidden sm:inline-flex',
                )}
            >
                <FiExternalLink className="size-[18px]" />
            </a>

            <Link
                href={`${ADMIN_BASE}/messages`}
                aria-label={unreadMessages > 0 ? `Messages, ${unreadMessages} unread` : 'Messages'}
                className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), iconButtonClass)}
            >
                <LuBell className="size-[18px]" />
                {unreadMessages > 0 && (
                    <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-primary ring-2 ring-background" />
                )}
            </Link>

            <ThemeToggle />

            <div aria-hidden className="mx-1 hidden h-5 w-px bg-border sm:block" />
            <UserMenu user={user} onSignOut={onSignOut} />
        </div>
    </header>
);

export default AdminHeader;