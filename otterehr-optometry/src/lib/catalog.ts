import { consentForms } from "./forms/consents";
import { examForms } from "./forms/exams";
import { intakeForms } from "./forms/intake";
import { letterForms } from "./forms/letters";
import type { FormCategory, PracticeForm } from "./types";

export const ALL_FORMS: PracticeForm[] = [
  ...intakeForms,
  ...consentForms,
  ...examForms,
  ...letterForms,
];

export function getForm(slug: string): PracticeForm | undefined {
  return ALL_FORMS.find((form) => form.slug === slug);
}

export function formsByCategory(): Record<FormCategory, PracticeForm[]> {
  const grouped = {
    intake: [] as PracticeForm[],
    consent: [] as PracticeForm[],
    exam: [] as PracticeForm[],
    procedure: [] as PracticeForm[],
    rx: [] as PracticeForm[],
    letter: [] as PracticeForm[],
    education: [] as PracticeForm[],
    admin: [] as PracticeForm[],
  };
  for (const form of ALL_FORMS) {
    grouped[form.category].push(form);
  }
  return grouped;
}

export const CATEGORY_LABELS: Record<FormCategory, string> = {
  intake: "Patient intake",
  consent: "Consents",
  exam: "Exam templates",
  procedure: "Procedures",
  rx: "Prescriptions",
  letter: "Letters & summaries",
  education: "Patient education",
  admin: "Admin & compliance",
};

export const CATEGORY_BLURB: Record<FormCategory, string> = {
  intake: "Paperwork the patient completes before or at the first visit. Maps to Ottehr intake questionnaires.",
  consent: "HIPAA, treat, dilation, imaging, contact lenses, and specialty procedure consents.",
  exam: "Clinician charting templates with OD/OS grids for Ottehr global templates and exam cards.",
  procedure: "In-office procedure consents and documentation (FB, plugs, amniotic membrane, IPL).",
  rx: "Spectacle and contact lens prescriptions ready to print or attach to the chart.",
  letter: "Referrals, PCP diabetes reports, excuses, and after-visit summaries.",
  education: "Plain-language handouts Ottehr can attach as patient instructions.",
  admin: "Financial policy, records release, DMV, and school screening.",
};
