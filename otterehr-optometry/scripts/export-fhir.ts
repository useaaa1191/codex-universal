import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { ALL_FORMS } from "../src/lib/catalog";
import { toQuestionnaire } from "../src/lib/fhir";

async function main() {
  const outDir = path.join(process.cwd(), "drop-in", "fhir");
  await mkdir(outDir, { recursive: true });
  const index = [];
  for (const form of ALL_FORMS) {
    const questionnaire = toQuestionnaire(form);
    await writeFile(
      path.join(outDir, `${form.slug}.questionnaire.json`),
      `${JSON.stringify(questionnaire, null, 2)}\n`,
    );
    index.push({ slug: form.slug, title: form.title, url: questionnaire.url, slot: form.ottehrSlot });
  }
  await writeFile(path.join(outDir, "index.json"), `${JSON.stringify(index, null, 2)}\n`);
  console.log(`Wrote ${ALL_FORMS.length} questionnaires to drop-in/fhir`);
}

void main();
