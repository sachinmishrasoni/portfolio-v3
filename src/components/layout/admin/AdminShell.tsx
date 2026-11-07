'use client';

import React, { useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminFooter from './AdminFooter';
import AdminHeader from './AdminHeader';
import AdminMobileNav from './AdminMobileNav';
import AdminSidebar from './AdminSidebar';
import { ADMIN_BASE, type AdminUser } from '@/config/admin.config';

const STORAGE_KEY = 'admin-sidebar-collapsed';

type AdminShellProps = {
    children: ReactNode;
    user: AdminUser;
    /** Unread counters by nav item id, e.g. { messages: 3 } */
    badges?: Record<string, number>;
};

/**
 * The frame around every admin page:
 *
 *   ┌──────────┬────────────────────────────┐
 *   │          │ header (sticky)            │
 *   │ sidebar  ├────────────────────────────┤
 *   │ (sticky) │ main  ← your pages         │
 *   │          ├────────────────────────────┤
 *   │          │ footer                     │
 *   └──────────┴────────────────────────────┘
 *
 * Below `lg` the sidebar becomes a drawer opened from the header.
 */
const AdminShell: React.FC<AdminShellProps> = ({ children, user, badges }) => {
    const pathname = usePathname();
    const router = useRouter();

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    // Stays false until the saved state has been applied, so the sidebar doesn't visibly animate on load
    const [ready, setReady] = useState(false);

    // Restore the saved collapsed state
    useEffect(() => {
        setCollapsed(localStorage.getItem(STORAGE_KEY) === '1');
        const frame = requestAnimationFrame(() => setReady(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    const toggleSidebar = () => {
        const next = !collapsed;
        setCollapsed(next);
        localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
    };

    // Ctrl/⌘ + B toggles the sidebar
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
                e.preventDefault();
                const next = !collapsed;
                setCollapsed(next);
                localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [collapsed]);

    // Close the drawer whenever the page changes
    useEffect(() => setMobileOpen(false), [pathname]);

    const handleSignOut = () => {
        // TODO: connect your auth (clear the session / call your logout API), then redirect
        router.push(`${ADMIN_BASE}/login`);
    };

    return (
        <div className="flex min-h-dvh bg-background text-foreground">
            <a
                href="#admin-main"
                className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
            >
                Skip to content
            </a>

            <AdminSidebar collapsed={collapsed} animated={ready} user={user} badges={badges} />
            <AdminMobileNav
                open={mobileOpen}
                onOpenChange={setMobileOpen}
                user={user}
                badges={badges}
            />

            {/* min-w-0 lets wide tables scroll inside the page instead of stretching the layout */}
            <div className="flex min-w-0 flex-1 flex-col">
                <AdminHeader
                    user={user}
                    collapsed={collapsed}
                    unreadMessages={badges?.messages}
                    onOpenMobileNav={() => setMobileOpen(true)}
                    onToggleSidebar={toggleSidebar}
                    onSignOut={handleSignOut}
                />

                <main id="admin-main" className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    <div className="mx-auto w-full max-w-7xl">{children}</div>
                </main>

                <AdminFooter />
            </div>
        </div>
    );
};

export default AdminShell;
