/**
 * Real portfolio projects — the single source of truth until the DB/admin
 * takes over. Every fact here is verifiable from the CV or the actual
 * design files in "my portfolio/" (git-ignored originals); compressed
 * copies live in /public/images/projects (see scripts/import-portfolio.mjs).
 *
 * CV-truth rule: no invented clients, outcomes, or tools.
 */
import imagesManifest from "./project-images.json";

type ManifestImage = {
  url: string;
  width: number;
  height: number;
  blurDataUrl: string;
};

const images = imagesManifest as Record<string, ManifestImage[]>;

function mediaFor(slug: string, altEn: string, altAr: string) {
  return (images[slug] ?? []).map((img, i) => ({
    id: `${slug}-m${i + 1}`,
    url: img.url,
    type: "IMAGE" as const,
    altEn: `${altEn} — ${i + 1}`,
    altAr: `${altAr} — ${i + 1}`,
    order: i,
    width: img.width,
    height: img.height,
    projectId: slug,
    createdAt: new Date("2026-07-01"),
  }));
}

function coverOf(slug: string) {
  const cover = images[slug]?.[0];
  return {
    coverImage: cover?.url ?? "/images/placeholder.jpg",
    blurDataUrl: cover?.blurDataUrl ?? null,
  };
}

export const projects = [
  {
    id: "zanqa",
    slug: "zanqa-education-platform",
    titleEn: "Zanqa Education Platform",
    titleAr: "منصة زنقة التعليمية",
    descEn:
      "An educational platform serving web and mobile audiences in Syria. As Partner & Front-End Developer (2019–2023) I designed the web and mobile UI and built the front-end with Next.js and MUI, while contributing to the product's strategic decisions. The platform reached 94,000+ users and 50,000+ app downloads, working with 3,000+ publishers.",
    descAr:
      "منصة تعليمية تخدم جمهورها عبر الويب والموبايل في سوريا. عملت عليها كشريكة ومطوّرة واجهات أمامية (2019–2023): صمّمت واجهات الويب والموبايل وبنيت الواجهة الأمامية باستخدام Next.js وMUI، وشاركت في القرارات الاستراتيجية للمنتج. وصلت المنصة إلى أكثر من 94,000 مستخدم و50,000 تحميل للتطبيق، بالعمل مع أكثر من 3,000 ناشر.",
    bodyEn: null,
    bodyAr: null,
    category: "WEBSITES" as const,
    tags: ["Education", "Mobile App", "Web Platform"],
    ...coverOf("zanqa-education-platform"),
    client: "Zanqa",
    role: "Partner & Front-End Developer",
    tools: ["Next.js", "MUI", "Adobe XD"],
    year: 2023,
    likeCount: 0,
    featured: true,
    published: true,
    publishedAt: new Date("2023-01-15"),
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2026-07-10"),
    media: mediaFor(
      "zanqa-education-platform",
      "Zanqa app screens",
      "شاشات تطبيق زنقة"
    ),
    likes: [],
  },
  {
    id: "e-liefer",
    slug: "e-liefer-delivery-platform",
    titleEn: "E-Liefer — Delivery Platform UX/UI",
    titleAr: "E-Liefer — تصميم منصة توصيل",
    descEn:
      "Complete UX/UI design for a German-market delivery platform connecting local stores to customers: shop from any store and get it delivered home. I designed the full journey in Adobe XD — onboarding and registration, store discovery by district, product browsing and details, favorites, and store profiles — in English and German.",
    descAr:
      "تصميم UX/UI كامل لمنصة توصيل موجهة للسوق الألماني تربط المتاجر المحلية بالعملاء: تسوّق من أي متجر ويصلك الطلب إلى المنزل. صمّمت الرحلة كاملة في Adobe XD — التسجيل، استكشاف المتاجر حسب المنطقة، تصفح المنتجات وتفاصيلها، المفضلة، وملفات المتاجر — باللغتين الإنجليزية والألمانية.",
    bodyEn: null,
    bodyAr: null,
    category: "UIUX" as const,
    tags: ["Web App", "Delivery", "UX Flow"],
    ...coverOf("e-liefer-delivery-platform"),
    client: "E-Liefer",
    role: "UI/UX Designer",
    tools: ["Adobe XD"],
    year: 2021,
    likeCount: 0,
    featured: true,
    published: true,
    publishedAt: new Date("2021-10-23"),
    createdAt: new Date("2021-10-23"),
    updatedAt: new Date("2026-07-10"),
    media: mediaFor(
      "e-liefer-delivery-platform",
      "E-Liefer platform screens",
      "شاشات منصة E-Liefer"
    ),
    likes: [],
  },
  {
    id: "living-app",
    slug: "living-app-ui",
    titleEn: "Living — Housing Management App",
    titleAr: "Living — تطبيق إدارة سكنية",
    descEn:
      "UI/UX design for a housing-management mobile app: residents manage their home, connect with neighbors, and stay informed in one place. Screens cover property details (unit info, floor plans), service and repair requests, move-in/move-out logistics, issue reporting, and community announcements.",
    descAr:
      "تصميم UI/UX لتطبيق موبايل لإدارة السكن: يتيح للسكان إدارة منازلهم والتواصل مع الجيران ومتابعة المستجدات في مكان واحد. تغطي الشاشات تفاصيل العقار (معلومات الوحدة والمخططات)، طلبات الصيانة والإصلاح، إجراءات الانتقال، الإبلاغ عن المشكلات، وإعلانات المجتمع السكني.",
    bodyEn: null,
    bodyAr: null,
    category: "UIUX" as const,
    tags: ["Mobile App", "Property", "UI Design"],
    ...coverOf("living-app-ui"),
    client: null,
    role: "UI/UX Designer",
    tools: ["Figma"],
    year: null,
    likeCount: 0,
    featured: false,
    published: true,
    publishedAt: new Date("2024-01-01"),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2026-07-10"),
    media: mediaFor("living-app-ui", "Living app screens", "شاشات تطبيق Living"),
    likes: [],
  },
  {
    id: "nana-gelato",
    slug: "nana-gelato-packaging",
    titleEn: "Nana — Gelato Packaging Series",
    titleAr: "نعناع — سلسلة عبوات جيلاتو",
    descEn:
      "Product packaging design for “nana | نعناع” Italian gelato: a flavor series (strawberry, mango, and more) with a bilingual Arabic/English label system. One visual system carries the brand across the series while each flavor keeps its own appetizing identity.",
    descAr:
      "تصميم عبوات منتجات لجيلاتو إيطالي بعلامة «نعناع nana»: سلسلة نكهات (فريز، مانجو، وغيرها) بنظام ملصقات ثنائي اللغة عربي/إنجليزي. نظام بصري واحد يحمل هوية العلامة عبر السلسلة، مع شخصية شهيّة مستقلة لكل نكهة.",
    bodyEn: null,
    bodyAr: null,
    category: "GRAPHIC_DESIGN" as const,
    tags: ["Packaging", "Branding", "FMCG"],
    ...coverOf("nana-gelato-packaging"),
    client: "nana | نعناع",
    role: "Graphic Designer",
    tools: ["Photoshop", "Illustrator"],
    year: null,
    likeCount: 0,
    featured: true,
    published: true,
    publishedAt: new Date("2022-06-01"),
    createdAt: new Date("2022-06-01"),
    updatedAt: new Date("2026-07-10"),
    media: mediaFor(
      "nana-gelato-packaging",
      "Nana gelato packaging",
      "عبوات جيلاتو نعناع"
    ),
    likes: [],
  },
  {
    id: "believe-in-syria",
    slug: "believe-in-syria-campaign",
    titleEn: "Believe in Syria — Campaign Identity",
    titleAr: "Believe in Syria — هوية الحملة",
    descEn:
      "Campaign identity and media collateral for JCI Syria's “Believe in Syria” campaign, where I served as Media Director (2018–2019): campaign one-pagers, formal invitations, table cards, business cards, T-shirts, and the campaign book — leading print and digital media production for large-scale outreach.",
    descAr:
      "الهوية البصرية والمواد الإعلامية لحملة «Believe in Syria» التابعة لـ JCI سوريا، حيث عملت مديرةً إعلامية (2018–2019): ملفات تعريفية، دعوات رسمية، بطاقات طاولات وبطاقات شخصية، تيشيرتات، وكتيّب الحملة — مع قيادة الإنتاج الإعلامي المطبوع والرقمي لحملة تواصل واسعة النطاق.",
    bodyEn: null,
    bodyAr: null,
    category: "GRAPHIC_DESIGN" as const,
    tags: ["Campaign", "Branding", "Print"],
    ...coverOf("believe-in-syria-campaign"),
    client: "JCI Syria",
    role: "Media Director",
    tools: ["Photoshop", "Illustrator"],
    year: 2018,
    likeCount: 0,
    featured: true,
    published: true,
    publishedAt: new Date("2018-10-01"),
    createdAt: new Date("2018-10-01"),
    updatedAt: new Date("2026-07-10"),
    media: mediaFor(
      "believe-in-syria-campaign",
      "Believe in Syria campaign collateral",
      "مواد حملة Believe in Syria"
    ),
    likes: [],
  },
  {
    id: "travel-agency",
    slug: "travel-agency-branding",
    titleEn: "Travel Agency — Brand & Collateral",
    titleAr: "وكالة سفر — هوية ومطبوعات",
    descEn:
      "Brand identity and print collateral for a travel agency: logo showcase, ID cards, brochure covers (front and back), social cover, and interior page layouts.",
    descAr:
      "هوية بصرية ومطبوعات لوكالة سفر: عرض الشعار، بطاقات تعريفية، أغلفة بروشور (أمامي وخلفي)، غلاف سوشال ميديا، وتنسيقات الصفحات الداخلية.",
    bodyEn: null,
    bodyAr: null,
    category: "GRAPHIC_DESIGN" as const,
    tags: ["Branding", "Print", "Logo"],
    ...coverOf("travel-agency-branding"),
    client: null,
    role: "Graphic Designer",
    tools: ["Photoshop", "Illustrator"],
    year: null,
    likeCount: 0,
    featured: false,
    published: true,
    publishedAt: new Date("2020-05-01"),
    createdAt: new Date("2020-05-01"),
    updatedAt: new Date("2026-07-10"),
    media: mediaFor(
      "travel-agency-branding",
      "Travel agency branding",
      "هوية وكالة السفر"
    ),
    likes: [],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug) ?? null;
}
