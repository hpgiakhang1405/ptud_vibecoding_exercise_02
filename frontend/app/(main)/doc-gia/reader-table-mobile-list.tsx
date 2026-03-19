"use client";

import { InboxIcon, PlusIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ReaderRecord } from "@/lib/types";

type ReaderTableMobileListProps = {
  readers: ReaderRecord[];
  loading: boolean;
  onCreate: () => void;
  onDelete: (reader: ReaderRecord) => void;
  onEdit: (reader: ReaderRecord) => void;
  onPrint: (reader: ReaderRecord) => void;
};

export function ReaderTableMobileList({
  readers,
  loading,
  onCreate,
  onDelete,
  onEdit,
  onPrint,
}: ReaderTableMobileListProps) {
  if (loading) {
    return (
      <div className="space-y-3 md:hidden">
        {Array.from({ length: 3 }).map((_, index) => (
          <ReaderMobileSkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (readers.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--gray-200)] bg-[var(--gray-50)] p-6 md:hidden">
        <div className="flex flex-col items-start gap-3">
          <InboxIcon className="h-7 w-7 text-[var(--gray-400)]" />
          <div>
            <p className="text-sm font-semibold text-[var(--gray-900)]">Chưa có độc giả phù hợp</p>
            <p className="mt-1 text-sm text-[var(--gray-600)]">
              Bạn có thể thêm độc giả mới hoặc thay đổi điều kiện tìm kiếm để xem lại dữ liệu.
            </p>
          </div>
          <Button icon={<PlusIcon className="h-4 w-4" />} onClick={onCreate}>
            Thêm độc giả
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 md:hidden">
      {readers.map((item) => (
        <article
          key={item.ma_doc_gia}
          className="rounded-[var(--radius-lg)] border border-[var(--gray-200)] bg-white p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--gray-400)]">
                {item.ma_doc_gia}
              </p>
              <h4 className="mt-1 text-base font-semibold text-[var(--gray-900)]">
                {item.ho_ten}
              </h4>
              <p className="mt-1 text-sm text-[var(--gray-600)]">{item.lop}</p>
            </div>
            <Badge tone={item.trang_thai === "active" ? "active" : "locked"} />
          </div>

          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[var(--gray-400)]">Ngày sinh</dt>
              <dd className="mt-1 text-[var(--gray-900)]">{item.ngay_sinh}</dd>
            </div>
            <div>
              <dt className="text-[var(--gray-400)]">Giới tính</dt>
              <dd className="mt-1 capitalize text-[var(--gray-900)]">{item.gioi_tinh}</dd>
            </div>
          </dl>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button variant="secondary" size="sm" className="sm:flex-1" onClick={() => onPrint(item)}>
              In thẻ
            </Button>
            <Button variant="secondary" size="sm" className="sm:flex-1" onClick={() => onEdit(item)}>
              Sửa
            </Button>
            <Button variant="danger" size="sm" className="sm:flex-1" onClick={() => onDelete(item)}>
              Xóa
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}

function ReaderMobileSkeletonCard() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--gray-200)] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="ui-skeleton h-3 w-16 rounded-full" />
          <div className="ui-skeleton h-5 w-40 rounded-full" />
          <div className="ui-skeleton h-4 w-24 rounded-full" />
        </div>
        <div className="ui-skeleton h-6 w-20 rounded-full" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="ui-skeleton h-3 w-20 rounded-full" />
          <div className="ui-skeleton h-4 w-28 rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="ui-skeleton h-3 w-16 rounded-full" />
          <div className="ui-skeleton h-4 w-24 rounded-full" />
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <div className="ui-skeleton h-11 flex-1 rounded-[var(--radius-md)]" />
        <div className="ui-skeleton h-11 flex-1 rounded-[var(--radius-md)]" />
        <div className="ui-skeleton h-11 flex-1 rounded-[var(--radius-md)]" />
      </div>
    </div>
  );
}
