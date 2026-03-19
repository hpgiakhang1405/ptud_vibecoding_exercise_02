"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export function PreviewCard({
  title,
  icon,
  loading,
  highlighted,
  emptyMessage,
  children,
}: {
  title: string;
  icon: ReactNode;
  loading: boolean;
  highlighted: boolean;
  emptyMessage: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border p-4 transition-colors",
        highlighted
          ? "border-[var(--primary)] bg-[var(--primary-light)]"
          : "border-[var(--gray-200)] bg-white",
      )}
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--gray-900)]">
        <span className="text-[var(--primary)]">{icon}</span>
        {title}
      </div>
      <div className="mt-4">
        {loading ? (
          <div className="space-y-2">
            <div className="ui-skeleton h-4 rounded-full" />
            <div className="ui-skeleton h-4 w-3/4 rounded-full" />
          </div>
        ) : children ? (
          children
        ) : (
          <p className="text-sm text-[var(--gray-600)]">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--red)]/10 bg-[var(--red-light)] px-4 py-3 text-sm text-[var(--red)]">
      {message}
    </div>
  );
}

export function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-[44px] flex-1 rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium transition-all duration-150 sm:flex-none",
        active
          ? "bg-[var(--primary-light)] text-[var(--primary)]"
          : "text-[var(--gray-600)] hover:bg-[var(--gray-50)]",
      )}
    >
      {children}
    </button>
  );
}

export function TimelineStep({
  active,
  label,
  description,
}: {
  active: boolean;
  label: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
            active
              ? "bg-[var(--primary)] text-white"
              : "bg-[var(--gray-100)] text-[var(--gray-400)]",
          )}
        >
          {active ? "1" : "2"}
        </span>
        <span className="mt-2 h-full w-px bg-[var(--gray-200)]" />
      </div>
      <div className="pb-4">
        <p className="text-sm font-semibold text-[var(--gray-900)]">{label}</p>
        <p className="mt-1 text-sm text-[var(--gray-600)]">{description}</p>
      </div>
    </div>
  );
}

export function LoanTimeline({ returned }: { returned: boolean }) {
  return (
    <div className="flex items-center gap-3 text-xs font-medium">
      <span className="inline-flex items-center gap-2 text-[var(--gray-900)]">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
        Đang mượn
      </span>
      <span className="h-px w-8 bg-[var(--gray-200)]" />
      <span
        className={cn(
          "inline-flex items-center gap-2",
          returned ? "text-[var(--green)]" : "text-[var(--gray-400)]",
        )}
      >
        <span
          className={cn(
            "h-2.5 w-2.5 rounded-full",
            returned ? "bg-[var(--green)]" : "bg-[var(--gray-200)]",
          )}
        />
        Đã trả
      </span>
    </div>
  );
}
