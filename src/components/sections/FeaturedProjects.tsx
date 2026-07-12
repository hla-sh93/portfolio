"use client";

import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Link } from "@/i18n/navigation";
import type { ProjectWithStats } from "@/types";
import { motion } from "framer-motion";
import { ArrowUpRight, Heart } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

interface FeaturedProjectsProps {
  projects: ProjectWithStats[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const t = useTranslations("home.featured");
  const tProjects = useTranslations("projects");
  const locale = useLocale();
  const isAr = locale === "ar";

  if (!projects || projects.length === 0) return null;

  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <SectionHeader
          index="03"
          label={t("sectionTitle")}
          title={t("heading")}
          action={
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-full border border-border-strong px-6 py-3 text-sm font-bold text-text-primary transition-colors hover:border-accent hover:text-accent"
            >
              {t("viewAll")}
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
              />
            </Link>
          }
        />

        <div className="flex flex-col gap-20 md:gap-28">
          {projects.slice(0, 4).map((project, index) => {
            const title = isAr ? project.titleAr : project.titleEn;
            const desc = isAr ? project.descAr : project.descEn;
            const reversed = index % 2 === 1;

            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12"
              >
                {/* Image */}
                <Link
                  href={`/projects/detail/${project.slug}`}
                  className={`group relative block overflow-hidden rounded-2xl border border-border lg:col-span-7 ${
                    reversed ? "lg:order-2" : ""
                  }`}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
                    <Image
                      src={project.coverImage}
                      alt={title}
                      fill
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      placeholder={project.blurDataUrl ? "blur" : "empty"}
                      blurDataURL={project.blurDataUrl || undefined}
                    />
                    {/* Hover veil + view pill */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <span className="absolute bottom-5 start-5 flex translate-y-3 items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-sm font-bold text-black opacity-0 transition-all duration-400 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                      {tProjects("viewProject")}
                      <ArrowUpRight size={15} className="rtl:-scale-x-100" />
                    </span>
                  </div>
                </Link>

                {/* Info */}
                <div
                  className={`relative lg:col-span-5 ${reversed ? "lg:order-1" : ""}`}
                >
                  {/* Ghost index numeral */}
                  <span
                    aria-hidden
                    dir="ltr"
                    className="ghost-numeral -top-14 end-0 text-[7rem] md:text-[9rem]"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="relative z-10">
                    <Badge category={project.category} />
                    <h3 className="mt-4 text-2xl font-black leading-snug text-text-primary md:text-3xl">
                      <Link
                        href={`/projects/detail/${project.slug}`}
                        className="transition-colors hover:text-accent"
                      >
                        {title}
                      </Link>
                    </h3>
                    <p className="mt-4 line-clamp-3 leading-relaxed text-text-secondary">
                      {desc}
                    </p>

                    {project.tools.length > 0 && (
                      <ul className="mt-6 flex flex-wrap gap-2">
                        {project.tools.map((tool) => (
                          <li
                            key={tool}
                            dir="ltr"
                            className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-text-secondary"
                          >
                            {tool}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-7 flex items-center gap-5">
                      <Link
                        href={`/projects/detail/${project.slug}`}
                        className="group/link inline-flex items-center gap-1.5 text-sm font-bold text-accent"
                      >
                        {tProjects("viewProject")}
                        <ArrowUpRight
                          size={15}
                          className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover/link:-translate-x-0.5"
                        />
                      </Link>
                      {project.likeCount > 0 && (
                        <span className="inline-flex items-center gap-1.5 text-sm text-text-tertiary">
                          <Heart size={14} />
                          {project.likeCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
