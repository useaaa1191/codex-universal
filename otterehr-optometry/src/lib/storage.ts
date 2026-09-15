import type { FormField, FormValues, PracticeForm } from "./types";

const STORAGE_PREFIX = "otterehr-optometry:";

export function storageKey(slug: string): string {
  return `${STORAGE_PREFIX}${slug}`;
}

export function loadValues(slug: string): FormValues {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(storageKey(slug));
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as FormValues;
  } catch {
    return {};
  }
}

export function saveValues(slug: string, values: FormValues): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(slug), JSON.stringify(values));
}

export function clearValues(slug: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(storageKey(slug));
}

export function missingRequired(form: PracticeForm, values: FormValues): string[] {
  const missing: string[] = [];
  for (const section of form.sections) {
    for (const field of section.fields) {
      if (!field.required) continue;
      if (isEmpty(field, values[field.key])) missing.push(field.label);
    }
  }
  return missing;
}

function isEmpty(field: FormField, value: FormValues[string]): boolean {
  if (value === undefined || value === "") return true;
  if (field.type === "checkbox") return value !== true;
  if (field.type === "multicheck") return !Array.isArray(value) || value.length === 0;
  if (field.type === "odos" || field.type === "rx" || field.type === "clrx") {
    if (typeof value !== "string") return true;
    try {
      const parsed = JSON.parse(value) as Record<string, string>;
      return !Object.values(parsed).some((part) => Boolean(part));
    } catch {
      return true;
    }
  }
  return false;
}

export function practiceName(): string {
  if (typeof window === "undefined") return "OtterEHR Optometry";
  return window.localStorage.getItem(`${STORAGE_PREFIX}practice-name`) || "OtterEHR Optometry";
}

export function setPracticeName(name: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(`${STORAGE_PREFIX}practice-name`, name);
}
