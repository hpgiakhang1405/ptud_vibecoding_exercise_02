import type { ReactNode } from "react";

import { CheckIcon, XIcon } from "@/components/icons";

export type ToastItem = {
  id: number | string;
  message: string;
  variant: "success" | "error";
};

export function ToastRegion({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div className="fixed right-4 top-4 z-[70] flex w-[min(100vw-2rem,24rem)] flex-col gap-3">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} variant={toast.variant}>
          {toast.message}
        </ToastCard>
      ))}
    </div>
  );
}

export function ToastCard({
  variant,
  children,
}: {
  variant: "success" | "error";
  children: ReactNode;
}) {
  const accent = variant === "success" ? "var(--green)" : "var(--red)";
  const title = variant === "success" ? "Thành công" : "Có lỗi";

  return (
    <div
      className="ui-toast-enter overflow-hidden rounded-[20px] border border-white/80 bg-white/90 backdrop-blur"
      style={{
        boxShadow:
          variant === "success"
            ? "0 18px 40px rgba(22, 163, 74, 0.12)"
            : "0 18px 40px rgba(220, 38, 38, 0.14)",
      }}
    >
      <div
        className="h-1.5 w-full"
        style={{
          background:
            variant === "success"
              ? "linear-gradient(90deg, rgba(22,163,74,0.9), rgba(34,197,94,0.7))"
              : "linear-gradient(90deg, rgba(220,38,38,0.92), rgba(251,113,133,0.74))",
        }}
      />
      <div className="flex items-start gap-3 px-4 py-3.5 text-sm text-[var(--gray-900)]">
        <span
          className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
          style={{
            background:
              variant === "success" ? "var(--green-light)" : "var(--red-light)",
            color: accent,
          }}
        >
          {variant === "success" ? (
            <CheckIcon className="h-4 w-4" />
          ) : (
            <XIcon className="h-4 w-4" />
          )}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--gray-900)]">{title}</p>
          <p className="mt-1 text-sm leading-6 text-[var(--gray-600)]">{children}</p>
        </div>
      </div>
    </div>
  );
}
