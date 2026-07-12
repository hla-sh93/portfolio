"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { contactSchema, ContactSubject, type ContactFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export function ContactForm() {
  const t = useTranslations("contact.form");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: ContactSubject.GENERAL,
      message: "",
      website: "", // Honeypot
      recaptchaToken: "",
    },
  });

  // Load reCAPTCHA script
  useEffect(() => {
    if (!siteKey) return;
    
    // Check if script already exists to avoid duplicates
    if (document.querySelector('script[src*="recaptcha/api.js"]')) {
      setRecaptchaLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setRecaptchaLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Cleanup is tricky with reCAPTCHA, usually we just leave it in the document
    };
  }, [siteKey]);

  const executeRecaptcha = async (): Promise<string> => {
    if (!siteKey || !window.grecaptcha || !recaptchaLoaded) {
      // Return dummy token if recaptcha isn't configured, so we don't block development
      return "dummy-token";
    }

    return new Promise((resolve) => {
      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(siteKey, { action: "submit" });
          resolve(token);
        } catch (error) {
          console.error("reCAPTCHA execution error:", error);
          resolve(""); // Empty token will fail validation on server
        }
      });
    });
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // 1. Get fresh token
      const token = await executeRecaptcha();
      
      // We manually add it because it's not bound to an input field
      data.recaptchaToken = token;

      // 2. Submit to API
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to send message");
      }

      toast({
        title: t("successTitle"),
        description: t("successDescription"),
        variant: "success",
      });
      
      reset();
    } catch (error: any) {
      toast({
        title: t("errorTitle"),
        description: error.message || t("errorDescription"),
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Honeypot field (hidden from screen readers and visual layout) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website URL (leave empty)</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label={t("name")}
          placeholder={t("namePlaceholder")}
          error={errors.name?.message}
          {...register("name")}
          disabled={isSubmitting}
        />
        <Input
          label={t("email")}
          type="email"
          placeholder={t("emailPlaceholder")}
          error={errors.email?.message}
          {...register("email")}
          disabled={isSubmitting}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="subject" className="text-sm font-medium text-text-secondary">
          {t("subject")}
        </label>
        <select
          id="subject"
          className="w-full rounded-xl border border-border bg-glass-bg px-4 py-2.5 text-sm text-text-primary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30 backdrop-blur-sm"
          {...register("subject")}
          disabled={isSubmitting}
        >
          <option value={ContactSubject.PROJECT_INQUIRY}>{t("subjectOptions.projectInquiry")}</option>
          <option value={ContactSubject.COLLABORATION}>{t("subjectOptions.collaboration")}</option>
          <option value={ContactSubject.GENERAL}>{t("subjectOptions.general")}</option>
        </select>
        {errors.subject && (
          <p role="alert" className="text-xs text-red-400 mt-1">
            {errors.subject.message}
          </p>
        )}
      </div>

      <Textarea
        label={t("message")}
        placeholder={t("messagePlaceholder")}
        rows={6}
        error={errors.message?.message}
        {...register("message")}
        disabled={isSubmitting}
      />

      <Button
        type="submit"
        variant="accent"
        size="lg"
        className="w-full sm:w-auto"
        loading={isSubmitting}
      >
        {t("submit")}
      </Button>

      <p className="text-xs text-center sm:text-left text-text-tertiary mt-4">
        This site is protected by reCAPTCHA and the Google{" "}
        <a href="https://policies.google.com/privacy" className="underline hover:text-text-secondary" target="_blank" rel="noreferrer">
          Privacy Policy
        </a>{" "}
        and{" "}
        <a href="https://policies.google.com/terms" className="underline hover:text-text-secondary" target="_blank" rel="noreferrer">
          Terms of Service
        </a>{" "}
        apply.
      </p>
    </form>
  );
}
