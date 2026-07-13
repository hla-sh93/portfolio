"use client";

import { Lightbox } from "@/components/features/Lightbox";
import certificates from "@/content/certificates.json";
import { motion } from "framer-motion";
import { Award, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Certificate {
  url: string;
  width: number;
  height: number;
  blurDataUrl: string;
  issuer: string | null;
  title: string;
}

const items = certificates as Certificate[];

/* Grid of certificate images (Udemy, Coursera, …) — studio cards with a
   zoom-to-Lightbox interaction. Renders nothing until certificates are
   imported via scripts/import-certificates.mjs. */
export function CertificatesGrid() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (items.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((cert, index) => (
          <motion.button
            key={cert.url}
            type="button"
            onClick={() => setLightboxIndex(index)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              delay: (index % 3) * 0.07,
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="card-studio spotlight group cursor-zoom-in overflow-hidden p-3 text-start"
            aria-label={cert.title}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface">
              <Image
                src={cert.url}
                alt={cert.title}
                fill
                className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL={cert.blurDataUrl}
              />
              {/* zoom hint */}
              <span className="absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                <ZoomIn size={16} />
              </span>
            </div>

            <div className="flex items-center gap-2.5 px-2 pb-1.5 pt-3.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-light text-accent">
                <Award size={15} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-text-primary">
                  {cert.title}
                </span>
                {cert.issuer && (
                  <span
                    dir="ltr"
                    className="block text-xs font-semibold text-text-tertiary"
                  >
                    {cert.issuer}
                  </span>
                )}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          items={items.map((c) => ({
            url: c.url,
            type: "IMAGE" as const,
            alt: c.title,
          }))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
