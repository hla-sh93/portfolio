import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Link } from "@/i18n/navigation";
import { format } from "date-fns";
import { Edit, Eye, Heart, Image as ImageIcon, Plus } from "lucide-react";

export const metadata = { title: "Projects | Admin" };

// Mock projects — will be replaced by Prisma DB calls
const mockProjects = [
  {
    id: "1", slug: "ecommerce-redesign", titleEn: "E-Commerce Redesign",
    category: "WEBSITES" as const, published: true, likeCount: 42,
    createdAt: new Date("2024-06-01"), mediaCount: 3,
  },
  {
    id: "2", slug: "brand-identity-studio", titleEn: "Brand Identity — Studio",
    category: "GRAPHIC_DESIGN" as const, published: true, likeCount: 28,
    createdAt: new Date("2024-04-01"), mediaCount: 5,
  },
  {
    id: "3", slug: "mobile-app-design", titleEn: "Health App UI/UX",
    category: "UIUX" as const, published: true, likeCount: 35,
    createdAt: new Date("2023-12-01"), mediaCount: 8,
  },
  {
    id: "4", slug: "promo-video-campaign", titleEn: "Promo Video Campaign",
    category: "VIDEOS" as const, published: true, likeCount: 19,
    createdAt: new Date("2023-09-01"), mediaCount: 2,
  },
];

export default function AdminProjectsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Projects</h1>
          <p className="text-text-secondary mt-1">Manage your portfolio projects.</p>
        </div>

        <Button asChild variant="accent">
          <Link href="/admin/projects/new" className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Project
          </Link>
        </Button>
      </header>

      <GlassCard padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text-secondary">
            <thead className="bg-bg-elevated/50 text-xs uppercase font-semibold text-text-tertiary">
              <tr>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Stats</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockProjects.map((project) => (
                <tr key={project.id} className="hover:bg-bg-elevated/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-text-primary mb-1">{project.titleEn}</p>
                    <p className="text-xs">{project.slug}</p>
                  </td>
                  <td className="px-6 py-4">
                    {project.published ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-500 border border-orange-500/20">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge category={project.category} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="flex items-center gap-2"><Heart className="w-3 h-3 text-red-500" /> {project.likeCount} Likes</span>
                      <span className="flex items-center gap-2"><ImageIcon className="w-3 h-3 text-blue-500" /> {project.mediaCount} Media</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    {format(new Date(project.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-text-tertiary hover:text-accent">
                        <Link href={`/projects/detail/${project.slug}`} target="_blank">
                          <Eye className="w-4 h-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-text-tertiary hover:text-blue-500">
                        <Link href={`/admin/projects/${project.id}`}>
                          <Edit className="w-4 h-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
