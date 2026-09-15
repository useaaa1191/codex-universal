import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { renderMarkdown } from "@/lib/markdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function ResourcePage({ params }: { params: { slug: string } }) {
  await requireUser();
  const resource = await prisma.resource.findUnique({
    where: { slug: params.slug },
    include: { part: true, subject: true },
  });
  if (!resource) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/library">
          <ArrowLeft className="h-4 w-4" /> Library
        </Link>
      </Button>

      <div className="flex flex-wrap items-center gap-2">
        {resource.part && <Badge variant="outline">{resource.part.subtitle}</Badge>}
        {resource.subject && <Badge variant="secondary">{resource.subject.name}</Badge>}
        {resource.tags.map((t) => (
          <Badge key={t} variant="secondary" className="font-normal">
            {t}
          </Badge>
        ))}
      </div>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{resource.title}</h1>
      <p className="mt-2 text-muted-foreground">{resource.summary}</p>

      <div className="mt-6">
        <Button variant="outline" size="sm" disabled>
          <Download className="h-4 w-4" /> Download PDF
        </Button>
      </div>

      <article
        className="mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(resource.body) }}
      />
    </div>
  );
}
