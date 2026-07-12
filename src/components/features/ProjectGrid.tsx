"use client";

import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { ProjectWithStats } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, List, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { ProjectCard } from "./ProjectCard";

interface ProjectGridProps {
  projects: ProjectWithStats[];
  initialCategory?: string;
}

const CATEGORIES = ["ALL", "VIDEOS", "GRAPHIC_DESIGN", "UIUX", "WEBSITES"] as const;
type Category = (typeof CATEGORIES)[number];

const categoryTranslationKey: Record<Category, string> = {
  ALL: "categories.all",
  VIDEOS: "categories.videos",
  GRAPHIC_DESIGN: "categories.graphic-design",
  UIUX: "categories.uiux",
  WEBSITES: "categories.websites",
};

export function ProjectGrid({ projects, initialCategory = "ALL" }: ProjectGridProps) {
  const t = useTranslations("projects");
  const [activeCategory, setActiveCategory] = useState<Category>(initialCategory as Category);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchCategory = activeCategory === "ALL" || project.category === activeCategory;
      const matchQuery =
        project.titleEn.toLowerCase().includes(query.toLowerCase()) ||
        project.titleAr.toLowerCase().includes(query.toLowerCase()) ||
        project.descEn.toLowerCase().includes(query.toLowerCase()) ||
        project.descAr.toLowerCase().includes(query.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [projects, activeCategory, query]);

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Categories Tab */}
        <div className="flex-1 overflow-x-auto pb-2 md:pb-0">
          <div className="flex items-center gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap",
                  activeCategory === category
                    ? "text-white"
                    : "text-text-secondary hover:text-text-primary hover:bg-accent-light"
                )}
              >
                {activeCategory === category && (
                  <motion.div
                    layoutId="category-pill"
                    className="absolute inset-0 bg-accent rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                {t(categoryTranslationKey[category] as Parameters<typeof t>[0])}
              </button>
            ))}
          </div>
        </div>

        {/* Search & View Toggle */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="w-full md:w-64">
            <Input
              type="text"
              placeholder={t("filters.search")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="hidden sm:flex items-center bg-surface rounded-full p-1 border border-border isolate">
            <button
              aria-label="Grid view"
              onClick={() => setView("grid")}
              className={cn(
                "relative p-2 rounded-full transition-colors",
                view === "grid" ? "text-white" : "text-text-secondary hover:text-text-primary"
              )}
            >
              {view === "grid" && (
                <motion.div
                  layoutId="view-pill"
                  className="absolute inset-0 bg-accent rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              aria-label="List view"
              onClick={() => setView("list")}
              className={cn(
                "relative p-2 rounded-full transition-colors",
                view === "list" ? "text-white" : "text-text-secondary hover:text-text-primary"
              )}
            >
              {view === "list" && (
                <motion.div
                  layoutId="view-pill"
                  className="absolute inset-0 bg-accent rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid rendering */}
      {filteredProjects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <Search className="w-12 h-12 text-text-tertiary mb-4" />
          <h3 className="text-xl font-medium text-text-primary mb-1">No results found</h3>
          <p className="text-text-secondary">Try a different search term or category.</p>
        </motion.div>
      ) : (
        <motion.div
          layout
          className={cn(
            "grid gap-6",
            view === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          )}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} view={view} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
