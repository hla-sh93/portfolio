"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

const variantClasses = {
  accent: [
    "bg-accent text-white",
    "hover:opacity-90 active:scale-[0.97]",
    "shadow-[0_0_20px_rgba(124,58,237,0.4)]",
    "hover:shadow-[0_0_30px_rgba(124,58,237,0.6)]",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
    "transition-all duration-200",
  ].join(" "),
  ghost: [
    "bg-transparent text-accent border border-border",
    "hover:bg-accent/10 active:scale-[0.97]",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "transition-all duration-200",
  ].join(" "),
  danger: [
    "bg-red-600 text-white",
    "hover:bg-red-700 active:scale-[0.97]",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "transition-all duration-200",
  ].join(" "),
} as const;

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm gap-1.5 rounded-lg",
  md: "px-5 py-2.5 text-sm gap-2 rounded-xl",
  lg: "px-7 py-3.5 text-base gap-2.5 rounded-2xl",
} as const;

const spinnerSizes = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
} as const;

type ButtonVariant = keyof typeof variantClasses;
type ButtonSize = keyof typeof sizeClasses;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "accent",
      size = "md",
      loading = false,
      disabled = false,
      asChild = false,
      type = "button",
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const classes = cn(
      "inline-flex items-center justify-center font-medium select-none outline-none",
      "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
      variantClasses[variant],
      sizeClasses[size],
      className
    );

    // asChild: render children directly with button styles applied
    // This allows wrapping <Link> or other elements
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
        className: cn(classes, (children as React.ReactElement<{ className?: string }>).props.className),
      });
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading}
        className={classes}
        {...rest}
      >
        {loading && <Spinner className={spinnerSizes[size]} />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
