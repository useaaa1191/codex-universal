import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DeleteQuestionButton } from "@/components/admin/delete-question-button";

export const metadata = { title: "Admin · Questions" };

const PAGE_SIZE = 20;

export default async function AdminQuestionsPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  await requireAdmin();
  const q = searchParams.q?.trim() ?? "";
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);

  const where = q
    ? { OR: [{ stem: { contains: q, mode: "insensitive" as const } }] }
    : {};

  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where,
      include: { subject: true, part: true },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.question.count({ where }),
  ]);
  const pages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Questions" description={`${total.toLocaleString()} questions in the bank`}>
        <Button asChild>
          <Link href="/admin/questions/new">
            <Plus className="h-4 w-4" /> New question
          </Link>
        </Button>
      </PageHeader>

      <form className="mb-4 flex gap-2" action="/admin/questions" method="get">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" defaultValue={q} placeholder="Search question stems…" className="pl-9" />
        </div>
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      <Card>
        <CardContent className="divide-y p-0">
          {questions.map((question) => (
            <div key={question.id} className="flex items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/questions/${question.id}`}
                  className="line-clamp-1 text-sm font-medium hover:text-primary"
                >
                  {question.stem}
                </Link>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-[10px]">{question.part.subtitle}</Badge>
                  <Badge variant="secondary" className="text-[10px]">{question.subject.name}</Badge>
                  <Badge
                    variant={
                      question.difficulty === "HARD"
                        ? "destructive"
                        : question.difficulty === "MEDIUM"
                          ? "warning"
                          : "success"
                    }
                    className="text-[10px]"
                  >
                    {question.difficulty}
                  </Badge>
                  {question.isFree && <Badge className="text-[10px]">free</Badge>}
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/questions/${question.id}`}>Edit</Link>
              </Button>
              <DeleteQuestionButton id={question.id} />
            </div>
          ))}
          {questions.length === 0 && (
            <p className="p-6 text-sm text-muted-foreground">No questions found.</p>
          )}
        </CardContent>
      </Card>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {page} of {pages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/questions?q=${encodeURIComponent(q)}&page=${page - 1}`}>Previous</Link>
              </Button>
            )}
            {page < pages && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/questions?q=${encodeURIComponent(q)}&page=${page + 1}`}>Next</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
