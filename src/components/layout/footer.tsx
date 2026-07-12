import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight, Dribbble, Linkedin, Mail } from "lucide-react";
import { LocalTime } from "./local-time";

const socialLinks = [
  {
    icon: Dribbble,
    href: "https://dribbble.com/hla-shindeah",
    label: "Dribbble",
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/hla-shindeah/",
    label: "LinkedIn",
  },
  { icon: Mail, href: "mailto:hla.shindeah@gmail.com", label: "Email" },
];

const navLinks = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/projects", key: "projects" },
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },
] as const;

export function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-border">
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-16 lg:px-8 lg:pt-24">
        {/* Studio sign-off: giant wordmark + invitation */}
        <div className="mb-16 flex flex-col gap-10 lg:mb-24 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href="/"
              className="block font-display text-[clamp(4rem,14vw,9rem)] font-black leading-[0.95] tracking-tight text-text-primary transition-colors hover:text-accent"
            >
              {locale === "ar" ? "حلا" : "Hla"}
              <span className="text-accent">.</span>
            </Link>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-text-secondary">
              {t("hero.tagline")}
            </p>
          </div>

          <Link
            href="/contact"
            className="shine group inline-flex w-fit items-center gap-3 rounded-full bg-accent px-8 py-4 text-base font-bold text-white transition-colors hover:bg-accent-hover"
          >
            {t("hero.badge")}
            <ArrowUpRight
              size={18}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
            />
          </Link>
        </div>

        {/* Link rails */}
        <div className="grid gap-10 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-text-tertiary">
              {t("nav.home")}
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map(({ href, key }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-sm font-medium text-text-secondary transition-colors hover:text-accent"
                  >
                    {t(`nav.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-text-tertiary">
              {t("contact.title")}
            </h3>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-text-secondary transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                  aria-label={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-text-tertiary">
              {t("footer.localTime")}
            </h3>
            <p className="text-sm font-medium text-text-secondary">
              <LocalTime />
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-text-tertiary">
              حلا شندية
            </h3>
            <p className="text-sm font-medium text-text-secondary">
              {t("footer.madeIn")}{" "}
              <span className="animate-wave" aria-hidden>
                🌊
              </span>
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-7 md:flex-row">
          <p className="text-xs text-text-tertiary">
            &copy; {year} {t("hero.name")}. {t("footer.rights")}
          </p>
          <p className="text-xs text-text-tertiary">
            {t("footer.builtWith")} Next.js & Tailwind CSS
          </p>
        </div>
      </div>

      {/* Ambient wine glow bleeding from the bottom edge */}
      <div
        aria-hidden
        className="glow-accent pointer-events-none absolute -bottom-40 start-1/2 h-80 w-[120%] -translate-x-1/2 opacity-60 rtl:translate-x-1/2"
      />
    </footer>
  );
}
