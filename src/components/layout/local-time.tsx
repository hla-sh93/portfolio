"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

/* Live clock in Hla's timezone (Lattakia) — renders after mount to avoid
   hydration mismatch; Western digits in both locales per the blueprint. */
export function LocalTime() {
  const locale = useLocale();
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat(locale === "ar" ? "ar-SY-u-nu-latn" : "en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "Asia/Damascus",
      }).format(new Date());

    setTime(format());
    const id = setInterval(() => setTime(format()), 30_000);
    return () => clearInterval(id);
  }, [locale]);

  if (!time) return null;

  return <span dir="ltr">{time}</span>;
}
