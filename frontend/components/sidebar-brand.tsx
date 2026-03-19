"use client";

import { BookIcon } from "@/components/icons";

export function BrandMark() {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-[var(--primary)]">
      <BookIcon className="h-5 w-5" />
    </div>
  );
}

export function BrandText() {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--gray-400)]">
        Library System
      </p>
      <h1 className="text-lg font-semibold text-[var(--gray-900)]">Thư viện ĐH</h1>
    </div>
  );
}
