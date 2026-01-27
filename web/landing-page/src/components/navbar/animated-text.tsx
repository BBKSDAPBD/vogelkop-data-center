"use client";

import { motion } from "motion/react";
import type { ElementType } from "react";

interface AnimatedTextProps {
    text: string;
    className?: string;
    as?: ElementType;
    delay?: number;
}

export function AnimatedText({
    text,
    className = "",
    as: Tag = "span",
    delay = 0,
}: AnimatedTextProps) {
    const words = text.split(" ");

    return (
        <Tag className={`inline-flex flex-wrap ${className}`}>
            {words.map((word, wordIndex) => (
                <span
                    key={wordIndex}
                    className="overflow-hidden inline-block mr-[0.25em]"
                >
                    <motion.span
                        className="inline-block"
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                            duration: 0.5,
                            delay: delay + wordIndex * 0.04,
                            ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                    >
                        {word}
                    </motion.span>
                </span>
            ))}
        </Tag>
    );
}

interface AnimatedListItemProps {
    text: string;
    index: number;
    baseDelay?: number;
}

export function AnimatedListItem({
    text,
    index,
    baseDelay = 0,
}: AnimatedListItemProps) {
    return (
        <li>
            <AnimatedText text={text} delay={baseDelay + index * 0.08} />
        </li>
    );
}
