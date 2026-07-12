import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create Admin User
  const passwordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@example.com",
      password: passwordHash,
      role: "ADMIN",
    },
  });

  console.log("Admin user created:", admin.email);

  // 2. Create Dummy Projects
  const project1 = await prisma.project.upsert({
    where: { slug: "fintech-dashboard" },
    update: {},
    create: {
      slug: "fintech-dashboard",
      titleEn: "FinTech Dashboard",
      titleAr: "لوحة تحكم التقنية المالية",
      descEn: "A modern analytics dashboard for a fintech startup.",
      descAr: "لوحة تحكم حديثة للتحليلات لشركة ناشئة في مجال التقنية المالية.",
      category: "WEBSITES",
      tags: ["React", "Tailwind CLS", "FinTech"],
      tools: ["Next.js", "TypeScript", "Recharts"],
      coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000",
      featured: true,
      published: true,
      publishedAt: new Date(),
    },
  });

  const project2 = await prisma.project.upsert({
    where: { slug: "brand-identity" },
    update: {},
    create: {
      slug: "brand-identity",
      titleEn: "Modern Brand Identity",
      titleAr: "هوية علامة تجارية حديثة",
      descEn: "A complete brand redesign for an eco-friendly product line.",
      descAr: "إعادة تصميم كاملة لعلامة تجارية لخط إنتاج صديق للبيئة.",
      category: "GRAPHIC_DESIGN",
      tags: ["Branding", "Logo", "Print"],
      tools: ["Illustrator", "Photoshop", "Indesign"],
      coverImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=2000",
      featured: true,
      published: true,
      publishedAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
    },
  });

  console.log("Demo projects created.");

  // 3. Create Dummy Articles
  const article1 = await prisma.article.upsert({
    where: { slug: "mastering-framer-motion" },
    update: {},
    create: {
      slug: "mastering-framer-motion",
      titleEn: "Mastering Framer Motion in Next.js",
      titleAr: "مائة طريقة لإتقان Framer Motion في Next.js",
      excerptEn: "Learn how to build complex, performant animations in React using Framer Motion.",
      excerptAr: "تعلم كيفية بناء حركات معقدة وعالية الأداء في React باستخدام Framer Motion.",
      bodyEn: "Framer Motion is a production-ready motion library for React. In this article, we'll explore the basics of animation, gestures, and layout transitions.",
      bodyAr: "Framer Motion هي مكتبة حركات جاهزة للإنتاج لـ React. في هذه المقالة، سنستكشف أساسيات الحركة والإيماءات والانتقالات في التخطيط.",
      coverImage: "https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&q=80&w=2000",
      tags: ["React", "Animation", "Tutorial"],
      readTime: 5,
      published: true,
      publishedAt: new Date(),
    },
  });

  console.log("Demo articles created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
