import type { IconType } from 'react-icons';
import {
    LuBriefcase,
    LuCode,
    LuFolderKanban,
    LuLayoutDashboard,
    LuMail,
    LuSettings,
    LuSparkles,
} from 'react-icons/lu';

export const ADMIN_BASE = '/admin';
export const ADMIN_VERSION = '1.0.0';
export const SITE_URL = '/';

export type AdminUser = {
    name: string;
    role: string;
    /** Image path or URL. Falls back to initials. */
    avatar?: string;
};

export type AdminNavItem = {
    id: string;
    label: string;
    href: string;
    icon: IconType;
    /** Active only on this exact path (the dashboard), not on its children */
    exact?: boolean;
};

export type AdminNavGroup = {
    label: string;
    items: AdminNavItem[];
};

export const ADMIN_NAV: AdminNavGroup[] = [
    {
        label: 'Overview',
        items: [
            { id: 'dashboard', label: 'Dashboard', href: ADMIN_BASE, icon: LuLayoutDashboard, exact: true },
        ],
    },
    {
        label: 'Content',
        items: [
            { id: 'projects', label: 'Projects', href: `${ADMIN_BASE}/projects`, icon: LuFolderKanban },
            { id: 'skills', label: 'Skills', href: `${ADMIN_BASE}/skills`, icon: LuCode },
            { id: 'experience', label: 'Experience', href: `${ADMIN_BASE}/experience`, icon: LuBriefcase },
            { id: 'services', label: 'Services', href: `${ADMIN_BASE}/services`, icon: LuSparkles },
        ],
    },
    {
        label: 'Inbox',
        items: [{ id: 'messages', label: 'Messages', href: `${ADMIN_BASE}/messages`, icon: LuMail }],
    },
    {
        label: 'System',
        items: [{ id: 'settings', label: 'Settings', href: `${ADMIN_BASE}/settings`, icon: LuSettings }],
    },
];

export const isNavActive = (pathname: string, item: AdminNavItem) =>
    item.exact
        ? pathname === item.href
        : pathname === item.href || pathname.startsWith(`${item.href}/`);
        