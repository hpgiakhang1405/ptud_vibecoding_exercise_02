"use client";

import type { ChangeEvent, FormEvent } from "react";

import { PlusIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Field, SelectInput, TextInput } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import type { CreateUserFormValues } from "@/lib/types";

type CreateUserModalProps = {
  open: boolean;
  form: CreateUserFormValues;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onFieldChange: <K extends keyof CreateUserFormValues>(
    field: K,
    value: CreateUserFormValues[K],
  ) => void;
};

export function CreateUserModal({
  open,
  form,
  submitting,
  onClose,
  onSubmit,
  onFieldChange,
}: CreateUserModalProps) {
  return (
    <Modal
      open={open}
      title="Thêm tài khoản mới"
      description="Điền thông tin cơ bản và phân quyền cho tài khoản mới."
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Hủy
          </Button>
          <Button
            type="submit"
            form="create-user-form"
            loading={submitting}
            icon={<PlusIcon className="h-4 w-4" />}
          >
            Tạo tài khoản
          </Button>
        </>
      }
    >
      <form id="create-user-form" className="space-y-4" onSubmit={onSubmit}>
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
        <Field label="Tài khoản">
          <TextInput
            value={form.tai_khoan}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onFieldChange("tai_khoan", event.target.value)
            }
            placeholder="Nhập tài khoản"
            required
          />
        </Field>
        <Field label="Mật khẩu">
          <TextInput
            type="password"
            value={form.mat_khau}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onFieldChange("mat_khau", event.target.value)
            }
            placeholder="Nhập mật khẩu"
            required
          />
        </Field>
        <Field label="Quyền">
          <SelectInput
            value={form.quyen}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              onFieldChange("quyen", event.target.value as CreateUserFormValues["quyen"])
            }
          >
            <option value="thu_thu">Thủ thư</option>
            <option value="admin">Quản trị viên</option>
          </SelectInput>
        </Field>
      </form>
    </Modal>
  );
}
