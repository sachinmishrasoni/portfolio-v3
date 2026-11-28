'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { LuChevronDown, LuChevronRight } from 'react-icons/lu';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { NavMenuItem, NavMenuLink, NavMenuProps } from './navmenu.type';
import { getActiveChild, isNavMenuActive } from './navmenu.utils';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Delay before the hover dropdown closes, so the pointer can travel from the icon to the menu */
const HOVER_CLOSE_DELAY = 150;

/**
 * Row shell. No left padding or gap: the icon cell (52px) controls the icon position.
 * 52px = collapsed sidebar width (76px) − nav padding (2 × 12px), so the icon is centred in the rail.
 * `overflow-hidden` clips the invisible label in the rail.
 */
const rowClass = (active: boolean) =>
    cn(
        'relative flex h-10 w-full items-center overflow-hidden rounded-xl text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        active ? 'text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
    );

/* -------------------------------------------------------------------------- */
/*  Small internal pieces                                                      */
/* -------------------------------------------------------------------------- */

/** Fades with the menu. On expand it waits a moment so the text appears after the width has grown. */
const NavMenuText: React.FC<{ show: boolean; children: React.ReactNode; className?: string }> = ({
    show,
    children,
    className,
}) => {
    const reduce = useReducedMotion();
    return (
        <motion.span
            initial={false}
            animate={{ opacity: show ? 1 : 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.15, delay: show ? 0.12 : 0 }}
            aria-hidden={!show}
            className={cn('whitespace-nowrap', className)}
        >
            {children}
        </motion.span>
    );
};

/** The animated active highlight (ring-inset so it never sticks out past the row) */
const Pill: React.FC<{ layoutId: string; className?: string }> = ({ layoutId, className }) => {
    const reduce = useReducedMotion();
    return (
        <motion.span
            layoutId={layoutId}
            transition={reduce ? { duration: 0 } : { duration: 0.35, ease: EASE }}
            className={cn('absolute inset-0 bg-primary/10 ring-1 ring-inset ring-primary/20', className)}
        />
    );
};

/** Group title. In the rail it shrinks to a 1px divider (and the first group to nothing) */
const GroupHeading: React.FC<{ label: string; collapsed: boolean; divider: boolean }> = ({
    label,
    collapsed,
    divider,
}) => (
    <div
        className={cn(
            'relative transition-[height,margin] duration-300 ease-out',
            collapsed ? (divider ? 'mx-3 mb-2 h-px' : 'mb-0 h-0') : 'mb-2 h-4',
        )}
    >
        <p
            className={cn(
                'absolute inset-x-0 top-0 whitespace-nowrap px-3 font-mono text-[10px] uppercase leading-4 tracking-[0.25em] text-muted-foreground transition-opacity duration-150',
                collapsed ? 'opacity-0' : 'opacity-100 delay-100',
            )}
        >
            {label}
        </p>
        {divider && (
            <div
                aria-hidden
                className={cn(
                    'absolute inset-0 bg-border transition-opacity duration-150',
                    collapsed ? 'opacity-100 delay-100' : 'opacity-0',
                )}
            />
        )}
    </div>
);

/* -------------------------------------------------------------------------- */
/*  One link row (plain link, or parent with children)                         */
/* -------------------------------------------------------------------------- */

type Shared = {
    collapsed: boolean;
    layoutId: string;
    pathname: string;
    badges: Record<string, number>;
    onClick?: (item: NavMenuLink) => void;
};

const NavMenuEntry: React.FC<{ item: NavMenuLink } & Shared> = ({
    item,
    collapsed,
    layoutId,
    pathname,
    badges,
    onClick,
}) => {
    const reduce = useReducedMotion();
    const Icon = item.icon;
    const badge = badges[item.id];

    const active = isNavMenuActive(pathname, item);
    const children = item.children ?? [];
    const hasChildren = children.length > 0;
    const activeChild = hasChildren ? getActiveChild(pathname, item) : undefined;

    const [expanded, setExpanded] = useState(active); // starts open when a child is active
    const [menuOpen, setMenuOpen] = useState(false); // hover dropdown, collapsed rail only
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const cancelClose = useCallback(() => {
        if (closeTimer.current) {
            clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }
    }, []);

    const openMenu = useCallback(() => {
        cancelClose();
        setMenuOpen(true);
    }, [cancelClose]);

    const scheduleClose = useCallback(() => {
        cancelClose();
        closeTimer.current = setTimeout(() => setMenuOpen(false), HOVER_CLOSE_DELAY);
    }, [cancelClose]);

    // Clear the timer on unmount
    useEffect(() => cancelClose, [cancelClose]);

    // Open the section when navigating into it
    useEffect(() => {
        if (active) setExpanded(true);
    }, [active]);

    // Never keep the dropdown "open" in the background while the menu is expanded
    useEffect(() => {
        if (!collapsed) {
            cancelClose();
            setMenuOpen(false);
        }
    }, [collapsed, cancelClose]);

    const rowInner = (showPill: boolean, withChevron = false) => (
        <>
            {showPill && <Pill layoutId={layoutId} className="rounded-xl" />}

            {/* Fixed-width cell = the whole rail row, so the icon is always centred in the rail */}
            <span className="relative flex h-full w-[52px] shrink-0 items-center justify-center">
                {Icon ? <Icon className="size-[18px]" aria-hidden /> : <span className="size-[18px]" />}

                {/* Rail: the unread count becomes a dot on the icon */}
                {badge ? (
                    <span
                        className={cn(
                            'absolute right-[13px] top-[10px] size-2 rounded-full bg-primary ring-2 ring-background transition-opacity duration-150',
                            collapsed ? 'opacity-100' : 'opacity-0',
                        )}
                    />
                ) : null}

                {/* Rail: small arrow = "this opens a menu" */}
                {withChevron && (
                    <LuChevronRight
                        aria-hidden
                        className={cn(
                            'pointer-events-none absolute right-[3px] top-1/2 size-2.5 -translate-y-1/2 transition-opacity duration-150',
                            collapsed ? 'opacity-70 delay-100' : 'opacity-0',
                        )}
                    />
                )}
            </span>

            <NavMenuText show={!collapsed} className="relative -ml-1 min-w-0 truncate">
                {item.label}
            </NavMenuText>

            {badge ? (
                <NavMenuText
                    show={!collapsed}
                    className="relative ml-auto mr-3 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold leading-none text-primary-foreground"
                >
                    {badge}
                </NavMenuText>
            ) : null}

            {/* Expanded: arrow at the end of the row */}
            {withChevron && (
                <NavMenuText
                    show={!collapsed}
                    className={cn('relative mr-3 inline-flex shrink-0', badge ? 'ml-0' : 'ml-auto')}
                >
                    <LuChevronDown
                        aria-hidden
                        className={cn('size-4 transition-transform duration-300', expanded && 'rotate-180')}
                    />
                </NavMenuText>
            )}
        </>
    );

    /* ------------------------------ disabled ------------------------------ */
    if (item.disabled || (!hasChildren && !item.href)) {
        return (
            <span aria-disabled="true" className={cn(rowClass(false), 'pointer-events-none opacity-50')}>
                {rowInner(false)}
            </span>
        );
    }

    /* ------------------------------ plain link ---------------------------- */
    if (!hasChildren) {
        return (
            <Link
                href={item.href!}
                onClick={() => onClick?.(item)}
                title={collapsed ? item.label : undefined}
                aria-label={collapsed ? item.label : undefined}
                aria-current={active ? 'page' : undefined}
                className={rowClass(active)}
            >
                {rowInner(active)}
            </Link>
        );
    }

    /* ------------------- parent: collapsible list / dropdown --------------- */
    const showChildren = expanded && !collapsed;

    return (
        <div
            // Hover only matters in the rail
            onMouseEnter={collapsed ? openMenu : undefined}
            onMouseLeave={collapsed ? scheduleClose : undefined}
        >
            <DropdownMenu
                // Non-modal: no invisible backdrop, so mouseleave fires and the menu can close on hover-out
                modal={false}
                open={collapsed && menuOpen}
                onOpenChange={(next) => {
                    if (!collapsed) return;
                    cancelClose();
                    setMenuOpen(next); // Escape, outside click, keyboard, touch
                }}
            >
                <DropdownMenuTrigger
                    aria-label={collapsed ? item.label : undefined}
                    aria-expanded={collapsed ? menuOpen : expanded}
                    onClick={() => {
                        // Expanded: toggles the list. Rail: the dropdown is driven by hover / keyboard
                        if (!collapsed) setExpanded((v) => !v);
                    }}
                    className={cn(rowClass(active || (collapsed && menuOpen)), 'cursor-pointer')}
                >
                    {/* Pill only in the rail; when expanded the active child gets it */}
                    {rowInner(collapsed && active, true)}
                </DropdownMenuTrigger>

                {/* Rail: children open in a dropdown to the right */}
                <DropdownMenuContent
                    side="right"
                    align="start"
                    sideOffset={8}
                    className="w-52"
                    onMouseEnter={openMenu}
                    onMouseLeave={scheduleClose}
                >
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>{item.label}</DropdownMenuLabel>
                        {children.map((child) => {
                            const ChildIcon = child.icon;
                            return (
                                <DropdownMenuItem
                                    key={child.id}
                                    disabled={child.disabled || !child.href}
                                    onClick={() => {
                                        setMenuOpen(false);
                                        onClick?.(child);
                                    }}
                                    render={<Link href={child.href ?? '#'} />}
                                    className={cn(
                                        'gap-2',
                                        activeChild?.id === child.id && 'bg-primary/10 text-primary',
                                    )}
                                >
                                    {ChildIcon && <ChildIcon aria-hidden className="size-4" />}
                                    {child.label}
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Expanded: children slide open under the parent */}
            <motion.div
                initial={false}
                animate={{ height: showChildren ? 'auto' : 0, opacity: showChildren ? 1 : 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.3, ease: EASE }}
                className="overflow-hidden"
                // Keeps the hidden links out of the tab order (needs React 19 typings;
                // on React 18 use aria-hidden={!showChildren} instead)
                inert={!showChildren}
            >
                <ul className="ml-[26px] space-y-1 border-l border-border py-1 pl-2">
                    {children.map((child) => {
                        const childActive = activeChild?.id === child.id;
                        const childClass = cn(
                            'relative flex h-9 items-center whitespace-nowrap rounded-lg px-3 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary',
                            childActive
                                ? 'text-primary'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        );

                        return (
                            <li key={child.id}>
                                {child.disabled || !child.href ? (
                                    <span
                                        aria-disabled="true"
                                        className={cn(childClass, 'pointer-events-none opacity-50')}
                                    >
                                        <span className="relative truncate">{child.label}</span>
                                    </span>
                                ) : (
                                    <Link
                                        href={child.href}
                                        onClick={() => onClick?.(child)}
                                        aria-current={childActive ? 'page' : undefined}
                                        className={childClass}
                                    >
                                        {childActive && <Pill layoutId={layoutId} className="rounded-lg" />}
                                        <span className="relative truncate">{child.label}</span>
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </motion.div>
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*  List: renders items, groups and dividers (groups can nest)                 */
/* -------------------------------------------------------------------------- */

const NavMenuList: React.FC<{ items: NavMenuItem[] } & Shared> = ({ items, ...shared }) => (
    <ul className="space-y-1">
        {items.map((item, index) => {
            if (item.type === 'divider') {
                return <li key={item.id} role="separator" className="mx-3 my-2 h-px bg-border" />;
            }

            if (item.type === 'group') {
                return (
                    <li
                        key={item.id}
                        className={cn(
                            'transition-[margin] duration-300 first:mt-0',
                            shared.collapsed ? 'mt-2' : 'mt-5',
                        )}
                    >
                        <GroupHeading
                            label={item.label}
                            collapsed={shared.collapsed}
                            divider={index > 0}
                        />
                        <NavMenuList items={item.children} {...shared} />
                    </li>
                );
            }

            return (
                <li key={item.id}>
                    <NavMenuEntry item={item} {...shared} />
                </li>
            );
        })}
    </ul>
);

/* -------------------------------------------------------------------------- */
/*  NavMenu                                                                    */
/* -------------------------------------------------------------------------- */

const NavMenu: React.FC<NavMenuProps> = ({
    items,
    collapsed = false,
    onClick,
    layoutId,
    badges = {},
    pathname,
    className,
    'aria-label': ariaLabel = 'Navigation',
}) => {
    const currentPath = usePathname();

    return (
        <nav
            aria-label={ariaLabel}
            // Hidden scrollbar: it took width from the rail and pushed the icons off-centre
            // className={cn('[scrollbar-width:none] [&::-webkit-scrollbar]:hidden', className)}
            className={cn('scrollbar-hide', className)}
        >
            <NavMenuList
                items={items}
                collapsed={collapsed}
                layoutId={layoutId}
                pathname={pathname ?? currentPath}
                badges={badges}
                onClick={onClick}
            />
        </nav>
    );
};

export default NavMenu;
