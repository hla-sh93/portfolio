"use client";

import { Badge } from "@/components/ui/Badge";
import type { TimelineEntry } from "@/types";
import { motion, useScroll, useSpring } from "framer-motion";
import { Briefcase } from "lucide-react";
import { useLocale } from "next-intl";
import { useRef } from "react";

interface TimelineProps {
  entries: TimelineEntry[];
}

/* Single-rail studio timeline: a wine progress line on the start side,
   dot markers, and hairline cards. Identical logic in RTL and LTR —
   no alternating columns to break. */
export function Timeline({ entries }: TimelineProps) {
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const isRtl = locale === "ar";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.75", "end 0.6"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div ref={containerRef} className="relative">
      {/* Rail */}
      <div className="absolute bottom-4 start-[7px] top-2 w-px bg-border">
        <motion.div
          className="w-full origin-top bg-accent"
          style={{ scaleY, height: "100%" }}
        />
      </div>

      <ol className="space-y-8">
        {entries.map((entry, index) => {
          const description =
            entry.desc ?? (isRtl ? entry.descAr : entry.descEn);
          return (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative ps-10"
            >
              {/* Marker */}
              <span
                className={
                  "absolute start-0 top-7 flex h-[15px] w-[15px] items-center justify-center rounded-full border-2 " +
                  (entry.current
                    ? "border-accent bg-accent/20"
                    : "border-border-strong bg-surface")
                }
              >
                {entry.current && (
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                )}
              </span>

              <div className="card-studio spotlight p-6 md:p-7">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-black text-text-primary md:text-xl">
                    {entry.role}
                  </h3>
                  {entry.current && (
                    <Badge
                      variant="solid"
                      className="border-0 bg-accent py-0.5 text-white"
                    >
                      {isRtl ? "الحالي" : "Current"}
                    </Badge>
                  )}
                </div>

                <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold">
                  <span className="inline-flex items-center gap-1.5 text-accent">
                    <Briefcase className="h-3.5 w-3.5" />
                    {entry.company}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-border-strong" />
                  <span className="text-text-tertiary">{entry.period}</span>
                </div>

                <p className="text-sm leading-relaxed text-text-secondary md:text-[15px]">
                  {description}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
