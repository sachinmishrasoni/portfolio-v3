'use client';

import React from 'react';
import { FiX } from 'react-icons/fi';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { SidebarContent } from './AdminSidebar';
import type { AdminUser } from '@/config/admin.config';

type AdminMobileNavProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: AdminUser;
    badges?: Record<string, number>;
};

/** The same sidebar, as a drawer that slides in from the left on screens below `lg`. */
const AdminMobileNav: React.FC<AdminMobileNavProps> = ({ open, onOpenChange, user, badges }) => (
    <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
            side="left"
            // `data-[side=left]:` so these beat shadcn's own width classes; `[&>button]:hidden` hides its built-in close button
            className="gap-0 border-r bg-background p-0 lg:hidden [&>button]:hidden data-[side=left]:w-72 data-[side=left]:max-w-[85vw]"
        >
            <SheetTitle className="sr-only">Admin navigation</SheetTitle>
            <SheetDescription className="sr-only">Navigate between the admin pages.</SheetDescription>

            <SidebarContent
                collapsed={false}
                user={user}
                badges={badges}
                layoutId="admin-nav-mobile"
                onNavigate={() => onOpenChange(false)}
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
);

export default AdminMobileNav;
