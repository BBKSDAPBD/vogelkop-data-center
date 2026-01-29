"use client";

import { useEffect, useState } from "react";

/**
 * Hook to wait for the page loader to complete before starting animations.
 * Listens for the 'pageLoaderComplete' custom event and also checks if the
 * loader has already completed (for late-mounting components).
 *
 * @returns {boolean} Whether the page loader has completed
 */
export function useLoaderComplete() {
    const [isLoaderComplete, setIsLoaderComplete] = useState(false);

    useEffect(() => {
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
