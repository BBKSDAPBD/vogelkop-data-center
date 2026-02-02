"use client";

import marquee from "@/assets/marquee.svg";
import marquee1 from "@/assets/marquee1.svg";
import marquee2 from "@/assets/marquee2.svg";
import marquee3 from "@/assets/marquee3.svg";
import marquee4 from "@/assets/marquee4.svg";
import marquee5 from "@/assets/marquee5.svg";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

/** Marquee image sources */
const IMAGES = [marquee, marquee1, marquee2, marquee3, marquee4, marquee5];

/** Animation configuration */
const CONFIG = {
    baseSpeed: 1,
    maxSpeed: 8,
    velocityMultiplier: 6,
    lerpFactor: 0.1,
    scrollHeight: 150, // vh to track
    animationDuration: 40,
    entranceDelay: 0.5,
} as const;

interface MarqueeImageProps {
    src: string;
    index: number;
    prefix: string;
}

/**
 * Single marquee image with hover effects.
 */
function MarqueeImage({ src, index, prefix }: MarqueeImageProps) {
    return (
        <img
            key={`${prefix}-${index}`}
            src={src}
            alt=""
            className="h-44 w-80 shrink-0 object-cover grayscale transition-all duration-300 hover:grayscale-0 hover:sepia-0 hover:hue-rotate-0 hover:brightness-100 hover:scale-105"
        />
    );
}

/**
 * Infinite scrolling marquee with scroll-velocity-based speed.
 * Pauses on hover and shows a progress bar indicating scroll position.
 */
export function Marquee() {
    const containerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const tweenRef = useRef<gsap.core.Tween | null>(null);
    const lastScrollY = useRef(0);
    const lastTime = useRef(Date.now());
    const targetSpeed = useRef<number>(CONFIG.baseSpeed);
    const currentSpeed = useRef<number>(CONFIG.baseSpeed);
    const isHovered = useRef(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Create infinite horizontal scroll animation
        tweenRef.current = gsap.to(container, {
            xPercent: -50,
            duration: CONFIG.animationDuration,
            ease: "none",
            repeat: -1,
        });

        // Entrance animation after page loader completes
        function startEntranceAnimation() {
            gsap.fromTo(
                wrapperRef.current,
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    delay: CONFIG.entranceDelay,
                },
            );
        }

        // Check if page loader already completed
        const loader = document.getElementById("page-loader");
        if (loader?.classList.contains("hidden")) {
            startEntranceAnimation();
        } else {
            window.addEventListener(
                "pageLoaderComplete",
                startEntranceAnimation,
                { once: true },
            );
        }

        function handleScroll() {
            const currentTime = Date.now();
            const deltaTime = currentTime - lastTime.current;
            const deltaY = Math.abs(window.scrollY - lastScrollY.current);

            // Calculate velocity (pixels per millisecond)
            const velocity = deltaTime > 0 ? deltaY / deltaTime : 0;

            // Set target speed based on velocity
            targetSpeed.current = Math.min(
                CONFIG.maxSpeed,
                CONFIG.baseSpeed + velocity * CONFIG.velocityMultiplier,
            );

            // Update scroll progress (0 to 1)
            const scrollHeight =
                (CONFIG.scrollHeight / 100) * window.innerHeight;
            const scrollProgress = Math.min(1, window.scrollY / scrollHeight);
            setProgress(scrollProgress);

            lastScrollY.current = window.scrollY;
            lastTime.current = currentTime;
        }

        function updateSpeed() {
            // Smoothly interpolate current speed toward target
            currentSpeed.current +=
                (targetSpeed.current - currentSpeed.current) *
                CONFIG.lerpFactor;

            // Decay target speed back to base
            targetSpeed.current +=
                (CONFIG.baseSpeed - targetSpeed.current) *
                CONFIG.lerpFactor *
                0.5;

            // Apply timeScale to GSAP tween (pause when hovering)
            if (tweenRef.current) {
                const targetTimeScale = isHovered.current
                    ? 0
                    : currentSpeed.current;
                const currentTimeScale = tweenRef.current.timeScale();
                const newTimeScale =
                    currentTimeScale +
                    (targetTimeScale - currentTimeScale) * CONFIG.lerpFactor;
                tweenRef.current.timeScale(newTimeScale);
            }

            requestAnimationFrame(updateSpeed);
        }

        window.addEventListener("scroll", handleScroll, { passive: true });
        const rafId = requestAnimationFrame(updateSpeed);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            cancelAnimationFrame(rafId);
            tweenRef.current?.kill();
        };
    }, []);

    return (
        <figure
            ref={wrapperRef}
            className="w-full overflow-visible absolute bottom-8 left-0 opacity-0 pb-4"
            aria-label="Image gallery marquee"
        >
            {/* Scroll Progress Bar */}
            <div
                className="w-full h-0.5 mb-4 overflow-hidden"
                role="progressbar"
                aria-valuenow={Math.round(progress * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                <div
                    className="h-full bg-primary/60 transition-[width] duration-100 ease-out"
                    style={{ width: `${progress * 100}%` }}
                />
            </div>

            {/* Marquee Container */}
            <div
                ref={containerRef}
                className="flex gap-4 w-max"
                aria-hidden="true"
                onMouseEnter={() => (isHovered.current = true)}
                onMouseLeave={() => (isHovered.current = false)}
            >
                {/* First set of images */}
                {IMAGES.map((img, i) => (
                    <MarqueeImage
                        key={`a-${i}`}
                        src={img.src}
                        index={i}
                        prefix="a"
                    />
                ))}
                {/* Duplicated for seamless loop */}
                {IMAGES.map((img, i) => (
                    <MarqueeImage
                        key={`b-${i}`}
                        src={img.src}
                        index={i}
                        prefix="b"
                    />
                ))}
            </div>
        </figure>
    );
}
