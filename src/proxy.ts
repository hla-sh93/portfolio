import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except:
    // - /api (API routes)
    // - /_next (Next.js internals)
    // - /admin (CMS — no locale prefix)
    // - /_vercel (Vercel internals)
    // - Static files with extensions
    "/((?!api|_next|admin|_vercel|.*\\..*).*)",
  ],
};
