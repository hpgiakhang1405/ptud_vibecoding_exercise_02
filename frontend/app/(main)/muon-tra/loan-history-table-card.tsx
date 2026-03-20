"use client";

import type { ChangeEvent } from "react";

import { InboxIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { SelectInput } from "@/components/ui/form";
import { DataTable, TableCard, TableCell, TableState } from "@/components/ui/table";
import { formatVietnameseDate } from "@/lib/date";
import { formatLoanStatusLabel } from "@/lib/format";
import type { LoanItem, LoanStatus } from "@/lib/types";

import { LoanTimeline } from "./loan-ui";

type LoanHistoryTableCardProps = {
  statusFilter: "all" | LoanStatus;
  loans: LoanItem[];
  historyLoading: boolean;
  returningId: string | null;
  onStatusFilterChange: (value: "all" | LoanStatus) => void;
  onConfirmReturn: (loanId: string) => void;
};

export function LoanHistoryTableCard({
  statusFilter,
  loans,
  historyLoading,
  returningId,
  onStatusFilterChange,
  onConfirmReturn,
}: LoanHistoryTableCardProps) {
  return (
    <TableCard
      title="Lịch sử mượn / trả"
      description="Theo dõi phiếu đang mở và xác nhận trả sách ngay trên từng dòng."
      actions={
        <div className="w-full lg:w-56">
          <SelectInput
            value={statusFilter}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              onStatusFilterChange(event.target.value as "all" | LoanStatus)
            }
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="dang_muon">Đang mượn</option>
            <option value="da_tra">Đã trả</option>
          </SelectInput>
        </div>
      }
    >
      <div className="space-y-3 md:hidden">
        {historyLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[var(--radius-lg)] border border-[var(--gray-200)] bg-white p-4"
            >
              <div className="space-y-2">
                <div className="ui-skeleton h-5 w-32 rounded-full" />
                <div className="ui-skeleton h-4 w-40 rounded-full" />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="ui-skeleton h-3 w-20 rounded-full" />
                  <div className="ui-skeleton h-4 w-24 rounded-full" />
                </div>
                <div className="space-y-2">
                  <div className="ui-skeleton h-3 w-20 rounded-full" />
                  <div className="ui-skeleton h-4 w-28 rounded-full" />
                </div>
              </div>
              <div className="mt-4 ui-skeleton h-11 rounded-[var(--radius-md)]" />
            </div>
          ))
        ) : loans.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--gray-200)] bg-[var(--gray-50)] p-6">
            <div className="flex flex-col items-start gap-3">
              <InboxIcon className="h-7 w-7 text-[var(--gray-400)]" />
              <div>
                <p className="text-sm font-semibold text-[var(--gray-900)]">
                  Chưa có phiếu mượn phù hợp
                </p>
                <p className="mt-1 text-sm text-[var(--gray-600)]">
                  Hãy tạo phiếu mượn mới hoặc đổi bộ lọc để xem các giao dịch hiện có.
                </p>
              </div>
            </div>
          </div>
        ) : (
          loans.map((loan) => (
            <article
              key={loan.ma_phieu}
              className="rounded-[var(--radius-lg)] border border-[var(--gray-200)] bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-base font-semibold text-[var(--gray-900)]">
                    {loan.ho_ten_doc_gia}
                  </h4>
                  <p className="mt-1 text-sm text-[var(--gray-600)]">{loan.ten_sach}</p>
                </div>
                <span className="inline-flex rounded-full border border-[var(--gray-200)] px-2.5 py-1 text-xs font-medium text-[var(--gray-700)]">
                  {formatLoanStatusLabel(loan.tinh_trang)}
                </span>
              </div>

              <div className="mt-4 grid gap-3 text-sm">
                <div>
                  <p className="text-[var(--gray-400)]">Ngày mượn</p>
                  <p className="mt-1 text-[var(--gray-900)]">
                    {formatVietnameseDate(loan.ngay_muon)}
                  </p>
                </div>
                <div>
                  <p className="text-[var(--gray-400)]">Timeline</p>
                  <div className="mt-2">
                    <LoanTimeline returned={loan.tinh_trang === "da_tra"} />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                {loan.tinh_trang === "dang_muon" ? (
                  <Button
                    variant="secondary"
                    className="w-full"
                    loading={returningId === loan.ma_phieu}
                    onClick={() => onConfirmReturn(loan.ma_phieu)}
                  >
                    Xác nhận trả
                  </Button>
                ) : (
                  <span className="text-sm text-[var(--gray-400)]">Hoàn tất</span>
                )}
              </div>
            </article>
          ))
        )}
      </div>

      <div className="hidden md:block">
        <DataTable
          columns={[
            { label: "Độc giả" },
            { label: "Tên sách" },
            { label: "Ngày mượn", className: "hidden lg:table-cell" },
            { label: "Timeline" },
            { label: "Tình trạng" },
            { label: "Actions", align: "right" },
          ]}
        >
          <TableState
            loading={historyLoading}
            isEmpty={loans.length === 0}
            columns={6}
            empty={{
              icon: <InboxIcon className="h-7 w-7" />,
              title: "Chưa có phiếu mượn phù hợp",
              description:
                "Hãy tạo phiếu mượn mới hoặc đổi bộ lọc để xem các giao dịch hiện có.",
            }}
          >
            {loans.map((loan) => (
              <tr key={loan.ma_phieu}>
                <TableCell>{loan.ho_ten_doc_gia}</TableCell>
                <TableCell>{loan.ten_sach}</TableCell>
                <TableCell className="hidden text-[var(--gray-600)] lg:table-cell">
                  {formatVietnameseDate(loan.ngay_muon)}
                </TableCell>
                <TableCell>
                  <LoanTimeline returned={loan.tinh_trang === "da_tra"} />
                </TableCell>
                <TableCell>
                  <span className="inline-flex rounded-full border border-[var(--gray-200)] px-2.5 py-1 text-xs font-medium text-[var(--gray-700)]">
                    {formatLoanStatusLabel(loan.tinh_trang)}
                  </span>
                </TableCell>
                <TableCell align="right">
                  {loan.tinh_trang === "dang_muon" ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      loading={returningId === loan.ma_phieu}
                      onClick={() => onConfirmReturn(loan.ma_phieu)}
                    >
                      Xác nhận trả
                    </Button>
                  ) : (
                    <span className="text-sm text-[var(--gray-400)]">Hoàn tất</span>
                  )}
                </TableCell>
              </tr>
            ))}
          </TableState>
        </DataTable>
      </div>
    </TableCard>
  );
}
