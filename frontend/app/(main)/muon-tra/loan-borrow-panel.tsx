"use client";

import type { ChangeEvent, FormEvent } from "react";

import { BookIcon, UsersIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/form";
import type { BookCopyPreview, ReaderPreview } from "@/lib/types";

import { ErrorBanner, PreviewCard } from "./loan-ui";

type LoanBorrowPanelProps = {
  maDocGia: string;
  maSach: string;
  reader: ReaderPreview | null;
  book: BookCopyPreview | null;
  readerLoading: boolean;
  bookLoading: boolean;
  readerError: string;
  bookError: string;
  canBorrow: boolean;
  submittingBorrow: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReaderChange: (value: string) => void;
  onBookChange: (value: string) => void;
};

export function LoanBorrowPanel({
  maDocGia,
  maSach,
  reader,
  book,
  readerLoading,
  bookLoading,
  readerError,
  bookError,
  canBorrow,
  submittingBorrow,
  onSubmit,
  onReaderChange,
  onBookChange,
}: LoanBorrowPanelProps) {
  return (
    <section className="surface-card p-4 sm:p-6">
      <div>
        <h3 className="text-base font-semibold text-[var(--gray-900)]">Tạo phiếu mượn</h3>
        <p className="mt-1 text-sm text-[var(--gray-600)]">
          Nhập đúng Mã độc giả và Mã sách để hệ thống kiểm tra nhanh trước khi xác nhận.
        </p>
      </div>

      <form className="mt-6 space-y-5" onSubmit={onSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Mã độc giả">
            <TextInput
              leftIcon={<UsersIcon className="h-4 w-4" />}
              value={maDocGia}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                onReaderChange(event.target.value)
              }
              placeholder="Ví dụ: DG001"
              required
            />
          </Field>

          <Field label="Mã sách">
            <TextInput
              leftIcon={<BookIcon className="h-4 w-4" />}
              value={maSach}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                onBookChange(event.target.value)
              }
              placeholder="Ví dụ: BS001"
              required
            />
          </Field>
        </div>

        {(readerError || bookError) && (
          <div className="space-y-2">
            {readerError ? <ErrorBanner message={readerError} /> : null}
            {bookError ? <ErrorBanner message={bookError} /> : null}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <PreviewCard
            title="Độc giả"
            icon={<UsersIcon className="h-4 w-4" />}
            loading={readerLoading}
            highlighted={Boolean(reader)}
            emptyMessage="Nhập Mã độc giả để xem trước hồ sơ người mượn."
          >
            {reader ? (
              <div className="space-y-2 text-sm text-[var(--gray-900)]">
                <p>
                  <span className="font-semibold">Họ tên:</span> {reader.ho_ten}
                </p>
                <p>
                  <span className="font-semibold">Lớp:</span> {reader.lop}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold">Trạng thái:</span>
                  <Badge tone={reader.trang_thai === "active" ? "active" : "locked"} />
                </p>
              </div>
            ) : null}
          </PreviewCard>

          <PreviewCard
            title="Bản sao sách"
            icon={<BookIcon className="h-4 w-4" />}
            loading={bookLoading}
            highlighted={Boolean(book)}
            emptyMessage="Nhập Mã sách để xem tên đầu sách và tình trạng hiện tại."
          >
            {book ? (
              <div className="space-y-2 text-sm text-[var(--gray-900)]">
                <p>
                  <span className="font-semibold">Tên sách:</span> {book.ten_dau_sach}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold">Tình trạng:</span>
                  <Badge tone={book.tinh_trang} />
                </p>
              </div>
            ) : null}
          </PreviewCard>
        </div>

        <div className="flex justify-end">
          <Button
            loading={submittingBorrow}
            disabled={!canBorrow}
            type="submit"
            className="w-full sm:w-auto"
          >
            Xác nhận mượn
          </Button>
        </div>
      </form>
    </section>
  );
}
