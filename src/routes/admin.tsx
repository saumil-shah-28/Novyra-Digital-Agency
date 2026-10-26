import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  FolderKanban,
  Image,
  Inbox,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";
import { adminSignOut, getCurrentAdminUser } from "@/lib/admin.functions";
import { Logo } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Admin | Novyra Digital" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  beforeLoad: async () => {
    const user = await getCurrentAdminUser();
    if (!user) throw redirect({ to: "/admin/login" });
    if (user.role !== "admin") throw redirect({ to: "/admin/login", search: { denied: true } });
    return { user };
  },
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/blog", label: "Blog", icon: FileText },
  { to: "/admin/services", label: "Services", icon: Sparkles },
  { to: "/admin/media", label: "Media", icon: Image },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function AdminLayout() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const navigate = useNavigate();
  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await adminSignOut();
    navigate({ to: "/admin/login", replace: true });
  }
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="border-b border-border bg-sidebar p-4 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>
          <span className="lg:hidden">
            <ThemeToggle />
          </span>
        </div>
        <nav aria-label="Admin" className="mt-6 flex gap-1 overflow-x-auto lg:flex-col">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: "exact" in n }}
              className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              activeProps={{ className: "!bg-sidebar-accent !text-sidebar-accent-foreground" }}
            >
              <n.icon className="h-4 w-4" /> {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 hidden border-t border-border pt-4 lg:block">
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          <div className="mt-3 flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm hover:text-destructive"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </aside>
      <main className="min-w-0 p-5 md:p-8">
        <Outlet />
        <button
          onClick={signOut}
          className="mt-10 inline-flex items-center gap-2 text-sm text-muted-foreground lg:hidden"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </main>
    </div>
  );
}
