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
    <div className="min-h-screen bg-gray-100">
      <Sidenavbar items={adminNav} heading="Admin Control">
        <div className="flex min-h-screen flex-col gap-5 px-4 py-4 md:px-6 md:py-5">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-4 shadow-lg shadow-emerald-500/20">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/70">Admin Deck</p>
              <h1 className="text-xl font-semibold text-white">Fest Command Center</h1>
            </div>
            <form action={logoutAction}>
              <Button type="submit" variant="ghost" className="text-white/90 hover:text-white hover:bg-white/20 text-sm">
                Sign out
              </Button>
            </form>
          </header>
          <section className="space-y-5">{children}</section>
        </div>
      </Sidenavbar>
    </div>
  );
}

