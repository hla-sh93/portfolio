<div dir="rtl">

# حلا. — Portfolio Studio

معرض أعمال **حلا شندية** — مصممة UI/UX أولى ومطوّرة واجهات أمامية.
عربي أولًا (RTL)، بهوية برغندي على أسود ستوديو، مبني ليكون بحد ذاته قطعة من البورتفوليو.

</div>

---

**Hla Shindeah** — Senior UI/UX Designer & Front-End Developer.
Arabic-first (RTL) portfolio with a burgundy-on-studio-black design system. The site itself is a portfolio piece.

🔗 [Dribbble](https://dribbble.com/hla-shindeah) · [LinkedIn](https://www.linkedin.com/in/hla-shindeah/)

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind CSS v4 + custom studio layer (spotlight cards, ambient glows, blueprint grid) |
| Motion | Framer Motion + View Transitions API (radial theme wipe) |
| i18n | next-intl — Arabic primary (`/ar`), English (`/en`), full RTL |
| Type | Tajawal (AR) + Poppins (EN) |
| Data | Prisma + PostgreSQL, admin CMS (NextAuth v5) |
| Media | sharp pipeline → WebP + blur placeholders (`scripts/import-portfolio.mjs`) |

## Highlights

- **Arabic-designed, not translated** — layout, type scale, and motion direction are built RTL-first.
- **Studio design system** — burgundy `#B91942` sampled from the brand cover; bento grids, editorial project rows with ghost numerals, mouse-tracked spotlight cards.
- **Performance-budgeted** — tiered experience for weak connections; images compressed 91% at import time.
- **CV-truth content** — every skill, role, and number on the site is verifiable.

## Development

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL etc.
npx prisma db push && npm run dev
```

Opens at `localhost:3000` → redirects to `/ar`.

---

<div dir="rtl">

صُنع بحُب في اللاذقية 🌊

</div>
