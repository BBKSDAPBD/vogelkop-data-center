"use client";

import marquee from "@/assets/marquee.svg";
import marquee1 from "@/assets/marquee1.svg";
import marquee2 from "@/assets/marquee2.svg";
import marquee3 from "@/assets/marquee3.svg";
import marquee4 from "@/assets/marquee4.svg";
import marquee5 from "@/assets/marquee5.svg";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

const images = [marquee, marquee1, marquee2, marquee3, marquee4, marquee5];

const BASE_SPEED = 1; // Normal timeScale
const MAX_SPEED = 8; // Maximum speed when scrolling fast
const VELOCITY_MULTIPLIER = 6; // How much scroll velocity affects speed
const LERP_FACTOR = 0.1; // Smooth interpolation factor
const SCROLL_HEIGHT = 150; // vh to track

export function Marquee() {
    const containerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const tweenRef = useRef<gsap.core.Tween | null>(null);
    const lastScrollY = useRef(0);
    const lastTime = useRef(Date.now());
    const targetSpeed = useRef(BASE_SPEED);
    const currentSpeed = useRef(BASE_SPEED);
    const [progress, setProgress] = useState(0);
    const isHovered = useRef(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Create GSAP infinite animation
        tweenRef.current = gsap.to(container, {
            xPercent: -50,
            duration: 40,
            ease: "none",
            repeat: -1,
        });

        // Slide up entrance animation - wait for page loader to complete
        function startEntranceAnimation() {
            gsap.fromTo(
                wrapperRef.current,
                { y: 100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
            );
        }

        // Check if page loader already completed (in case we missed the event)
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
                MAX_SPEED,
                BASE_SPEED + velocity * VELOCITY_MULTIPLIER,
            );

            // Update scroll progress (0 to 1)
            const scrollHeight = (SCROLL_HEIGHT / 100) * window.innerHeight;
            const scrollProgress = Math.min(1, window.scrollY / scrollHeight);
            setProgress(scrollProgress);

            lastScrollY.current = window.scrollY;
            lastTime.current = currentTime;
        }

        function updateSpeed() {
            // Smoothly interpolate current speed toward target
            currentSpeed.current +=
                (targetSpeed.current - currentSpeed.current) * LERP_FACTOR;

            // Decay target speed back to base
            targetSpeed.current +=
                (BASE_SPEED - targetSpeed.current) * LERP_FACTOR * 0.5;

            // Apply timeScale to GSAP tween (pause when hovering)
            if (tweenRef.current) {
                const targetTimeScale = isHovered.current
                    ? 0
                    : currentSpeed.current;
                const currentTimeScale = tweenRef.current.timeScale();
                const newTimeScale =
                    currentTimeScale +
                    (targetTimeScale - currentTimeScale) * LERP_FACTOR;
                tweenRef.current.timeScale(newTimeScale);
            }

            requestAnimationFrame(updateSpeed);
        }

        window.addEventListener("scroll", handleScroll, { passive: true });
        const rafId = requestAnimationFrame(updateSpeed);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            cancelAnimationFrame(rafId);
            if (tweenRef.current) {
                tweenRef.current.kill();
            }
        };
    }, []);

    return (
        <div
            ref={wrapperRef}
            className="w-full overflow-visible absolute bottom-8 left-0 opacity-0 pb-4"
        >
            {/* Scroll Progress Bar */}
            <div className="w-full h-0.5  mb-4 rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary/60 rounded-full transition-[width] duration-100 ease-out"
                    style={{ width: `${progress * 100}%` }}
                />
            </div>

            {/* Marquee */}
            <div
                ref={containerRef}
                className="flex gap-4 w-max"
                aria-hidden="true"
                onMouseEnter={() => (isHovered.current = true)}
                onMouseLeave={() => (isHovered.current = false)}
            >
                {images.map((img, i) => (
                    <img
                        key={`a-${i}`}
                        src={img.src}
                        alt=""
                        className="h-44 w-80 shrink-0 object-cover rounded-lg grayscale sepia-[0.4] hue-rotate-[90deg] brightness-75 transition-all duration-300 hover:grayscale-0 hover:sepia-0 hover:hue-rotate-0 hover:brightness-100 hover:scale-105"
                    />
                ))}
                {images.map((img, i) => (
                    <img
                        key={`b-${i}`}
                        src={img.src}
                        alt=""
                        className="h-44 w-80 shrink-0 object-cover rounded-lg grayscale sepia-[0.4] hue-rotate-[90deg] brightness-75 transition-all duration-300 hover:grayscale-0 hover:sepia-0 hover:hue-rotate-0 hover:brightness-100 hover:scale-105"
                    />
                ))}
            </div>
        </div>
    );
}
