"use client";

import { ReactNode } from "react";

export type FieldDef =
  | {
      type: "number";
      name: string;
      label: string;
      help?: string;
      step?: number;
      min?: number;
      max?: number;
      defaultValue?: number;
    }
  | {
      type: "select";
      name: string;
      label: string;
      help?: string;
      options: { value: string; label: string }[];
      defaultValue?: string;
    };

export function FormGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
  );
}

export function Field({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: string | number | undefined;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-ink-800">{field.label}</span>
      {field.help ? (
        <span className="ml-2 text-xs text-ink-500">{field.help}</span>
      ) : null}
      {field.type === "number" ? (
        <input
          type="number"
          step={field.step ?? "any"}
          min={field.min}
          max={field.max}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 block w-full rounded-md border border-ink-200 px-2 py-1.5 text-sm outline-none focus:border-ink-400"
        />
      ) : (
        <select
          value={(value as string) ?? field.defaultValue ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 block w-full rounded-md border border-ink-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-ink-400"
        >
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </label>
  );
}

export function ResultRow({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number | undefined | null;
  unit?: string;
}) {
  return (
    <div className="flex items-baseline justify-between border-b border-ink-100 py-1.5 text-sm last:border-0">
      <span className="text-ink-600">{label}</span>
      <span className="font-mono text-ink-900">
        {value == null || value === "" ? "—" : value}
        {unit ? <span className="ml-1 text-ink-500">{unit}</span> : null}
      </span>
    </div>
  );
}
