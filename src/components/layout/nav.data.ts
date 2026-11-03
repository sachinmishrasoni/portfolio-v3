export type NavItem = {
    label: string;
    /** Section id on the page */
    href: `#${string}`;
};

/** Shared by the mobile menu (and handy for the desktop header too). */
export const NAV_ITEMS: NavItem[] = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
];
