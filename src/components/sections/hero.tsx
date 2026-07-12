"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";

/* The four hats — each morph re-tints the hero glow with its discipline color */
const roles = [
  { key: "uiux", color: "#E14A6D" },
  { key: "websites", color: "#60A5FA" },
  { key: "graphic", color: "#F59E0B" },
  { key: "video", color: "#8B5CF6" },
] as const;

/* From the brand cover — capability chips (CV-backed) */
const chips = [
  "Design Systems",
  "UX Research",
  "Product Analysis",
  "Next.js",
  "React",
] as const;

const ROTATE_MS = 3500;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

export function Hero() {
  const t = useTranslations("hero");
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reducedMotion || paused) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % roles.length),
      ROTATE_MS
    );
    return () => clearInterval(id);
  }, [reducedMotion, paused]);

  const role = roles[index];

  return (
    <section className="relative flex min-h-[calc(100vh-var(--navbar-height))] items-center overflow-hidden">
      {/* Studio backdrop: blueprint grid + wine glows (brand cover language) */}
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden>
        <div className="glow-accent absolute -bottom-40 -start-40 h-[640px] w-[640px]" />
        <div className="glow-accent absolute -end-32 -top-32 h-[420px] w-[420px] opacity-70" />
        <div
          className="hero-mesh absolute start-1/3 top-1/4 h-[380px] w-[380px] rounded-full blur-[130px]"
          style={{ backgroundColor: `${role.color}1f` }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 py-20 lg:px-8">
        <div className="max-w-4xl">
          {/* Book-a-call badge (top-left on the cover) */}
          <motion.div {...rise(0)}>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition-all hover:border-accent hover:bg-accent hover:text-white"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 group-hover:bg-white" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent group-hover:bg-white" />
              </span>
              {t("badge")}
              <Phone size={14} />
            </Link>
          </motion.div>

          {/* Greeting + name */}
          <motion.p
            {...rise(0.1)}
            className="mt-10 text-lg font-medium text-text-secondary"
          >
            {t("greeting")}{" "}
            <span className="font-bold text-text-primary">{t("name")}</span>
            <span className="font-bold text-accent">.</span>
          </motion.p>

          {/* Two-tone display title — the cover headline */}
          <motion.h1
            {...rise(0.2)}
            className="mt-4 font-display text-4xl font-black uppercase leading-[1.08] tracking-tight text-text-primary sm:text-6xl lg:text-7xl"
          >
            {t("titleL1")}
            <br />
            <span className="text-accent">{t("titleL2")}</span>
          </motion.h1>

          {/* The morphing verb — the playful identity moment */}
          <motion.div
            {...rise(0.3)}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="mt-6 flex min-h-[2.5rem] items-baseline gap-2 text-xl font-bold sm:text-2xl"
            aria-label={t("title")}
          >
            <span className="text-text-secondary">{t("iAm")}</span>
            <span className="relative inline-grid overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={role.key}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 26 }}
                  className="inline-block whitespace-nowrap"
                  style={{ color: role.color }}
                >
                  {t(`roles.${role.key}`)}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.div>

          {/* Capability chips (from the cover) */}
          <motion.ul {...rise(0.4)} className="mt-8 flex flex-wrap gap-2.5">
            {chips.map((chip) => (
              <li
                key={chip}
                dir="ltr"
                className="rounded-full border border-border-strong px-4 py-1.5 text-sm font-medium text-text-primary transition-colors hover:border-accent hover:text-accent"
              >
                {chip}
              </li>
            ))}
          </motion.ul>

          {/* Tagline (from the cover) */}
          <motion.p
            {...rise(0.5)}
            className="mt-6 border-s-2 border-accent ps-4 text-lg text-text-secondary"
          >
            {t("tagline")}
          </motion.p>

          {/* CTAs */}
          <motion.div {...rise(0.6)} className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/projects"
              className="group flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_24px_var(--accent-glow)] transition-all hover:bg-accent-hover hover:shadow-[0_0_36px_var(--accent-glow)]"
            >
              {t("cta")}
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
              />
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-full border border-border-strong px-7 py-3.5 text-sm font-bold text-text-primary transition-colors hover:border-accent hover:text-accent"
            >
              {t("contact")}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-text-tertiary p-1.5"
        >
          <motion.div className="h-2 w-1 rounded-full bg-text-tertiary" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// Keep backward compat
export { Hero as HeroSection };
