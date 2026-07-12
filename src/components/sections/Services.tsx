"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  LayoutTemplate,
  MonitorSmartphone,
  PenTool,
  Video,
} from "lucide-react";
import { useTranslations } from "next-intl";

/* Bento layout: the two core crafts (UI/UX + front-end) get the wide cells.
   Tints come from the discipline color system. */
const services = [
  {
    icon: LayoutTemplate,
    titleKey: "uiux.title",
    descKey: "uiux.desc",
    href: "/projects?category=UIUX",
    span: "lg:col-span-7",
    tint: "var(--cat-uiux)",
    tintBg: "var(--cat-uiux-bg)",
  },
  {
    icon: MonitorSmartphone,
    titleKey: "websites.title",
    descKey: "websites.desc",
    href: "/projects?category=WEBSITES",
    span: "lg:col-span-5",
    tint: "var(--cat-websites)",
    tintBg: "var(--cat-websites-bg)",
  },
  {
    icon: PenTool,
    titleKey: "branding.title",
    descKey: "branding.desc",
    href: "/projects?category=GRAPHIC_DESIGN",
    span: "lg:col-span-5",
    tint: "var(--cat-graphic)",
    tintBg: "var(--cat-graphic-bg)",
  },
  {
    icon: Video,
    titleKey: "video.title",
    descKey: "video.desc",
    href: "/projects?category=VIDEOS",
    span: "lg:col-span-7",
    tint: "var(--cat-videos)",
    tintBg: "var(--cat-videos-bg)",
  },
] as const;

export function Services() {
  const t = useTranslations("home.services");

  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <SectionHeader
          index="02"
          label={t("sectionTitle")}
          title={t("heading")}
          description={t("description")}
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.titleKey}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={service.span}
              >
                <Link href={service.href} className="group block h-full">
                  <SpotlightCard className="flex h-full flex-col p-8 md:p-10">
                    {/* Giant ghost icon — editorial depth */}
                    <Icon
                      aria-hidden
                      className="pointer-events-none absolute -bottom-6 -end-6 h-40 w-40 opacity-[0.05] transition-transform duration-700 ease-out group-hover:rotate-6 group-hover:scale-110"
                      style={{ color: service.tint }}
                      strokeWidth={1}
                    />

                    <div className="mb-8 flex items-start justify-between">
                      <span
                        className="flex h-14 w-14 items-center justify-center rounded-2xl border"
                        style={{
                          color: service.tint,
                          backgroundColor: service.tintBg,
                          borderColor: service.tintBg,
                        }}
                      >
                        <Icon className="h-6 w-6" strokeWidth={1.8} />
                      </span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-tertiary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:border-accent group-hover:text-accent rtl:-scale-x-100">
                        <ArrowUpRight size={18} />
                      </span>
                    </div>

                    <h3 className="mb-3 text-xl font-black text-text-primary md:text-2xl">
                      {t(service.titleKey)}
                    </h3>
                    <p className="max-w-md text-sm leading-relaxed text-text-secondary md:text-base">
                      {t(service.descKey)}
                    </p>
                  </SpotlightCard>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
