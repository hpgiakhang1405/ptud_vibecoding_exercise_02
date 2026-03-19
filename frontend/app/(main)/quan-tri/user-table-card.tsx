"use client";

import { InboxIcon, PlusIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DataTable,
  TableCard,
  TableCell,
  TableRow,
  TableState,
} from "@/components/ui/table";
import type { UserItem } from "@/lib/types";

type UserTableCardProps = {
  currentUserId: string;
  users: UserItem[];
  loading: boolean;
  onCreate: () => void;
  onEdit: (user: UserItem) => void;
  onDelete: (user: UserItem) => void;
};

export function UserTableCard({
  currentUserId,
  users,
  loading,
  onCreate,
  onEdit,
  onDelete,
}: UserTableCardProps) {
  return (
    <TableCard
      title="Danh sách tài khoản"
      description="Admin có thể tạo mới, cập nhật quyền và khóa hoặc kích hoạt lại tài khoản thủ thư."
    >
      <div className="space-y-3 md:hidden">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[var(--radius-lg)] border border-[var(--gray-200)] bg-white p-4"
            >
              <div className="ui-skeleton h-4 w-20 rounded-full" />
              <div className="ui-skeleton mt-3 h-5 w-2/3 rounded-full" />
              <div className="ui-skeleton mt-2 h-4 w-1/2 rounded-full" />
            </div>
          ))
        ) : users.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--gray-200)] bg-[var(--gray-50)] p-6">
            <div className="flex flex-col items-start gap-3">
              <InboxIcon className="h-10 w-10 text-[var(--gray-400)]" />
              <div>
                <p className="text-sm font-semibold text-[var(--gray-900)]">
                  Chưa có tài khoản nào
                </p>
                <p className="mt-1 text-sm text-[var(--gray-600)]">
                  Tạo tài khoản đầu tiên để bắt đầu quản lý quyền truy cập hệ thống.
                </p>
              </div>
              <Button icon={<PlusIcon className="h-4 w-4" />} onClick={onCreate}>
                Tạo tài khoản
              </Button>
            </div>
          </div>
        ) : (
          users.map((item) => (
            <article
              key={item.ma_nguoi_dung}
              className="rounded-[var(--radius-lg)] border border-[var(--gray-200)] bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--gray-400)]">
                    {item.ma_nguoi_dung}
                  </p>
                  <h4 className="mt-1 text-base font-semibold text-[var(--gray-900)]">
                    {item.ho_ten}
                  </h4>
                  <p className="mt-1 text-sm text-[var(--gray-600)]">{item.tai_khoan}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge tone={item.quyen === "admin" ? "admin" : "thu_thu"} />
                  <Badge tone={item.trang_thai === "active" ? "active" : "inactive"} />
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button variant="secondary" size="sm" className="sm:flex-1" onClick={() => onEdit(item)}>
                  Sửa
                </Button>
                <Button variant="danger" size="sm" className="sm:flex-1" onClick={() => onDelete(item)}>
                  Xóa
                </Button>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="hidden md:block">
        <DataTable
          columns={[
            { label: "Mã" },
            { label: "Họ tên" },
            { label: "Tài khoản", className: "hidden lg:table-cell" },
            { label: "Quyền" },
            { label: "Trạng thái" },
            { label: "Actions", align: "right" },
          ]}
        >
          <TableState
            loading={loading}
            isEmpty={users.length === 0}
            columns={6}
            empty={{
              icon: <InboxIcon className="h-10 w-10" />,
              title: "Chưa có tài khoản nào",
              description: "Tạo tài khoản đầu tiên để bắt đầu quản lý quyền truy cập hệ thống.",
              action: (
                <Button icon={<PlusIcon className="h-4 w-4" />} onClick={onCreate}>
                  Tạo tài khoản
                </Button>
              ),
            }}
          >
            {users.map((item) => {
              return (
                <TableRow key={item.ma_nguoi_dung}>
                  <TableCell className="font-semibold">{item.ma_nguoi_dung}</TableCell>
                  <TableCell>{item.ho_ten}</TableCell>
                  <TableCell className="hidden text-[var(--gray-600)] lg:table-cell">
                    {item.tai_khoan}
                  </TableCell>
                  <TableCell>
                    <Badge tone={item.quyen === "admin" ? "admin" : "thu_thu"} />
                  </TableCell>
                  <TableCell>
                    <Badge tone={item.trang_thai === "active" ? "active" : "inactive"} />
                  </TableCell>
                  <TableCell align="right">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" size="sm" onClick={() => onEdit(item)}>
                        Sửa
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => onDelete(item)}>
                        Xóa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableState>
        </DataTable>
      </div>
    </TableCard>
  );
}
