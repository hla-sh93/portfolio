import { ContactForm } from "@/components/features/ContactForm";
import { GlassCard } from "@/components/ui/GlassCard";
import { Globe, Mail, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("contact");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ContactPage() {
  const t = await getTranslations("contact");

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: t("info.email"),
      value: "hello@example.com",
      href: "mailto:hello@example.com",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: t("info.location"),
      value: "Dubai, UAE",
      href: null,
    },
    {
      icon: <Globe className="w-5 h-5" />,
      label: "Social",
      value: "@hlashindeah",
      href: "https://x.com",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-8 py-24 md:py-32">
      <header className="mb-16 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black text-text-primary mb-6">
          {t("title")}
        </h1>
        <p className="text-xl text-text-secondary leading-relaxed">
          {t("description")}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info */}
        <div className="lg:col-span-4 space-y-6">
          <GlassCard padding="lg" className="h-full flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-text-primary mb-8">
              {t("subtitle")}
            </h2>
            <div className="space-y-8 text-text-secondary">
              {contactInfo.map((info, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium uppercase tracking-wider text-text-tertiary mb-1">
                      {info.label}
                    </p>
                    {info.href ? (
                      <a
                        href={info.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-lg font-semibold text-text-primary hover:text-accent transition-colors block"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-lg font-semibold text-text-primary">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-8">
          <GlassCard padding="lg">
            <h2 className="text-2xl font-bold text-text-primary mb-8">
              {t("form.send")}
            </h2>
            <ContactForm />
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
