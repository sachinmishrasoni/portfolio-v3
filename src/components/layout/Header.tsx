"use client";

import { useCallback, useEffect, useState } from "react";
import {
    motion,
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
} from "motion/react";
import { useTheme } from "next-themes";
import { FiDownload } from "react-icons/fi";
import { CgMenuRight } from "react-icons/cg";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import MobileMenu from "./MobileMenu";
import Portrait from "../ui/portrait";
import ThemeToggle from "../common/ThemeToggle";

const navItems = [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
];

// Scroll distance in px before the header turns into a floating pill
const SCROLL_THRESHOLD = 40;

// Section counts as active once its top passes this offset from the viewport top
const ACTIVE_OFFSET = 140;

// Values match max-w-7xl (1280px) and max-w-5xl (1024px)
const navVariants = {
    top: {
        maxWidth: 1280,
        marginTop: 0,
        paddingTop: 16,
        paddingBottom: 16,
        borderRadius: 0,
    },
    scrolled: {
        maxWidth: 1024,
        marginTop: 12,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 16,
    },
};

const Header = () => {
    const { theme, setTheme } = useTheme();
    const reduceMotion = useReducedMotion();
    const { scrollY } = useScroll();

    const [mounted, setMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Sync header state and active section with the current scroll position
    const syncWithScroll = useCallback(() => {
        setIsScrolled(window.scrollY > SCROLL_THRESHOLD);

        const sections = navItems
            .map((item) => document.querySelector(item.href))
            .filter((section): section is Element => section !== null);

        const current = sections
            .filter((section) => section.getBoundingClientRect().top <= ACTIVE_OFFSET)
            .at(-1);

        // Fall back to home when above the first section
        setActiveSection(current?.id ?? "home");
    }, []);

    useMotionValueEvent(scrollY, "change", syncWithScroll);

    // Run once on mount and on resize so a refreshed or resized page starts correct
    useEffect(() => {
        syncWithScroll();
        window.addEventListener("resize", syncWithScroll);
        return () => window.removeEventListener("resize", syncWithScroll);
    }, [syncWithScroll]);

    const toggleTheme = () => {
        if (!mounted) return;
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const transition = reduceMotion
        ? { duration: 0 }
        : { type: "spring" as const, stiffness: 260, damping: 32, mass: 0.8 };

    return (
        <header className="fixed inset-x-0 top-0 z-50 px-2">
            <motion.nav
                aria-label="Main"
                initial={false}
                variants={navVariants}
                animate={isScrolled ? "scrolled" : "top"}
                transition={transition}
                className="relative isolate mx-auto flex w-full items-center justify-between px-2.5 sm:px-4"
            >
                {/* Glass surface fades in so the border, blur and shadow never pop */}
                <motion.div
                    aria-hidden="true"
                    initial={false}
                    animate={{ opacity: isScrolled ? 1 : 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
                    className="absolute inset-0 -z-10 rounded-[inherit] border border-border bg-background/60 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl dark:shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
                />
                <div className="flex items-center gap-1">
                    <Portrait name="Sachin Mishra Soni" src="/images/avatar.jpg" size="sm" />
                    <a href="#home" className="font-signature text-xl font-bold">
                        Sam
                    </a>
                </div>

                <ul className="hidden items-center gap-1 md:flex">
                    {navItems.map((item) => {
                        const sectionId = item.href.slice(1);
                        const isActive = activeSection === sectionId;

                        return (
                            <li key={item.href} className="relative">
                                <a
                                    href={item.href}
                                    className={cn(
                                        "block px-3 py-2 text-sm transition-colors duration-300 hover:text-primary",
                                        isActive ? "text-primary" : "text-muted-foreground"
                                    )}
                                >
                                    {item.label}
                                </a>

                                {/* Shared layout id makes the underline glide between links */}
                                {isActive && (
                                    <motion.span
                                        layoutId="nav-active-indicator"
                                        transition={transition}
                                        className="absolute inset-x-3 -bottom-0.5 h-px rounded-full bg-primary"
                                    />
                                )}
                            </li>
                        );
                    })}
                </ul>

                <div className="flex items-center gap-2">
                    {/* <Button
                        size="icon"
                        variant="outline"
                        className="hover:border-primary dark:hover:border-primary"
                        // className="size-8 hover:border-indigo-400/50"
                        onClick={toggleTheme}
                        disabled={!mounted}
                    >
                        {mounted ? (
                            theme === "dark" ? <MdOutlineLightMode /> : <MdOutlineDarkMode />
                        ) : (
                            <span className="size-4" />
                        )}
                    </Button> */}

                    <ThemeToggle />

                    <Button
                        variant="secondary"
                        className="rounded-full bg-gray-500/10 text-xs hover:bg-gray-500/20"
                        onClick={() => {
                            window.open("/resume.pdf", "_blank", "noopener,noreferrer");
                        }}
                    >
                        <FiDownload />
                        Resume
                    </Button>

                    <Button size="icon" variant="outline"
                        className="flex md:hidden"
                        onClick={() => setMenuOpen(true)}
                    >
                        <CgMenuRight />
                    </Button>
                </div>
            </motion.nav>

            <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />
        </header>
    );
};

export default Header;