import { EditArticleForm } from "@/components/features/EditArticleForm";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { ArrowLeft } from "lucide-react";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let article = null;
  try {
    article = await db.article.findUnique({
      where: { id }
    });
  } catch (error) {
    console.error("Database query failed, using mock data for edit.", error);
  }

  if (!article) {
    article = {
      id: id,
      slug: "mock-article",
      titleEn: "Mock Article",
      titleAr: "مقال وهمي",
      excerptEn: "This is a mock excerpt since DB is disconnected.",
      excerptAr: "هذه مقتطفات وهمية لأن قاعدة البيانات مفصولة.",
      bodyEn: "## Mock Article\n\nThis is a mock article body.",
      bodyAr: "## مقال وهمي\n\nهذا هو نص المقال الوهمي.",
      tags: ["Mock", "Test"],
      coverImage: "",
      published: false,
      readTime: 5,
      views: 0,
      publishedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  const initialData = {
    slug: article.slug,
    titleEn: article.titleEn,
    titleAr: article.titleAr,
    excerptEn: article.excerptEn || "",
    excerptAr: article.excerptAr || "",
    bodyEn: article.bodyEn,
    bodyAr: article.bodyAr,
    tags: article.tags.join(", "),
    coverImage: article.coverImage || "",
    published: article.published,
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
          <h1 className="text-3xl font-bold text-text-primary">Edit Article</h1>
          <p className="text-text-secondary mt-1">Make changes to "{article.titleEn}".</p>
        </div>
      </header>
      
      <EditArticleForm initialData={initialData} articleId={article.id} />
    </div>
  );
}
