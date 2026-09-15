import { AppShell } from "@/components/app-shell";
import { GLOBAL_TEMPLATES } from "../../../drop-in/global-templates";

export const metadata = { title: "Ottehr drop-in" };

const FILES = [
  { file: "drop-in/consent-forms.ts", dest: "packages/utils/lib/ottehr-config/consent-forms" },
  { file: "drop-in/forms.ts", dest: "packages/utils/lib/ottehr-config/forms" },
  { file: "drop-in/examination.ts", dest: "packages/utils/lib/ottehr-config/examination" },
  { file: "drop-in/review-of-systems.ts", dest: "packages/utils/lib/ottehr-config/review-of-systems" },
  { file: "drop-in/medical-history.ts", dest: "packages/utils/lib/ottehr-config/medical-history" },
  { file: "drop-in/intake-paperwork.ts", dest: "packages/utils/lib/ottehr-config/intake-paperwork (merge)" },
  { file: "drop-in/procedures.ts", dest: "config/oystehr/procedure-type.json extras" },
  { file: "drop-in/global-templates.ts", dest: "EHR Admin → Global templates" },
];

export default function DropInPage() {
  return (
    <AppShell
      title="Wire this pack into Ottehr"
      subtitle="Ottehr is FHIR-native and customized through packages/utils/lib/ottehr-config. Keep hipaa-acknowledgement and consent-to-treat IDs so intake checkboxes still bind."
    >
      <ol className="mb-10 list-decimal space-y-2 pl-5 text-sm leading-relaxed">
        <li>Fork github.com/masslight/ottehr and finish Oystehr project setup.</li>
        <li>Copy or merge the files below into the matching Ottehr paths.</li>
        <li>Add visit types for comprehensive, contact lens, medical, and follow-up in booking config.</li>
        <li>Bump IN_PERSON_INTAKE_PAPERWORK_VERSION and regenerate questionnaires.</li>
        <li>Seed the global templates in EHR Admin (HPI, ROS, exam, CPT, instructions).</li>
      </ol>
      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left">
            <tr>
              <th className="p-3">This pack</th>
              <th className="p-3">Ottehr destination</th>
            </tr>
          </thead>
          <tbody>
            {FILES.map((row) => (
              <tr key={row.file} className="border-t">
                <td className="p-3 font-mono text-xs">{row.file}</td>
                <td className="p-3">{row.dest}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="mb-3 mt-10 font-serif text-2xl">Global templates included</h2>
      <ul className="grid gap-3 md:grid-cols-2">
        {GLOBAL_TEMPLATES.map((template) => (
          <li key={template.name} className="rounded-xl border bg-card p-4">
            <h3 className="font-medium">{template.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{template.mdm}</p>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
