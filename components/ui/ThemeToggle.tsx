'use client';
import { useTheme } from "next-themes";
import { Button } from "./button";
import { Moon, Sun, SunMoon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { useEffect, useState } from "react";

export default function ThemeToggle({className}: {className?: string}) {
    const { theme, setTheme } = useTheme();
    const themes = ["light", "dark", "system"];
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return <Tooltip>
        <TooltipContent>
            <p>Toggle Theme</p>
        </TooltipContent>
        <TooltipTrigger render={(triggerProps) => (
            <Button
                {...triggerProps}
                variant="ghost"
                size="icon"
                aria-label="Toggle theme"
                onClick={() => {
                    const currentIndex = themes.indexOf(theme || "system");
                    const nextIndex = (currentIndex + 1) % themes.length;
                    setTheme(themes[nextIndex]);
                }}
                className={cn("text-muted-foreground", className)}
            >
                {theme === "light" ? <Sun/>: theme === "dark" ? <Moon/> : <SunMoon/>}
            </Button>
        )} />
    </Tooltip>
}
