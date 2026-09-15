import type { ReactNode } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Library" },
  { href: "/drop-in", label: "Ottehr drop-in" },
  { href: "/codes", label: "CPT / ICD-10" },
];

export function AppShell({
  children,
  title,
  subtitle,
  actions,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="no-print sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-serif text-lg">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Eye className="h-4 w-4" />
            </span>
            OtterEHR Optometry
          </Link>
          <nav className="flex gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="container py-8">
        {title ? (
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl tracking-tight md:text-4xl">{title}</h1>
              {subtitle ? <p className="mt-2 max-w-3xl text-muted-foreground">{subtitle}</p> : null}
            </div>
            {actions}
          </div>
        ) : null}
        {children}
      </main>
    </div>
  );
}
