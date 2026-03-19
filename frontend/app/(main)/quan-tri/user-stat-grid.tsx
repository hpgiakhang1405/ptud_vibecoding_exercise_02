"use client";

import { ShieldIcon, UsersIcon } from "@/components/icons";
import { StatCard } from "@/components/stat-card";

type UserStatGridProps = {
  totalUsers: number;
  adminCount: number;
  activeCount: number;
};

export function UserStatGrid({
  totalUsers,
  adminCount,
  activeCount,
}: UserStatGridProps) {
  return (
    <div className="mb-8 grid gap-4 md:grid-cols-3">
      <StatCard
        label="Tổng tài khoản"
        value={totalUsers}
        icon={<UsersIcon className="h-5 w-5" />}
        tone="primary"
      />
      <StatCard
        label="Quản trị viên"
        value={adminCount}
        icon={<ShieldIcon className="h-5 w-5" />}
        tone="purple"
      />
      <StatCard
        label="Đang hoạt động"
        value={activeCount}
        icon={<UsersIcon className="h-5 w-5" />}
        tone="green"
      />
    </div>
  );
}
