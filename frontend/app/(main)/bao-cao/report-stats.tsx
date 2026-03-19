"use client";

import { BookIcon, ChartIcon, ClockIcon, ReceiptIcon } from "@/components/icons";
import { StatCard } from "@/components/stat-card";
import type { TopBookItem, UnreturnedLoanItem } from "@/lib/types";

type ReportStatsProps = {
  topBooks: TopBookItem[];
  unreturnedLoans: UnreturnedLoanItem[];
  totalBorrowingDays: number;
};

export function ReportStats({
  topBooks,
  unreturnedLoans,
  totalBorrowingDays,
}: ReportStatsProps) {
  return (
    <>
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <StatCard
          icon={<ReceiptIcon className="h-5 w-5" />}
          label="Tổng sách đang mượn"
          value={unreturnedLoans.length}
          tone="primary"
        />
        <StatCard
          icon={<BookIcon className="h-5 w-5" />}
          label="Tổng đầu sách trong top"
          value={topBooks.length}
          tone="purple"
        />
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <StatCard
          icon={<ChartIcon className="h-5 w-5" />}
          label="Lượt mượn cộng dồn trong top"
          value={topBooks.reduce((sum, item) => sum + item.so_luot_muon, 0)}
          tone="yellow"
        />
        <StatCard
          icon={<ClockIcon className="h-5 w-5" />}
          label="Tổng số ngày đang được mượn"
          value={totalBorrowingDays}
          tone="green"
        />
      </div>
    </>
  );
}
