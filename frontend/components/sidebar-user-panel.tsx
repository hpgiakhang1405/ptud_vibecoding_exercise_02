"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import type { AuthUser } from "@/lib/types";

type UserPanelProps = {
  initials: string;
  user: AuthUser;
  compact?: boolean;
};

export function UserPanel({
  initials,
  user,
  compact = false,
}: UserPanelProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-[var(--radius-lg)] bg-[var(--gray-50)] p-3",
        compact ? "md:justify-center md:px-2 lg:justify-start lg:px-3" : "",
      )}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-semibold text-white">
        {initials}
      </div>
      <div className={cn("min-w-0 flex-1", compact ? "md:hidden lg:block" : "")}>
        <p className="truncate text-sm font-semibold text-[var(--gray-900)]">{user.ho_ten}</p>
        <div className="mt-1">
          <Badge tone={user.quyen === "admin" ? "admin" : "thu_thu"} />
        </div>
      </div>
    </div>
  );
}
