import { db } from "@/lib/db";

export interface CounterValue {
  views: number;
  likes: number;
}

/**
 * Server-side read of engagement counters for a content type.
 * Returns slug → { views, likes }; empty map when the DB is unreachable
 * (pages must render fine with zeros).
 */
export async function getCounters(
  type: "project" | "article"
): Promise<Record<string, CounterValue>> {
  try {
    const rows = await db.counter.findMany({
      where: { type },
      select: { slug: true, views: true, likes: true },
    });
    return Object.fromEntries(
      rows.map((r) => [r.slug, { views: r.views, likes: Math.max(0, r.likes) }])
    );
  } catch {
    return {};
  }
}
