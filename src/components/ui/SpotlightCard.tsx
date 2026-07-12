"use client";

import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

/**
 * Mouse-tracked spotlight surface (21st.dev-style).
 * Sets --mx/--my custom properties consumed by the `.spotlight` CSS in
 * globals.css. Purely decorative — zero effect on touch devices.
 */
export function SpotlightCard({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
      }}
      className={cn("spotlight card-studio", className)}
      {...props}
    >
      {children}
    </div>
  );
}
