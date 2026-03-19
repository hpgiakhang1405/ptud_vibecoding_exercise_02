"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { PlusIcon } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/modal";
import { createMajor, deleteMajor, listMajors, updateMajor } from "@/lib/api";
import type { Major, MajorFormValues } from "@/lib/types";
import { showToast } from "@/lib/toast";

import { MajorFormModal } from "./major-form-modal";
import { MajorTableCard } from "./major-table-card";

const emptyForm: MajorFormValues = {
  ma_chuyen_nganh: "",
  ten_chuyen_nganh: "",
  mo_ta: "",
};

export default function ChuyenNganhPage() {
  const [items, setItems] = useState<Major[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Major | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MajorFormValues>(emptyForm);

  const modalTitle = useMemo(
    () => (editingId ? "Cập nhật chuyên ngành" : "Thêm chuyên ngành"),
    [editingId],
  );

  const loadMajors = useCallback(async (keyword: string) => {
    setLoading(true);
    try {
      const data = await listMajors(keyword);
      if (!data) {
        return;
      }
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadMajors(search);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [loadMajors, search]);

  useEffect(() => {
    void loadMajors("");
  }, [loadMajors]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (item: Major) => {
    setEditingId(item.ma_chuyen_nganh);
    setForm({
      ma_chuyen_nganh: item.ma_chuyen_nganh,
      ten_chuyen_nganh: item.ten_chuyen_nganh,
      mo_ta: item.mo_ta,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        const data = await updateMajor(editingId, form);
        if (!data) {
          return;
        }
        showToast("Cập nhật chuyên ngành thành công");
      } else {
        const data = await createMajor(form);
        if (!data) {
          return;
        }
        showToast("Tạo chuyên ngành thành công");
      }
      closeModal();
      await loadMajors(search);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setSubmitting(true);
    try {
      const data = await deleteMajor(deleteTarget.ma_chuyen_nganh);
      if (!data) {
        return;
      }
      showToast("Xóa chuyên ngành thành công");
      setDeleteTarget(null);
      await loadMajors(search);
    } finally {
      setSubmitting(false);
    }
  };

  function updateFormField<K extends keyof MajorFormValues>(
    field: K,
    value: MajorFormValues[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  return (
    <section>
      <PageHeader
        breadcrumb={["Danh mục", "Chuyên ngành"]}
        title="Quản lý Chuyên ngành"
        description="Quản lý các nhóm chuyên ngành để tổ chức kho sách và đồng bộ danh mục trên toàn hệ thống."
        actions={
          <Button icon={<PlusIcon className="h-4 w-4" />} onClick={openCreateModal}>
            Thêm mới
          </Button>
        }
      />

      <MajorTableCard
        items={items}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        onCreate={openCreateModal}
        onEdit={openEditModal}
        onDelete={setDeleteTarget}
      />

      <MajorFormModal
        open={modalOpen}
        title={modalTitle}
        form={form}
        editingId={editingId}
        submitting={submitting}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onFieldChange={updateFormField}
      />

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Xác nhận xóa chuyên ngành"
        description={
          deleteTarget
            ? `Bạn có chắc muốn xóa chuyên ngành "${deleteTarget.ten_chuyen_nganh}"?`
            : ""
        }
        confirmLabel="Xóa chuyên ngành"
        loading={submitting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </section>
  );
}
