"use client";

import type { Media } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Lightbox } from "./Lightbox";

interface MediaGalleryProps {
  media: Media[];
}

export function MediaGallery({ media }: MediaGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!media || media.length === 0) return null;

  // Adapt Prisma Media to Lightbox MediaItem
  const lightboxItems = media.sort((a, b) => a.order - b.order).map((m) => ({
    id: m.id,
    url: m.url,
    type: m.type as "IMAGE" | "VIDEO",
    alt: m.altEn || "Gallery media",
  }));

  // Layout algorithm: 
  // 1 item -> full width
  // 2 items -> 50/50
  // 3+ items -> First item full, rest in a grid
  
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {media.map((item, index) => {
          const isFirstOfMany = media.length >= 3 && index === 0;
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-2xl cursor-zoom-in group ${
                isFirstOfMany ? "sm:col-span-2 lg:col-span-3 aspect-[21/9]" : "aspect-[4/3]"
              } bg-gray-100 dark:bg-gray-800`}
              onClick={() => setLightboxIndex(index)}
            >
              {item.type === "IMAGE" ? (
                <Image
                  src={item.url}
                  alt={item.altEn || ""}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes={isFirstOfMany ? "100vw" : "(max-width: 768px) 100vw, 33vw"}
                  priority={index < 2}
                />
              ) : (
                <div className="relative w-full h-full bg-black">
                  <video
                    src={item.url}
                    className="w-full h-full object-cover opacity-80"
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => {
                      const v = e.target as HTMLVideoElement;
                      v.play().catch(() => {});
                    }}
                    onMouseLeave={(e) => {
                      const v = e.target as HTMLVideoElement;
                      v.pause();
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 text-white transition-transform group-hover:scale-110">
                      <Play className="w-5 h-5 ml-1 fill-current" />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            items={lightboxItems}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
