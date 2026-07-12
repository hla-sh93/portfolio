import { LikeButton } from "@/components/features/LikeButton";
import { CTABanner } from "@/components/sections/CTABanner";
import { Badge } from "@/components/ui/Badge";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Calendar, Code2 } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/content/projects";
import { MediaGallery } from "@/components/features/MediaGallery";
import type { Media as PrismaMedia } from "@prisma/client";



export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const project = getProjectBySlug(slug);

  if (!project) return { title: "Not Found" };

  const title = locale === "ar" ? project.titleAr : project.titleEn;
  const desc = locale === "ar" ? project.descAr : project.descEn;

  return {
    title: `${title} | Project`,
    description: desc.slice(0, 160),
    openGraph: {
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(title)}&type=project`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const isRtl = locale === "ar";

  const project = getProjectBySlug(slug);

  if (!project || !project.published) {
    notFound();
  }

  const title = isRtl ? project.titleAr : project.titleEn;
  const description = isRtl ? project.descAr : project.descEn;
  const body = isRtl ? project.bodyAr : project.bodyEn;

  return (
    <>
      <article className="min-h-screen">
        {/* Cover Section */}
        <div className="relative h-[60vh] md:h-[80vh] w-full bg-black">
          <Image
            src={project.coverImage}
            alt={title}
            fill
            className="object-cover opacity-60"
            priority
            sizes="100vw"
            placeholder={project.blurDataUrl ? "blur" : "empty"}
            blurDataURL={project.blurDataUrl || undefined}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/40 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end container mx-auto px-6 max-w-5xl pb-16 md:pb-24">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium mb-8 transition-colors w-fit group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
              {isRtl ? "العودة للمشاريع" : "Back to Projects"}
            </Link>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Badge category={project.category} />
              {project.year && (
                <div className="flex items-center text-white/80 text-sm font-medium">
                  <Calendar className="w-4 h-4 mr-2" />
                  {project.year}
                </div>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 drop-shadow-xl">{title}</h1>

            <div className="flex items-center gap-6">
              <LikeButton projectId={project.id} initialCount={project.likeCount} className="bg-white/10" />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 max-w-5xl py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h2 className="text-2xl font-bold mb-6 text-text-primary">
                  {isRtl ? "نظرة عامة" : "Overview"}
                </h2>
                <div className="prose prose-lg dark:prose-invert prose-p:leading-relaxed text-text-secondary whitespace-pre-wrap">
                  {description}
                </div>
              </section>

              {body && (
                <section>
                  <h2 className="text-2xl font-bold mb-6 text-text-primary">
                    {isRtl ? "التفاصيل" : "Details"}
                  </h2>
                  <div className="prose prose-lg dark:prose-invert prose-p:leading-relaxed text-text-secondary whitespace-pre-wrap">
                    {body}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar / Meta */}
            <div className="space-y-10">
              <div className="p-8 rounded-3xl bg-glass-bg border border-border backdrop-blur-md">
                <h3 className="text-sm font-bold uppercase tracking-wider text-text-tertiary mb-6">
                  {isRtl ? "معلومات المشروع" : "Project Info"}
                </h3>

                <dl className="space-y-6">
                  {project.client && (
                    <div>
                      <dt className="text-sm font-medium text-text-secondary mb-1">
                        {isRtl ? "العميل" : "Client"}
                      </dt>
                      <dd className="text-base font-semibold text-text-primary">{project.client}</dd>
                    </div>
                  )}

                  {project.role && (
                    <div>
                      <dt className="text-sm font-medium text-text-secondary mb-1">
                        {isRtl ? "الدور" : "Role"}
                      </dt>
                      <dd className="text-base font-semibold text-text-primary">{project.role}</dd>
                    </div>
                  )}

                  {project.tools.length > 0 && (
                    <div>
                      <dt className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                        <Code2 className="w-4 h-4" />
                        {isRtl ? "التقنيات المستخدمة" : "Technologies"}
                      </dt>
                      <dd className="flex flex-wrap gap-2">
                        {project.tools.map((tool) => (
                          <span key={tool} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-accent/10 text-accent">
                            {tool}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {project.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-text-tertiary mb-4">
                    {isRtl ? "الكلمات الدالة" : "Tags"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1.5 text-sm rounded-lg border border-border text-text-secondary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Project gallery */}
          {project.media.length > 0 && (
            <section className="mt-20">
              <h2 className="mb-8 text-2xl font-bold text-text-primary">
                {isRtl ? "معرض المشروع" : "Project Gallery"}
              </h2>
              <MediaGallery
                media={project.media as unknown as PrismaMedia[]}
              />
            </section>
          )}
        </div>
      </article>

      <CTABanner />
    </>
  );
}
