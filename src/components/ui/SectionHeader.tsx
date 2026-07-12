"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  /** Two-digit studio index, e.g. "01" */
  index?: string;
  /** Small accent label above the title */
  label: string;
  title: string;
  description?: string;
  /** Optional action node rendered at the end (desktop) */
  action?: React.ReactNode;
  className?: string;
}

/**
 * Editorial studio section header: — 01 · LABEL, then a display title.
 * Start-aligned (never centered) — the asymmetry is the studio signature.
 */
export function SectionHeader({
  index,
  label,
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className="max-w-2xl">
        <span className="section-label">
          {index && <span dir="ltr">{index}</span>}
          {label}
        </span>
        <h2 className="mt-4 font-display text-3xl font-black leading-tight text-text-primary md:text-5xl">
          {title}
        </h2>
        {description && (
          <p className="mt-5 text-lg leading-relaxed text-text-secondary">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </motion.div>
  );
}
