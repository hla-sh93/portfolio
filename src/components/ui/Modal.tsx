"use client";

import React, {
  useEffect,
  useRef,
  useCallback,
  forwardRef,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

export type ModalSize = "sm" | "md" | "lg" | "full";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  className?: string;
  children?: React.ReactNode;
}

// ─── Size map ────────────────────────────────────────────────────────────────

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
  full: "max-w-[95vw] h-[95vh]",
};

// ─── Focus trap helpers ──────────────────────────────────────────────────────

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

function trapFocus(containerEl: HTMLElement, event: KeyboardEvent) {
  const focusable = Array.from(
    containerEl.querySelectorAll<HTMLElement>(FOCUSABLE)
  ).filter((el) => !el.closest("[disabled]") && el.offsetParent !== null);

  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey) {
    if (document.activeElement === first) {
      event.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}

// ─── Inner modal panel ───────────────────────────────────────────────────────

const ModalPanel = forwardRef<
  HTMLDivElement,
  {
    title?: string;
    size: ModalSize;
    className?: string;
    children?: React.ReactNode;
    onClose: () => void;
  }
>(({ title, size, className, children, onClose }, ref) => (
  <motion.div
    ref={ref}
    role="dialog"
    aria-modal="true"
    aria-labelledby={title ? "modal-title" : undefined}
    initial={{ opacity: 0, scale: 0.95, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95, y: 20 }}
    transition={{ type: "spring", stiffness: 320, damping: 28 }}
    className={cn(
      "glass relative w-full rounded-2xl p-6 shadow-2xl",
      sizeClasses[size],
      size === "full" ? "overflow-y-auto" : "overflow-hidden",
      className
    )}
    onClick={(e) => e.stopPropagation()}
  >
    {/* Header */}
    {title && (
      <div className="mb-4 flex items-start justify-between gap-4">
        <h2
          id="modal-title"
          className="text-lg font-semibold text-text-primary leading-tight"
        >
          {title}
        </h2>
        <button
          type="button"
          aria-label="Close modal"
          onClick={onClose}
          className="rounded-lg p-1 text-text-tertiary hover:text-text-primary hover:bg-white/10 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    )}

    {/* Body */}
    <div className="text-text-secondary">{children}</div>
  </motion.div>
));
ModalPanel.displayName = "ModalPanel";

// ─── Public component ────────────────────────────────────────────────────────

export function Modal({
  open,
  onClose,
  title,
  size = "md",
  className,
  children,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Lock body scroll and save previously focused element
  useEffect(() => {
    if (open) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";

      // Move focus into the panel on next tick
      const timer = setTimeout(() => {
        if (panelRef.current) {
          const first = panelRef.current.querySelector<HTMLElement>(FOCUSABLE);
          (first ?? panelRef.current).focus();
        }
      }, 50);

      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "";
      // Restore focus
      previouslyFocusedRef.current?.focus();
    }
  }, [open]);

  // Keyboard handling: Escape closes, Tab traps focus
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!open) return;
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "Tab" && panelRef.current) {
        trapFocus(panelRef.current, event);
      }
    },
    [open, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        /* Glass backdrop */
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
          onClick={onClose}
          aria-hidden="true"
        >
          <ModalPanel
            ref={panelRef}
            title={title}
            size={size}
            className={className}
            onClose={onClose}
          >
            {children}
          </ModalPanel>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default Modal;
