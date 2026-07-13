import { db } from "@/lib/db";
import fs from "node:fs";
import path from "node:path";

export interface CounterValue {
  views: number;
  likes: number;
}

/**
 * Counter storage with a dev fallback:
 *  1. Prisma/Postgres when reachable (production: Neon/Supabase/…)
 *  2. Local JSON file (.counters.json, git-ignored) so counters work in
 *     development without any database — NOT used in production.
 */
const FILE = path.join(process.cwd(), ".counters.json");
const key = (type: string, slug: string) => `${type}:${slug}`;

function readFile(): Record<string, CounterValue> {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return {};
  }
}

function writeFile(data: Record<string, CounterValue>) {
  try {
    fs.writeFileSync(FILE, JSON.stringify(data));
  } catch {
    /* read-only FS (serverless) — silently skip */
  }
}

export async function bump(
  type: "project" | "article",
  slug: string,
  action: "view" | "like" | "unlike"
): Promise<CounterValue> {
  const delta =
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
      update: delta,
    });
    return { views: counter.views, likes: Math.max(0, counter.likes) };
  } catch {
    // dev fallback — file store
    const data = readFile();
    const cur = data[key(type, slug)] ?? { views: 0, likes: 0 };
    if (action === "view") cur.views += 1;
    if (action === "like") cur.likes += 1;
    if (action === "unlike") cur.likes = Math.max(0, cur.likes - 1);
    data[key(type, slug)] = cur;
    writeFile(data);
    return cur;
  }
}

export async function getCounters(
  type: "project" | "article"
): Promise<Record<string, CounterValue>> {
  try {
    const rows = await db.counter.findMany({
      where: { type },
      select: { slug: true, views: true, likes: true },
    });
    if (rows.length > 0) {
      return Object.fromEntries(
        rows.map((r) => [
          r.slug,
          { views: r.views, likes: Math.max(0, r.likes) },
        ])
      );
    }
    // fall through to file if DB is empty AND file has dev data
  } catch {
    /* DB unreachable — use file */
  }
  const data = readFile();
  const out: Record<string, CounterValue> = {};
  for (const [k, v] of Object.entries(data)) {
    if (k.startsWith(`${type}:`)) out[k.slice(type.length + 1)] = v;
  }
  return out;
}
