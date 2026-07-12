"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

export type BadgeCategory = "VIDEOS" | "GRAPHIC_DESIGN" | "UIUX" | "WEBSITES";
export type BadgeVariant = "default" | "outline" | "solid";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Maps to a category-specific CSS class (badge-videos, badge-graphic, etc.) */
  category?: BadgeCategory;
  variant?: BadgeVariant;
  className?: string;
  children?: React.ReactNode;
}

// ─── Maps ───────────────────────────────────────────────────────────────────

/** CSS class defined in globals.css for each category */
const categoryClasses: Record<BadgeCategory, string> = {
  VIDEOS: "badge-videos",
  GRAPHIC_DESIGN: "badge-graphic",
  UIUX: "badge-uiux",
  WEBSITES: "badge-websites",
};

/** Variant modifier classes — layered on top of the category base */
const variantClasses: Record<BadgeVariant, string> = {
  default: "opacity-90",
  outline: "bg-transparent border-2 border-current",
  solid: "opacity-100 font-semibold",
};

// ─── Component ──────────────────────────────────────────────────────────────

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      category,
      variant = "default",
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const baseClasses = [
      "inline-flex items-center justify-center",
      "px-2.5 py-0.5",
      "text-xs font-medium tracking-wide",
      "rounded-full",
      "transition-opacity duration-150",
    ].join(" ");

    // If no category is supplied fall back to a neutral accent style
    const categoryClass = category
      ? categoryClasses[category]
      : "bg-accent/20 text-accent border border-accent/30";

    return (
      <span
        ref={ref}
        className={cn(
          baseClasses,
          categoryClass,
          variantClasses[variant],
          className
        )}
        {...rest}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;
