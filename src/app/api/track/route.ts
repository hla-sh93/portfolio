import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * Engagement counters keyed by (type, slug) — works for projects and
 * articles regardless of where their content lives.
 *
 * POST /api/track  { type, slug, action: "view" | "like" | "unlike" }
 * → { views, likes }
 *
 * View dedup is client-side (sessionStorage, one per session per slug);
 * likes dedup is client-side too (localStorage) — good enough for a
 * portfolio, no personal data stored.
 */
const bodySchema = z.object({
  type: z.enum(["project", "article"]),
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/),
  action: z.enum(["view", "like", "unlike"]),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { type, slug, action } = parsed.data;

  const data =
    action === "view"
      ? { views: { increment: 1 } }
      : action === "like"
        ? { likes: { increment: 1 } }
        : { likes: { decrement: 1 } };

  try {
    const counter = await db.counter.upsert({
      where: { type_slug: { type, slug } },
      create: {
        type,
        slug,
        views: action === "view" ? 1 : 0,
        likes: action === "like" ? 1 : 0,
      },
      update: data,
    });
    return NextResponse.json({
      views: counter.views,
      likes: Math.max(0, counter.likes),
    });
  } catch {
    // DB not reachable (e.g. local dev without Postgres) — degrade silently
    return NextResponse.json({ views: 0, likes: 0 }, { status: 200 });
  }
}
