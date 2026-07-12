"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface MediaItem {
  id?: string;
  url: string;
  type: "IMAGE" | "VIDEO";
  alt?: string;
}

interface LightboxProps {
  items: MediaItem[];
  initialIndex?: number;
  onClose: () => void;
}

export function Lightbox({ items, initialIndex = 0, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const navigate = useCallback((direction: 1 | -1) => {
    setCurrentIndex((prev) => {
      let next = prev + direction;
      if (next < 0) next = items.length - 1;
      if (next >= items.length) next = 0;
      return next;
    });
  }, [items.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, onClose]);

  const currentItem = items[currentIndex];

  if (!items.length) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      >
        {/* Header / Close */}
        <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
          <div className="text-white/70 text-sm font-medium">
            {currentIndex + 1} / {items.length}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Arrows */}
        {items.length > 1 && (
          <>
            <button
              onClick={() => navigate(-1)}
              className="absolute left-4 p-3 text-white/50 hover:text-white bg-black/20 hover:bg-black/50 rounded-full transition-all z-10 hidden sm:block"
              aria-label="Previous"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={() => navigate(1)}
              className="absolute right-4 p-3 text-white/50 hover:text-white bg-black/20 hover:bg-black/50 rounded-full transition-all z-10 hidden sm:block"
              aria-label="Next"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        {/* Media Container */}
        <div 
          className="relative w-full h-[100dvh] flex items-center justify-center p-0 sm:p-12 md:p-20"
          onClick={onClose}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking media
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragEnd={(_, info) => {
                if (info.offset.x > 100) navigate(-1);
                if (info.offset.x < -100) navigate(1);
              }}
            >
              {currentItem.type === "IMAGE" ? (
                <div className="relative w-full h-full max-w-7xl max-h-full">
                  <Image
                    src={currentItem.url}
                    alt={currentItem.alt || "Gallery image"}
                    fill
                    className="object-contain"
                    quality={100}
                    sizes="100vw"
                    priority
                  />
                </div>
              ) : (
                <video
                  src={currentItem.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-full rounded-lg shadow-2xl"
                  playsInline
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
