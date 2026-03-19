"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";

import { createUser, deleteUser, listUsers, updateUser } from "@/lib/api";
import type {
  CreateUserFormValues,
  CreateUserPayload,
  UpdateUserFormValues,
  UpdateUserPayload,
  UserItem,
} from "@/lib/types";
import { showToast } from "@/lib/toast";

const emptyCreateForm: CreateUserFormValues = {
  ho_ten: "",
  tai_khoan: "",
  mat_khau: "",
  quyen: "thu_thu",
};

const emptyEditForm: UpdateUserFormValues = {
  ho_ten: "",
  quyen: "thu_thu",
  trang_thai: "active",
  mat_khau: "",
};

export function useUserManagement() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserItem | null>(null);
  const [createForm, setCreateForm] = useState<CreateUserFormValues>(emptyCreateForm);
  const [editForm, setEditForm] = useState<UpdateUserFormValues>(emptyEditForm);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listUsers();
      if (!data) {
        return;
      }
      setUsers(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  function openCreateModal() {
    setCreateForm(emptyCreateForm);
    setCreateModalOpen(true);
  }

  function openEditModal(target: UserItem) {
    setEditingUserId(target.ma_nguoi_dung);
    setEditForm({
      ho_ten: target.ho_ten,
      quyen: target.quyen,
      trang_thai: target.trang_thai,
      mat_khau: "",
    });
    setEditModalOpen(true);
  }

  async function submitCreateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const payload: CreateUserPayload = {
        ...createForm,
        trang_thai: "active",
      };
      const success = await createUser(payload);
      if (!success) {
        return;
      }
      showToast("Tạo tài khoản thành công", "success");
      setCreateModalOpen(false);
      setCreateForm(emptyCreateForm);
      await loadUsers();
    } finally {
      setSubmitting(false);
    }
  }

  async function submitEditUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingUserId) {
      return;
    }

    setSubmitting(true);
    try {
      const payload: UpdateUserPayload = {
        ho_ten: editForm.ho_ten,
        quyen: editForm.quyen,
        trang_thai: editForm.trang_thai,
        mat_khau: editForm.mat_khau.trim() || null,
      };
      const success = await updateUser(editingUserId, payload);
      if (!success) {
        return;
      }
      showToast("Cập nhật tài khoản thành công", "success");
      setEditModalOpen(false);
      setEditingUserId(null);
      setEditForm(emptyEditForm);
      await loadUsers();
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDeleteUser() {
    if (!deleteTarget) {
      return;
    }

    setSubmitting(true);
    try {
      const success = await deleteUser(deleteTarget.ma_nguoi_dung);
      if (!success) {
        return;
      }
      showToast("Xóa tài khoản thành công", "success");
      setDeleteTarget(null);
      await loadUsers();
    } finally {
      setSubmitting(false);
    }
  }

  function updateCreateField<K extends keyof CreateUserFormValues>(
    field: K,
    value: CreateUserFormValues[K],
  ) {
    setCreateForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateEditField<K extends keyof UpdateUserFormValues>(
    field: K,
    value: UpdateUserFormValues[K],
  ) {
    setEditForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  return {
    users,
    loading,
    submitting,
    createModalOpen,
    editModalOpen,
    deleteTarget,
    createForm,
    editForm,
    openCreateModal,
    openEditModal,
    setCreateModalOpen,
    setEditModalOpen,
    setDeleteTarget,
    submitCreateUser,
    submitEditUser,
    confirmDeleteUser,
    updateCreateField,
    updateEditField,
  };
}
