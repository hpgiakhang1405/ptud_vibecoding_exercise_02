import type { ReactNode } from "react";

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary-light)] text-[var(--primary)]">
        {icon}
      </div>
      <h3 className="mt-5 text-base font-semibold text-[var(--gray-900)]">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-[var(--gray-600)]">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
