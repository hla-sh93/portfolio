import { Link } from "@/i18n/navigation";
import { FileText, FolderOpen, LayoutDashboard, LogOut, Settings } from "lucide-react";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-bg-elevated/50 flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-black text-accent tracking-tighter">
            PORTFOLIO<span className="text-text-primary">ADMIN</span>
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/projects"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            <FolderOpen className="w-4 h-4" />
            Projects
          </Link>
          <Link
            href="/admin/blog"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            <FileText className="w-4 h-4" />
            Articles
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="mb-4 px-4 font-medium text-sm text-text-secondary">
            admin@portfolio.dev
          </div>
          <button
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
