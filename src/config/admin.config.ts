import { NavMenuItem } from '@/components/common/NavMenu/navmenu.type';
import type { IconType } from 'react-icons';
import { IoSchoolOutline } from 'react-icons/io5';
import {
    LuBriefcase,
    LuBriefcaseBusiness,
    LuCode,
    LuFileText,
    LuFolderKanban,
    LuImage,
    LuLayoutDashboard,
    LuList,
    LuMail,
    LuMegaphone,
    LuPanelBottom,
    LuPlus,
    LuSettings,
    LuSparkles,
    LuUserRound,
} from 'react-icons/lu';

export const ADMIN_BASE = '/admin';
export const ADMIN_VERSION = '1.0.0';
export const SITE_URL = '/';
export const SIDEBAR_COOKIE = 'admin-sidebar-collapsed';

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

export const ADMIN_NAV: NavMenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', href: ADMIN_BASE, icon: LuLayoutDashboard, exact: true },
    // {
    //     type: 'group',
    //     id: 'overview',
    //     label: 'Overview',
    //     children: [
    //         { id: 'dashboard', label: 'Dashboard', href: ADMIN_BASE, icon: LuLayoutDashboard, exact: true },
    //     ],
    // },
    {
        type: 'group',
        id: 'content',
        label: 'Content',
        children: [
            {
                id: 'projects',
                label: 'Projects',
                href: `${ADMIN_BASE}/projects`,
                icon: LuFolderKanban,
                children: [
                    { id: 'projects-all', label: 'All projects', href: `${ADMIN_BASE}/projects`, icon: LuList },
                    { id: 'projects-new', label: 'New project', href: `${ADMIN_BASE}/projects/new`, icon: LuPlus },
                ],
            },
            { id: 'skills', label: 'Skills', href: `${ADMIN_BASE}/skills`, icon: LuCode },
            { id: 'education', label: 'Education', href: `${ADMIN_BASE}/education`, icon: IoSchoolOutline },
            { id: 'experience', label: 'Experience', href: `${ADMIN_BASE}/experience`, icon: LuBriefcaseBusiness },
            { id: 'services', label: 'Services', href: `${ADMIN_BASE}/services`, icon: LuSparkles },
        ],
    },
    {
        type: 'group',
        id: 'cms',
        label: 'CMS',
        children: [
            { id: 'cms-pages', label: 'Pages', href: `${ADMIN_BASE}/cms/pages`, icon: LuFileText },
            { id: 'cms-hero', label: 'Hero Section', href: `${ADMIN_BASE}/cms/hero`, icon: LuImage },
            { id: 'cms-about', label: 'About Section', href: `${ADMIN_BASE}/cms/about`, icon: LuUserRound },
            { id: 'cms-cta', label: 'CTA Section', href: `${ADMIN_BASE}/cms/cta`, icon: LuMegaphone },
            { id: 'cms-footer', label: 'Footer', href: `${ADMIN_BASE}/cms/footer`, icon: LuPanelBottom },
        ],
    },
    {
        type: 'group',
        id: 'inbox',
        label: 'Inbox',
        children: [{ id: 'messages', label: 'Messages', href: `${ADMIN_BASE}/messages`, icon: LuMail }],
    },
    {
        type: 'group',
        id: 'system',
        label: 'System',
        children: [{ id: 'settings', label: 'Settings', href: `${ADMIN_BASE}/settings`, icon: LuSettings }],
    },
];
