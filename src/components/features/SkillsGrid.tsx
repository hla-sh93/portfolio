"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Heart, Languages, Monitor, Palette } from "lucide-react";
import { useTranslations } from "next-intl";

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  skills: string[];
  colorClass: string;
}

export function SkillsGrid() {
  const t = useTranslations("about.skills");

  // Every skill below is copied verbatim from the CV — nothing invented.
  const categories: SkillCategory[] = [
    {
      title: t("design"),
      icon: <Palette className="w-5 h-5" />,
      skills: [
        "Figma",
        "Adobe XD",
        "Photoshop",
        "Illustrator",
        "After Effects",
        "Premiere Pro",
      ],
      colorClass: "text-[var(--cat-uiux)] bg-[var(--cat-uiux-bg)] border-[var(--cat-uiux-border)]",
    },
    {
      title: t("frontend"),
      icon: <Monitor className="w-5 h-5" />,
      skills: [
        "HTML5",
        "CSS3",
        "JavaScript",
        "Bootstrap",
        "MUI",
        "React",
        "Next.js",
      ],
      colorClass: "text-[var(--cat-websites)] bg-[var(--cat-websites-bg)] border-[var(--cat-websites-border)]",
    },
    {
      title: t("soft"),
      icon: <Heart className="w-5 h-5" />,
      skills: [
        t("softSkills.leadership"),
        t("softSkills.strategic"),
        t("softSkills.problemSolving"),
        t("softSkills.communication"),
        t("softSkills.creativeVision"),
        t("softSkills.commitment"),
        t("softSkills.adaptability"),
      ],
      colorClass: "text-[var(--cat-graphic)] bg-[var(--cat-graphic-bg)] border-[var(--cat-graphic-border)]",
    },
    {
      title: t("languages"),
      icon: <Languages className="w-5 h-5" />,
      skills: [t("arabicNative"), t("englishProficient")],
      colorClass: "text-[var(--cat-videos)] bg-[var(--cat-videos-bg)] border-[var(--cat-videos-border)]",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {categories.map((category, idx) => (
        <motion.div key={idx} variants={itemVariants}>
          <GlassCard hover className="h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className={cn("p-2.5 rounded-xl border", category.colorClass)}>
                {category.icon}
              </div>
              <h3 className="text-xl font-bold text-text-primary">{category.title}</h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="px-3 py-1.5 text-sm rounded-lg bg-glass-bg border border-border text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary hover:border-text-tertiary"
                >
                  {skill}
                </span>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </motion.div>
  );
}
