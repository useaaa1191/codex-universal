import type { FieldOption, FormField, FormSection, PracticeForm } from "./types";

export function heading(label: string): FormField {
  return { key: slugify(label), label, type: "heading", span: 3 };
}

export function display(key: string, text: string): FormField {
  return { key, label: text, type: "display", span: 3, legal: true };
}

export function text(
  key: string,
  label: string,
  required = false,
  extra: Partial<FormField> = {},
): FormField {
  return { key, label, type: "text", required, span: extra.span ?? 1, ...extra };
}

export function area(
  key: string,
  label: string,
  required = false,
  rows = 3,
): FormField {
  return { key, label, type: "textarea", required, rows, span: 3 };
}

export function date(key: string, label: string, required = false): FormField {
  return { key, label, type: "date", required };
}

export function email(key: string, label: string, required = false): FormField {
  return { key, label, type: "email", required };
}

export function tel(key: string, label: string, required = false): FormField {
  return { key, label, type: "tel", required };
}

export function num(key: string, label: string, extra: Partial<FormField> = {}): FormField {
  return { key, label, type: "number", span: extra.span ?? 1, ...extra };
}

export function select(
  key: string,
  label: string,
  options: string[],
  required = false,
): FormField {
  return {
    key,
    label,
    type: "select",
    required,
    options: options.map((value) => ({ label: value, value })),
  };
}

export function radio(
  key: string,
  label: string,
  options: string[],
  required = false,
): FormField {
  return {
    key,
    label,
    type: "radio",
    required,
    span: 3,
    options: options.map((value) => ({ label: value, value })),
  };
}

export function yesno(key: string, label: string, required = false): FormField {
  return { key, label, type: "yesno", required, span: 2 };
}

export function checks(
  key: string,
  label: string,
  options: string[],
  required = false,
): FormField {
  return {
    key,
    label,
    type: "multicheck",
    required,
    span: 3,
    options: options.map((value) => ({ label: value, value })),
  };
}

export function box(key: string, label: string, required = false): FormField {
  return { key, label, type: "checkbox", required, span: 3 };
}

export function sign(key: string, label = "Signature"): FormField {
  return { key, label, type: "signature", required: true, span: 2 };
}

export function initials(key: string, label: string, required = true): FormField {
  return { key, label, type: "initials", required, span: 1 };
}

export function odos(key: string, label: string, placeholder = ""): FormField {
  return { key, label, type: "odos", placeholder, span: 3 };
}

export function rxField(key: string, label: string): FormField {
  return { key, label, type: "rx", span: 3 };
}

export function clrx(key: string, label: string): FormField {
  return { key, label, type: "clrx", span: 3 };
}

export function section(
  id: string,
  title: string,
  fields: FormField[],
  description?: string,
): FormSection {
  return { id, title, fields, description };
}

export function form(
  partial: Omit<PracticeForm, "sections"> & { sections: FormSection[] },
): PracticeForm {
  return partial;
}

export function opts(...values: string[]): FieldOption[] {
  return values.map((value) => ({ label: value, value }));
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC",
];

export const RELATIONSHIPS = [
  "Self",
  "Spouse",
  "Parent",
  "Legal Guardian",
  "Child",
  "Sibling",
  "Power of Attorney",
  "Other",
];

export const OCULAR_SYMPTOMS = [
  "Blur at distance",
  "Blur at near",
  "Fluctuating vision",
  "Double vision",
  "Eye pain",
  "Redness",
  "Itching",
  "Burning / gritty",
  "Tearing",
  "Discharge",
  "Light sensitivity",
  "Flashes",
  "Floaters",
  "Curtain / veil",
  "Headache",
  "Eye strain",
  "Dryness",
  "Halos",
  "Night driving difficulty",
  "Loss of vision",
];

export const OCULAR_HISTORY = [
  "None",
  "Myopia",
  "Hyperopia",
  "Astigmatism",
  "Presbyopia",
  "Amblyopia / lazy eye",
  "Strabismus / eye turn",
  "Cataract",
  "Glaucoma / glaucoma suspect",
  "Macular degeneration",
  "Diabetic retinopathy",
  "Retinal detachment / tear",
  "Keratoconus",
  "Dry eye disease",
  "Uveitis / iritis",
  "Eye injury",
  "Eye surgery",
  "Color vision deficiency",
];

export const SYSTEMIC_HISTORY = [
  "None",
  "Diabetes type 1",
  "Diabetes type 2",
  "Hypertension",
  "High cholesterol",
  "Thyroid disease",
  "Autoimmune (RA, lupus, Sjogren)",
  "Asthma / COPD",
  "Heart disease",
  "Stroke / TIA",
  "Cancer",
  "Migraine",
  "Multiple sclerosis",
  "Sleep apnea",
  "Kidney disease",
  "Pregnancy / nursing",
  "HIV / immunocompromised",
  "Seasonal allergies",
];

export const FAMILY_OCULAR = [
  "None known",
  "Glaucoma",
  "Macular degeneration",
  "Cataract (early)",
  "Retinal detachment",
  "Blindness",
  "Strabismus / amblyopia",
  "Keratoconus",
  "Color blindness",
];
