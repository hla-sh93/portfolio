"use client";

import { useEffect } from "react";

/**
 * Fires one "view" per browser session per slug (sessionStorage dedup).
 * Renders nothing — drop it on any detail page.
 */
export function ViewTracker({
  type,
  slug,
}: {
  type: "project" | "article";
  slug: string;
}) {
  useEffect(() => {
    const key = `viewed:${type}:${slug}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, slug, action: "view" }),
      keepalive: true,
    }).catch(() => {});
  }, [type, slug]);

  return null;
}
