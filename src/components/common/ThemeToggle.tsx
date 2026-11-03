
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button
                type="button"
                aria-label="Theme settings"
                className="size-10 rounded-full border border-border"
            />
        );
    }

    return (
        <div className="flex items-center gap-1 rounded-full border border-border p-1">
            {[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
                { value: "system", label: "System" },
            ].map((option) => (
                <Button
                    key={option.value}
                    type="button"
                    onClick={() => setTheme(option.value)}
                    aria-pressed={theme === option.value}
                    // className={`rounded-full px-3 py-2 text-sm transition-colors ${theme === option.value
                    //         ? "bg-primary text-white"
                    //         : "text-muted hover:bg-surface hover:text-foreground"
                    //     }`}
                    variant={theme === option.value ? "default" : "secondary"}
                >
                    {option.label}
                </Button>
            ))}
        </div>
    );
}
