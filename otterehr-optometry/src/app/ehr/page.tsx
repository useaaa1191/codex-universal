import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { DEMO_VISITS } from "@/lib/demo-board";
import { cn } from "@/lib/utils";

export const metadata = { title: "EHR tracking board" };

const STATUS: Record<(typeof DEMO_VISITS)[number]["status"], string> = {
  arrived: "Arrived",
  intake: "Intake",
  ready: "Ready for OD",
  "with-doctor": "With doctor",
  checkout: "Optical / checkout",
};

export default function EhrBoardPage() {
  return (
    <AppShell
      title="Today's board"
      subtitle="Preview of an optometry day in Ottehr: five demo visits already wired to the exam templates and consents in this pack. Click a row to open the chart."
    >
      <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left">
            <tr>
              <th className="p-3">Patient</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Status</th>
              <th className="p-3">Room</th>
              <th className="p-3">Insurance</th>
              <th className="p-3">Template</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_VISITS.map((visit) => (
              <tr key={visit.id} className="border-t hover:bg-accent/40">
                <td className="p-3">
                  <Link href={`/ehr/${visit.id}`} className="font-medium text-primary hover:underline">
                    {visit.name}
                  </Link>
                  <div className="text-xs text-muted-foreground">
                    {visit.age} · {visit.sex} · DOB {visit.dob}
                  </div>
                </td>
                <td className="p-3">{visit.reason}</td>
                <td className="p-3">
                  <Badge
                    variant={visit.status === "ready" || visit.status === "with-doctor" ? "default" : "secondary"}
                    className={cn(visit.status === "arrived" && "bg-secondary")}
                  >
                    {STATUS[visit.status]}
                  </Badge>
                </td>
                <td className="p-3">{visit.room}</td>
                <td className="p-3">{visit.insurance}</td>
                <td className="p-3 font-mono text-xs">{visit.templateSlug}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        This board is a local preview. Production Ottehr still needs an Oystehr project for scheduling, eRx, and FHIR
        persistence. The zip in the repo root packages every form, FHIR Questionnaire, and drop-in file for that wiring.
      </p>
    </AppShell>
  );
}
