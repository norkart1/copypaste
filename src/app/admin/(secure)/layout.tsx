import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Sidenavbar, {
  type SidebarItem,
} from "@/components/ui/demo";
import { ADMIN_COOKIE } from "@/lib/config";

const adminNav: SidebarItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/programs", label: "Programs", icon: "programs" },
  { href: "/admin/students", label: "Students", icon: "students" },
  { href: "/admin/jury", label: "Jury", icon: "jury" },
  { href: "/admin/assign", label: "Assignments", icon: "assignments" },
  { href: "/admin/add-result", label: "Add Result", icon: "addResult" },
  { href: "/admin/pending-results", label: "Pending Results", icon: "pending" },
  { href: "/admin/approved-results", label: "Approved Results", icon: "approved" },
  {
    href: "/admin/team-portal-control",
    label: "Team Portal",
    icon: "teams",
    children: [
      { href: "/admin/team-portal-control", label: "Control Panel" },
      { href: "/admin/team-details", label: "Team Details" },
      { href: "/admin/request-approvals", label: "Request Approvals" },
    ],
  },
];

async function logoutAction() {
  "use server";
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

export default function AdminSecureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Sidenavbar items={adminNav} heading="Admin Control">
        <div className="flex min-h-screen flex-col gap-6 px-4 py-4 md:px-6 md:py-6">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/5 bg-slate-900/50 backdrop-blur-md px-5 py-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/50">Admin Deck</p>
              <h1 className="text-xl font-semibold text-white">Fest Command Center</h1>
            </div>
            <form action={logoutAction}>
              <Button type="submit" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 text-sm">
                Sign out
              </Button>
            </form>
          </header>
          <section className="space-y-6">{children}</section>
        </div>
      </Sidenavbar>
    </div>
  );
}

