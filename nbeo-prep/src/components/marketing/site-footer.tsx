import Link from "next/link";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container grid gap-8 py-12 md:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            The next-generation NBEO board-prep platform for Parts 1, 2 & 3. Built by
            optometrists, powered by learning science.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/#features" className="hover:text-foreground">Features</Link></li>
            <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
            <li><Link href="/register" className="hover:text-foreground">Free trial</Link></li>
            <li><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Exam Parts</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/#parts" className="hover:text-foreground">Part 1 — ABS</Link></li>
            <li><Link href="/#parts" className="hover:text-foreground">Part 2 — PAM</Link></li>
            <li><Link href="/#parts" className="hover:text-foreground">Part 3 — Clinical Skills</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Resources</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
            <li><Link href="/faq" className="hover:text-foreground">FAQ</Link></li>
            <li><Link href="/login" className="hover:text-foreground">Log in</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-2 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} OptiPrep. Not affiliated with the NBEO.</p>
          <p>Made for future optometrists.</p>
        </div>
      </div>
    </footer>
  );
}
