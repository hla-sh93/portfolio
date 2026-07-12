"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

interface LikeButtonProps {
  projectId: string;
  initialCount: number;
  className?: string;
}

export function LikeButton({ projectId, initialCount, className }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  // Load liked state from localStorage on mount
  useEffect(() => {
    const isLiked = localStorage.getItem(`liked:${projectId}`);
    if (isLiked) {
      setLiked(true);
    }
  }, [projectId]);

  const toggleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if card is a link
    e.stopPropagation();

    if (loading) return;
    setLoading(true);

    const prevLiked = liked;
    const prevCount = count;

    // Optimistic update
    setLiked(!prevLiked);
    setCount((c) => (prevLiked ? c - 1 : c + 1));

    try {
      const res = await fetch(`/api/projects/${projectId}/like`, {
        method: prevLiked ? "DELETE" : "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to toggle like");
      }

      const data = await res.json();
      setCount(data.likeCount);

      if (!prevLiked) {
        localStorage.setItem(`liked:${projectId}`, "true");
      } else {
        localStorage.removeItem(`liked:${projectId}`);
      }
    } catch (error) {
      console.error(error);
      // Revert optimistic update
      setLiked(prevLiked);
      setCount(prevCount);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className={cn(
        "group relative flex items-center justify-center gap-2 rounded-full px-3 py-1.5 transition-colors",
        "bg-white/10 dark:bg-black/20 hover:bg-white/20 dark:hover:bg-black/40 backdrop-blur-md",
        "border border-white/10",
        liked ? "text-red-500" : "text-gray-600 dark:text-gray-300",
        className
      )}
      aria-label={liked ? "Unlike project" : "Like project"}
    >
      <div className="relative">
        <Heart
          className={cn(
            "h-4 w-4 transition-transform group-hover:scale-110",
            liked ? "fill-current" : ""
          )}
        />
        <AnimatePresence>
          {liked && (
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute inset-0 bg-red-500 rounded-full"
            />
          )}
        </AnimatePresence>
      </div>
      <span className="text-sm font-medium">{count}</span>
    </button>
  );
}
