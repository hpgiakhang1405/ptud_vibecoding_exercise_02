"use client";

import { useAuth } from "@/components/auth-provider";
import { PlusIcon } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/modal";

import { CreateUserModal } from "./create-user-modal";
import { EditUserModal } from "./edit-user-modal";
import { UserStatGrid } from "./user-stat-grid";
import { UserTableCard } from "./user-table-card";
import { useUserManagement } from "./use-user-management";

export default function QuanTriPageClient() {
  const { user } = useAuth();
  const {
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
  } = useUserManagement();

  const totalUsers = users.length;
  const adminCount = users.filter((item) => item.quyen === "admin").length;
  const activeCount = users.filter((item) => item.trang_thai === "active").length;

  return (
    <div>
      <PageHeader
        breadcrumb={["Quản trị", "Tài khoản"]}
        title="Quản trị tài khoản"
        description="Quản lý tài khoản đăng nhập, phân quyền và trạng thái hoạt động của người dùng nội bộ."
        actions={
          <Button icon={<PlusIcon className="h-4 w-4" />} onClick={openCreateModal}>
            Thêm mới
          </Button>
        }
      />

      <UserStatGrid
        totalUsers={totalUsers}
        adminCount={adminCount}
        activeCount={activeCount}
      />

      <UserTableCard
        currentUserId={user.ma_nguoi_dung}
        users={users}
        loading={loading}
        onCreate={openCreateModal}
        onEdit={openEditModal}
        onDelete={setDeleteTarget}
      />

      <CreateUserModal
        open={createModalOpen}
        form={createForm}
        submitting={submitting}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={submitCreateUser}
        onFieldChange={updateCreateField}
      />

      <EditUserModal
        open={editModalOpen}
        form={editForm}
        submitting={submitting}
        onClose={() => setEditModalOpen(false)}
        onSubmit={submitEditUser}
        onFieldChange={updateEditField}
      />

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Xác nhận xóa tài khoản"
        description={
          deleteTarget
            ? `Bạn có chắc muốn xóa tài khoản "${deleteTarget.tai_khoan}"?`
            : ""
        }
        confirmLabel="Xóa tài khoản"
        loading={submitting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDeleteUser()}
      />
    </div>
  );
}
