"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useReducer,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastData {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  /** Auto-dismiss duration in ms. Pass 0 to persist until manually dismissed. */
  duration?: number;
}

// ─── State / Reducer ─────────────────────────────────────────────────────────

type Action =
  | { type: "ADD"; toast: ToastData }
  | { type: "DISMISS"; id: string };

function reducer(state: ToastData[], action: Action): ToastData[] {
  switch (action.type) {
    case "ADD":
      // Keep at most 5 toasts visible
      return [action.toast, ...state].slice(0, 5);
    case "DISMISS":
      return state.filter((t) => t.id !== action.id);
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface ToastContextValue {
  toasts: ToastData[];
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, dispatch] = useReducer(reducer, []);

  const toast = useCallback((options: ToastOptions): string => {
    const id = Math.random().toString(36).slice(2);
    dispatch({
      type: "ADD",
      toast: {
        id,
        title: options.title,
        description: options.description,
        variant: options.variant ?? "info",
        duration: options.duration ?? 4000,
      },
    });
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    dispatch({ type: "DISMISS", id });
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
}

// ─── Variant styles ───────────────────────────────────────────────────────────

const variantConfig: Record<
  ToastVariant,
  { icon: React.ReactNode; barColor: string; iconColor: string }
> = {
  success: {
    iconColor: "text-emerald-400",
    barColor: "bg-emerald-500",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
  },
  error: {
    iconColor: "text-red-400",
    barColor: "bg-red-500",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
  },
  warning: {
    iconColor: "text-amber-400",
    barColor: "bg-amber-500",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  info: {
    iconColor: "text-accent",
    barColor: "bg-accent",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
};

// ─── Single toast item ────────────────────────────────────────────────────────

function ToastItem({ toast, onDismiss }: { toast: ToastData; onDismiss: () => void }) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const config = variantConfig[toast.variant ?? "info"];

  useEffect(() => {
    if (!toast.duration || toast.duration <= 0) return;
    timerRef.current = setTimeout(onDismiss, toast.duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.duration, onDismiss]);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      role="alert"
      aria-live="assertive"
      className="glass relative w-80 overflow-hidden rounded-xl shadow-lg"
    >
      {/* Progress bar */}
      {toast.duration && toast.duration > 0 && (
        <motion.div
          className={cn("absolute bottom-0 left-0 h-0.5", config.barColor)}
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: toast.duration / 1000, ease: "linear" }}
        />
      )}

      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <span className={cn("mt-0.5 flex-shrink-0", config.iconColor)}>
          {config.icon}
        </span>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-text-primary">{toast.title}</p>
          {toast.description && (
            <p className="mt-0.5 text-xs text-text-secondary">{toast.description}</p>
          )}
        </div>

        {/* Close */}
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={onDismiss}
          className="flex-shrink-0 rounded p-0.5 text-text-tertiary hover:text-text-primary transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </motion.li>
  );
}

// ─── Toaster (renders into portal) ───────────────────────────────────────────

export function Toaster() {
  const { toasts, dismiss } = useToast();
  // Portal only after mount — server and first client render both output
  // null, avoiding a hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <div
      aria-label="Notifications"
      className="fixed bottom-6 end-6 z-[9999] flex flex-col-reverse gap-3"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}

export default useToast;
