export const FORM_CATEGORIES = [
  "intake",
  "consent",
  "exam",
  "procedure",
  "rx",
  "letter",
  "education",
  "admin",
] as const;

export type FormCategory = (typeof FORM_CATEGORIES)[number];

export const FORM_AUDIENCES = ["patient", "clinician", "both"] as const;
export type FormAudience = (typeof FORM_AUDIENCES)[number];

export type FieldType =
  | "heading"
  | "display"
  | "text"
  | "textarea"
  | "date"
  | "email"
  | "tel"
  | "number"
  | "select"
  | "radio"
  | "checkbox"
  | "multicheck"
  | "yesno"
  | "signature"
  | "initials"
  | "odos"
  | "rx"
  | "clrx";

export interface FieldOption {
  label: string;
  value: string;
}

export interface FormField {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  help?: string;
  options?: FieldOption[];
  rows?: number;
  span?: 1 | 2 | 3;
  defaultValue?: string | boolean | string[];
  legal?: boolean;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

export interface PracticeForm {
  slug: string;
  title: string;
  shortTitle: string;
  category: FormCategory;
  audience: FormAudience;
  description: string;
  ottehrSlot: OttehrSlot;
  cptHints?: string[];
  icdHints?: string[];
  sections: FormSection[];
  wnlDefaults?: Record<string, string | boolean | string[]>;
}

export type OttehrSlot =
  | "intake-paperwork"
  | "consent-forms"
  | "forms-list"
  | "examination"
  | "review-of-systems"
  | "medical-history"
  | "global-template"
  | "patient-instruction"
  | "procedure";

export type FormValue = string | boolean | string[] | undefined;

export type FormValues = Record<string, FormValue>;
