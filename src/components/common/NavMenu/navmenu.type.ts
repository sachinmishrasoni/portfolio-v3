import type { IconType } from 'react-icons';

/** A thin horizontal line between items */
export type NavMenuDivider = {
    type: 'divider';
    id: string;
};

/** A titled section. In the collapsed rail its title becomes a divider */
export type NavMenuGroup = {
    type: 'group';
    id: string;
    label: string;
    children: NavMenuItem[];
};

/** A normal link. With `children` it becomes an expandable list (a dropdown when collapsed) */
export type NavMenuLink = {
    type?: 'item'; // default
    id: string;
    label: string;
    icon?: IconType;
    href?: string;
    disabled?: boolean;
    /** Active only on this exact path (e.g. the dashboard), not on its children */
    exact?: boolean;
    children?: NavMenuLink[];
};

export type NavMenuItem = NavMenuLink | NavMenuGroup | NavMenuDivider;

export type NavMenuProps = {
    items: NavMenuItem[];
    collapsed?: boolean;
    /** Called with the link that was clicked (parents that only open/close a list don't call it) */
    onClick?: (item: NavMenuLink) => void;
    /** Unique per instance so the active highlight doesn't jump between two menus (desktop and mobile) */
    layoutId: string;
    /** Counters by item id, e.g. { messages: 3 } */
    badges?: Record<string, number>;
    /** Defaults to the current route */
    pathname?: string;
    className?: string;
    'aria-label'?: string;
};