import { notFound } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ChartForms } from "@/components/chart-forms";
import { Badge } from "@/components/ui/badge";
import { getForm } from "@/lib/catalog";
import { DEMO_VISITS, getVisit } from "@/lib/demo-board";

export function generateStaticParams() {
  return DEMO_VISITS.map((visit) => ({ patientId: visit.id }));
}

export function generateMetadata({ params }: { params: { patientId: string } }) {
  const visit = getVisit(params.patientId);
  return { title: visit ? `${visit.name} · chart` : "Chart" };
}

export default function PatientChartPage({
  params,
  searchParams,
}: {
  params: { patientId: string };
  searchParams: { form?: string };
}) {
  const visit = getVisit(params.patientId);
  if (!visit) notFound();

  const slugs = [visit.templateSlug, ...visit.extraForms];
  const activeSlug = slugs.includes(searchParams.form ?? "") ? searchParams.form! : visit.templateSlug;
  const active = getForm(activeSlug);
  if (!active) notFound();

  return (
    <AppShell
      title={visit.name}
      subtitle={`${visit.age}yo ${visit.sex} · ${visit.reason} · ${visit.insurance} · ${visit.room}`}
      actions={
        <div className="flex flex-wrap gap-2">
          <Badge>{visit.status.replace("-", " ")}</Badge>
          <Badge variant="secondary">{active.shortTitle}</Badge>
        </div>
      }
    >
      <p className="no-print mb-4 text-sm">
        <Link href="/ehr" className="text-primary underline">
          Back to board
        </Link>
      </p>
      <div className="no-print mb-6 flex flex-wrap gap-2">
        {slugs.map((slug) => {
          const form = getForm(slug);
          if (!form) return null;
          const href = slug === visit.templateSlug ? `/ehr/${visit.id}` : `/ehr/${visit.id}?form=${slug}`;
          const isActive = slug === activeSlug;
          return (
            <Link
              key={slug}
              href={href}
              className={
                isActive
                  ? "rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground"
                  : "rounded-full border px-3 py-1 text-xs hover:bg-accent"
              }
            >
              {form.shortTitle}
            </Link>
          );
        })}
      </div>
      <ChartForms form={active} visit={visit} />
    </AppShell>
  );
}
