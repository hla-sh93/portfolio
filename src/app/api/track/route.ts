import { bump } from "@/lib/counter-store";
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

  const counter = await bump(type, slug, action);
  return NextResponse.json(counter);
}
