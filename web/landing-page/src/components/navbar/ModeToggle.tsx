import * as React from "react";

import { Button } from "@/components/ui/button";
import { CastIcon } from "@/components/ui/cast";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoonIcon } from "@/components/ui/moon";
import { SunIcon } from "@/components/ui/sun";

export function ModeToggle() {
    const [theme, setThemeState] = React.useState<
        "theme-light" | "dark" | "system"
    >("theme-light");

    React.useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains("dark");
        setThemeState(isDarkMode ? "dark" : "theme-light");
    }, []);

    React.useEffect(() => {
        const isDark =
            theme === "dark" ||
            (theme === "system" &&
                window.matchMedia("(prefers-color-scheme: dark)").matches);
        document.documentElement.classList[isDark ? "add" : "remove"]("dark");
    }, [theme]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button
                    variant="decorations"
                    size="icon"
                    className="bg-transparent border-white/10 hover:bg-white/5 hover:text-muted-foreground"
                >
                    <SunIcon
                        size={18}
                        className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                    />
                    <MoonIcon
                        size={18}
                        className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                    />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-[120px] border-white/10 text-muted-foreground"
            >
                <DropdownMenuItem
                    onClick={() => setThemeState("theme-light")}
                    className="hover:bg-white/5 cursor-pointer"
                >
                    <SunIcon size={14} /> Light
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setThemeState("dark")}
                    className="hover:bg-white/5 cursor-pointer"
                >
                    <MoonIcon size={14} /> Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setThemeState("system")}
                    className="hover:bg-white/5 cursor-pointer"
                >
                    <CastIcon size={14} /> System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
