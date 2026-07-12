import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  // Arabic is the primary experience: "/" always lands on /ar,
  // visitors switch to EN explicitly via the navbar toggle.
  localeDetection: false,
});
