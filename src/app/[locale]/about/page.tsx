import { SkillsGrid } from "@/components/features/SkillsGrid";
import { Timeline } from "@/components/features/Timeline";
import { CTABanner } from "@/components/sections/CTABanner";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { TimelineEntry } from "@/types";
import { getTranslations } from "next-intl/server";

export default async function AboutPage() {
  const t = await getTranslations("about");

  // Career history — straight from the CV, newest first.
  // BW (e2) is the only current role.
  const experiences: TimelineEntry[] = (
    ["e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8"] as const
  ).map((key) => ({
    role: t(`experience.${key}.role`),
    company: t(`experience.${key}.company`),
    period: t(`experience.${key}.period`),
    desc: t(`experience.${key}.desc`),
    current: key === "e2",
  }));

  return (
    <>
      {/* Page hero — studio backdrop, start-aligned */}
      <header className="relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden>
          <div className="glow-accent absolute -end-40 -top-40 h-[480px] w-[480px] opacity-70" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-24 lg:px-8 md:pb-24 md:pt-32">
          <span className="section-label">{t("subtitle")}</span>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-black leading-tight text-text-primary md:text-6xl">
            {t("heading")}
            <span className="text-accent">.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
            {t("description")}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Experience */}
        <section className="border-t border-border py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <SectionHeader
                  index="01"
                  label={t("subtitle")}
                  title={t("experience.title")}
                  className="mb-0 md:mb-0"
                />
              </div>
            </div>
            <div className="lg:col-span-8">
              <Timeline entries={experiences} />
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="border-t border-border py-16 md:py-24">
          <SectionHeader
            index="02"
            label={t("subtitle")}
            title={t("skills.title")}
          />
          <SkillsGrid />
        </section>
      </div>

      <CTABanner />
    </>
  );
}
