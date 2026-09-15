"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function parsePair(raw: string | undefined): { od: string; os: string } {
  if (!raw) return { od: "", os: "" };
  try {
    const parsed = JSON.parse(raw) as { od?: string; os?: string };
    return { od: parsed.od ?? "", os: parsed.os ?? "" };
  } catch {
    return { od: raw, os: "" };
  }
}

export function OdOsInput({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  value: string | undefined;
  onChange: (next: string) => void;
}) {
  const pair = parsePair(typeof value === "string" ? value : undefined);

  function update(side: "od" | "os", next: string) {
    onChange(JSON.stringify({ ...pair, [side]: next }));
  }

  return (
    <div className="col-span-full grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1.2fr)_1fr_1fr]">
      <p className="self-center text-sm font-medium">{label}</p>
      <label className="space-y-1">
        <Badge variant="od">OD</Badge>
        <Input
          value={pair.od}
          placeholder={placeholder}
          onChange={(event) => update("od", event.target.value)}
          aria-label={`${label} OD`}
        />
      </label>
      <label className="space-y-1">
        <Badge variant="os">OS</Badge>
        <Input
          value={pair.os}
          placeholder={placeholder}
          onChange={(event) => update("os", event.target.value)}
          aria-label={`${label} OS`}
        />
      </label>
    </div>
  );
}

type EyeRx = { sph: string; cyl: string; axis: string; add: string; prism: string; base: string };
type RxValue = { od: EyeRx; os: EyeRx };

const emptyEye = (): EyeRx => ({ sph: "", cyl: "", axis: "", add: "", prism: "", base: "" });

function parseRx(raw: string | undefined): RxValue {
  const fallback = { od: emptyEye(), os: emptyEye() };
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as Partial<RxValue>;
    return {
      od: { ...emptyEye(), ...parsed.od },
      os: { ...emptyEye(), ...parsed.os },
    };
  } catch {
    return fallback;
  }
}

const RX_COLS: { key: keyof EyeRx; label: string }[] = [
  { key: "sph", label: "Sph" },
  { key: "cyl", label: "Cyl" },
  { key: "axis", label: "Axis" },
  { key: "add", label: "Add" },
  { key: "prism", label: "Prism" },
  { key: "base", label: "Base" },
];

export function SpectacleRx({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | undefined;
  onChange: (next: string) => void;
}) {
  const rx = parseRx(typeof value === "string" ? value : undefined);

  function update(eye: "od" | "os", key: keyof EyeRx, next: string) {
    onChange(JSON.stringify({ ...rx, [eye]: { ...rx[eye], [key]: next } }));
  }

  return (
    <div className="col-span-full space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="p-2 text-left">Eye</th>
              {RX_COLS.map((col) => (
                <th key={col.key} className="p-2 text-left font-medium">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(["od", "os"] as const).map((eye) => (
              <tr key={eye} className="border-t">
                <td className="p-2">
                  <Badge variant={eye}>{eye.toUpperCase()}</Badge>
                </td>
                {RX_COLS.map((col) => (
                  <td key={col.key} className="p-1">
                    <Input
                      className="h-8"
                      value={rx[eye][col.key]}
                      onChange={(event) => update(eye, col.key, event.target.value)}
                      aria-label={`${eye} ${col.label}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type ClEye = {
  brand: string;
  bc: string;
  diam: string;
  sph: string;
  cyl: string;
  axis: string;
  add: string;
};
type ClValue = { od: ClEye; os: ClEye };

const emptyCl = (): ClEye => ({
  brand: "",
  bc: "",
  diam: "",
  sph: "",
  cyl: "",
  axis: "",
  add: "",
});

function parseCl(raw: string | undefined): ClValue {
  const fallback = { od: emptyCl(), os: emptyCl() };
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as Partial<ClValue>;
    return {
      od: { ...emptyCl(), ...parsed.od },
      os: { ...emptyCl(), ...parsed.os },
    };
  } catch {
    return fallback;
  }
}

const CL_COLS: { key: keyof ClEye; label: string }[] = [
  { key: "brand", label: "Brand" },
  { key: "bc", label: "BC" },
  { key: "diam", label: "Diam" },
  { key: "sph", label: "Sph" },
  { key: "cyl", label: "Cyl" },
  { key: "axis", label: "Axis" },
  { key: "add", label: "Add" },
];

export function ContactRx({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | undefined;
  onChange: (next: string) => void;
}) {
  const rx = parseCl(typeof value === "string" ? value : undefined);

  function update(eye: "od" | "os", key: keyof ClEye, next: string) {
    onChange(JSON.stringify({ ...rx, [eye]: { ...rx[eye], [key]: next } }));
  }

  return (
    <div className="col-span-full space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="p-2 text-left">Eye</th>
              {CL_COLS.map((col) => (
                <th key={col.key} className="p-2 text-left font-medium">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(["od", "os"] as const).map((eye) => (
              <tr key={eye} className="border-t">
                <td className="p-2">
                  <Badge variant={eye}>{eye.toUpperCase()}</Badge>
                </td>
                {CL_COLS.map((col) => (
                  <td key={col.key} className="p-1">
                    <Input
                      className={cn("h-8", col.key === "brand" && "min-w-[8rem]")}
                      value={rx[eye][col.key]}
                      onChange={(event) => update(eye, col.key, event.target.value)}
                      aria-label={`${eye} ${col.label}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
