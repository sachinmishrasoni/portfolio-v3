'use client';

import React from 'react';
import { motion } from 'motion/react';
import { FiX } from 'react-icons/fi';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import SidebarContent from './components/SidebarContent';
import type { AdminUser } from '@/config/admin.config';

const EASE = [0.22, 1, 0.36, 1] as const;

export const SIDEBAR_WIDTH = 260;
export const SIDEBAR_WIDTH_COLLAPSED = 76;

type AdminSidebarProps = {
    collapsed: boolean;
    user: AdminUser;
    badges?: Record<string, number>;
    /** Mobile drawer state (below `lg`) */
    mobileOpen: boolean;
    onMobileOpenChange: (open: boolean) => void;
};

const AdminSidebar: React.FC<AdminSidebarProps> = ({
    collapsed,
    user,
    badges,
    mobileOpen,
    onMobileOpenChange,
}) => (
    <>
        {/* Desktop: sticky, collapses to an icon rail */}
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH }}
            transition={{ duration: 0.3, ease: EASE }}
            className="sticky top-0 hidden h-dvh shrink-0 overflow-hidden border-r border-border bg-card/40 lg:block"
        >
            <SidebarContent
                collapsed={collapsed}
                user={user}
                badges={badges}
                layoutId="admin-nav-desktop"
            />
        </motion.aside>

        {/* Mobile: drawer that slides in from the left below `lg` */}
        <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
            <SheetContent
                side="left"
                // `data-[side=left]:` so these beat shadcn's own width classes; `[&>button]:hidden` hides its built-in close button
                className="gap-0 border-r bg-background p-0 lg:hidden [&>button]:hidden data-[side=left]:w-72 data-[side=left]:max-w-[85vw]"
            >
                <SheetTitle className="sr-only">Admin navigation</SheetTitle>
                <SheetDescription className="sr-only">
                    Navigate between the admin pages.
                </SheetDescription>

                <SidebarContent
                    collapsed={false}
                    user={user}
                    badges={badges}
                    layoutId="admin-nav-mobile"
                    onNavigate={() => onMobileOpenChange(false)}
                    brandAction={
                        <SheetClose
                            render={
                                <Button size="icon" variant="ghost" aria-label="Close menu">
                                    <FiX className="size-5" />
                                </Button>
                            }
                        />
                    }
                />
            </SheetContent>
        </Sheet>
    </>
);

export default AdminSidebar;