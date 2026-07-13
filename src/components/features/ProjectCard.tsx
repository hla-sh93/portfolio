"use client";

import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { ProjectWithStats } from "@/types";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { LikeButton } from "./LikeButton";

const categoryKeyMap: Record<string, string> = {
  VIDEOS: "videos",
  GRAPHIC_DESIGN: "graphic-design",
  UIUX: "uiux",
  WEBSITES: "websites",
};

type ProjectWithViews = ProjectWithStats & { views?: number };

interface ProjectCardProps {
  project: ProjectWithViews;
  view?: "grid" | "list";
  className?: string;
  index?: number;
}

export function ProjectCard({
  project,
  view = "grid",
  className,
  index = 0,
}: ProjectCardProps) {
  const locale = useLocale();
  const t = useTranslations("projects");
  const isGrid = view === "grid";

  const title = locale === "ar" ? project.titleAr : project.titleEn;
  const description = locale === "ar" ? project.descAr : project.descEn;
  const views = project.views ?? 0;

  const cardContent = (
    <GlassCard
      hover
      padding="none"
      className={cn(
        "group relative flex overflow-hidden",
        isGrid ? "h-full flex-col" : "flex-col gap-4 p-4 sm:flex-row",
        className
      )}
    >
      {/* Image — favorite overlay lives here, store-style */}
      <div
        className={cn(
          "relative overflow-hidden bg-surface",
          isGrid
            ? "aspect-video w-full"
            : "aspect-video w-full shrink-0 rounded-xl sm:aspect-[4/3] sm:w-72"
        )}
      >
        <Image
          src={project.coverImage || "/images/placeholder.jpg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={
            isGrid
              ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              : "(max-width: 640px) 100vw, 288px"
          }
          placeholder={project.blurDataUrl ? "blur" : "empty"}
          blurDataURL={project.blurDataUrl || undefined}
        />

        {/* Category badge */}
        <div className="absolute start-3 top-3 z-10">
          <Badge category={project.category}>
            {t(
              `categories.${categoryKeyMap[project.category] || project.category.toLowerCase()}` as Parameters<
                typeof t
              >[0]
            )}
          </Badge>
        </div>

        {/* Favorite — icon only, on the image */}
        <div className="absolute end-3 top-3 z-10">
          <LikeButton slug={project.slug} variant="overlay" />
        </div>
      </div>

      {/* Content */}
      <div className={cn("flex flex-1 flex-col", isGrid ? "p-6" : "py-2")}>
        <h3 className="mb-2 line-clamp-1 text-xl font-bold tracking-tight text-text-primary">
          {title}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-text-secondary">
          {description}
        </p>

        {/* Meta: views */}
        <div className="mt-auto flex items-center gap-1.5 text-text-tertiary">
          <Eye className="h-4 w-4" />
          <span className="text-xs font-semibold tabular-nums">
            {views.toLocaleString()}
          </span>
        </div>
      </div>
    </GlassCard>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      layout
    >
      <Link
        href={`/projects/detail/${project.slug}`}
        className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {cardContent}
      </Link>
    </motion.div>
  );
}
