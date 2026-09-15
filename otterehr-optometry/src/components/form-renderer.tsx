"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Eraser, Printer, ShieldCheck, Sparkles } from "lucide-react";
import { ContactRx, OdOsInput, SpectacleRx } from "@/components/eye-fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { downloadJson, toQuestionnaire, toQuestionnaireResponse } from "@/lib/fhir";
import { clearValues, loadValues, missingRequired, saveValues } from "@/lib/storage";
import type { FormField, FormValue, FormValues, PracticeForm } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FormRenderer({ form }: { form: PracticeForm }) {
  const [values, setValues] = useState<FormValues>({});
  const [notice, setNotice] = useState<string>("");

  useEffect(() => {
    const stored = loadValues(form.slug);
    const seeded: FormValues = { ...stored };
    for (const section of form.sections) {
      for (const field of section.fields) {
        if (seeded[field.key] === undefined && field.defaultValue !== undefined) {
          seeded[field.key] = field.defaultValue;
        }
      }
    }
    setValues(seeded);
  }, [form]);

  function setField(key: string, value: FormValue) {
    setValues((current) => {
      const next = { ...current, [key]: value };
      saveValues(form.slug, next);
      return next;
    });
  }

  const missing = useMemo(() => missingRequired(form, values), [form, values]);

  function applyWnl() {
    if (!form.wnlDefaults) return;
    setValues((current) => {
      const next = { ...current, ...form.wnlDefaults };
      saveValues(form.slug, next);
      return next;
    });
    setNotice("WNL defaults applied to empty exam fields.");
  }

  function reset() {
    clearValues(form.slug);
    setValues({});
    setNotice("Draft cleared.");
  }

  return (
    <div className="space-y-8">
      <div className="no-print flex flex-wrap items-center gap-2">
        {form.wnlDefaults ? (
          <Button type="button" onClick={applyWnl}>
            <Sparkles className="h-4 w-4" />
            Apply WNL
          </Button>
        ) : null}
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (missing.length) {
              setNotice(`Required: ${missing.slice(0, 6).join(", ")}${missing.length > 6 ? "…" : ""}`);
              return;
            }
            setNotice("Form complete. Print or export FHIR.");
          }}
        >
          <ShieldCheck className="h-4 w-4" />
          Validate
        </Button>
        <Button type="button" variant="outline" onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
          Print
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => downloadJson(`${form.slug}.questionnaire.json`, toQuestionnaire(form))}
        >
          <Download className="h-4 w-4" />
          Questionnaire
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            downloadJson(
              `${form.slug}.response.json`,
              toQuestionnaireResponse(form, values, missing.length ? "in-progress" : "completed"),
            )
          }
        >
          <Download className="h-4 w-4" />
          Response
        </Button>
        <Button type="button" variant="ghost" onClick={reset}>
          <Eraser className="h-4 w-4" />
          Clear draft
        </Button>
      </div>
      {notice ? <p className="no-print text-sm text-primary">{notice}</p> : null}

      {form.sections.map((section) => (
        <section key={section.id} className="rounded-xl border bg-card p-5 shadow-sm print:border-0 print:p-0 print:shadow-none">
          <header className="mb-4 border-b pb-3">
            <h2 className="font-serif text-xl">{section.title}</h2>
            {section.description ? (
              <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
            ) : null}
          </header>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {section.fields.map((field) => (
              <FieldControl
                key={field.key}
                field={field}
                value={values[field.key]}
                onChange={(value) => setField(field.key, value)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: FormField;
  value: FormValue;
  onChange: (value: FormValue) => void;
}) {
  const span = field.span === 3 ? "md:col-span-3" : field.span === 2 ? "md:col-span-2" : "";

  if (field.type === "heading") {
    return <h3 className="md:col-span-3 mt-2 font-serif text-lg text-primary">{field.label}</h3>;
  }
  if (field.type === "display") {
    return (
      <p className="md:col-span-3 rounded-md bg-muted/60 p-3 text-sm leading-relaxed">{field.label}</p>
    );
  }
  if (field.type === "odos") {
    return (
      <OdOsInput
        label={field.label}
        placeholder={field.placeholder}
        value={typeof value === "string" ? value : undefined}
        onChange={onChange}
      />
    );
  }
  if (field.type === "rx") {
    return (
      <SpectacleRx
        label={field.label}
        value={typeof value === "string" ? value : undefined}
        onChange={onChange}
      />
    );
  }
  if (field.type === "clrx") {
    return (
      <ContactRx
        label={field.label}
        value={typeof value === "string" ? value : undefined}
        onChange={onChange}
      />
    );
  }

  return (
    <label className={cn("space-y-1.5", span)}>
      <span className="block text-sm font-medium">
        {field.label}
        {field.required ? <span className="text-destructive"> *</span> : null}
      </span>
      <Control field={field} value={value} onChange={onChange} />
      {field.help ? <span className="block text-xs text-muted-foreground">{field.help}</span> : null}
    </label>
  );
}

function Control({
  field,
  value,
  onChange,
}: {
  field: FormField;
  value: FormValue;
  onChange: (value: FormValue) => void;
}) {
  const stringValue = typeof value === "string" ? value : "";

  switch (field.type) {
    case "textarea":
      return (
        <Textarea
          rows={field.rows ?? 3}
          value={stringValue}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      );
    case "select":
      return (
        <select
          className="flex h-9 w-full rounded-md border border-input bg-white px-3 text-sm shadow-sm"
          value={stringValue}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">Select</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    case "radio":
      return (
        <div className="space-y-2">
          {field.options?.map((option) => (
            <label key={option.value} className="flex items-start gap-2 text-sm">
              <input
                type="radio"
                name={field.key}
                checked={stringValue === option.value}
                onChange={() => onChange(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      );
    case "yesno":
      return (
        <div className="flex gap-3">
          {["yes", "no"].map((choice) => (
            <Button
              key={choice}
              type="button"
              size="sm"
              variant={stringValue === choice ? "default" : "outline"}
              onClick={() => onChange(choice)}
            >
              {choice === "yes" ? "Yes" : "No"}
            </Button>
          ))}
        </div>
      );
    case "checkbox":
      return (
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={value === true}
          onChange={(event) => onChange(event.target.checked)}
        />
      );
    case "multicheck": {
      const selected = Array.isArray(value) ? value : [];
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          {field.options?.map((option) => {
            const checked = selected.includes(option.value);
            return (
              <label key={option.value} className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={checked}
                  onChange={() => {
                    onChange(
                      checked
                        ? selected.filter((entry) => entry !== option.value)
                        : [...selected, option.value],
                    );
                  }}
                />
                {option.label}
              </label>
            );
          })}
        </div>
      );
    }
    case "signature":
    case "initials":
    case "text":
    case "email":
    case "tel":
    case "date":
    case "number":
      return (
        <Input
          type={inputType(field.type)}
          value={stringValue}
          placeholder={field.placeholder ?? (field.type === "signature" ? "Type full name" : undefined)}
          onChange={(event) => onChange(event.target.value)}
        />
      );
    case "heading":
    case "display":
    case "odos":
    case "rx":
    case "clrx":
      return null;
    default: {
      const exhaustive: never = field.type;
      return exhaustive;
    }
  }
}

function inputType(type: FormField["type"]): string {
  if (type === "email") return "email";
  if (type === "tel") return "tel";
  if (type === "date") return "date";
  if (type === "number") return "number";
  return "text";
}
