import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Field, SelectInput, TextInput } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import type { BookTitle, CopyFormValues } from "@/lib/types";

type BookCopyModalProps = {
  open: boolean;
  books: BookTitle[];
  form: CopyFormValues;
  editingCopy: string | null;
  currentCopyBookName: string;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onFieldChange: <K extends keyof CopyFormValues>(field: K, value: CopyFormValues[K]) => void;
};

export function BookCopyModal({
  open,
  books,
  form,
  editingCopy,
  currentCopyBookName,
  submitting,
  onClose,
  onSubmit,
  onFieldChange,
}: BookCopyModalProps) {
  const isEditing = Boolean(editingCopy);
  const readOnlyClassName = isEditing
    ? "bg-[var(--gray-50)] text-[var(--gray-600)]"
    : undefined;

  return (
    <Modal
      open={open}
      title={editingCopy ? "Cập nhật bản sao" : "Thêm bản sao"}
      description="Quản lý từng bản sao để theo dõi chính xác tình trạng khai thác."
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Hủy
          </Button>
          <Button type="submit" form="copy-form" loading={submitting}>
            {editingCopy ? "Cập nhật" : "Tạo mới"}
          </Button>
        </>
      }
    >
      <form id="copy-form" className="space-y-4" onSubmit={onSubmit}>
        <Field label="Mã bản sao">
          <TextInput
            value={form.ma_sach}
            onChange={(event) => onFieldChange("ma_sach", event.target.value)}
            required
            disabled={isEditing}
            className={readOnlyClassName}
          />
        </Field>
        <Field label="Đầu sách">
          <SelectInput
            value={form.ma_dau_sach}
            onChange={(event) => onFieldChange("ma_dau_sach", event.target.value)}
            required
            disabled={isEditing}
            className={readOnlyClassName}
          >
            <option value="">Chọn đầu sách</option>
            {books.map((book) => (
              <option key={book.ma_dau_sach} value={book.ma_dau_sach}>
                {book.ten_dau_sach}
              </option>
            ))}
          </SelectInput>
        </Field>
        {isEditing ? (
          <>
            <Field label="Tên đầu sách">
              <TextInput
                value={currentCopyBookName}
                disabled
                className="bg-[var(--gray-50)] text-[var(--gray-600)]"
              />
            </Field>
            <Field label="Tình trạng">
              <SelectInput
                value={form.tinh_trang}
                onChange={(event) =>
                  onFieldChange(
                    "tinh_trang",
                    event.target.value as CopyFormValues["tinh_trang"],
                  )
                }
              >
                <option value="san_sang">Sẵn sàng</option>
                <option value="hong">Hỏng</option>
              </SelectInput>
            </Field>
          </>
        ) : (
          <Field label="Ngày nhập">
            <TextInput
              type="date"
              value={form.ngay_nhap}
              onChange={(event) => onFieldChange("ngay_nhap", event.target.value)}
              required
            />
          </Field>
        )}
      </form>
    </Modal>
  );
}
