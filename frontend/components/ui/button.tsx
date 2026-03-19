import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
};

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]",
  secondary:
    "border-[var(--gray-200)] bg-white text-[var(--gray-900)] hover:bg-[var(--gray-50)]",
  danger:
    "border-transparent bg-[var(--red-light)] text-[var(--red)] hover:bg-[#FEE2E2]",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "min-h-11 min-w-[44px] px-3.5 py-2.5 text-sm",
  md: "min-h-11 min-w-[44px] px-4 py-2.5 text-sm",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  icon,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] border font-medium transition-all duration-150 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60",
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
          <span className="sr-only">Đang xử lý</span>
        </>
      ) : (
        <>
          {icon ? <span className="h-4 w-4">{icon}</span> : null}
          {children}
        </>
      )}
    </button>
  );
}
