import { ReadingProgress } from "@/components/features/ReadingProgress";
import { TableOfContents } from "@/components/features/TableOfContents";
import { ViewTracker } from "@/components/features/ViewTracker";
import { CTABanner } from "@/components/sections/CTABanner";
import { Link } from "@/i18n/navigation";
import { getCounters } from "@/lib/counters";
import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { ArrowLeft, Calendar, Clock, Eye } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";

// Mock articles — will be replaced by Prisma DB calls
const mockArticles = [
  {
    id: "a1",
    slug: "building-with-nextjs-15",
    titleEn: "Building with Next.js 15",
    titleAr: "البناء باستخدام Next.js 15",
    excerptEn: "Exploring the new App Router features and server components in Next.js 15.",
    excerptAr: "استكشاف ميزات App Router الجديدة ومكونات الخادم في Next.js 15.",
    bodyEn: `## Introduction

Next.js 15 introduces several groundbreaking features that revolutionize the way we build web applications. From enhanced server components to improved routing capabilities, this version marks a significant step forward.

## The App Router

The App Router is one of the most significant additions. It provides a new paradigm for building applications with React Server Components at its core.

### Key Features

- **Server Components by Default**: Components are server-rendered unless explicitly marked as client components.
- **Nested Layouts**: Share UI between routes while preserving state.
- **Loading States**: Built-in loading UI with React Suspense.
- **Error Handling**: Automatic error boundaries for graceful error recovery.

## Server Components

Server Components allow you to render components on the server, reducing the JavaScript bundle sent to the client.

### Benefits

1. Reduced bundle size
2. Direct backend access
3. Improved SEO
4. Better performance on low-powered devices

## Conclusion

Next.js 15 represents a major leap forward in web development. The combination of Server Components, the App Router, and improved caching makes it an excellent choice for modern web applications.`,
    bodyAr: `## مقدمة

يقدم Next.js 15 العديد من الميزات الرائدة التي تحدث ثورة في طريقة بناء تطبيقات الويب.

## موجه التطبيق

موجه التطبيق هو أحد أهم الإضافات. يوفر نموذجًا جديدًا لبناء التطبيقات.

## الخلاصة

يمثل Next.js 15 قفزة كبيرة في تطوير الويب.`,
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
    bodyEn: `## What is Glassmorphism?

Glassmorphism is a design trend that creates a frosted glass effect using background blur, transparency, and subtle borders.

## Key Properties

The three main CSS properties that define glassmorphism:

- **backdrop-filter**: Creates the blur effect behind the element
- **background**: Semi-transparent background color
- **border**: Subtle border for depth perception

## Implementation

Here's how to implement a basic glass card effect in your CSS.

## Best Practices

1. Use appropriate contrast for readability
2. Don't overuse the effect
3. Consider performance implications
4. Test across different backgrounds

## Conclusion

Glassmorphism adds a modern, elegant touch to web designs when used thoughtfully.`,
    bodyAr: `## ما هو تأثير الزجاج الشفاف؟

تأثير الزجاج الشفاف هو اتجاه تصميمي يخلق تأثير الزجاج المصنفر.

## الخصائص الرئيسية

الخصائص الثلاث الرئيسية التي تحدد التأثير.

## الخلاصة

يضيف تأثير الزجاج الشفاف لمسة عصرية وأنيقة للتصاميم.`,
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
    bodyEn: `## Overview

Tailwind CSS v4 brings a complete rewrite of the engine with significant performance improvements and new features.

## New Features

### CSS-First Configuration

Tailwind v4 introduces a CSS-first configuration approach, moving away from JavaScript config files.

### Lightning CSS

The new engine is built on Lightning CSS, providing much faster build times.

### Automatic Content Detection

No more configuring content paths manually — Tailwind v4 automatically detects your template files.

## Performance

Build times have improved dramatically with the new architecture.

## Conclusion

Tailwind CSS v4 is a major upgrade that makes the framework faster and easier to use.`,
    bodyAr: `## نظرة عامة

يجلب Tailwind CSS v4 إعادة كتابة كاملة للمحرك مع تحسينات كبيرة في الأداء.

## الخلاصة

Tailwind CSS v4 ترقية كبيرة تجعل الإطار أسرع وأسهل استخدامًا.`,
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

function getArticleBySlug(slug: string) {
  return mockArticles.find((a) => a.slug === slug) || null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const article = getArticleBySlug(slug);

  if (!article) return { title: "Not Found" };

  const title = locale === "ar" ? article.titleAr : article.titleEn;
  const excerpt = locale === "ar" ? article.excerptAr : article.excerptEn;

  return {
    title: `${title} | Blog`,
    description: excerpt?.slice(0, 160) || "",
    openGraph: {
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(title)}&type=article`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const t = await getTranslations("blog");
  const isRtl = locale === "ar";

  const article = getArticleBySlug(slug);

  if (!article || !article.published) {
    notFound();
  }

  const title = isRtl ? article.titleAr : article.titleEn;
  const body = isRtl ? article.bodyAr : article.bodyEn;

  const dateLocale = isRtl ? arSA : enUS;
  const publishDate = article.publishedAt
    ? format(new Date(article.publishedAt), "MMMM d, yyyy", { locale: dateLocale })
    : "";

  const counters = await getCounters("article");
  const views = counters[article.slug]?.views ?? 0;

  return (
    <>
      <ViewTracker type="article" slug={article.slug} />
      <ReadingProgress />

      <article className="min-h-screen pt-24 pb-16 md:pb-24">
        {/* Article Header */}
        <header className="container mx-auto px-6 max-w-4xl mb-12 md:mb-20 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-text-tertiary hover:text-accent font-medium mb-10 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
            {isRtl ? "العودة للمدونة" : "Back to Blog"}
          </Link>

          <div className="flex flex-wrap justify-center items-center gap-6 mb-8 text-sm font-medium text-text-secondary">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" />
              <time dateTime={article.publishedAt?.toISOString()}>{publishDate}</time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              <span>{article.readTime} {t("minRead")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-accent" />
              <span className="tabular-nums">{views.toLocaleString()}</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary leading-tight mb-8">
            {title}
          </h1>

          <div className="flex flex-wrap justify-center gap-2">
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag}`}
                className="px-3 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-lg bg-accent/10 text-accent transition-colors hover:bg-accent hover:text-white"
              >
                {tag}
              </Link>
            ))}
          </div>
        </header>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="container mx-auto px-6 max-w-5xl mb-16 md:mb-24">
            <div className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-2xl">
              <Image
                src={article.coverImage}
                alt={title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </div>
        )}

        {/* Content with Sidebar TOC */}
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col xl:flex-row gap-16 relative">
            <div className="w-full xl:w-[calc(100%-20rem)] shrink-0">
              <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-text-primary prose-a:text-accent hover:prose-a:text-accent-hover prose-img:rounded-2xl">
                {/* Render plain text content since MDXRemote requires actual MDX compilation setup */}
                {body.split("\n").map((line, i) => {
                  if (line.startsWith("## ")) {
                    return <h2 key={i} id={line.slice(3).toLowerCase().replace(/\s+/g, "-")}>{line.slice(3)}</h2>;
                  }
                  if (line.startsWith("### ")) {
                    return <h3 key={i} id={line.slice(4).toLowerCase().replace(/\s+/g, "-")}>{line.slice(4)}</h3>;
                  }
                  if (line.startsWith("- **")) {
                    const match = line.match(/- \*\*(.+?)\*\*:?\s*(.*)/);
                    if (match) {
                      return <li key={i}><strong>{match[1]}</strong>{match[2] ? `: ${match[2]}` : ""}</li>;
                    }
                  }
                  if (line.startsWith("- ")) {
                    return <li key={i}>{line.slice(2)}</li>;
                  }
                  if (/^\d+\.\s/.test(line)) {
                    return <li key={i}>{line.replace(/^\d+\.\s/, "")}</li>;
                  }
                  if (line.trim() === "") return null;
                  return <p key={i}>{line}</p>;
                })}
              </div>
            </div>

            <TableOfContents />
          </div>
        </div>
      </article>

      <CTABanner />
    </>
  );
}
