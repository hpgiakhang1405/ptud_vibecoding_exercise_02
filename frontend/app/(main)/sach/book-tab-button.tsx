import type { ReactNode } from "react";

type BookTabButtonProps = {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
};

export function BookTabButton({ active, onClick, children }: BookTabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[44px] flex-1 rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium transition-all duration-150 sm:flex-none ${
        active
          ? "bg-[var(--primary-light)] text-[var(--primary)]"
          : "text-[var(--gray-600)] hover:bg-[var(--gray-50)]"
      }`}
    >
      {children}
    </button>
  );
}
