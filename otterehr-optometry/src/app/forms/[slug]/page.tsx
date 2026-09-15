import { notFound } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { FormRenderer } from "@/components/form-renderer";
import { Badge } from "@/components/ui/badge";
import { ALL_FORMS, getForm } from "@/lib/catalog";

export function generateStaticParams() {
  return ALL_FORMS.map((form) => ({ slug: form.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const form = getForm(params.slug);
  return { title: form?.title ?? "Form" };
}

export default function FormPage({ params }: { params: { slug: string } }) {
  const form = getForm(params.slug);
  if (!form) notFound();

  return (
    <AppShell
      title={form.title}
      subtitle={form.description}
      actions={
        <div className="no-print flex flex-wrap gap-2">
          <Badge>{form.category}</Badge>
          <Badge variant="secondary">{form.ottehrSlot}</Badge>
          {form.cptHints?.map((code) => (
            <Badge key={code} variant="outline">
              {code}
            </Badge>
          ))}
        </div>
      }
    >
      <p className="no-print mb-6 text-sm">
        <Link href="/" className="text-primary underline">
          All forms
        </Link>
      </p>
      <FormRenderer form={form} />
    </AppShell>
  );
}
