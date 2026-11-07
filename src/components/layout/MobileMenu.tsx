'use client';

import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { FiX } from 'react-icons/fi';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from '@/components/ui/sheet';
// Same links and location as the Contact section / footer. Adjust the path if yours differs.
// import { CONTACT_LINKS, LOCATION } from '@/components/contact/contact.data';
import { NAV_ITEMS } from './nav.data';
import { CONTACT_LINKS, LOCATION } from '@/features/portfolio/contact/contact.data';
import { Button } from '../ui/button';
import { IoLocationOutline } from 'react-icons/io5';

const EASE = [0.22, 1, 0.36, 1] as const;

/** The menu is mobile-only: it closes itself if the window grows past this width. Match your header's breakpoint. */
const DESKTOP_QUERY = '(min-width: 1024px)';
/** shadcn's Sheet close animation lasts 300ms */
const CLOSE_ANIMATION_MS = 300;

type MobileMenuProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const MobileMenu: React.FC<MobileMenuProps> = ({ open, onOpenChange }) => {
    const reduce = useReducedMotion();

    // Close when the viewport becomes desktop-sized
    useEffect(() => {
        if (!open) return;
        const query = window.matchMedia(DESKTOP_QUERY);
        const handleChange = (e: MediaQueryListEvent) => {
            if (e.matches) onOpenChange(false);
        };
        query.addEventListener('change', handleChange);
        return () => query.removeEventListener('change', handleChange);
    }, [open, onOpenChange]);

    const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        onOpenChange(false);

        // Radix locks page scroll while the sheet is open, so scroll once it has finished closing
        window.setTimeout(
            () => {
                document
                    .querySelector(href)
                    ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
                history.replaceState(null, '', href);
            },
            reduce ? 0 : CLOSE_ANIMATION_MS,
        );
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="top"
                // Full-screen; `[&>button]:hidden` hides shadcn's built-in close button because we render our own
                className="gap-0 border-0 bg-background p-0 lg:hidden [&>button]:hidden data-[side=top]:h-dvh data-[side=top]:max-h-none data-[side=top]:w-full data-[side=top]:max-w-none"
            >
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                <SheetDescription className="sr-only">
                    Jump to a section of the page.
                </SheetDescription>

                {/* Soft glow in the corner */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_15%_0%,color-mix(in_oklab,var(--primary)_10%,transparent),transparent)]"
                />

                <div className="relative flex h-full flex-col">
                    {/* Top bar: logo + close */}
                    <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-2.5 mt-3">
                        <p className="flex items-baseline gap-2">
                            <span className="text-xl font-extrabold tracking-tight text-foreground">
                                SAM
                            </span>
                            <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                / Sachin
                            </span>
                        </p>

                        <SheetClose
                            render={
                                <Button size="icon" variant="ghost">
                                    <FiX className="size-5" />
                                </Button>
                            }
                        />
                    </div>

                    {/* Links */}
                    <nav aria-label="Primary" className="flex-1 overflow-y-auto px-6 py-10">
                        <ul className="space-y-6">
                            {NAV_ITEMS.map(({ label, href }, i) => (
                                <motion.li
                                    key={href}
                                    initial={reduce ? false : { opacity: 0, x: -24 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: EASE }}
                                >
                                    <a
                                        href={href}
                                        onClick={(e) => handleNavigate(e, href)}
                                        className="group flex items-baseline gap-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                                    >
                                        <span className="font-mono text-sm text-primary">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <span className="text-3xl font-semibold tracking-tight text-foreground transition-all duration-300 group-hover:translate-x-2 group-hover:text-primary">
                                            {label}
                                        </span>
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                    </nav>

                    {/* Bottom bar: socials + location */}
                    <div className="flex shrink-0 items-center justify-between gap-4 border-t border-border p-4">
                        <ul className="flex items-center gap-3">
                            {CONTACT_LINKS.map(({ id, label, href, icon: Icon, external }) => (
                                <li key={id}>
                                    <a
                                        href={href}
                                        aria-label={label}
                                        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                                        className="flex size-8 items-center justify-center rounded-lg border border-border bg-card/60 text-sm text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                                    >
                                        <Icon aria-hidden />
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-1.5 inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
                            <IoLocationOutline aria-hidden="true" className="shrink-0 text-primary" />
                            <span>{LOCATION}</span>
                        </p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default MobileMenu;
