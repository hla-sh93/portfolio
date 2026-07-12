/* Infinite tool marquee — every name comes straight from the CV.
   Pure CSS animation (see .animate-marquee in globals.css); reverses in RTL
   and freezes under prefers-reduced-motion. */

const tools = [
  "Figma",
  "Adobe XD",
  "Photoshop",
  "Illustrator",
  "After Effects",
  "Premiere Pro",
  "React",
  "Next.js",
  "JavaScript",
  "HTML5",
  "CSS3",
  "MUI",
  "Bootstrap",
] as const;

export function ToolsMarquee() {
  // Duplicated once so the -50% keyframe loops seamlessly
  const items = [...tools, ...tools];

  return (
    <section
      aria-label="Tools & technologies"
      className="marquee-mask overflow-hidden border-y border-border py-5"
    >
      <div dir="ltr" className="animate-marquee flex w-max items-center">
        {items.map((tool, i) => (
          <span
            key={i}
            className="flex items-center text-sm font-semibold uppercase tracking-[0.2em] text-text-tertiary"
          >
            <span className="px-6">{tool}</span>
            <span aria-hidden className="text-accent">
              ✦
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
