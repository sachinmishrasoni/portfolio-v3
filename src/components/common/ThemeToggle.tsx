'use client';

import React from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { Button } from '@/components/ui/button';
import { useThemeTransition } from '@/hooks/useThemeTransition';

const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
    const { resolvedTheme, switchTheme } = useThemeTransition();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        // Always start the reveal from the middle of the button (also right for keyboard users)
        const rect = e.currentTarget.getBoundingClientRect();
        switchTheme(resolvedTheme === 'dark' ? 'light' : 'dark', {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        });
    };

    return (
        <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={handleClick}
            aria-label="Toggle theme"
            className={className}
        >
            {/* Both icons are rendered and `dark:` picks one in CSS, so there is no flash before hydration */}
            <MdOutlineLightMode className="hidden size-4 dark:block" />
            <MdOutlineDarkMode className="size-4 dark:hidden" />
        </Button>
    );
};

export default ThemeToggle;
