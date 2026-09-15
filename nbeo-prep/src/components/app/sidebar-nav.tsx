"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Target,
  CalendarCheck,
  Repeat,
  BarChart3,
  Stethoscope,
  BookOpen,
  PlaySquare,
  Bot,
  CalendarDays,
  CreditCard,
  Settings,
  Shield,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, initials } from "@/lib/utils";

const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/practice", label: "Practice", icon: Target },
  { href: "/daily", label: "Daily Quiz", icon: CalendarCheck },
  { href: "/srs", label: "Spaced Repetition", icon: Repeat },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/part3", label: "Part 3 Skills", icon: Stethoscope },
];

const contentNav = [
  { href: "/library", label: "Library", icon: BookOpen },
  { href: "/videos", label: "Videos", icon: PlaySquare },
  { href: "/tutor", label: "AI Tutor", icon: Bot },
  { href: "/study", label: "Study Plan", icon: CalendarDays },
];

const accountNav = [
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  user: { name?: string | null; email?: string | null; image?: string | null; role: string };
}

function NavList({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const section = (items: typeof mainNav, title?: string) => (
    <div className="space-y-1">
      {title && (
        <p className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
      )}
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );

  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3">
      {section(mainNav)}
      {section(contentNav, "Content")}
      {section(accountNav, "Account")}
    </nav>
  );
}

export function SidebarNav({ user }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const isAdmin = user.role === "ADMIN";

  const inner = (onNavigate?: () => void) => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <Logo href="/dashboard" />
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        <NavList pathname={pathname} onNavigate={onNavigate} />
        {isAdmin && (
          <div className="mt-2 px-3">
            <Link
              href="/admin"
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname.startsWith("/admin")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Shield className="h-4 w-4" />
              Admin CMS
            </Link>
          </div>
        )}
      </div>
      <div className="border-t p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <Avatar>
            {user.image && <AvatarImage src={user.image} alt={user.name ?? ""} />}
            <AvatarFallback>{initials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user.name ?? "Student"}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Sign out"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r bg-card/40 md:block">
        {inner()}
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b bg-background/90 px-4 backdrop-blur md:hidden">
        <Logo href="/dashboard" />
        <Button variant="ghost" size="icon" aria-label="Open menu" onClick={() => setOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-card shadow-xl">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close menu"
              className="absolute right-2 top-3 z-10"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            {inner(() => setOpen(false))}
          </div>
        </div>
      )}
    </>
  );
}
