"use client";

import type { ChangeEvent, FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Field, TextInput, TextareaInput } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import type { MajorFormValues } from "@/lib/types";

type MajorFormModalProps = {
  open: boolean;
  title: string;
  form: MajorFormValues;
  editingId: string | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onFieldChange: <K extends keyof MajorFormValues>(
    field: K,
    value: MajorFormValues[K],
  ) => void;
};

export function MajorFormModal({
  open,
  title,
  form,
  editingId,
  submitting,
  onClose,
  onSubmit,
  onFieldChange,
}: MajorFormModalProps) {
  return (
    <Modal
      open={open}
      title={title}
      description="Điền đầy đủ thông tin chuyên ngành để đồng bộ trên toàn hệ thống."
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Hủy
          </Button>
          <Button loading={submitting} type="submit" form="major-form">
            {editingId ? "Cập nhật" : "Tạo mới"}
          </Button>
        </>
      }
    >
      <form id="major-form" className="space-y-4" onSubmit={onSubmit}>
        <Field label="Mã chuyên ngành">
          <TextInput
            value={form.ma_chuyen_nganh}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onFieldChange("ma_chuyen_nganh", event.target.value)
            }
            required
          />
        </Field>

        <Field label="Tên chuyên ngành">
          <TextInput
            value={form.ten_chuyen_nganh}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onFieldChange("ten_chuyen_nganh", event.target.value)
            }
            required
          />
        </Field>

        <Field label="Mô tả" hint="Có thể để trống nếu chưa cần ghi chú thêm.">
          <TextareaInput
            value={form.mo_ta}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              onFieldChange("mo_ta", event.target.value)
            }
          />
        </Field>
      </form>
    </Modal>
  );
}
