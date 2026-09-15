import { AppShell } from "@/components/app-shell";
import { CPT_CODES, ICD10_CODES, LOINC_HINTS } from "@/lib/codes";

export const metadata = { title: "CPT / ICD-10" };

function Table({ rows }: { rows: { code: string; description: string }[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-muted/60 text-left">
          <tr>
            <th className="p-3 font-medium">Code</th>
            <th className="p-3 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.code} className="border-t">
              <td className="p-3 font-mono text-xs">{row.code}</td>
              <td className="p-3">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CodesPage() {
  return (
    <AppShell
      title="Charge & diagnosis cheat sheet"
      subtitle="Common optometry CPT, ICD-10, and LOINC bindings to hang on global templates and Ottehr assessment."
    >
      <div className="space-y-10">
        <section>
          <h2 className="mb-3 font-serif text-2xl">CPT</h2>
          <Table rows={CPT_CODES} />
        </section>
        <section>
          <h2 className="mb-3 font-serif text-2xl">ICD-10</h2>
          <Table rows={ICD10_CODES} />
        </section>
        <section>
          <h2 className="mb-3 font-serif text-2xl">LOINC / Ottehr consent codes</h2>
          <Table rows={LOINC_HINTS} />
        </section>
      </div>
    </AppShell>
  );
}
