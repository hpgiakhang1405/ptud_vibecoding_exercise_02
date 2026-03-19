"use client";

import type { ReactNode } from "react";

type FieldProps = {
  label?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export function Field({ label, error, hint, children }: FieldProps) {
  return (
    <label className="block">
      {label ? (
        <span className="mb-1.5 block text-[13px] font-medium text-[var(--gray-600)]">
          {label}
        </span>
      ) : null}
      {children}
      {error ? (
        <span className="mt-1.5 block text-xs font-medium text-[var(--red)]">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-[var(--gray-400)]">{hint}</span>
      ) : null}
    </label>
  );
}
