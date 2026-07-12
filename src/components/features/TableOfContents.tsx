"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ListCollapse, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const t = useTranslations("blog");
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Collect all h2 and h3 elements inside the article content
    const elements = Array.from(document.querySelectorAll("article h2, article h3"))
      .map((element) => ({
        id: element.id,
        text: element.textContent || "",
        level: Number(element.tagName.charAt(1)),
      }))
      .filter((item) => item.id); // Only include headings with IDs
      
    setHeadings(elements);

    // Intersection Observer to track active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" } // Trigger when near top
    );

    elements.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 100; // 100px offset for sticky navbar
      window.scrollTo({ top, behavior: "smooth" });
      setActiveId(id);
      setIsOpen(false);
    }
  };

  const desktopToc = (
    <nav className="hidden xl:block sticky top-32 w-64 shrink-0">
      <h3 className="text-sm font-bold uppercase tracking-wider text-text-tertiary mb-4">
        {t("tableOfContents")}
      </h3>
      <ul className="space-y-3 border-l-2 border-border pl-4 relative">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <li
              key={heading.id}
              className={cn("transition-colors relative", isActive ? "text-accent" : "text-text-secondary hover:text-text-primary")}
              style={{ marginLeft: `${(heading.level - 2)}rem` }}
            >
              {isActive && (
                <motion.div
                  layoutId="toc-indicator"
                  className="absolute -left-[18px] top-1.5 w-2 h-2 rounded-full bg-accent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              <a
                href={`#${heading.id}`}
                onClick={(e) => scrollToSection(e, heading.id)}
                className={cn("text-sm block py-1", heading.level === 3 ? "text-xs opacity-80" : "")}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  const mobileToc = (
    <div className="xl:hidden fixed bottom-6 left-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-16 left-0 w-72 origin-bottom-left"
          >
            <GlassCard padding="md" className="max-h-[60vh] overflow-y-auto scrollbar-thin shadow-2xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-tertiary mb-4">
                {t("tableOfContents")}
              </h3>
              <ul className="space-y-3">
                {headings.map((heading) => (
                  <li key={heading.id} style={{ marginLeft: `${(heading.level - 2)}rem` }}>
                    <a
                      href={`#${heading.id}`}
                      onClick={(e) => scrollToSection(e, heading.id)}
                      className={cn(
                        "text-sm block py-1 transition-colors",
                        activeId === heading.id ? "text-accent font-medium" : "text-text-secondary"
                      )}
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 flex items-center justify-center rounded-full bg-accent text-white shadow-xl hover:scale-105 active:scale-95 transition-transform"
        aria-label="Toggle table of contents"
      >
        {isOpen ? <X className="w-5 h-5" /> : <ListCollapse className="w-5 h-5" />}
      </button>
    </div>
  );

  return (
    <>
      {desktopToc}
      {mobileToc}
    </>
  );
}
