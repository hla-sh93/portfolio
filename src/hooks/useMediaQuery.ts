"use client";

import { useState, useEffect } from "react";

/**
 * Hook that tracks whether a CSS media query matches.
 * SSR-safe: returns false on the server to avoid hydration mismatches.
 *
 * @example
 * const isMobile = useMediaQuery("(max-width: 768px)");
 * const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQueryList = window.matchMedia(query);

    // Set the initial value immediately
    setMatches(mediaQueryList.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Use addEventListener for modern browsers, addListener as fallback
    if (typeof mediaQueryList.addEventListener === "function") {
      mediaQueryList.addEventListener("change", handleChange);
      return () => mediaQueryList.removeEventListener("change", handleChange);
    } else {
      // Legacy fallback
      mediaQueryList.addListener(handleChange);
      return () => mediaQueryList.removeListener(handleChange);
    }
  }, [query]);

  return matches;
}

// Convenience hooks for common breakpoints (Tailwind defaults)
export const useIsMobile = () => useMediaQuery("(max-width: 767px)");
export const useIsTablet = () =>
  useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
export const usePrefersDark = () =>
  useMediaQuery("(prefers-color-scheme: dark)");
export const usePrefersReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");

export default useMediaQuery;
