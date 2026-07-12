import { ProjectGrid } from "@/components/features/ProjectGrid";
import { CTABanner } from "@/components/sections/CTABanner";
import { projects } from "@/content/projects";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("projects");
  return { title: t("heading") };
}


export default async function ProjectsPage() {
  const t = await getTranslations("projects");

  return (
    <>
      <div className="mx-auto max-w-6xl px-6 lg:px-8 py-24 md:py-32">
        <header className="mb-16 md:mb-24">
          <h1 className="text-4xl md:text-6xl font-black text-text-primary mb-6">
            {t("heading")}
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl">
            {t("description")}
          </p>
        </header>

        <ProjectGrid projects={projects} initialCategory="ALL" />
      </div>

      <CTABanner />
    </>
  );
}
