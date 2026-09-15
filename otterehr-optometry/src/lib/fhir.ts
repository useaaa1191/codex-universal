import type { FormField, FormSection, FormValues, PracticeForm } from "./types";

interface FhirCoding {
  system: string;
  code: string;
  display: string;
}

interface FhirQuestionnaireItem {
  linkId: string;
  text: string;
  type: string;
  required?: boolean;
  repeats?: boolean;
  answerOption?: { valueString: string }[];
  item?: FhirQuestionnaireItem[];
}

export interface FhirQuestionnaire {
  resourceType: "Questionnaire";
  url: string;
  version: string;
  name: string;
  title: string;
  status: "active";
  publisher: string;
  useContext: Array<{
    code: { system: string; code: string };
    valueCodeableConcept: { text: string };
  }>;
  item: FhirQuestionnaireItem[];
}

interface FhirAnswer {
  valueString?: string;
  valueBoolean?: boolean;
}

interface FhirResponseItem {
  linkId: string;
  text: string;
  answer?: FhirAnswer[];
  item?: FhirResponseItem[];
}

export interface FhirQuestionnaireResponse {
  resourceType: "QuestionnaireResponse";
  questionnaire: string;
  status: "in-progress" | "completed";
  authored: string;
  item: FhirResponseItem[];
}

export function questionnaireUrl(slug: string): string {
  return `https://fhir.ottehr.com/Questionnaire/optometry-${slug}`;
}

export function toQuestionnaire(form: PracticeForm, version = "1.0.0"): FhirQuestionnaire {
  return {
    resourceType: "Questionnaire",
    url: questionnaireUrl(form.slug),
    version,
    name: form.slug.replace(/-/g, "_"),
    title: form.title,
    status: "active",
    publisher: "OtterEHR Optometry pack",
    useContext: [
      {
        code: { system: "http://terminology.hl7.org/CodeSystem/usage-context-type", code: "focus" },
        valueCodeableConcept: { text: form.category },
      },
      {
        code: { system: "https://fhir.ottehr.com/CodeSystem/ottehr-slot", code: "slot" },
        valueCodeableConcept: { text: form.ottehrSlot },
      },
    ],
    item: form.sections.map(sectionToItem),
  };
}

function sectionToItem(section: FormSection): FhirQuestionnaireItem {
  return {
    linkId: section.id,
    text: section.title,
    type: "group",
    item: section.fields.map(fieldToItem).filter((item): item is FhirQuestionnaireItem => Boolean(item)),
  };
}

function fieldToItem(field: FormField): FhirQuestionnaireItem | undefined {
  if (field.type === "heading") {
    return { linkId: field.key, text: field.label, type: "display" };
  }
  if (field.type === "display") {
    return { linkId: field.key, text: field.label, type: "display" };
  }

  const item: FhirQuestionnaireItem = {
    linkId: field.key,
    text: field.label,
    type: fhirType(field),
    required: field.required || undefined,
  };

  if (field.options?.length) {
    item.answerOption = field.options.map((option) => ({ valueString: option.value }));
  }
  if (field.type === "multicheck") item.repeats = true;
  if (field.type === "odos") {
    item.type = "group";
    item.item = [
      { linkId: `${field.key}.od`, text: `${field.label} OD`, type: "string" },
      { linkId: `${field.key}.os`, text: `${field.label} OS`, type: "string" },
    ];
  }
  if (field.type === "rx") {
    item.type = "group";
    item.item = rxItems(field.key);
  }
  if (field.type === "clrx") {
    item.type = "group";
    item.item = clItems(field.key);
  }
  return item;
}

function fhirType(field: FormField): string {
  switch (field.type) {
    case "checkbox":
    case "yesno":
      return "boolean";
    case "date":
      return "date";
    case "number":
      return "decimal";
    case "select":
    case "radio":
    case "multicheck":
      return "choice";
    case "textarea":
    case "text":
    case "email":
    case "tel":
    case "signature":
    case "initials":
      return "string";
    case "odos":
    case "rx":
    case "clrx":
    case "heading":
    case "display":
      return "group";
    default: {
      const exhaustive: never = field.type;
      return exhaustive;
    }
  }
}

function rxItems(key: string): FhirQuestionnaireItem[] {
  const eyes = ["od", "os"];
  const parts = ["sph", "cyl", "axis", "add", "prism", "base"];
  const items: FhirQuestionnaireItem[] = [];
  for (const eye of eyes) {
    for (const part of parts) {
      items.push({ linkId: `${key}.${eye}.${part}`, text: `${eye.toUpperCase()} ${part}`, type: "string" });
    }
  }
  return items;
}

function clItems(key: string): FhirQuestionnaireItem[] {
  const eyes = ["od", "os"];
  const parts = ["brand", "bc", "diam", "sph", "cyl", "axis", "add"];
  const items: FhirQuestionnaireItem[] = [];
  for (const eye of eyes) {
    for (const part of parts) {
      items.push({ linkId: `${key}.${eye}.${part}`, text: `${eye.toUpperCase()} ${part}`, type: "string" });
    }
  }
  return items;
}

export function toQuestionnaireResponse(
  form: PracticeForm,
  values: FormValues,
  status: "in-progress" | "completed" = "in-progress",
): FhirQuestionnaireResponse {
  return {
    resourceType: "QuestionnaireResponse",
    questionnaire: `${questionnaireUrl(form.slug)}|1.0.0`,
    status,
    authored: new Date().toISOString(),
    item: form.sections.map((section) => ({
      linkId: section.id,
      text: section.title,
      item: section.fields
        .map((field) => fieldResponse(field, values[field.key]))
        .filter((item): item is FhirResponseItem => Boolean(item)),
    })),
  };
}

function fieldResponse(field: FormField, value: FormValues[string]): FhirResponseItem | undefined {
  if (field.type === "heading" || field.type === "display") return undefined;
  if (value === undefined || value === "") return undefined;

  if (field.type === "checkbox" || field.type === "yesno") {
    return {
      linkId: field.key,
      text: field.label,
      answer: [{ valueBoolean: value === true || value === "yes" || value === "true" }],
    };
  }
  if (field.type === "multicheck" && Array.isArray(value)) {
    return {
      linkId: field.key,
      text: field.label,
      answer: value.map((entry) => ({ valueString: entry })),
    };
  }
  if (typeof value === "string" && (field.type === "odos" || field.type === "rx" || field.type === "clrx")) {
    try {
      const parsed = JSON.parse(value) as Record<string, unknown>;
      return {
        linkId: field.key,
        text: field.label,
        item: flattenJson(field.key, parsed),
      };
    } catch {
      return { linkId: field.key, text: field.label, answer: [{ valueString: value }] };
    }
  }
  if (typeof value === "string" || typeof value === "boolean") {
    return {
      linkId: field.key,
      text: field.label,
      answer: typeof value === "boolean" ? [{ valueBoolean: value }] : [{ valueString: value }],
    };
  }
  return undefined;
}

function flattenJson(prefix: string, value: Record<string, unknown>): FhirResponseItem[] {
  const items: FhirResponseItem[] = [];
  for (const [key, nested] of Object.entries(value)) {
    if (nested && typeof nested === "object" && !Array.isArray(nested)) {
      items.push(...flattenJson(`${prefix}.${key}`, nested as Record<string, unknown>));
    } else if (nested !== undefined && nested !== "") {
      items.push({
        linkId: `${prefix}.${key}`,
        text: key,
        answer: [{ valueString: String(nested) }],
      });
    }
  }
  return items;
}

export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export type { FhirCoding };
