"use client";

import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import type { TimelineEntry } from "@/types";
import { motion, useScroll, useSpring } from "framer-motion";
import { Briefcase } from "lucide-react";
import { useLocale } from "next-intl";
import { useRef } from "react";

interface TimelineProps {
  entries: TimelineEntry[];
}

export function Timeline({ entries }: TimelineProps) {
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const isRtl = locale === "ar";

  return (
    <div className="relative py-12" ref={containerRef}>
      {/* Central Line - Desktop Only */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border transform -translate-x-1/2">
        <motion.div
          className="w-full bg-accent origin-top"
          style={{ scaleY, height: "100%" }}
        />
      </div>

      {/* Edge Line - Mobile Only */}
      <div className={cn(
        "block md:hidden absolute top-0 bottom-0 w-0.5 bg-border",
        isRtl ? "right-6" : "left-6"
      )}>
        <motion.div
          className="w-full bg-accent origin-top"
          style={{ scaleY, height: "100%" }}
        />
      </div>

      <div className="space-y-12">
        {entries.map((entry, index) => {
          const isEven = index % 2 === 0;
          const description =
            entry.desc ?? (isRtl ? entry.descAr : entry.descEn);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={cn(
                "relative flex items-center md:justify-between",
                isRtl ? "md:flex-row-reverse" : "md:flex-row"
              )}
            >
              {/* Desktop Empty Spacer */}
              <div className="hidden md:block w-5/12" />

              {/* Icon Marker */}
              <div className={cn(
                "absolute flex items-center justify-center w-8 h-8 rounded-full border-4 border-bg-base bg-glass-bg z-10 shadow-sm transition-colors",
                entry.current ? "border-accent bg-accent/20" : "",
                "md:left-1/2 md:-translate-x-1/2",
                isRtl ? "right-2 mobile-marker-rtl" : "left-2 mobile-marker-ltr"
              )}>
                <Briefcase className={cn(
                  "w-3.5 h-3.5",
                  entry.current ? "text-accent" : "text-text-tertiary"
                )} />
              </div>

              {/* Content Card */}
              <div className={cn(
                "w-full md:w-5/12 z-20",
                "pl-14 md:pl-0 pr-0",
                isRtl && "pr-14 md:pr-0 pl-0",
                // Push right column logic
                !isEven && !isRtl && "md:pl-0 md:ml-auto",
                !isEven && isRtl && "md:pr-0 md:mr-auto",
                // Push left column logic
                isEven && !isRtl && "md:pr-8",
                isEven && isRtl && "md:pl-8",
              )}>
                <GlassCard hover className="relative p-6 group">
                  {/* Internal connecting line logic for desktop */}
                  <div className={cn(
                    "hidden md:block absolute top-6 w-8 h-0.5 bg-border transition-colors group-hover:bg-accent/40",
                    isEven && !isRtl ? "-right-8" : "",
                    !isEven && !isRtl ? "-left-8" : "",
                    isEven && isRtl ? "-left-8" : "",
                    !isEven && isRtl ? "-right-8" : ""
                  )} />

                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h3 className="text-lg font-bold text-text-primary">
                      {entry.role}
                    </h3>
                    {entry.current && (
                      <Badge variant="solid" className="bg-accent text-white border-0 py-0.5">
                        {isRtl ? "الحالي" : "Current"}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="mb-4 text-sm font-medium text-text-secondary flex items-center gap-2">
                    <span className="text-accent">{entry.company}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>{entry.period}</span>
                  </div>
                  
                  <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                    {description}
                  </p>
                </GlassCard>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
