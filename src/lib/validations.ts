import { z } from "zod";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ---------------------------------------------------------------------------
// Contact schema
// ---------------------------------------------------------------------------

export const ContactSubject = {
  PROJECT_INQUIRY: "PROJECT_INQUIRY",
  COLLABORATION: "COLLABORATION",
  GENERAL: "GENERAL",
} as const;

export type ContactSubjectValue =
  (typeof ContactSubject)[keyof typeof ContactSubject];

export const contactSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .trim(),

  email: z
    .string({ error: "Email is required" })
    .email("Please enter a valid email address")
    .max(254, "Email is too long")
    .toLowerCase()
    .trim(),

  subject: z.enum(
    [
      ContactSubject.PROJECT_INQUIRY,
      ContactSubject.COLLABORATION,
      ContactSubject.GENERAL,
    ],
    {
      error: "Subject must be one of: Project Inquiry, Collaboration, General",
    },
  ),

  message: z
    .string({ error: "Message is required" })
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be at most 5000 characters")
    .trim(),

  /** Honeypot field — must remain empty. Bot submissions are silently discarded. */
  website: z
    .string()
    .max(0, "Bot detected")
    .optional(),

  recaptchaToken: z
    .string({ error: "reCAPTCHA token is required" })
    .min(1, "reCAPTCHA token is required"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// ---------------------------------------------------------------------------
// Project schema
// ---------------------------------------------------------------------------

export const ProjectCategory = {
  VIDEOS: "VIDEOS",
  GRAPHIC_DESIGN: "GRAPHIC_DESIGN",
  UIUX: "UIUX",
  WEBSITES: "WEBSITES",
} as const;

export type ProjectCategoryValue =
  (typeof ProjectCategory)[keyof typeof ProjectCategory];

export const projectSchema = z.object({
  slug: z
    .string({ error: "Slug is required" })
    .min(1, "Slug is required")
    .max(120, "Slug must be at most 120 characters")
    .regex(slugRegex, "Slug must be lowercase letters, numbers, and hyphens only"),

  titleEn: z
    .string({ error: "English title is required" })
    .min(1, "English title is required")
    .max(200, "English title must be at most 200 characters")
    .trim(),

  titleAr: z
    .string({ error: "Arabic title is required" })
    .min(1, "Arabic title is required")
    .max(200, "Arabic title must be at most 200 characters")
    .trim(),

  descEn: z
    .string({ error: "English description is required" })
    .min(1, "English description is required")
    .max(10000, "English description is too long")
    .trim(),

  descAr: z
    .string({ error: "Arabic description is required" })
    .min(1, "Arabic description is required")
    .max(10000, "Arabic description is too long")
    .trim(),

  bodyEn: z
    .string()
    .max(100000, "English body is too long")
    .trim()
    .optional()
    .nullable(),

  bodyAr: z
    .string()
    .max(100000, "Arabic body is too long")
    .trim()
    .optional()
    .nullable(),

  category: z.enum(
    [
      ProjectCategory.VIDEOS,
      ProjectCategory.GRAPHIC_DESIGN,
      ProjectCategory.UIUX,
      ProjectCategory.WEBSITES,
    ],
    {
      error: "Invalid category",
    },
  ),

  tags: z
    .array(z.string().min(1).max(50).trim())
    .max(20, "You can add at most 20 tags")
    .default([]),

  tools: z
    .array(z.string().min(1).max(50).trim())
    .max(30, "You can add at most 30 tools")
    .default([]),

  coverImage: z
    .string({ error: "Cover image is required" })
    .url("Cover image must be a valid URL"),

  blurDataUrl: z.string().optional().nullable(),

  client: z
    .string()
    .max(200, "Client name must be at most 200 characters")
    .trim()
    .optional()
    .nullable(),

  role: z
    .string()
    .max(200, "Role must be at most 200 characters")
    .trim()
    .optional()
    .nullable(),

  year: z
    .number()
    .int("Year must be an integer")
    .min(2000, "Year must be 2000 or later")
    .max(new Date().getFullYear() + 1, "Year is too far in the future")
    .optional()
    .nullable(),

  featured: z.boolean().default(false),

  published: z.boolean().default(false),

  publishedAt: z.coerce.date().optional().nullable(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

// ---------------------------------------------------------------------------
// Article schema
// ---------------------------------------------------------------------------

export const articleSchema = z.object({
  slug: z
    .string({ error: "Slug is required" })
    .min(1, "Slug is required")
    .max(120, "Slug must be at most 120 characters")
    .regex(slugRegex, "Slug must be lowercase letters, numbers, and hyphens only"),

  titleEn: z
    .string({ error: "English title is required" })
    .min(1, "English title is required")
    .max(200, "English title must be at most 200 characters")
    .trim(),

  titleAr: z
    .string({ error: "Arabic title is required" })
    .min(1, "Arabic title is required")
    .max(200, "Arabic title must be at most 200 characters")
    .trim(),

  excerptEn: z
    .string()
    .max(500, "English excerpt must be at most 500 characters")
    .trim()
    .optional()
    .nullable(),

  excerptAr: z
    .string()
    .max(500, "Arabic excerpt must be at most 500 characters")
    .trim()
    .optional()
    .nullable(),

  bodyEn: z
    .string({ error: "English body is required" })
    .min(1, "English body is required")
    .max(200000, "English body is too long")
    .trim(),

  bodyAr: z
    .string({ error: "Arabic body is required" })
    .min(1, "Arabic body is required")
    .max(200000, "Arabic body is too long")
    .trim(),

  coverImage: z
    .string()
    .url("Cover image must be a valid URL")
    .optional()
    .nullable(),

  tags: z
    .array(z.string().min(1).max(50).trim())
    .max(20, "You can add at most 20 tags")
    .default([]),

  readTime: z
    .number()
    .int("Read time must be an integer")
    .min(0)
    .default(0),

  published: z.boolean().default(false),

  publishedAt: z.coerce.date().optional().nullable(),
});

export type ArticleFormData = z.infer<typeof articleSchema>;

// ---------------------------------------------------------------------------
// Login schema
// ---------------------------------------------------------------------------

export const loginSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .email("Please enter a valid email address")
    .max(254, "Email is too long")
    .toLowerCase()
    .trim(),

  password: z
    .string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
