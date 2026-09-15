import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { ALL_FORMS, CATEGORY_BLURB, CATEGORY_LABELS, formsByCategory } from "@/lib/catalog";
import { FORM_CATEGORIES } from "@/lib/types";

export default function HomePage() {
  const grouped = formsByCategory();

  return (
    <AppShell
      title="Practice forms & templates"
      subtitle="Everything an optometry clinic needs to run on Ottehr: patient paperwork, consents, OD/OS charting, Rx pads, referrals, and FHIR drop-ins."
    >
      <p className="mb-8 text-sm text-muted-foreground">
        {ALL_FORMS.length} documents · fill, print, export Questionnaire JSON, then copy{" "}
        <Link href="/drop-in" className="underline">
          drop-in config
        </Link>{" "}
        into a forked Ottehr repo.
      </p>
      <div className="space-y-10">
        {FORM_CATEGORIES.map((category) => {
          const forms = grouped[category];
          if (!forms.length) return null;
          return (
            <section key={category}>
              <h2 className="font-serif text-2xl">{CATEGORY_LABELS[category]}</h2>
              <p className="mb-4 mt-1 text-sm text-muted-foreground">{CATEGORY_BLURB[category]}</p>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {forms.map((form) => (
                  <Link
                    key={form.slug}
                    href={`/forms/${form.slug}`}
                    className="rounded-xl border bg-card p-4 shadow-sm transition hover:border-primary"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium leading-snug">{form.shortTitle}</h3>
                      <Badge variant="secondary">{form.audience}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{form.description}</p>
                    <p className="mt-3 text-xs uppercase tracking-wide text-primary">{form.ottehrSlot}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
