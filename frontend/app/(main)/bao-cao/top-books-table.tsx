"use client";

import { BookIcon, InboxIcon } from "@/components/icons";
import { DataTable, TableCard, TableCell, TableState } from "@/components/ui/table";
import type { TopBookItem } from "@/lib/types";

type TopBooksTableProps = {
  items: TopBookItem[];
  loading: boolean;
};

export function TopBooksTable({ items, loading }: TopBooksTableProps) {
  return (
    <TableCard
      title="Section 1 — Sách mượn nhiều nhất"
      description="Top đầu sách có số lượt mượn cao nhất trong hệ thống."
    >
      <div className="space-y-3 md:hidden">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[var(--radius-lg)] border border-[var(--gray-200)] bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="ui-skeleton h-3 w-12 rounded-full" />
                  <div className="ui-skeleton h-5 w-44 rounded-full" />
                  <div className="ui-skeleton h-4 w-28 rounded-full" />
                </div>
                <div className="ui-skeleton h-10 w-10 rounded-2xl" />
              </div>
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--gray-200)] bg-[var(--gray-50)] p-6">
            <div className="flex flex-col items-start gap-3">
              <InboxIcon className="h-7 w-7 text-[var(--gray-400)]" />
              <div>
                <p className="text-sm font-semibold text-[var(--gray-900)]">
                  Chưa có dữ liệu mượn sách
                </p>
                <p className="mt-1 text-sm text-[var(--gray-600)]">
                  Khi phát sinh giao dịch mượn, bảng xếp hạng đầu sách sẽ xuất hiện tại đây.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm text-[var(--gray-500)]">
                <BookIcon className="h-4 w-4" />
                Dữ liệu sẽ được tổng hợp tự động từ phiếu mượn.
              </span>
            </div>
          </div>
        ) : (
          items.map((item, index) => (
            <article
              key={`${item.ten_dau_sach}-${item.tac_gia}`}
              className="rounded-[var(--radius-lg)] border border-[var(--gray-200)] bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--gray-400)]">
                    Hạng #{index + 1}
                  </p>
                  <h4 className="mt-1 text-base font-semibold text-[var(--gray-900)]">
                    {item.ten_dau_sach}
                  </h4>
                  <p className="mt-1 text-sm text-[var(--gray-600)]">{item.tac_gia}</p>
                </div>
                <div className="rounded-2xl bg-[var(--primary-light)] px-3 py-2 text-right">
                  <p className="text-xs text-[var(--gray-500)]">Lượt mượn</p>
                  <p className="text-lg font-semibold text-[var(--primary)]">
                    {item.so_luot_muon}
                  </p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="hidden md:block">
        <DataTable
          columns={[
            { label: "STT" },
            { label: "Tên sách" },
            { label: "Tác giả", className: "hidden lg:table-cell" },
            { label: "Số lượt mượn" },
          ]}
        >
          <TableState
            loading={loading}
            isEmpty={items.length === 0}
            columns={4}
            empty={{
              icon: <InboxIcon className="h-7 w-7" />,
              title: "Chưa có dữ liệu mượn sách",
              description:
                "Khi phát sinh giao dịch mượn, bảng xếp hạng đầu sách sẽ xuất hiện tại đây.",
              action: (
                <span className="inline-flex items-center gap-2 text-sm text-[var(--gray-500)]">
                  <BookIcon className="h-4 w-4" />
                  Dữ liệu sẽ được tổng hợp tự động từ phiếu mượn.
                </span>
              ),
            }}
          >
            {items.map((item, index) => (
              <tr key={`${item.ten_dau_sach}-${item.tac_gia}`}>
                <TableCell className="font-semibold">{index + 1}</TableCell>
                <TableCell>{item.ten_dau_sach}</TableCell>
                <TableCell className="hidden text-[var(--gray-600)] lg:table-cell">
                  {item.tac_gia}
                </TableCell>
                <TableCell className="font-semibold">{item.so_luot_muon}</TableCell>
              </tr>
            ))}
          </TableState>
        </DataTable>
      </div>
    </TableCard>
  );
}
