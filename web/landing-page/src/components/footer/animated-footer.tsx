"use client";

import logoSrc from "@/assets/logo.svg";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/** Animation timing constants */
const ANIMATION = {
    easing: [0.25, 0.46, 0.45, 0.94] as const,
} as const;

/** Pixel configuration */
const PIXEL_CONFIG = {
    size: 6,
    gap: 1,
    fadeSpeed: 0.015,
} as const;

interface Pixel {
    x: number;
    y: number;
    opacity: number;
    targetOpacity: number;
    phase: number;
    speed: number;
    hue: number;
}

/**
 * Generate landscape height at a given x position
 * Creates mountains, hills, and trees silhouette
 */
function getLandscapeHeight(x: number, width: number): number {
    const normalizedX = x / width;

    // Base terrain with multiple sine waves for natural look
    let height = 0;

    // Large mountains
    height += Math.sin(normalizedX * Math.PI * 2) * 0.3;
    height += Math.sin(normalizedX * Math.PI * 4 + 1) * 0.15;

    // Medium hills
    height += Math.sin(normalizedX * Math.PI * 8 + 2) * 0.1;
    height += Math.sin(normalizedX * Math.PI * 6 + 0.5) * 0.08;

    // Small variations (trees/bushes)
    height += Math.sin(normalizedX * Math.PI * 20 + 3) * 0.05;
    height += Math.sin(normalizedX * Math.PI * 30) * 0.03;

    // Normalize to 0-1 range and invert (higher = more pixels from bottom)
    return (height + 0.7) * 0.5;
}

/**
 * Animated pixel background canvas - Landscape silhouette
 */
function PixelBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pixelsRef = useRef<Pixel[]>([]);
    const animationRef = useRef<number>(0);
    const initializedRef = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { size, gap, fadeSpeed } = PIXEL_CONFIG;
        const cellSize = size + gap;

        const initializeLandscape = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.offsetWidth;
                canvas.height = parent.offsetHeight;
            }

            const cols = Math.ceil(canvas.width / cellSize);
            const rows = Math.ceil(canvas.height / cellSize);

            // Clear existing pixels
            pixelsRef.current = [];

            // Generate landscape pixels
            for (let x = 0; x < cols; x++) {
                const landscapeHeight = getLandscapeHeight(x, cols);
                const maxRow = Math.floor(rows * landscapeHeight);

                for (let y = rows - maxRow; y < rows; y++) {
                    // Add some randomness to edges for organic look
                    const edgeDistance = y - (rows - maxRow);
                    const isEdge = edgeDistance < 3;

                    if (isEdge && Math.random() > 0.6) continue;

                    pixelsRef.current.push({
                        x,
                        y,
                        opacity: 0,
                        targetOpacity: 0.4 + Math.random() * 0.4,
                        phase: Math.random() * Math.PI * 2,
                        speed: 0.02 + Math.random() * 0.02,
                        hue: 130 + Math.random() * 50, // Green to teal hues
                    });
                }
            }

            initializedRef.current = true;
        };

        const handleResize = () => {
            initializeLandscape();
        };

        initializeLandscape();
        window.addEventListener("resize", handleResize);

        let time = 0;
        const animate = () => {
            if (!ctx || !canvas) return;

            time += 0.016; // ~60fps

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw pixels
            for (const pixel of pixelsRef.current) {
                // Twinkling effect using sine wave
                const twinkle = Math.sin(time * pixel.speed * 60 + pixel.phase);
                const currentOpacity =
                    pixel.targetOpacity * (0.5 + twinkle * 0.5);

                // Draw pixel
                ctx.fillStyle = `hsla(${pixel.hue}, 50%, 45%, ${currentOpacity})`;
                ctx.fillRect(
                    pixel.x * cellSize,
                    pixel.y * cellSize,
                    size,
                    size,
                );
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
        />
    );
}

/**
 * Footer link component
 */
function FooterLink({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <a
            href={href}
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
            {children}
        </a>
    );
}

/**
 * Main footer component with pixel animation background
 */
export function AnimatedFooter() {
    const [currentYear] = useState(() => new Date().getFullYear());

    return (
        <footer className="relative overflow-hidden border-t border-border">
            {/* Pixel Animation Background */}
            <div className="absolute inset-0 opacity-30">
                <PixelBackground />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Main Footer Content */}
                <div className="px-8 md:px-12 lg:px-16 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {/* Brand */}
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.5,
                                    ease: ANIMATION.easing,
                                }}
                            >
                                <img
                                    src={logoSrc.src}
                                    alt="BBKSDA Papua Barat Daya Logo"
                                    className="h-16 w-auto mb-4"
                                />
                            </motion.div>
                            <motion.h3
                                className="text-xl font-semibold"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.05,
                                    ease: ANIMATION.easing,
                                }}
                            >
                                BBKSDA Papua Barat Daya
                            </motion.h3>
                            <motion.p
                                className="text-muted-foreground text-sm leading-relaxed"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.1,
                                    ease: ANIMATION.easing,
                                }}
                            >
                                Menjaga kelestarian biodiversitas dan kawasan
                                konservasi di Papua Barat Daya.
                            </motion.p>
                        </div>

                        {/* Quick Links */}
                        <motion.div
                            className="space-y-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.5,
                                delay: 0.2,
                                ease: ANIMATION.easing,
                            }}
                        >
                            <h4 className="font-medium text-sm uppercase tracking-wide">
                                Layanan
                            </h4>
                            <div className="flex flex-col gap-2">
                                <FooterLink href="#">SIMAKSI</FooterLink>
                                <FooterLink href="#">SATS-DN</FooterLink>
                                <FooterLink href="#">
                                    Pengaduan Publik
                                </FooterLink>
                                <FooterLink href="#">
                                    Informasi Kawasan
                                </FooterLink>
                            </div>
                        </motion.div>

                        {/* Resources */}
                        <motion.div
                            className="space-y-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.5,
                                delay: 0.3,
                                ease: ANIMATION.easing,
                            }}
                        >
                            <h4 className="font-medium text-sm uppercase tracking-wide">
                                Informasi
                            </h4>
                            <div className="flex flex-col gap-2">
                                <FooterLink href="#">
                                    Berita & Artikel
                                </FooterLink>
                                <FooterLink href="#">Galeri</FooterLink>
                                <FooterLink href="#">Peta Kawasan</FooterLink>
                                <FooterLink href="#">
                                    Laporan Tahunan
                                </FooterLink>
                            </div>
                        </motion.div>

                        {/* Contact */}
                        <motion.div
                            className="space-y-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.5,
                                delay: 0.4,
                                ease: ANIMATION.easing,
                            }}
                        >
                            <h4 className="font-medium text-sm uppercase tracking-wide">
                                Kontak
                            </h4>
                            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                                <p>Jl. Raya Sorong - Makbon</p>
                                <p>Kota Sorong, Papua Barat Daya</p>
                                <p>Telp: (0951) 123456</p>
                                <p>Email: info@bbksda-papuabaratdaya.go.id</p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border px-8 md:px-12 lg:px-16 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <motion.p
                            className="text-sm text-muted-foreground"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.5,
                                delay: 0.5,
                                ease: ANIMATION.easing,
                            }}
                        >
                            © {currentYear} BBKSDA Papua Barat Daya. Hak Cipta
                            Dilindungi.
                        </motion.p>
                        <motion.div
                            className="flex gap-6"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.5,
                                delay: 0.6,
                                ease: ANIMATION.easing,
                            }}
                        >
                            <FooterLink href="#">Kebijakan Privasi</FooterLink>
                            <FooterLink href="#">Syarat & Ketentuan</FooterLink>
                        </motion.div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
