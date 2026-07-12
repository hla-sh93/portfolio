"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Link } from "@/i18n/navigation";
import type { ArticleWithMeta } from "@/types";
import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

interface BlogCardProps {
  article: ArticleWithMeta;
  index?: number;
}

export function BlogCard({ article, index = 0 }: BlogCardProps) {
  const locale = useLocale();
  const t = useTranslations("blog");
  const isRtl = locale === "ar";

  const title = isRtl ? article.titleAr : article.titleEn;
  const excerpt = isRtl ? article.excerptAr : article.excerptEn;
  
  const dateLocale = isRtl ? arSA : enUS;
  const publishDate = article.publishedAt 
    ? format(new Date(article.publishedAt), "MMMM d, yyyy", { locale: dateLocale })
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/blog/${article.slug}`} className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-2xl group">
        <GlassCard hover padding="none" className="h-full flex flex-col overflow-hidden relative">
          {/* Default hover glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Cover Image */}
          {article.coverImage && (
            <div className="relative w-full aspect-[2/1] overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
              <Image
                src={article.coverImage}
                alt={title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6 flex flex-col flex-1 relative z-10">
            {/* Meta Tags */}
            <div className="flex flex-wrap gap-4 mb-4 text-xs font-medium text-text-tertiary">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{publishDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readTime} {t("minRead")}</span>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-3 text-text-primary line-clamp-2 group-hover:text-accent transition-colors">
              {title}
            </h3>
            
            {excerpt && (
              <p className="text-sm text-text-secondary line-clamp-3 mb-6 leading-relaxed">
                {excerpt}
              </p>
            )}

            <div className="mt-auto pt-4 border-t border-border flex flex-wrap gap-2">
              {article.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-[10px] uppercase tracking-wider font-semibold rounded bg-glass-bg border border-border text-text-secondary"
                >
                  {tag}
                </span>
              ))}
              {article.tags.length > 3 && (
                <span className="px-2 py-1 text-[10px] uppercase font-semibold text-text-tertiary">
                  +{article.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}
