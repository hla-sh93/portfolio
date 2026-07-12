"use client";

import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { ProjectWithStats } from "@/types";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { LikeButton } from "./LikeButton";

const categoryKeyMap: Record<string, string> = {
  VIDEOS: "videos",
  GRAPHIC_DESIGN: "graphic-design",
  UIUX: "uiux",
  WEBSITES: "websites",
};

interface ProjectCardProps {
  project: ProjectWithStats;
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

  const cardContent = (
    <GlassCard
      hover
      padding="none"
      className={cn(
        "group relative flex overflow-hidden",
        isGrid ? "flex-col h-full" : "flex-col sm:flex-row gap-4 p-4",
        className
      )}
    >
      {/* Image Section — list view needs explicit dimensions: `fill` inside
          an auto-height flex row collapses to 0 and the image vanishes */}
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
          sizes={isGrid ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : "25vw"}
          placeholder={project.blurDataUrl ? "blur" : "empty"}
          blurDataURL={project.blurDataUrl || undefined}
        />
        {/* Category Badge - Overlay on Grid */}
        {isGrid && (
          <div className="absolute top-4 left-4 z-10">
            <Badge category={project.category}>{t(`categories.${categoryKeyMap[project.category] || project.category.toLowerCase()}` as Parameters<typeof t>[0])}</Badge>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className={cn("flex flex-1 flex-col", isGrid ? "p-6" : "")}>
        {!isGrid && (
          <div className="mb-2">
            <Badge category={project.category} variant="outline" className="text-[10px] py-0">
              {t(`categories.${categoryKeyMap[project.category] || project.category.toLowerCase()}` as Parameters<typeof t>[0])}
            </Badge>
          </div>
        )}
        <h3 className="mb-2 line-clamp-1 text-xl font-bold tracking-tight text-text-primary">
          {title}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-text-secondary">
          {description}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <div className="flex gap-2 isolate">
            <LikeButton projectId={project.id} initialCount={project.likeCount} />
          </div>
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
      <Link href={`/projects/detail/${project.slug}`} className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-2xl">
        {cardContent}
      </Link>
    </motion.div>
  );
}
