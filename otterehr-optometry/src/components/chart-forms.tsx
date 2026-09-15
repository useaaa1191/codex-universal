"use client";

import { useMemo } from "react";
import { FormRenderer } from "@/components/form-renderer";
import { seedFromVisit, type DemoVisit } from "@/lib/demo-board";
import type { PracticeForm } from "@/lib/types";

export function ChartForms({ form, visit }: { form: PracticeForm; visit: DemoVisit }) {
  const initialValues = useMemo(() => seedFromVisit(visit), [visit]);
  return <FormRenderer form={form} visitId={visit.id} initialValues={initialValues} />;
}
