"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { PlusIcon } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/modal";
import {
  createReader,
  deleteReader,
  listReaders,
  updateReader,
} from "@/lib/api";
import type { ReaderFormValues, ReaderRecord } from "@/lib/types";
import { showToast } from "@/lib/toast";

import { ReaderFormModal } from "./reader-form-modal";
import { printReaderCard } from "./reader-card-print";
import { ReaderSummaryCards } from "./reader-summary-cards";
import { ReaderTableCard } from "./reader-table-card";

const emptyForm: ReaderFormValues = {
  ma_doc_gia: "",
  ho_ten: "",
  lop: "",
  ngay_sinh: "",
  gioi_tinh: "nam",
  trang_thai: "active",
};

export default function DocGiaPage() {
  const [items, setItems] = useState<ReaderRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ReaderFormValues>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<ReaderRecord | null>(null);

  const activeCount = useMemo(
    () => items.filter((item) => item.trang_thai === "active").length,
    [items],
  );

  const loadDocGia = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listReaders(search);
      if (!data) {
        return;
      }
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    void loadDocGia();
  }, [loadDocGia]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadDocGia(), 250);
    return () => window.clearTimeout(timer);
  }, [loadDocGia]);

  function openCreate() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      ngay_sinh: new Date().toISOString().slice(0, 10),
    });
    setModalOpen(true);
  }

  function openEdit(item: ReaderRecord) {
    setEditingId(item.ma_doc_gia);
    setForm({
      ma_doc_gia: item.ma_doc_gia,
      ho_ten: item.ho_ten,
      lop: item.lop,
      ngay_sinh: item.ngay_sinh,
      gioi_tinh: item.gioi_tinh,
      trang_thai: item.trang_thai,
    });
    setModalOpen(true);
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        const success = await updateReader(editingId, form);
        if (!success) {
          return;
        }
        showToast("Cập nhật độc giả thành công", "success");
      } else {
        const success = await createReader(form);
        if (!success) {
          return;
        }
        showToast("Tạo thẻ thư viện thành công", "success");
      }
      setModalOpen(false);
      setForm(emptyForm);
      await loadDocGia();
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      const success = await deleteReader(deleteTarget.ma_doc_gia);
      if (!success) {
        return;
      }
      showToast("Xóa độc giả thành công", "success");
      setDeleteTarget(null);
      await loadDocGia();
    } finally {
      setSubmitting(false);
    }
  }

  function handlePrintCard(item: ReaderRecord) {
    if (!printReaderCard(item)) {
      showToast("Trình duyệt đang chặn cửa sổ in thẻ", "error");
      return;
    }
  }

  function updateFormField<K extends keyof ReaderFormValues>(
    field: K,
    value: ReaderFormValues[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  return (
    <section>
      <PageHeader
        breadcrumb={["Bạn đọc", "Độc giả"]}
        title="Quản lý Độc giả"
        description="Tạo, cập nhật, in thẻ và theo dõi trạng thái hoạt động của độc giả trong toàn hệ thống."
        actions={
          <Button icon={<PlusIcon className="h-4 w-4" />} onClick={openCreate}>
            Thêm độc giả
          </Button>
        }
      />

      <ReaderSummaryCards readers={items} activeCount={activeCount} />

      <ReaderTableCard
        readers={items}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        onCreate={openCreate}
        onPrint={handlePrintCard}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />

      <ReaderFormModal
        open={modalOpen}
        editingId={editingId}
        form={form}
        submitting={submitting}
        onClose={() => setModalOpen(false)}
        onSubmit={submitForm}
        onFieldChange={updateFormField}
      />

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Xác nhận xóa độc giả"
        description={
          deleteTarget ? `Bạn có chắc muốn xóa độc giả "${deleteTarget.ho_ten}"?` : ""
        }
        confirmLabel="Xóa độc giả"
        loading={submitting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}
