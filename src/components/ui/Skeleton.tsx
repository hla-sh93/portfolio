"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Explicit width (e.g. "200px", "100%") — falls back to w-full */
  width?: string | number;
  /** Explicit height (e.g. "20px", "1rem") — falls back to h-4 */
  height?: string | number;
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ width, height, className, style, ...rest }, ref) => {
    const inlineStyle: React.CSSProperties = {
      ...(width !== undefined
        ? { width: typeof width === "number" ? `${width}px` : width }
        : {}),
      ...(height !== undefined
        ? { height: typeof height === "number" ? `${height}px` : height }
        : {}),
      ...style,
    };

    return (
      <div
        ref={ref}
        aria-hidden="true"
        role="presentation"
        style={inlineStyle}
        className={cn(
          // Base shape
          "rounded-lg",
          // Default dimensions when none are supplied via props
          width === undefined && "w-full",
          height === undefined && "h-4",
          // Glass-themed shimmer: a gradient animation over the surface color
          "relative overflow-hidden bg-white/5",
          // Pulse animation — defined in globals.css or Tailwind's animate-pulse
          "animate-pulse",
          className
        )}
        {...rest}
      >
        {/*
         * Shimmer sweep — an absolutely-positioned gradient that slides
         * across the element.  Complements the pulse to give a lively look.
         */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0",
            "bg-gradient-to-r from-transparent via-white/10 to-transparent",
            "translate-x-[-100%] animate-[shimmer_1.8s_infinite]"
          )}
        />
      </div>
    );
  }
);

Skeleton.displayName = "Skeleton";

// ─── Convenience presets ─────────────────────────────────────────────────────

/** A single line of text placeholder */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={14}
          // Last line is shorter to mimic real paragraph endings
          width={i === lines - 1 ? "66%" : "100%"}
        />
      ))}
    </div>
  );
}

/** A card-shaped placeholder */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("glass rounded-2xl p-6 space-y-4", className)}>
      <Skeleton height={24} width="60%" />
      <SkeletonText lines={3} />
      <div className="flex gap-2 pt-2">
        <Skeleton height={32} width={80} className="rounded-full" />
        <Skeleton height={32} width={80} className="rounded-full" />
      </div>
    </div>
  );
}

export default Skeleton;
