"use client";

import React, { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

type PaddingSize = "none" | "sm" | "md" | "lg";

export interface GlassCardProps {
  /** Add a subtle lift + scale on hover using Framer Motion */
  hover?: boolean;
  /** Internal padding preset */
  padding?: PaddingSize;
  className?: string;
  children?: React.ReactNode;
  /** Forward any extra div / motion.div props */
  [key: string]: unknown;
}

// ─── Maps ───────────────────────────────────────────────────────────────────

const paddingClasses: Record<PaddingSize, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

// ─── Static card (no hover animation) ───────────────────────────────────────

const StaticCard = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { padding?: PaddingSize }
>(({ padding = "md", className, children, ...rest }, ref) => (
  <div
    ref={ref}
    className={cn("glass rounded-2xl", paddingClasses[padding], className)}
    {...rest}
  >
    {children}
  </div>
));
StaticCard.displayName = "StaticCard";

// ─── Animated card ──────────────────────────────────────────────────────────

type MotionDivProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children?: React.ReactNode;
};

const HoverCard = forwardRef<
  HTMLDivElement,
  MotionDivProps & { padding?: PaddingSize }
>(({ padding = "md", className, children, ...rest }, ref) => (
  <motion.div
    ref={ref}
    whileHover={{ y: -4, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
    className={cn(
      "glass rounded-2xl cursor-default",
      paddingClasses[padding],
      className
    )}
    {...rest}
  >
    {children}
  </motion.div>
));
HoverCard.displayName = "HoverCard";

// ─── Public component ────────────────────────────────────────────────────────

export function GlassCard({
  hover = false,
  padding = "md",
  className,
  children,
  ...rest
}: GlassCardProps) {
  if (hover) {
    return (
      <HoverCard
        padding={padding}
        className={className}
        {...(rest as MotionDivProps)}
      >
        {children}
      </HoverCard>
    );
  }

  return (
    <StaticCard
      padding={padding}
      className={className}
      {...(rest as React.HTMLAttributes<HTMLDivElement>)}
    >
      {children}
    </StaticCard>
  );
}

export default GlassCard;
