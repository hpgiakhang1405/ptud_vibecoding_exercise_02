import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { XIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidthClassName?: string;
  onClose: () => void;
};

export function Modal({
  open,
  title,
  description,
  children,
  footer,
  maxWidthClassName = "max-w-[520px]",
  onClose,
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(15,23,42,0.55)] p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
      onMouseDown={onClose}
    >
      <div
        className={cn(
          "ui-modal-enter flex h-[100dvh] w-full flex-col overflow-hidden rounded-t-[16px] bg-white shadow-[var(--shadow-md)] sm:h-auto sm:max-h-[90dvh] sm:rounded-[var(--radius-lg)]",
          maxWidthClassName,
          "sm:w-full",
        )}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex justify-center pt-3 sm:hidden">
          <span className="h-1.5 w-12 rounded-full bg-[var(--gray-200)]" />
        </div>

        <div className="flex items-start justify-between gap-4 px-4 pb-4 pt-3 sm:px-7 sm:pb-0 sm:pt-7">
          <div>
            <h3 className="text-[18px] font-semibold text-[var(--gray-900)]">{title}</h3>
            {description ? (
              <p className="mt-1 text-sm text-[var(--gray-600)]">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--gray-400)] transition hover:bg-[var(--gray-50)] hover:text-[var(--gray-900)]"
            onClick={onClose}
            aria-label="Đóng modal"
          >
            <XIcon className="block h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 sm:mt-6 sm:px-7">{children}</div>

        {footer ? (
          <div className="border-t border-[var(--gray-200)] bg-white px-4 py-4 sm:mt-6 sm:border-t-0 sm:px-7 sm:pt-0">
            <div className="flex flex-col-reverse gap-3 [&>*]:w-full sm:flex-row sm:justify-end sm:[&>*]:w-auto">
              {footer}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  loading = false,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      open={open}
      title={title}
      description={description}
      onClose={onCancel}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Hủy
          </Button>
          <Button variant="danger" loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="text-sm text-[var(--gray-600)]">
        Thao tác này sẽ được thực hiện ngay khi bạn xác nhận.
      </div>
    </Modal>
  );
}
