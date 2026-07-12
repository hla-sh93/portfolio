"use client";

import { BlogCard } from "@/components/features/BlogCard";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import type { ArticleWithMeta } from "@/types";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";

interface LatestBlogProps {
  articles: ArticleWithMeta[];
}

export function LatestBlog({ articles }: LatestBlogProps) {
  const t = useTranslations("home.blog");

  if (!articles || articles.length === 0) return null;

  return (
    <section className="py-20 md:py-28 relative bg-gray-50/50 dark:bg-white/[0.02]">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <span className="section-label mb-3">
              <span dir="ltr">05</span>
              {t("sectionTitle")}
            </span>
            <h3 className="mt-3 font-display text-3xl font-black text-text-primary md:text-5xl">
              {t("heading")}
            </h3>
          </div>
          
          <Button asChild variant="ghost" className="rounded-full hidden md:inline-flex">
            <Link href="/blog" className="group">
              <BookOpen className="w-4 h-4 mr-2" />
              {t("viewAll")}
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {articles.slice(0, 3).map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <BlogCard article={article} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center md:hidden"
        >
          <Button asChild variant="ghost" className="rounded-full w-full sm:w-auto">
            <Link href="/blog" className="group">
              <BookOpen className="w-4 h-4 mr-2" />
              {t("viewAll")}
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
