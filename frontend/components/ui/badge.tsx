import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type BadgeTone =
  | "active"
  | "san_sang"
  | "thu_thu"
  | "dang_muon"
  | "da_tra"
  | "inactive"
  | "hong"
  | "admin"
  | "locked";

const toneClass: Record<BadgeTone, string> = {
  active:
    "border border-emerald-200 bg-emerald-50/90 text-emerald-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]",
  san_sang:
    "border border-emerald-200 bg-emerald-50/90 text-emerald-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]",
  thu_thu:
    "border border-amber-200 bg-amber-50/90 text-amber-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]",
  dang_muon:
    "border border-amber-200 bg-amber-50/90 text-amber-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]",
  da_tra:
    "border border-sky-200 bg-sky-50/90 text-sky-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]",
  inactive:
    "border border-slate-200 bg-slate-100/90 text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]",
  hong:
    "border border-rose-200 bg-rose-50/90 text-rose-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]",
  locked:
    "border border-rose-200 bg-rose-50/90 text-rose-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]",
  admin:
    "border border-violet-200 bg-violet-50/90 text-violet-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]",
};

const toneLabel: Record<BadgeTone, string> = {
  active: "Đang hoạt động",
  san_sang: "Sẵn sàng",
  thu_thu: "Thủ thư",
  dang_muon: "Đang mượn",
  da_tra: "Đã trả",
  inactive: "Ngừng hoạt động",
  hong: "Hỏng",
  admin: "Quản trị viên",
  locked: "Bị khóa",
};

const toneDotClass: Record<BadgeTone, string> = {
  active: "bg-emerald-500",
  san_sang: "bg-emerald-500",
  thu_thu: "bg-amber-500",
  dang_muon: "bg-amber-500",
  da_tra: "bg-sky-500",
  inactive: "bg-slate-500",
  hong: "bg-rose-500",
  admin: "bg-violet-500",
  locked: "bg-rose-500",
};

export function getBadgeLabel(tone: BadgeTone) {
  return toneLabel[tone];
}

export function Badge({
  tone,
  children,
  className,
  hideIndicator = false,
}: {
  tone: BadgeTone;
  children?: ReactNode;
  className?: string;
  hideIndicator?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.01em]",
        toneClass[tone],
        className,
      )}
    >
      {!hideIndicator ? <span className={cn("h-2 w-2 rounded-full", toneDotClass[tone])} /> : null}
      <span>{children ?? getBadgeLabel(tone)}</span>
    </span>
  );
}
