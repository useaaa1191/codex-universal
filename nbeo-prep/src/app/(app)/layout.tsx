import { requireUser } from "@/lib/session";
import { SidebarNav } from "@/components/app/sidebar-nav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav
        user={{ name: user.name, email: user.email, image: user.image, role: user.role }}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-4 pb-16 pt-20 md:px-8 md:pt-8">{children}</main>
      </div>
    </div>
  );
}
