"use client";

import React, { forwardRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** URL of the avatar image */
  src?: string;
  /** Descriptive alt text for the image */
  alt?: string;
  /** Size preset */
  size?: AvatarSize;
  /**
   * Fallback text to show when src is absent or fails to load.
   * Typically 1–2 initials, e.g. "JD".
   */
  fallback?: string;
  className?: string;
}

// ─── Size maps ───────────────────────────────────────────────────────────────

const sizeClasses: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-xl",
};

const imageSizes: Record<AvatarSize, number> = {
  sm: 32,
  md: 40,
  lg: 64,
};

// ─── Fallback initials helper ─────────────────────────────────────────────────

function deriveInitials(fallback?: string, alt?: string): string {
  const source = fallback ?? alt ?? "";
  // If it looks like a full name, take up to the first two initials
  const parts = source.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return source.slice(0, 2).toUpperCase() || "?";
}

// ─── Component ──────────────────────────────────────────────────────────────

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt = "",
      size = "md",
      fallback,
      className,
      ...rest
    },
    ref
  ) => {
    const [imgError, setImgError] = useState(false);
    const showFallback = !src || imgError;
    const initials = deriveInitials(fallback, alt);
    const px = imageSizes[size];

    return (
      <div
        ref={ref}
        aria-label={alt || fallback || "Avatar"}
        role="img"
        className={cn(
          "relative flex flex-shrink-0 items-center justify-center overflow-hidden",
          "rounded-full select-none",
          // Glass-tinted ring
          "ring-2 ring-border ring-offset-2 ring-offset-transparent",
          sizeClasses[size],
          // Fallback background when no image
          showFallback && "bg-accent/20",
          className
        )}
        {...rest}
      >
        {!showFallback && (
          <Image
            src={src!}
            alt={alt}
            width={px}
            height={px}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
            // Avoid dragging the image around accidentally
            draggable={false}
          />
        )}

        {showFallback && (
          <span
            aria-hidden="true"
            className="font-semibold tracking-wide text-accent"
          >
            {initials}
          </span>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export default Avatar;
