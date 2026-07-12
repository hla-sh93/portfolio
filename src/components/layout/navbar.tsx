"use client";

import { useState, useEffect } from "react";
import { flushSync } from "react-dom";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Monitor, Globe, Menu, X, ArrowUpRight } from "lucide-react";

const navLinks = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/projects", key: "projects" },
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },
] as const;

export function Navbar() {
  const t = useTranslations("nav");
  const tHero = useTranslations("hero");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const switchLocale = () => {
    const next = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: next });
  };

  const cycleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const order: Array<"light" | "dark" | "system"> = [
      "light",
      "dark",
      "system",
    ];
    const idx = order.indexOf(theme as "light" | "dark" | "system");
    const next = order[(idx + 1) % order.length];

    // Radial theme wipe from the toggle button (progressive enhancement)
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };
    if (
      !doc.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(next);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    doc
      .startViewTransition(() => flushSync(() => setTheme(next)))
      .ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 500,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });
  };

  const ThemeIcon = !mounted
    ? Monitor
    : theme === "system"
      ? Monitor
      : resolvedTheme === "dark"
        ? Moon
        : Sun;

  const controlBtn =
    "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-accent-light hover:text-accent";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      {/* Floating pill nav */}
      <nav
        className={cn(
          "mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full border px-2.5 ps-6 transition-all duration-300",
          scrolled || mobileOpen
            ? "border-border bg-surface-acrylic shadow-lg backdrop-blur-2xl"
            : "border-transparent bg-transparent"
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-lg font-black tracking-tight text-text-primary"
        >
          {locale === "ar" ? "حلا" : "Hla"}
          <span className="text-accent">.</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, key }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={key}>
                <Link
                  href={href}
                  className={cn(
                    "relative block rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    isActive
                      ? "text-accent"
                      : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-accent-light"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative">{t(key)}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={cycleTheme}
            className={controlBtn}
            aria-label={`Theme: ${mounted ? theme : "system"}`}
          >
            <ThemeIcon size={17} />
          </button>

          <button
            onClick={switchLocale}
            className={cn(controlBtn, "w-auto gap-1.5 px-3 text-sm font-semibold")}
            aria-label="Switch language"
          >
            <Globe size={15} />
            <span>{locale === "en" ? "ع" : "EN"}</span>
          </button>

          {/* CTA — the one primary action (desktop) */}
          <Link
            href="/contact"
            className="shine ms-1 hidden items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent-hover lg:flex"
          >
            {tHero("contact")}
            <ArrowUpRight size={15} className="rtl:-scale-x-100" />
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(controlBtn, "md:hidden")}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-2 max-w-5xl overflow-hidden rounded-3xl border border-border bg-surface-acrylic shadow-xl backdrop-blur-2xl md:hidden"
          >
            <ul className="flex flex-col p-3">
              {navLinks.map(({ href, key }) => {
                const isActive =
                  href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <li key={key}>
                    <Link
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block rounded-2xl px-4 py-3 text-base font-semibold transition-colors",
                        isActive
                          ? "bg-accent-light text-accent"
                          : "text-text-secondary hover:text-text-primary"
                      )}
                    >
                      {t(key)}
                    </Link>
                  </li>
                );
              })}
              <li className="mt-2 border-t border-border pt-3">
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 text-base font-bold text-white"
                >
                  {tHero("contact")}
                  <ArrowUpRight size={16} className="rtl:-scale-x-100" />
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
