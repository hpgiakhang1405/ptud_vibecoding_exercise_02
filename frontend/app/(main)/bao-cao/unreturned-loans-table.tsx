"use client";

import { InboxIcon, ReceiptIcon } from "@/components/icons";
import { DataTable, TableCard, TableCell, TableState } from "@/components/ui/table";
import type { UnreturnedLoanItem } from "@/lib/types";

type UnreturnedLoansTableProps = {
  items: UnreturnedLoanItem[];
  loading: boolean;
  getBorrowedDays: (borrowedAt: string) => number;
};

export function UnreturnedLoansTable({
  items,
  loading,
  getBorrowedDays,
}: UnreturnedLoansTableProps) {
  return (
    <TableCard
      title="Section 2 — Độc giả chưa trả sách"
      description="Danh sách phiếu đang mở, kèm số ngày đã mượn tính đến hôm nay."
    >
      <div className="space-y-3 md:hidden">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[var(--radius-lg)] border border-[var(--gray-200)] bg-white p-4"
            >
              <div className="space-y-2">
                <div className="ui-skeleton h-5 w-40 rounded-full" />
                <div className="ui-skeleton h-4 w-24 rounded-full" />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="ui-skeleton h-3 w-16 rounded-full" />
                  <div className="ui-skeleton h-4 w-36 rounded-full" />
                </div>
                <div className="space-y-2">
                  <div className="ui-skeleton h-3 w-20 rounded-full" />
                  <div className="ui-skeleton h-4 w-24 rounded-full" />
                </div>
                <div className="space-y-2">
                  <div className="ui-skeleton h-3 w-20 rounded-full" />
                  <div className="ui-skeleton h-4 w-20 rounded-full" />
                </div>
              </div>
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--gray-200)] bg-[var(--gray-50)] p-6">
            <div className="flex flex-col items-start gap-3">
              <ReceiptIcon className="h-7 w-7 text-[var(--gray-400)]" />
              <div>
                <p className="text-sm font-semibold text-[var(--gray-900)]">
                  Hiện không có độc giả nào đang mượn sách
                </p>
                <p className="mt-1 text-sm text-[var(--gray-600)]">
                  Khi có phiếu mượn chưa đóng, danh sách theo dõi sẽ hiển thị tại đây.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm text-[var(--gray-500)]">
                <InboxIcon className="h-4 w-4" />
                Danh sách này chỉ hiển thị các phiếu chưa hoàn tất.
              </span>
            </div>
          </div>
        ) : (
          items.map((item) => (
            <article
              key={`${item.ma_sach}-${item.ngay_muon}`}
              className="rounded-[var(--radius-lg)] border border-[var(--gray-200)] bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-base font-semibold text-[var(--gray-900)]">
                    {item.ho_ten_doc_gia}
                  </h4>
                  <p className="mt-1 text-sm text-[var(--gray-600)]">{item.lop}</p>
                </div>
                <div className="rounded-2xl bg-[var(--yellow-light)] px-3 py-2 text-right">
                  <p className="text-xs text-[var(--gray-500)]">Số ngày</p>
                  <p className="text-lg font-semibold text-[var(--yellow)]">
                    {getBorrowedDays(item.ngay_muon)}
                  </p>
                </div>
              </div>

              <dl className="mt-4 grid gap-3 text-sm">
                <div>
                  <dt className="text-[var(--gray-400)]">Tên sách</dt>
                  <dd className="mt-1 text-[var(--gray-900)]">{item.ten_dau_sach}</dd>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-[var(--gray-400)]">Mã sách</dt>
                    <dd className="mt-1 font-semibold text-[var(--gray-900)]">{item.ma_sach}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--gray-400)]">Ngày mượn</dt>
                    <dd className="mt-1 text-[var(--gray-900)]">{item.ngay_muon}</dd>
                  </div>
                </div>
              </dl>
            </article>
          ))
        )}
      </div>

      <div className="hidden md:block">
        <DataTable
          columns={[
            { label: "Họ tên" },
            { label: "Lớp", className: "hidden lg:table-cell" },
            { label: "Tên sách" },
            { label: "Mã sách" },
            { label: "Ngày mượn", className: "hidden lg:table-cell" },
            { label: "Số ngày đã mượn" },
          ]}
        >
          <TableState
            loading={loading}
            isEmpty={items.length === 0}
            columns={6}
            empty={{
              icon: <ReceiptIcon className="h-7 w-7" />,
              title: "Hiện không có độc giả nào đang mượn sách",
              description:
                "Khi có phiếu mượn chưa đóng, danh sách theo dõi sẽ hiển thị tại đây.",
              action: (
                <span className="inline-flex items-center gap-2 text-sm text-[var(--gray-500)]">
                  <InboxIcon className="h-4 w-4" />
                  Danh sách này chỉ hiển thị các phiếu chưa hoàn tất.
                </span>
              ),
            }}
          >
            {items.map((item) => (
              <tr key={`${item.ma_sach}-${item.ngay_muon}`}>
                <TableCell>{item.ho_ten_doc_gia}</TableCell>
                <TableCell className="hidden text-[var(--gray-600)] lg:table-cell">
                  {item.lop}
                </TableCell>
                <TableCell>{item.ten_dau_sach}</TableCell>
                <TableCell className="font-semibold">{item.ma_sach}</TableCell>
                <TableCell className="hidden text-[var(--gray-600)] lg:table-cell">
                  {item.ngay_muon}
                </TableCell>
                <TableCell className="font-semibold">
                  {getBorrowedDays(item.ngay_muon)}
                </TableCell>
              </tr>
            ))}
          </TableState>
        </DataTable>
      </div>
    </TableCard>
  );
}
