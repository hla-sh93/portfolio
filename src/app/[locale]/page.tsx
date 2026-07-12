import { Hero } from "@/components/sections/hero";
import { ToolsMarquee } from "@/components/sections/ToolsMarquee";
import { featuredProjects } from "@/content/projects";
import { AboutSnippet } from "@/components/sections/AboutSnippet";
import { Services } from "@/components/sections/Services";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Stats } from "@/components/sections/Stats";
import { LatestBlog } from "@/components/sections/LatestBlog";
import { CTABanner } from "@/components/sections/CTABanner";
import type { Stat } from "@/types";

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

// Real numbers from the CV (Zanqa Education Platform + career span)
const stats: Stat[] = [
  { value: 7, suffix: "+", labelKey: "yearsExperience" },
  { value: 94, suffix: "K+", labelKey: "usersReached" },
  { value: 50, suffix: "K+", labelKey: "appDownloads" },
  { value: 3, suffix: "K+", labelKey: "publishersServed" },
];

export default function Home() {
  return (
    <>
      <Hero />
      <ToolsMarquee />
      <AboutSnippet />
      <Services />
      <FeaturedProjects projects={featuredProjects} />
      <Stats stats={stats} />
      <LatestBlog articles={mockArticles} />
      <CTABanner />
    </>
  );
}
