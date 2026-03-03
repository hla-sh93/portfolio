import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { HeroSection } from "@/components/sections/hero";

export default function Home() {
  const t = useTranslations();

  return (
    <>
      <HeroSection />

      {/* Placeholder sections — to be built in Phase 2 */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="font-display text-3xl font-bold text-text-primary">
          {t("projects.subtitle")}
        </h2>
        <p className="mt-2 text-text-secondary">
          Coming soon...
        </p>
      </section>
    </>
  );
}
