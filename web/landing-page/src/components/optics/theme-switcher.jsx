"use client";

import { useControlledState } from "@/hooks/use-controlled-state";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { AirplayIcon } from "../ui/airplay";
import { Button } from "../ui/button";
import { MoonIcon } from "../ui/moon";
import { SunIcon } from "../ui/sun";

const themes = [
    {
        key: "system",
        icon: AirplayIcon,
        label: "System theme",
    },
    {
        key: "light",
        icon: SunIcon,
        label: "Light theme",
    },
    {
        key: "dark",
        icon: MoonIcon,
        label: "Dark theme",
    },
];

export const ThemeSwitcher = forwardRef(
    (
        {
            value = undefined,
            onChange = undefined,
            defaultValue = undefined,
            className = "",
            ...props
        },
        ref,
    ) => {
        const [mounted, setMounted] = useState(false);

        // Get initial theme from localStorage or system
        const getInitialTheme = () => {
            if (
                typeof localStorage !== "undefined" &&
                localStorage.getItem("theme")
            ) {
                return localStorage.getItem("theme");
            }
            return "system";
        };

        const [theme, setTheme] = useControlledState({
            defaultValue: defaultValue || getInitialTheme(),
            value: value,
            onChange,
        });

        const applyTheme = useCallback((themeKey) => {
            const root = window.document.documentElement;
            root.classList.remove("light", "dark");

            if (themeKey === "system") {
                const systemTheme = window.matchMedia(
                    "(prefers-color-scheme: dark)",
                ).matches
                    ? "dark"
                    : "light";
                root.classList.add(systemTheme);
            } else {
                root.classList.add(themeKey);
            }

            if (typeof localStorage !== "undefined") {
                localStorage.setItem("theme", themeKey);
            }
        }, []);

        const handleThemeClick = useCallback(
            (themeKey, event) => {
                const isAppearanceTransition =
                    document.startViewTransition &&
                    !window.matchMedia("(prefers-reduced-motion: reduce)")
                        .matches;

                if (!isAppearanceTransition) {
                    setTheme(themeKey);
                    applyTheme(themeKey);
                    return;
                }

                const x = event.clientX;
                const y = event.clientY;
                const endRadius = Math.hypot(
                    Math.max(x, window.innerWidth - x),
                    Math.max(y, window.innerHeight - y),
                );

                const transition = document.startViewTransition(async () => {
                    setTheme(themeKey);
                    applyTheme(themeKey);
                });

                transition.ready.then(() => {
                    const clipPath = [
                        `circle(0px at ${x}px ${y}px)`,
                        `circle(${endRadius}px at ${x}px ${y}px)`,
                    ];

                    document.documentElement.animate(
                        {
                            clipPath: clipPath,
                        },
                        {
                            duration: 500,
                            easing: "ease-in-out",
                            pseudoElement: "::view-transition-new(root)",
                        },
                    );
                });
            },
            [setTheme, applyTheme],
        );

        // Prevent hydration mismatch and initialize theme
        useEffect(() => {
            setMounted(true);
            const initialTheme = getInitialTheme();
            applyTheme(initialTheme);

            // Listen for system theme changes if set to system
            if (theme === "system") {
                const mediaQuery = window.matchMedia(
                    "(prefers-color-scheme: dark)",
                );
                const handleChange = () => applyTheme("system");
                mediaQuery.addEventListener("change", handleChange);
                return () =>
                    mediaQuery.removeEventListener("change", handleChange);
            }
        }, [theme, applyTheme]);

        if (!mounted) {
            return (
                <div
                    className={cn(
                        "flex h-8 w-[88px] p-1 opacity-50",
                        className,
                    )}
                />
            );
        }

        return (
            <div
                ref={ref}
                className={cn("flex flex-col gap-1 items-start", className)}
                {...props}
            >
                {themes.map(({ key, icon: Icon, label }) => {
                    const isActive = theme === key;

                    return (
                        <Button
                            aria-label={label}
                            variant="decorations"
                            size="icon-lg"
                            className="relative rounded-full squircle-none"
                            key={key}
                            onClick={(e) => handleThemeClick(key, e)}
                            type="button"
                        >
                            {isActive && (
                                <motion.div
                                    className="absolute inset-0 bg-primary-foreground"
                                    layoutId="activeTheme"
                                    transition={{
                                        type: "spring",
                                        duration: 0.5,
                                    }}
                                />
                            )}
                            <Icon
                                size={14}
                                className={cn(
                                    "relative z-10 m-auto",
                                    isActive
                                        ? "text-foreground"
                                        : "text-muted-foreground",
                                )}
                            />
                        </Button>
                    );
                })}
            </div>
        );
    },
);

ThemeSwitcher.displayName = "ThemeSwitcher";
