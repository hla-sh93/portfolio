import { BlogCard } from "@/components/features/BlogCard";
import { CTABanner } from "@/components/sections/CTABanner";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Tag } from "lucide-react";
import { getTranslations } from "next-intl/server";

// Mock articles — will be replaced by Prisma DB calls
const mockArticles = [
  {
    id: "a1",
    slug: "building-with-nextjs-15",
    titleEn: "Building with Next.js 15",
    titleAr: "البناء باستخدام Next.js 15",
    excerptEn: "Exploring the new App Router features and server components in Next.js 15.",
    excerptAr: "استكشاف ميزات App Router الجديدة ومكونات الخادم في Next.js 15.",
    bodyEn: "",
    bodyAr: "",
    coverImage: "/images/placeholder.jpg",
    tags: ["Next.js", "React", "TypeScript"],
    readTime: 8,
    views: 1200,
    published: true,
    publishedAt: new Date("2024-05-20"),
    createdAt: new Date("2024-05-20"),
    updatedAt: new Date("2024-05-20"),
  },
  {
    id: "a2",
    slug: "glassmorphism-design-guide",
    titleEn: "Glassmorphism Design Guide",
    titleAr: "دليل تصميم الزجاج الشفاف",
    excerptEn: "A comprehensive guide to implementing glassmorphism in modern web design.",
    excerptAr: "دليل شامل لتنفيذ تأثير الزجاج الشفاف في تصميم الويب الحديث.",
    bodyEn: "",
    bodyAr: "",
    coverImage: "/images/placeholder.jpg",
    tags: ["Design", "CSS", "UI"],
    readTime: 5,
    views: 890,
    published: true,
    publishedAt: new Date("2024-04-15"),
    createdAt: new Date("2024-04-15"),
    updatedAt: new Date("2024-04-15"),
  },
  {
    id: "a3",
    slug: "tailwind-v4-whats-new",
    titleEn: "Tailwind CSS v4: What's New",
    titleAr: "Tailwind CSS v4: ما الجديد",
    excerptEn: "Breaking down the biggest changes and improvements in Tailwind CSS version 4.",
    excerptAr: "تحليل أكبر التغييرات والتحسينات في الإصدار الرابع من Tailwind CSS.",
    bodyEn: "",
    bodyAr: "",
    coverImage: "/images/placeholder.jpg",
    tags: ["Tailwind", "CSS", "Frontend"],
    readTime: 6,
    views: 650,
    published: true,
    publishedAt: new Date("2024-03-10"),
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-10"),
  },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string; tag: string }> }) {
  const { locale, tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const t = await getTranslations({ locale, namespace: "blog" });

  return {
    title: `${decodedTag} | ${t("heading")}`,
  };
}

export default async function BlogTagPage({ params }: { params: Promise<{ locale: string; tag: string }> }) {
  const { locale, tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const t = await getTranslations({ locale, namespace: "blog" });
  const isRtl = locale === "ar";

  // Filter mock articles by tag
  const articles = mockArticles.filter(
    (a) => a.published && a.tags.includes(decodedTag)
  );

  return (
    <>
      <div className="container mx-auto px-6 max-w-6xl py-24 md:py-32">
        <header className="mb-16 md:mb-24">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-text-tertiary hover:text-accent font-medium mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
            {isRtl ? "العودة للمدونة" : "Back to Blog"}
          </Link>

          <div className="flex items-center gap-4 mb-6 text-accent">
            <Tag className="w-8 h-8 md:w-10 md:h-10" />
            <h1 className="text-4xl md:text-5xl font-black text-text-primary">
              {decodedTag}
            </h1>
          </div>
          <p className="text-xl text-text-secondary">
            {articles.length} {isRtl ? "مقال" : articles.length === 1 ? "article" : "articles"}
          </p>
        </header>

        {articles.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-text-secondary">
              {isRtl ? "لا توجد مقالات لهذا الوسم" : "No articles found for this tag"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <BlogCard key={article.id} article={article} index={index} />
            ))}
          </div>
        )}
      </div>

      <CTABanner />
    </>
  );
}
