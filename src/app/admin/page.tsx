import { GlassCard } from "@/components/ui/GlassCard";
import { db } from "@/lib/db";
import { Eye, FileText, FolderOpen, Heart } from "lucide-react";

export const metadata = { title: "Dashboard | Admin" };

export default async function AdminDashboardPage() {

  const [totalProjects, publishedProjects, totalArticles, projectsWithLikes, articlesWithViews] = await Promise.all([
    db.project.count(),
    db.project.count({ where: { published: true } }),
    db.article.count(),
    db.project.aggregate({ _sum: { likeCount: true } }),
    db.article.aggregate({ _sum: { views: true } })
  ]);

  const totalLikes = projectsWithLikes._sum.likeCount || 0;
  const totalViews = articlesWithViews._sum.views || 0;

  const stats = [
    {
      title: "Projects",
      value: totalProjects,
      description: `${publishedProjects} published`,
      icon: <FolderOpen className="w-5 h-5 text-accent" />,
      colorClass: "bg-accent/10 border-accent/20",
    },
    {
      title: "Articles",
      value: totalArticles,
      description: "Total written articles",
      icon: <FileText className="w-5 h-5 text-blue-500" />,
      colorClass: "bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Project Likes",
      value: totalLikes,
      description: "Total likes across projects",
      icon: <Heart className="w-5 h-5 text-red-500" />,
      colorClass: "bg-red-500/10 border-red-500/20",
    },
    {
      title: "Article Views",
      value: totalViews,
      description: "Total views across articles",
      icon: <Eye className="w-5 h-5 text-emerald-500" />,
      colorClass: "bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-2">Overview of your portfolio activity.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <GlassCard key={idx} padding="md" className="flex flex-col relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-4 -translate-y-1/4 translate-x-1/4 rounded-full blur-2xl opacity-50 ${stat.colorClass} w-24 h-24`} />

            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-text-secondary">{stat.title}</h3>
              <div className={`p-2 rounded-lg ${stat.colorClass} backdrop-blur-sm border`}>
                {stat.icon}
              </div>
            </div>

            <div className="mt-auto">
              <p className="text-3xl font-black text-text-primary">{stat.value}</p>
              <p className="text-sm text-text-tertiary mt-1">{stat.description}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
