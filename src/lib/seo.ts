import type { Metadata } from "next";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "https://example.com";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Portfolio";
const AUTHOR_NAME = process.env.NEXT_PUBLIC_AUTHOR_NAME ?? "Portfolio Owner";
const AUTHOR_TWITTER = process.env.NEXT_PUBLIC_TWITTER_HANDLE ?? "@handle";
const DEFAULT_OG_IMAGE = `${APP_URL}/og-default.png`;

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

/**
 * Truncates a string to a maximum length, appending an ellipsis if needed.
 *
 * @param text    - The string to truncate.
 * @param maxLen  - Maximum number of characters (default: 160).
 * @returns The truncated string.
 */
export function truncate(text: string, maxLen = 160): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLen) return cleaned;
  return `${cleaned.slice(0, maxLen - 1).trimEnd()}…`;
}

/**
 * Strips Markdown/MDX syntax from a string to produce plain text suitable
 * for meta descriptions.
 */
function stripMarkdown(text: string): string {
  return text
    .replace(/!\[.*?\]\(.*?\)/g, "") // images
    .replace(/\[([^\]]+)\]\(.*?\)/g, "$1") // links → label only
    .replace(/`{1,3}[^`]*`{1,3}/g, "") // inline code and code fences
    .replace(/#{1,6}\s+/g, "") // headings
    .replace(/[*_~]{1,3}([^*_~]+)[*_~]{1,3}/g, "$1") // bold, italic, strike
    .replace(/>\s+/g, "") // blockquotes
    .replace(/\n{2,}/g, " ") // paragraph breaks → space
    .replace(/\n/g, " ")
    .trim();
}

// ---------------------------------------------------------------------------
// Core metadata builder
// ---------------------------------------------------------------------------

export interface SEOMetadataOptions {
  title: string;
  description?: string;
  /** Canonical path, e.g. "/en/projects/my-project". */
  canonicalPath?: string;
  /** Absolute URL to the Open Graph image. Defaults to the site default. */
  ogImage?: string;
  ogType?: "website" | "article" | "profile";
  /** Published date for articles (ISO string or Date). */
  publishedAt?: string | Date;
  /** Last-modified date (ISO string or Date). */
  updatedAt?: string | Date;
  /** Comma-separated keywords or an array. */
  keywords?: string | string[];
  noIndex?: boolean;
  locale?: string;
  alternateLocales?: Record<string, string>;
}

/**
 * Generates a Next.js `Metadata` object ready to be exported from a
 * `page.tsx` or `layout.tsx` file.
 */
export function getSEOMetadata(options: SEOMetadataOptions): Metadata {
  const {
    title,
    description = "",
    canonicalPath,
    ogImage = DEFAULT_OG_IMAGE,
    ogType = "website",
    publishedAt,
    updatedAt,
    keywords,
    noIndex = false,
    locale = "en",
    alternateLocales,
  } = options;

  const canonical = canonicalPath
    ? `${APP_URL}${canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`}`
    : APP_URL;

  const metaDescription = truncate(stripMarkdown(description), 160);
  const keywordsArray = Array.isArray(keywords)
    ? keywords
    : keywords
      ? keywords.split(",").map((k) => k.trim())
      : [];

  const openGraphArticle =
    ogType === "article"
      ? {
          publishedTime: publishedAt
            ? new Date(publishedAt).toISOString()
            : undefined,
          modifiedTime: updatedAt
            ? new Date(updatedAt).toISOString()
            : undefined,
          authors: [AUTHOR_NAME],
        }
      : {};

  const languages: Record<string, string> = {};
  if (alternateLocales) {
    for (const [lang, path] of Object.entries(alternateLocales)) {
      languages[lang] = `${APP_URL}${path}`;
    }
  }

  return {
    title: {
      default: `${title} | ${SITE_NAME}`,
      template: `%s | ${SITE_NAME}`,
    },
    description: metaDescription || undefined,
    keywords: keywordsArray.length > 0 ? keywordsArray : undefined,
    authors: [{ name: AUTHOR_NAME, url: APP_URL }],
    creator: AUTHOR_NAME,
    metadataBase: new URL(APP_URL),
    alternates: {
      canonical,
      languages: Object.keys(languages).length > 0 ? languages : undefined,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description: metaDescription || undefined,
      url: canonical,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale,
      type: ogType,
      ...openGraphArticle,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description: metaDescription || undefined,
      images: [ogImage],
      creator: AUTHOR_TWITTER,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

// ---------------------------------------------------------------------------
// JSON-LD schema builders
// ---------------------------------------------------------------------------

/**
 * JSON-LD Person schema for the portfolio owner / about page.
 */
export interface PersonSchemaOptions {
  name: string;
  url?: string;
  jobTitle?: string;
  description?: string;
  image?: string;
  sameAs?: string[];
  email?: string;
}

export function getPersonSchema(options: PersonSchemaOptions): string {
  const {
    name,
    url = APP_URL,
    jobTitle,
    description,
    image,
    sameAs = [],
    email,
  } = options;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url,
    ...(jobTitle && { jobTitle }),
    ...(description && { description }),
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: image,
      },
    }),
    ...(email && { email }),
    ...(sameAs.length > 0 && { sameAs }),
  };

  return JSON.stringify(schema);
}

/**
 * JSON-LD Article schema for blog / article pages.
 */
export interface ArticleSchemaOptions {
  title: string;
  description?: string;
  url: string;
  image?: string;
  publishedAt?: string | Date;
  updatedAt?: string | Date;
  authorName?: string;
  tags?: string[];
}

export function getArticleSchema(options: ArticleSchemaOptions): string {
  const {
    title,
    description,
    url,
    image,
    publishedAt,
    updatedAt,
    authorName = AUTHOR_NAME,
    tags = [],
  } = options;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: truncate(title, 110),
    ...(description && { description: truncate(description, 300) }),
    url,
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: image,
      },
    }),
    ...(publishedAt && {
      datePublished: new Date(publishedAt).toISOString(),
    }),
    ...(updatedAt && {
      dateModified: new Date(updatedAt).toISOString(),
    }),
    author: {
      "@type": "Person",
      name: authorName,
      url: APP_URL,
    },
    publisher: {
      "@type": "Person",
      name: authorName,
      url: APP_URL,
    },
    ...(tags.length > 0 && { keywords: tags.join(", ") }),
    inLanguage: "en",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return JSON.stringify(schema);
}

/**
 * JSON-LD CreativeWork schema for portfolio project pages.
 */
export interface CreativeWorkSchemaOptions {
  title: string;
  description?: string;
  url: string;
  image?: string;
  creatorName?: string;
  dateCreated?: string | Date;
  datePublished?: string | Date;
  keywords?: string[];
  category?: string;
  tools?: string[];
}

export function getCreativeWorkSchema(options: CreativeWorkSchemaOptions): string {
  const {
    title,
    description,
    url,
    image,
    creatorName = AUTHOR_NAME,
    dateCreated,
    datePublished,
    keywords = [],
    category,
    tools = [],
  } = options;

  const allKeywords = [
    ...keywords,
    ...tools,
    ...(category ? [category] : []),
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    ...(description && { description: truncate(description, 300) }),
    url,
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: image,
      },
    }),
    creator: {
      "@type": "Person",
      name: creatorName,
      url: APP_URL,
    },
    ...(dateCreated && {
      dateCreated: new Date(dateCreated).toISOString(),
    }),
    ...(datePublished && {
      datePublished: new Date(datePublished).toISOString(),
    }),
    ...(allKeywords.length > 0 && { keywords: allKeywords.join(", ") }),
    ...(tools.length > 0 && {
      instrument: tools.map((tool) => ({
        "@type": "HowToTool",
        name: tool,
      })),
    }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return JSON.stringify(schema);
}

/**
 * JSON-LD WebSite schema for the root layout.
 */
export function getWebSiteSchema(): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: APP_URL,
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${APP_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return JSON.stringify(schema);
}
