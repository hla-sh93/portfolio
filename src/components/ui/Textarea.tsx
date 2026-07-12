"use client";

import React, { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Rendered as a <label> above the field */
  label?: string;
  /** Error message rendered below the field (also sets aria-invalid) */
  error?: string;
  /** Number of visible text rows (default 4) */
  rows?: number;
  className?: string;
  /** Extra class applied to the outer wrapper div */
  wrapperClassName?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      rows = 4,
      className,
      wrapperClassName,
      disabled,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const id = rest.id ?? generatedId;

    const hasError = Boolean(error);

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-text-secondary"
          >
            {label}
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className={cn(
            // Base glass style — mirrors Input
            "w-full resize-y rounded-xl border border-border bg-glass-bg",
            "px-4 py-2.5 text-sm text-text-primary",
            "placeholder:text-text-tertiary",
            "backdrop-blur-sm",
            // Focus ring
            "outline-none transition-all duration-200",
            "focus:border-accent focus:ring-2 focus:ring-accent/30",
            // Scrollbar
            "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
            // Error state
            hasError &&
              "border-red-500/70 focus:border-red-500 focus:ring-red-500/30",
            // Disabled
            disabled && "cursor-not-allowed opacity-50 resize-none",
            className
          )}
          {...rest}
        />

        {/* Error message */}
        {hasError && (
          <p
            id={`${id}-error`}
            role="alert"
            className="flex items-center gap-1 text-xs text-red-400"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5 flex-shrink-0"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
