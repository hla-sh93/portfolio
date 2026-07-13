"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

interface LikeButtonProps {
  /** Content slug — counters are keyed by (type, slug) */
  slug: string;
  type?: "project" | "article";
  initialCount?: number;
  /**
   * overlay — icon-only circle for image corners (store-style)
   * pill    — icon + count, for detail pages
   */
  variant?: "overlay" | "pill";
  className?: string;
}

export function LikeButton({
  slug,
  type = "project",
  initialCount = 0,
  variant = "pill",
  className,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(`liked:${type}:${slug}`)) setLiked(true);
  }, [type, slug]);

  const toggleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); // cards wrap this in a Link
    e.stopPropagation();
    if (loading) return;
    setLoading(true);

    const prevLiked = liked;
    const prevCount = count;
    setLiked(!prevLiked);
    setCount((c) => Math.max(0, prevLiked ? c - 1 : c + 1));

    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          slug,
          action: prevLiked ? "unlike" : "like",
        }),
      });
      if (!res.ok) throw new Error("track failed");
      const data = await res.json();
      setCount(data.likes);
      if (!prevLiked) localStorage.setItem(`liked:${type}:${slug}`, "1");
      else localStorage.removeItem(`liked:${type}:${slug}`);
    } catch {
      setLiked(prevLiked);
      setCount(prevCount);
    } finally {
      setLoading(false);
    }
  };

  const heart = (
    <span className="relative">
      <Heart
        className={cn(
          "transition-transform duration-200 group-hover/like:scale-110",
          variant === "overlay" ? "h-[18px] w-[18px]" : "h-4 w-4",
          liked && "fill-current"
        )}
      />
      <AnimatePresence>
        {liked && (
          <motion.span
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 2.2, opacity: 0 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 rounded-full bg-red-500"
          />
        )}
      </AnimatePresence>
    </span>
  );

  if (variant === "overlay") {
    // Store-style favorite: white circle on the image, icon only
    return (
      <button
        onClick={toggleLike}
        disabled={loading}
        aria-label={liked ? "Unlike" : "Like"}
        className={cn(
          "group/like flex h-10 w-10 cursor-pointer items-center justify-center rounded-full",
          "bg-white/95 shadow-md backdrop-blur-sm transition-all duration-200",
          "hover:scale-105 active:scale-95",
          liked ? "text-red-500" : "text-gray-700 hover:text-red-500",
          className
        )}
      >
        {heart}
      </button>
    );
  }

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      aria-label={liked ? "Unlike" : "Like"}
      className={cn(
        "group/like flex cursor-pointer items-center justify-center gap-2 rounded-full border px-4 py-2 transition-colors",
        "border-border bg-surface/60 backdrop-blur-md hover:border-accent/40",
        liked ? "text-red-500" : "text-text-secondary",
        className
      )}
    >
      {heart}
      <span className="text-sm font-semibold tabular-nums">{count}</span>
    </button>
  );
}
