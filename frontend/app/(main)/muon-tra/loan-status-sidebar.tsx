"use client";

import { SwapIcon } from "@/components/icons";

import { TimelineStep } from "./loan-ui";

export function LoanStatusSidebar({ activeLoanCount }: { activeLoanCount: number }) {
  return (
    <section className="space-y-4">
      <div className="surface-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-[var(--gray-600)]">Phiếu đang mượn</p>
            <p className="mt-3 text-[28px] font-semibold leading-none text-[var(--gray-900)]">
              {activeLoanCount}
            </p>
          </div>
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-[var(--primary)]">
            <SwapIcon className="h-5 w-5" />
          </span>
        </div>
      </div>

      <div className="surface-card p-5">
        <h3 className="text-base font-semibold text-[var(--gray-900)]">Timeline trạng thái</h3>
        <p className="mt-1 text-sm text-[var(--gray-600)]">
          Một phiếu mượn hợp lệ sẽ đi qua đúng 2 bước nghiệp vụ.
        </p>
        <div className="mt-5 space-y-4">
          <TimelineStep
            active
            label="Đang mượn"
            description="Bản sao được giao cho độc giả."
          />
          <TimelineStep
            active={false}
            label="Đã trả"
            description="Phiếu được đóng và bản sao quay về trạng thái sẵn sàng."
          />
        </div>
      </div>
    </section>
  );
}
