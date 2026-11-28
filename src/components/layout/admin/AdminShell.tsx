'use client';

import React, { useCallback, useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminFooter from './AdminFooter';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { ADMIN_BASE, SIDEBAR_COOKIE, type AdminUser } from '@/config/admin.config';
import { logout } from '@/features/admin/auth/auth.service';
import { toast } from 'sonner';

type AdminShellProps = {
    children: ReactNode;
    user: AdminUser;
    /** Unread counters by nav item id, e.g. { messages: 3 } */
    badges?: Record<string, number>;
    /** Read from the cookie on the server, so the first paint is already correct */
    defaultCollapsed?: boolean;
};

const AdminShell: React.FC<AdminShellProps> = ({
    children,
    user,
    badges,
    defaultCollapsed = false,
}) => {
    const pathname = usePathname();
    const router = useRouter();

    const [collapsed, setCollapsed] = useState(defaultCollapsed);
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleSidebar = useCallback(() => {
        const next = !collapsed;
        setCollapsed(next);
        // Saved in a cookie (not localStorage) so the server can render the right width on refresh
        document.cookie = `${SIDEBAR_COOKIE}=${next ? '1' : '0'}; path=/; max-age=31536000; samesite=lax`;
    }, [collapsed]);

    // Ctrl/⌘ + B toggles the sidebar
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
                e.preventDefault();
                toggleSidebar();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [toggleSidebar]);

    // Close the drawer whenever the page changes
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    const handleSignOut = async () => {
        try {
            await logout();

            router.replace(`${ADMIN_BASE}/login`);
            router.refresh();

            toast.success('Sign out successful!');
        } catch (error) {
            console.error('Sign out failed:', error);
        }
    };

    return (
        <div className="flex min-h-dvh bg-background text-foreground">
            <a
                href="#admin-main"
                className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
            >
                Skip to content
            </a>

            {/* One component: desktop sidebar + mobile drawer */}
            <AdminSidebar
                collapsed={collapsed}
                user={user}
                badges={badges}
                mobileOpen={mobileOpen}
                onMobileOpenChange={setMobileOpen}
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

                <main id="admin-main" className="flex-1 px-4 py-4">
                    <div className="mx-auto w-full max-w-7xl">{children}</div>
                </main>

                <AdminFooter />
            </div>
        </div>
    );
};

export default AdminShell;