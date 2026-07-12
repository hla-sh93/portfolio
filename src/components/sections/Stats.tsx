"use client";

import type { Stat } from "@/types";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

interface StatsProps {
  stats: Stat[];
}

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const spring = useSpring(0, { stiffness: 50, damping: 20, mass: 1 });
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    if (inView) spring.set(value);
  }, [inView, spring, value]);

  return (
    <span ref={ref} dir="ltr" className="tabular-nums">
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

/* Agency-style proof strip: giant gradient numerals on hairline rails.
   Every figure is CV-verified. */
export function Stats({ stats }: StatsProps) {
  const t = useTranslations("home.stats");

  return (
    <section className="relative border-y border-border py-16 md:py-20">
      {/* faint wine wash behind the strip */}
      <div
        aria-hidden
        className="glow-accent pointer-events-none absolute inset-0 opacity-40"
      />
      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4 lg:gap-0">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.labelKey}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                delay: index * 0.08,
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col gap-3 lg:border-s lg:border-border lg:px-10 lg:first:border-s-0 lg:first:ps-0"
            >
              <span className="bg-gradient-to-b from-[var(--text-primary)] to-[var(--accent)] bg-clip-text font-display text-5xl font-black leading-none text-transparent md:text-6xl lg:text-7xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </span>
              <span className="text-sm font-semibold text-text-secondary md:text-base">
                {t(stat.labelKey as never)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
