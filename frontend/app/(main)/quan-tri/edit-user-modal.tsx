"use client";

import type { ChangeEvent, FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Field, SelectInput, TextInput } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import type { UpdateUserFormValues } from "@/lib/types";

type EditUserModalProps = {
  open: boolean;
  form: UpdateUserFormValues;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onFieldChange: <K extends keyof UpdateUserFormValues>(
    field: K,
    value: UpdateUserFormValues[K],
  ) => void;
};

export function EditUserModal({
  open,
  form,
  submitting,
  onClose,
  onSubmit,
  onFieldChange,
}: EditUserModalProps) {
  return (
    <Modal
      open={open}
      title="Cập nhật tài khoản"
      description="Điều chỉnh quyền, trạng thái hoặc đặt lại mật khẩu cho tài khoản này."
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Hủy
          </Button>
          <Button type="submit" form="edit-user-form" loading={submitting}>
            Lưu thay đổi
          </Button>
        </>
      }
    >
      <form id="edit-user-form" className="space-y-4" onSubmit={onSubmit}>
        <Field label="Họ tên">
          <TextInput
            value={form.ho_ten}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onFieldChange("ho_ten", event.target.value)
            }
            placeholder="Nhập họ tên"
            required
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Quyền">
            <SelectInput
              value={form.quyen}
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                onFieldChange("quyen", event.target.value as UpdateUserFormValues["quyen"])
              }
            >
              <option value="thu_thu">Thủ thư</option>
              <option value="admin">Quản trị viên</option>
            </SelectInput>
          </Field>
          <Field label="Trạng thái">
            <SelectInput
              value={form.trang_thai}
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                onFieldChange(
                  "trang_thai",
                  event.target.value as UpdateUserFormValues["trang_thai"],
                )
              }
            >
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
            </SelectInput>
          </Field>
        </div>
        <Field label="Đổi mật khẩu" hint="Để trống nếu muốn giữ nguyên mật khẩu hiện tại.">
          <TextInput
            type="password"
            value={form.mat_khau}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onFieldChange("mat_khau", event.target.value)
            }
            placeholder="Nhập mật khẩu mới"
          />
        </Field>
      </form>
    </Modal>
  );
}
