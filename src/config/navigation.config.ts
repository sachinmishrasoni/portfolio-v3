export interface NavigationItem {
    label: string;
    href: string;
    icon?: string;
    children?: NavigationItem[];
}

export const PUBLIC_NAVIGATION: NavigationItem[] = [
    { label: "Home", href: "/" },
    { label: "About", href: "/#about" },
    { label: "Skills", href: "/#skills" },
    { label: "Experience", href: "/#experience" },
    { label: "Projects", href: "/#projects" },
    { label: "Services", href: "/#services" },
    { label: "Contact", href: "/#contact" },
];

export const ADMIN_NAVIGATION: NavigationItem[] = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Users", href: "/admin/users" },
    { label: "Settings", href: "/admin/settings" },
];
