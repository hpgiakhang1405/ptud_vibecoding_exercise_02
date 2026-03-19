"use client";

import type { ChangeEvent, FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Field, SelectInput, TextInput } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import type { ReaderFormValues } from "@/lib/types";

type ReaderFormModalProps = {
  open: boolean;
  editingId: string | null;
  form: ReaderFormValues;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onFieldChange: <K extends keyof ReaderFormValues>(
    field: K,
    value: ReaderFormValues[K],
  ) => void;
};

export function ReaderFormModal({
  open,
  editingId,
  form,
  submitting,
  onClose,
  onSubmit,
  onFieldChange,
}: ReaderFormModalProps) {
  return (
    <Modal
      open={open}
      title={editingId ? "Cập nhật độc giả" : "Thêm độc giả"}
      description="Điền thông tin độc giả để tạo hoặc cập nhật thẻ thư viện."
      maxWidthClassName="max-w-2xl"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Hủy
          </Button>
          <Button type="submit" form="reader-form" loading={submitting}>
            {editingId ? "Cập nhật" : "Tạo mới"}
          </Button>
        </>
      }
    >
      <form id="reader-form" className="space-y-4" onSubmit={onSubmit}>
        <Field label="Mã độc giả">
          <TextInput
            value={form.ma_doc_gia}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onFieldChange("ma_doc_gia", event.target.value)
            }
            required
            disabled={Boolean(editingId)}
            className={editingId ? "bg-[var(--gray-50)] text-[var(--gray-600)]" : undefined}
          />
        </Field>
        <Field label="Họ tên">
          <TextInput
            value={form.ho_ten}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onFieldChange("ho_ten", event.target.value)
            }
            required
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Lớp">
            <TextInput
              value={form.lop}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                onFieldChange("lop", event.target.value)
              }
              required
            />
          </Field>
          <Field label="Ngày sinh">
            <TextInput
              type="date"
              value={form.ngay_sinh}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                onFieldChange("ngay_sinh", event.target.value)
              }
              required
            />
          </Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Giới tính">
            <SelectInput
              value={form.gioi_tinh}
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                onFieldChange("gioi_tinh", event.target.value as ReaderFormValues["gioi_tinh"])
              }
            >
              <option value="nam">Nam</option>
              <option value="nu">Nữ</option>
            </SelectInput>
          </Field>
          <Field label="Trạng thái">
            <SelectInput
              value={form.trang_thai}
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                onFieldChange(
                  "trang_thai",
                  event.target.value as ReaderFormValues["trang_thai"],
                )
              }
            >
              <option value="active">Đang hoạt động</option>
              <option value="locked">Bị khóa</option>
            </SelectInput>
          </Field>
        </div>
      </form>
    </Modal>
  );
}
