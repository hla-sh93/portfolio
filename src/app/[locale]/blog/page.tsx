import { BlogCard } from "@/components/features/BlogCard";
import { getCounters } from "@/lib/counters";
import { CTABanner } from "@/components/sections/CTABanner";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("blog");
  return { title: t("heading") };
}

// Mock articles — will be replaced by Prisma DB calls
const mockArticles = [
  {
    id: "a1", slug: "building-with-nextjs-15", titleEn: "Building with Next.js 15", titleAr: "البناء باستخدام Next.js 15",
    excerptEn: "Exploring the new App Router features and server components in Next.js 15.",
    excerptAr: "استكشاف ميزات App Router الجديدة ومكونات الخادم في Next.js 15.",
    bodyEn: "", bodyAr: "", coverImage: "/images/placeholder.jpg",
    tags: ["Next.js", "React", "TypeScript"], readTime: 8, views: 1200,
    published: true, publishedAt: new Date("2024-05-20"),
    createdAt: new Date("2024-05-20"), updatedAt: new Date("2024-05-20"),
  },
  {
    id: "a2", slug: "glassmorphism-design-guide", titleEn: "Glassmorphism Design Guide", titleAr: "دليل تصميم الزجاج الشفاف",
    excerptEn: "A comprehensive guide to implementing glassmorphism in modern web design.",
    excerptAr: "دليل شامل لتنفيذ تأثير الزجاج الشفاف في تصميم الويب الحديث.",
    bodyEn: "", bodyAr: "", coverImage: "/images/placeholder.jpg",
    tags: ["Design", "CSS", "UI"], readTime: 5, views: 890,
    published: true, publishedAt: new Date("2024-04-15"),
    createdAt: new Date("2024-04-15"), updatedAt: new Date("2024-04-15"),
  },
  {
    id: "a3", slug: "tailwind-v4-whats-new", titleEn: "Tailwind CSS v4: What's New", titleAr: "Tailwind CSS v4: ما الجديد",
    excerptEn: "Breaking down the biggest changes and improvements in Tailwind CSS version 4.",
    excerptAr: "تحليل أكبر التغييرات والتحسينات في الإصدار الرابع من Tailwind CSS.",
    bodyEn: "", bodyAr: "", coverImage: "/images/placeholder.jpg",
    tags: ["Tailwind", "CSS", "Frontend"], readTime: 6, views: 650,
    published: true, publishedAt: new Date("2024-03-10"),
    createdAt: new Date("2024-03-10"), updatedAt: new Date("2024-03-10"),
  },
];

export default async function BlogPage() {
  const t = await getTranslations("blog");
  const counters = await getCounters("article");
  const articles = mockArticles.map((a) => ({ ...a, views: counters[a.slug]?.views ?? 0 }));

  return (
    <>
      <div className="mx-auto max-w-6xl px-6 lg:px-8 py-24 md:py-32">
        <header className="mb-16 md:mb-24 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-black text-text-primary mb-6">
            {t("heading")}
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed">
            {t("description")}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <BlogCard key={article.id} article={article} index={index} />
          ))}
        </div>
      </div>

      <CTABanner />
    </>
  );
}
