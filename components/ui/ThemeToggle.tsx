import { useTheme } from "next-themes";
import { Button } from "./button";
import { Moon, Sun, SunMoon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export default function ThemeToggle({className}: {className?: string}) {
    const { theme, setTheme } = useTheme();
    const themes = ["light", "dark", "system"];
    return <Tooltip>
        <TooltipContent>
            <p>Toggle Theme</p>
        </TooltipContent>
        <TooltipTrigger>
            <Button variant="ghost" size="icon"
                onClick={() => {
                    const currentIndex = themes.indexOf(theme || "system");
                    const nextIndex = (currentIndex + 1) % themes.length;
                    setTheme(themes[nextIndex]);
                }}
                className={cn("text-muted-foreground", className)}
            >
                {theme === "light" ? <Sun/>: theme === "dark" ? <Moon/> : <SunMoon/>}
            </Button>
        </TooltipTrigger>
    </Tooltip>
}