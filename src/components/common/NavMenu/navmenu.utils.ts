import type { NavMenuItem, NavMenuLink } from './navmenu.type';

export const isNavMenuLink = (item: NavMenuItem): item is NavMenuLink =>
    item.type !== 'group' && item.type !== 'divider';

const matches = (pathname: string, item: NavMenuLink) => {
    if (!item.href) return false;
    return item.exact
        ? pathname === item.href
        : pathname === item.href || pathname.startsWith(`${item.href}/`);
};

/** True when the item itself or any of its children matches the current path */
export const isNavMenuActive = (pathname: string, item: NavMenuLink) =>
    matches(pathname, item) || !!item.children?.some((child) => matches(pathname, child));

/** The one active child. The longest href wins, so "All projects" isn't active on /projects/new */
export const getActiveChild = (pathname: string, parent: NavMenuLink) =>
    (parent.children ?? [])
        .filter((child) => !child.disabled && matches(pathname, child))
        .sort((a, b) => (b.href?.length ?? 0) - (a.href?.length ?? 0))[0];

/** All links, with groups unwrapped (dividers dropped) */
export const flattenNavMenu = (items: NavMenuItem[]): NavMenuLink[] =>
    items.flatMap((item) =>
        item.type === 'group' ? flattenNavMenu(item.children) : isNavMenuLink(item) ? [item] : [],
    );

/** The top-level link for the current path (used by the header title) */
export const findActiveNavMenuItem = (pathname: string, items: NavMenuItem[]) =>
    flattenNavMenu(items).find((item) => isNavMenuActive(pathname, item));