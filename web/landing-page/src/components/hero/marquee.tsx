"use client";

import marquee from "@/assets/marquee.svg";
import marquee1 from "@/assets/marquee1.svg";
import marquee2 from "@/assets/marquee2.svg";
import marquee3 from "@/assets/marquee3.svg";
import marquee4 from "@/assets/marquee4.svg";
import marquee5 from "@/assets/marquee5.svg";

const images = [marquee, marquee1, marquee2, marquee3, marquee4, marquee5];

export function Marquee() {
    return (
        <div className="w-full overflow-hidden absolute bottom-8 left-0">
            <div
                className="flex gap-4 w-max"
                style={{
                    animation: "marquee 40s linear infinite",
                }}
                aria-hidden="true"
            >
                {images.map((img, i) => (
                    <img
                        key={`a-${i}`}
                        src={img.src}
                        alt=""
                        className="h-44 w-80 shrink-0 object-cover rounded-lg"
                    />
                ))}
                {images.map((img, i) => (
                    <img
                        key={`b-${i}`}
                        src={img.src}
                        alt=""
                        className="h-44 w-80 shrink-0 object-cover rounded-lg"
                    />
                ))}
            </div>
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    );
}
