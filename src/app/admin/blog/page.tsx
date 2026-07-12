import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Link } from "@/i18n/navigation";
import { format } from "date-fns";
import { Clock, Edit, Eye, Plus } from "lucide-react";

export const metadata = { title: "Articles | Admin" };

// Mock articles — will be replaced by Prisma DB calls
const mockArticles = [
  {
    id: "a1", slug: "building-with-nextjs-15", titleEn: "Building with Next.js 15",
    published: true, views: 1200, readTime: 8,
    tags: ["Next.js", "React", "TypeScript"],
    createdAt: new Date("2024-05-20"),
  },
  {
    id: "a2", slug: "glassmorphism-design-guide", titleEn: "Glassmorphism Design Guide",
    published: true, views: 890, readTime: 5,
    tags: ["Design", "CSS", "UI"],
    createdAt: new Date("2024-04-15"),
  },
  {
    id: "a3", slug: "tailwind-v4-whats-new", titleEn: "Tailwind CSS v4: What's New",
    published: true, views: 650, readTime: 6,
    tags: ["Tailwind", "CSS", "Frontend"],
    createdAt: new Date("2024-03-10"),
  },
];

export default function AdminBlogPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Articles</h1>
          <p className="text-text-secondary mt-1">Manage your blog articles.</p>
        </div>

        <Button asChild variant="accent">
          <Link href="/admin/blog/new" className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Article
          </Link>
        </Button>
      </header>

      <GlassCard padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text-secondary">
            <thead className="bg-bg-elevated/50 text-xs uppercase font-semibold text-text-tertiary">
              <tr>
                <th className="px-6 py-4">Article</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Stats</th>
                <th className="px-6 py-4">Tags</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockArticles.map((article) => (
                <tr key={article.id} className="hover:bg-bg-elevated/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-text-primary mb-1 line-clamp-1">{article.titleEn}</p>
                    <p className="text-xs line-clamp-1">{article.slug}</p>
                  </td>
                  <td className="px-6 py-4">
                    {article.published ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-500 border border-orange-500/20">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="flex items-center gap-2"><Eye className="w-3 h-3 text-emerald-500" /> {article.views} Views</span>
                      <span className="flex items-center gap-2"><Clock className="w-3 h-3 text-purple-500" /> {article.readTime} min read</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 rounded bg-bg-elevated border border-border text-[10px]">
                          {tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span className="px-1.5 py-0.5 text-[10px]">+{article.tags.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    {format(new Date(article.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-text-tertiary hover:text-accent">
                        <Link href={`/blog/${article.slug}`} target="_blank">
                          <Eye className="w-4 h-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-text-tertiary hover:text-blue-500">
                        <Link href={`/admin/blog/${article.id}`}>
                          <Edit className="w-4 h-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {mockArticles.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-tertiary">
                    No articles found. Write your first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
