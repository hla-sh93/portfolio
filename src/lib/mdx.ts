import { serialize } from "next-mdx-remote/serialize";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Heading {
  /** Heading level: 1–6. */
  level: number;
  /** Plain-text content of the heading. */
  text: string;
  /** URL-safe slug derived from the heading text. */
  slug: string;
}

export interface CompiledMDX<TFrontmatter = Record<string, unknown>> {
  /** Serialised MDX source ready to be passed to <MDXRemote />. */
  source: Awaited<ReturnType<typeof serialize>>;
  /** Parsed front-matter key/value pairs. */
  frontmatter: TFrontmatter;
  /** Extracted headings for a Table of Contents. */
  headings: Heading[];
  /** Estimated reading time in minutes (≈ 200 wpm). */
  readingTimeMinutes: number;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Converts a heading text string into a URL-safe slug.
 *
 * - Lower-cases the text.
 * - Strips HTML tags.
 * - Replaces spaces and non-alphanumeric characters with hyphens.
 * - Collapses consecutive hyphens and trims leading / trailing hyphens.
 *
 * @param text - Raw heading text.
 * @returns A URL-safe slug string.
 */
function slugify(text: string): string {
  return text
    .replace(/<[^>]+>/g, "")     // strip HTML tags
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")    // remove non-word characters (except hyphens)
    .replace(/[\s_]+/g, "-")     // spaces and underscores → hyphen
    .replace(/-{2,}/g, "-")      // collapse multiple hyphens
    .replace(/^-+|-+$/g, "");    // trim leading / trailing hyphens
}

/**
 * Extracts all ATX-style headings (`#` … `######`) from a raw Markdown /
 * MDX string and returns them as a sorted array of {@link Heading} objects.
 *
 * MDX JSX expressions and code blocks are skipped so that headings inside
 * fenced code blocks are not included.
 *
 * @param source - Raw MDX/Markdown source string.
 * @returns Array of headings in document order.
 */
export function extractHeadings(source: string): Heading[] {
  const headings: Heading[] = [];

  // Track whether we are inside a fenced code block (``` or ~~~).
  let insideCodeBlock = false;

  for (const line of source.split("\n")) {
    const trimmed = line.trim();

    // Toggle code-block state.
    if (/^```|^~~~/.test(trimmed)) {
      insideCodeBlock = !insideCodeBlock;
      continue;
    }

    if (insideCodeBlock) continue;

    // Match ATX headings: 1–6 leading `#` characters followed by a space.
    const match = trimmed.match(/^(#{1,6})\s+(.*)/);
    if (!match) continue;

    const level = match[1].length as 1 | 2 | 3 | 4 | 5 | 6;
    // Strip inline code, bold, italic, and link markup from the heading text.
    const rawText = match[2]
      .replace(/`[^`]*`/g, "")             // inline code
      .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1")  // bold / italic
      .replace(/_{1,2}([^_]+)_{1,2}/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")  // links
      .trim();

    headings.push({
      level,
      text: rawText,
      slug: slugify(rawText),
    });
  }

  return headings;
}

/**
 * Estimates reading time based on an average of 200 words per minute.
 *
 * @param source - Raw MDX/Markdown source.
 * @returns Estimated reading time in whole minutes (minimum 1).
 */
function estimateReadingTime(source: string): number {
  // Strip code blocks, HTML, and Markdown syntax before counting.
  const text = source
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / 200));
}

// ---------------------------------------------------------------------------
// Main compilation function
// ---------------------------------------------------------------------------

/**
 * Compiles an MDX string into a form that can be rendered with
 * `<MDXRemote />` from `next-mdx-remote`.
 *
 * Plugins applied:
 * - **remark-gfm**: GitHub Flavored Markdown (tables, strikethrough, etc.)
 * - **rehype-highlight**: Syntax highlighting via `highlight.js`
 *
 * @param rawSource  - Raw MDX or Markdown string.
 * @returns A {@link CompiledMDX} object containing the serialised source,
 *          parsed front-matter, extracted headings, and estimated reading time.
 *
 * @example
 * ```ts
 * const { source, frontmatter, headings } = await compileMDX<MyFrontmatter>(raw);
 * return <MDXRemote {...source} />;
 * ```
 */
export async function compileMDX<TFrontmatter = Record<string, unknown>>(
  rawSource: string,
): Promise<CompiledMDX<TFrontmatter>> {
  const headings = extractHeadings(rawSource);
  const readingTimeMinutes = estimateReadingTime(rawSource);

  const source = await serialize(rawSource, {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [
        // GitHub Flavored Markdown: tables, task lists, strikethrough, etc.
        remarkGfm,
      ],
      rehypePlugins: [
        // Syntax highlighting — add a highlight.js theme stylesheet to the
        // layout to activate colours (e.g. "github-dark").
        rehypeHighlight,
      ],
      // Required for next-mdx-remote v4+.
      format: "mdx",
    },
  });

  return {
    source,
    frontmatter: (source.frontmatter ?? {}) as TFrontmatter,
    headings,
    readingTimeMinutes,
  };
}

// ---------------------------------------------------------------------------
// Re-exports for convenience
// ---------------------------------------------------------------------------

export type { MDXRemoteSerializeResult } from "next-mdx-remote";
