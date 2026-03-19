"use client";

import { ReceiptIcon, UsersIcon } from "@/components/icons";
import type { ReaderRecord } from "@/lib/types";

type ReaderSummaryCardsProps = {
  readers: ReaderRecord[];
  activeCount: number;
};

export function ReaderSummaryCards({
  readers,
  activeCount,
}: ReaderSummaryCardsProps) {
  return (
    <div className="mb-6 grid gap-4 lg:grid-cols-2">
      <div className="surface-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-[var(--gray-600)]">Tổng độc giả</p>
            <p className="mt-3 text-[28px] font-semibold leading-none text-[var(--gray-900)]">
              {readers.length}
            </p>
          </div>
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-[var(--primary)]">
            <UsersIcon className="h-5 w-5" />
          </span>
        </div>
      </div>

      <div className="surface-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-[var(--gray-600)]">Đang hoạt động</p>
            <p className="mt-3 text-[28px] font-semibold leading-none text-[var(--gray-900)]">
              {activeCount}
            </p>
          </div>
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--green-light)] text-[var(--green)]">
            <ReceiptIcon className="h-5 w-5" />
          </span>
        </div>
      </div>
    </div>
  );
}
