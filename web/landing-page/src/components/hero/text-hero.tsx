"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Marquee } from "./marquee";

const texts = [
    "Menjaga denyut -- Nadi **Biodiversitas** endemik Papua Barat Daya demi masa depan alam yang tetap terjaga.",
    "Mengelola kawasan **Konservasi** secara berkelanjutan melalui sinergi data dan aksi nyata di lapangan.",
    "Memberikan layanan informasi dan perizinan yang transparan demi kolaborasi lestari bersama **Masyarakat.**",
];

/**
 * Hook to wait for the page loader to complete before starting animations
 */
function useLoaderComplete() {
    const [isLoaderComplete, setIsLoaderComplete] = useState(false);

    useEffect(() => {
        // Check if loader already completed (for late-mounting components)
        const loader = document.getElementById("page-loader");
        if (loader?.classList.contains("hidden")) {
            setIsLoaderComplete(true);
            return;
        }

        function handleLoaderComplete() {
            setIsLoaderComplete(true);
        }

        window.addEventListener("pageLoaderComplete", handleLoaderComplete);
        return () => {
            window.removeEventListener(
                "pageLoaderComplete",
                handleLoaderComplete,
            );
        };
    }, []);

    return isLoaderComplete;
}

function AnimatedWordOnLoad({
    word,
    wordIndex,
    totalWords,
    scrollYProgress,
    isLoaderComplete,
}: {
    word: string;
    wordIndex: number;
    totalWords: number;
    scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
    isLoaderComplete: boolean;
}) {
    const [hasAnimatedIn, setHasAnimatedIn] = useState(false);

    // Check if word is highlighted (wrapped in **)
    const isHighlighted = word.startsWith("**") && word.endsWith("**");
    const displayWord = isHighlighted ? word.slice(2, -2) : word;

    // Staggered fade out: each word fades out at slightly different times
    const fadeOutStart = 0.3 + (wordIndex / totalWords) * 0.15;
    const fadeOutEnd = fadeOutStart + 0.05;

    const scrollOpacity = useTransform(
        scrollYProgress,
        [fadeOutStart, fadeOutEnd],
        [1, 0],
    );
    const scrollY = useTransform(
        scrollYProgress,
        [fadeOutStart, fadeOutEnd],
        ["0%", "100%"],
    );

    const highlightStyles = isHighlighted
        ? "text-primary underline decoration-dotted underline-offset-4"
        : "";

    return (
        <span className="overflow-hidden inline-block mr-[0.25em]">
            <motion.span
                className={`inline-block ${highlightStyles}`}
                initial={{ y: "100%", opacity: 0 }}
                animate={
                    isLoaderComplete
                        ? { y: 0, opacity: 1 }
                        : { y: "100%", opacity: 0 }
                }
                transition={{
                    duration: 0.5,
                    delay: wordIndex * 0.04,
                    ease: [0.25, 0.46, 0.45, 0.94],
                }}
                onAnimationComplete={() => {
                    if (isLoaderComplete) {
                        setHasAnimatedIn(true);
                    }
                }}
                style={
                    hasAnimatedIn
                        ? { opacity: scrollOpacity, y: scrollY }
                        : undefined
                }
            >
                {displayWord}
            </motion.span>
        </span>
    );
}

function AnimatedWordOnScroll({
    word,
    scrollYProgress,
    startOffset,
    endOffset,
    fadeOutStart,
    fadeOutEnd,
}: {
    word: string;
    scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
    startOffset: number;
    endOffset: number;
    fadeOutStart: number;
    fadeOutEnd: number;
}) {
    // Check if word is highlighted (wrapped in **)
    const isHighlighted = word.startsWith("**") && word.endsWith("**");
    const displayWord = isHighlighted ? word.slice(2, -2) : word;

    const yIn = useTransform(
        scrollYProgress,
        [startOffset, endOffset],
        ["100%", "0%"],
    );
    const yOut = useTransform(
        scrollYProgress,
        [fadeOutStart, fadeOutEnd],
        ["0%", "100%"],
    );
    const opacityIn = useTransform(
        scrollYProgress,
        [startOffset, endOffset],
        [0, 1],
    );
    const opacityOut = useTransform(
        scrollYProgress,
        [fadeOutStart, fadeOutEnd],
        [1, 0],
    );

    // Combine: use fade-in values until fully visible, then fade-out
    const y = useTransform(() => {
        const progress = scrollYProgress.get();
        if (progress < endOffset) {
            return yIn.get();
        }
        return yOut.get();
    });

    const opacity = useTransform(() => {
        const progress = scrollYProgress.get();
        if (progress < endOffset) {
            return opacityIn.get();
        }
        if (progress > fadeOutStart) {
            return opacityOut.get();
        }
        return 1;
    });

    const highlightStyles = isHighlighted
        ? "text-primary underline decoration-dotted underline-offset-4"
        : "";

    return (
        <span className="overflow-hidden inline-block mr-[0.25em]">
            <motion.span
                className={`inline-block ${highlightStyles}`}
                style={{ y, opacity }}
            >
                {displayWord}
            </motion.span>
        </span>
    );
}

function AnimatedTextOnLoad({
    text,
    scrollYProgress,
    className = "",
    isLoaderComplete,
}: {
    text: string;
    scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
    className?: string;
    isLoaderComplete: boolean;
}) {
    const words = text.split(" ");
    const totalWords = words.length;

    return (
        <h3 className={`flex flex-wrap ${className}`} data-index={0}>
            {words.map((word, wordIndex) => (
                <AnimatedWordOnLoad
                    key={wordIndex}
                    word={word}
                    wordIndex={wordIndex}
                    totalWords={totalWords}
                    scrollYProgress={scrollYProgress}
                    isLoaderComplete={isLoaderComplete}
                />
            ))}
        </h3>
    );
}

function AnimatedTextOnScroll({
    text,
    columnIndex,
    scrollYProgress,
    className = "",
}: {
    text: string;
    columnIndex: number;
    scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
    className?: string;
}) {
    const words = text.split(" ");
    const totalWords = words.length;

    // Column 1: appear 0.3-0.5, fade out 0.7-0.9
    // Column 2: appear 0.7-0.9, stay visible
    const columnStart = columnIndex === 1 ? 0.3 : 0.7;
    const columnEnd = columnIndex === 1 ? 0.5 : 0.9;
    const fadeOutRangeStart = columnIndex === 1 ? 0.7 : 1.1; // Column 2 doesn't fade out
    const fadeOutRangeEnd = columnIndex === 1 ? 0.9 : 1.2;
    const columnRange = columnEnd - columnStart;
    const fadeOutRange = fadeOutRangeEnd - fadeOutRangeStart;

    return (
        <h3 className={`flex flex-wrap ${className}`} data-index={columnIndex}>
            {words.map((word, wordIndex) => {
                const wordStart =
                    columnStart + (wordIndex / totalWords) * columnRange * 0.8;
                const wordEnd = Math.min(wordStart + 0.03, columnEnd);

                // Stagger fade out per word
                const wordFadeOutStart =
                    fadeOutRangeStart +
                    (wordIndex / totalWords) * fadeOutRange * 0.8;
                const wordFadeOutEnd = Math.min(
                    wordFadeOutStart + 0.03,
                    fadeOutRangeEnd,
                );

                return (
                    <AnimatedWordOnScroll
                        key={wordIndex}
                        word={word}
                        scrollYProgress={scrollYProgress}
                        startOffset={wordStart}
                        endOffset={wordEnd}
                        fadeOutStart={wordFadeOutStart}
                        fadeOutEnd={wordFadeOutEnd}
                    />
                );
            })}
        </h3>
    );
}

export function TextHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const isLoaderComplete = useLoaderComplete();
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    return (
        <div ref={containerRef} className="h-[300vh] -mt-[50vh] relative">
            <div className="sticky top-0 h-screen p-4 pb-16 flex items-center">
                <div className="flex gap-4 text-3xl font-medium w-full">
                    <div className="flex-1">
                        <AnimatedTextOnLoad
                            text={texts[0]}
                            scrollYProgress={scrollYProgress}
                            className="text-hero"
                            isLoaderComplete={isLoaderComplete}
                        />
                    </div>
                    {texts.slice(1).map((text, index) => (
                        <div key={index + 1} className="flex-1">
                            <AnimatedTextOnScroll
                                text={text}
                                columnIndex={index + 1}
                                scrollYProgress={scrollYProgress}
                            />
                        </div>
                    ))}
                </div>
                <Marquee />
            </div>
        </div>
    );
}
