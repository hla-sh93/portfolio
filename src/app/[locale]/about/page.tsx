import { SkillsGrid } from "@/components/features/SkillsGrid";
import { Timeline } from "@/components/features/Timeline";
import { CTABanner } from "@/components/sections/CTABanner";
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
      <div className="container mx-auto px-6 max-w-4xl py-24 md:py-32">
        {/* Header */}
        <header className="mb-20 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-text-primary mb-6">
            {t("heading")}
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
            {t("description")}
          </p>
        </header>

        {/* Experience Section */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">{t("experience.title")}</h2>
            <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
          </div>
          <Timeline entries={experiences} />
        </section>

        {/* Skills Section */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">{t("skills.title")}</h2>
            <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
          </div>
          <SkillsGrid />
        </section>
      </div>

      <CTABanner />
    </>
  );
}
