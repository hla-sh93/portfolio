"use client";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { Link, useRouter } from "@/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const articleSchema = z.object({
  slug: z.string().min(1),
  titleEn: z.string().min(1),
  titleAr: z.string().min(1),
  excerptEn: z.string().optional(),
  excerptAr: z.string().optional(),
  bodyEn: z.string().min(1),
  bodyAr: z.string().min(1),
  tags: z.string(), // comma separated
  coverImage: z.string().url().optional().or(z.literal("")),
  published: z.boolean(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

export default function NewArticlePage() {
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      published: false,
    },
  });

  const onSubmit = async (data: ArticleFormData) => {
    try {
      console.log("Saving article", data);
      router.push("/admin/blog");
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <header className="flex items-center gap-4 mb-8">
        <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full">
          <Link href="/admin/blog">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">New Article</h1>
          <p className="text-text-secondary mt-1">Write a new blog post.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <GlassCard padding="lg" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Title (EN)</label>
              <Input {...register("titleEn")} error={errors.titleEn?.message} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Title (AR)</label>
              <Input {...register("titleAr")} error={errors.titleAr?.message} dir="rtl" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Slug</label>
              <Input {...register("slug")} error={errors.slug?.message} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Tags (Comma separated)</label>
              <Input {...register("tags")} placeholder="e.g. Next.js, React, Design" error={errors.tags?.message} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Cover Image URL (Optional)</label>
            <Input {...register("coverImage")} error={errors.coverImage?.message} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Excerpt (EN)</label>
              <textarea
                {...register("excerptEn")}
                rows={2}
                className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Excerpt (AR)</label>
              <textarea
                {...register("excerptAr")}
                dir="rtl"
                rows={2}
                className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all resize-none"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">MDX Content (EN)</label>
            <textarea
              {...register("bodyEn")}
              rows={12}
              className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-xl text-text-primary font-mono text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
            />
            {errors.bodyEn && <span className="text-xs text-red-500">{errors.bodyEn.message}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">MDX Content (AR)</label>
            <textarea
              {...register("bodyAr")}
              dir="rtl"
              rows={12}
              className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-xl text-text-primary font-mono text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
            />
            {errors.bodyAr && <span className="text-xs text-red-500">{errors.bodyAr.message}</span>}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <input
              type="checkbox"
              id="published"
              {...register("published")}
              className="w-5 h-5 rounded border-border text-accent focus:ring-accent/50 bg-bg-elevated cursor-pointer"
            />
            <label htmlFor="published" className="font-medium text-text-primary cursor-pointer select-none">
              Publish publicly
            </label>
          </div>
        </GlassCard>

        <div className="flex justify-end gap-4">
          <Button asChild variant="ghost">
            <Link href="/admin/blog">Cancel</Link>
          </Button>
          <Button type="submit" variant="accent" disabled={isSubmitting} className="min-w-[120px]">
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Article
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
