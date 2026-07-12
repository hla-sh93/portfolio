"use client";

import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

export function CTABanner() {
  const t = useTranslations("home.ctaBanner");

  return (
    <section className="relative overflow-hidden px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#120409] p-10 md:p-16 lg:p-24"
      >
        {/* Studio backdrop: blueprint grid + drifting wine blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="bg-grid absolute inset-0 opacity-[0.35] [--border:rgba(255,255,255,0.06)]" />
          <div className="ambient-blob -start-24 -top-24 h-96 w-96 bg-[var(--accent-deep)] !opacity-50" />
          <div className="ambient-blob -bottom-32 -end-16 h-80 w-80 bg-[#B91942] !opacity-30 [animation-delay:-9s]" />
        </div>

        {/* Giant ghost word */}
        <span
          aria-hidden
          className="ghost-numeral -end-4 -top-10 text-[22vw] leading-none lg:text-[12rem] [-webkit-text-stroke:1px_rgba(255,255,255,0.07)]"
        >
          حلا
        </span>

        <div className="relative z-10 max-w-3xl">
          <h2 className="font-display text-4xl font-black leading-[1.1] text-white md:text-6xl">
            {t("heading")}
            <span className="text-[#E64A6E]">.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70 md:text-xl">
            {t("subheading")}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="shine group flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-[#120409] transition-transform duration-300 hover:scale-[1.03]"
            >
              <Mail size={16} />
              {t("primaryButton")}
            </Link>
            <Link
              href="/projects"
              className="group flex items-center gap-2 rounded-full border border-white/25 px-8 py-4 text-sm font-bold text-white transition-colors hover:border-white/60"
            >
              {t("secondaryButton")}
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
