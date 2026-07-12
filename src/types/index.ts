import type { Project, Media, Article, Like, ContactMessage } from "@prisma/client";

export type ProjectWithMedia = Project & {
  media: Media[];
};

export type ProjectWithStats = Project & {
  media: Media[];
  likes: Like[];
  _count?: {
    likes: number;
  };
};

export type ArticleWithMeta = Article;

export type ContactMessageWithStatus = ContactMessage;

export type Locale = "en" | "ar";

export type Theme = "light" | "dark" | "system";

export type CategorySlug = "videos" | "graphic-design" | "uiux" | "websites";

export const categorySlugToEnum: Record<CategorySlug, string> = {
  videos: "VIDEOS",
  "graphic-design": "GRAPHIC_DESIGN",
  uiux: "UIUX",
  websites: "WEBSITES",
};

export const categoryEnumToSlug: Record<string, CategorySlug> = {
  VIDEOS: "videos",
  GRAPHIC_DESIGN: "graphic-design",
  UIUX: "uiux",
  WEBSITES: "websites",
};

export interface TimelineEntry {
  role: string;
  company: string;
  period: string;
  /** Already-localized description (preferred — from translation files) */
  desc?: string;
  descEn?: string;
  descAr?: string;
  current?: boolean;
}

export interface Stat {
  value: number;
  suffix?: string;
  labelKey: string;
}

export interface NavLink {
  href: string;
  key: string;
}
