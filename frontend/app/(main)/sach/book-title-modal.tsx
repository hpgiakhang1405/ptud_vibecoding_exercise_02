import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Field, SelectInput, TextInput } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import type { BookFormValues, Major } from "@/lib/types";

type BookTitleModalProps = {
  open: boolean;
  majors: Major[];
  form: BookFormValues;
  editingBook: string | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onFieldChange: <K extends keyof BookFormValues>(field: K, value: BookFormValues[K]) => void;
};

export function BookTitleModal({
  open,
  majors,
  form,
  editingBook,
  submitting,
  onClose,
  onSubmit,
  onFieldChange,
}: BookTitleModalProps) {
  return (
    <Modal
      open={open}
      title={editingBook ? "Cập nhật đầu sách" : "Thêm đầu sách"}
      description="Quản lý đầy đủ metadata của đầu sách để đồng bộ kho và báo cáo."
      maxWidthClassName="max-w-2xl"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Hủy
          </Button>
          <Button type="submit" form="book-form" loading={submitting}>
            {editingBook ? "Cập nhật" : "Tạo mới"}
          </Button>
        </>
      }
    >
      <form id="book-form" className="space-y-4" onSubmit={onSubmit}>
        <Field label="Mã đầu sách">
          <TextInput
            value={form.ma_dau_sach}
            onChange={(event) => onFieldChange("ma_dau_sach", event.target.value)}
            required
          />
        </Field>
        <Field label="Tên đầu sách">
          <TextInput
            value={form.ten_dau_sach}
            onChange={(event) => onFieldChange("ten_dau_sach", event.target.value)}
            required
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Tác giả">
            <TextInput
              value={form.tac_gia}
              onChange={(event) => onFieldChange("tac_gia", event.target.value)}
              required
            />
          </Field>
          <Field label="Nhà xuất bản">
            <TextInput
              value={form.nha_xuat_ban}
              onChange={(event) => onFieldChange("nha_xuat_ban", event.target.value)}
              required
            />
          </Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Số trang">
            <TextInput
              type="number"
              min="1"
              value={form.so_trang}
              onChange={(event) => onFieldChange("so_trang", event.target.value)}
              required
            />
          </Field>
          <Field label="Kích thước">
            <TextInput
              value={form.kich_thuoc}
              onChange={(event) => onFieldChange("kich_thuoc", event.target.value)}
              required
            />
          </Field>
        </div>
        <Field label="Chuyên ngành">
          <SelectInput
            value={form.ma_chuyen_nganh}
            onChange={(event) => onFieldChange("ma_chuyen_nganh", event.target.value)}
            required
          >
            <option value="">Chọn chuyên ngành</option>
            {majors.map((major) => (
              <option key={major.ma_chuyen_nganh} value={major.ma_chuyen_nganh}>
                {major.ten_chuyen_nganh}
              </option>
            ))}
          </SelectInput>
        </Field>
      </form>
    </Modal>
  );
}
