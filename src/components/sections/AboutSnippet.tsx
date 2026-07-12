"use client";

import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function AboutSnippet() {
  const t = useTranslations("home.about");

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Image Side — placeholder until real photo is added */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, type: "spring", stiffness: 50 }}
            className="relative"
          >
            <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-accent/20 via-accent/5 to-transparent border border-border isolate flex items-center justify-center">
              <span className="text-8xl font-black text-accent/20 select-none">HS</span>
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-3xl" />
            </div>

            {/* Decorative blobs */}
            <div className="ambient-blob -bottom-6 -end-6 -z-10 h-32 w-32 bg-accent" />
            <div className="ambient-blob -top-6 -start-6 -z-10 h-32 w-32 bg-[var(--cat-uiux)] [animation-delay:-7s]" />
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 50 }}
            className="flex flex-col items-start"
          >
            <span className="section-label mb-4">
              <span dir="ltr">01</span>
              {t("sectionTitle")}
            </span>
            <h3 className="text-3xl md:text-5xl font-black text-text-primary mb-6 leading-tight">
              {t("heading")}
            </h3>

            <div className="space-y-4 text-lg text-text-secondary leading-relaxed mb-8">
              <p>{t("paragraph1")}</p>
              <p>{t("paragraph2")}</p>
            </div>

            <Button asChild variant="accent" size="lg" className="rounded-full">
              <Link href="/about" className="group">
                {t("cta")}
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
