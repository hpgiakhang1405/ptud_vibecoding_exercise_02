import type { ReactNode } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeletonRows } from "@/components/ui/skeleton";

export function TableCard({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="surface-card p-4 sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h3 className="text-base font-semibold text-[var(--gray-900)]">{title}</h3>
          {description ? (
            <p className="mt-1 text-sm text-[var(--gray-600)]">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
      <div className="mt-6 overflow-x-auto">{children}</div>
    </section>
  );
}

export function DataTable({
  columns,
  children,
  className,
}: {
  columns: Array<{ label: string; align?: "left" | "right"; className?: string }>;
  children: ReactNode;
  className?: string;
}) {
  return (
    <table className={`min-w-full border-separate border-spacing-0 text-left ${className ?? ""}`}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.label}
              className={`bg-[var(--gray-50)] px-4 py-3 text-xs font-medium uppercase tracking-[0.05em] text-[var(--gray-600)] ${
                column.align === "right" ? "text-right" : "text-left"
              } ${column.className ?? ""}`}
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

export function TableRow({ children }: { children: ReactNode }) {
  return (
    <tr className="border-b border-[var(--gray-100)] transition-colors duration-100 hover:bg-[var(--gray-50)]">
      {children}
    </tr>
  );
}

export function TableCell({
  children,
  align = "left",
  className = "",
}: {
  children: ReactNode;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <td
      className={`border-b border-[var(--gray-100)] px-4 py-[14px] text-sm text-[var(--gray-900)] ${
        align === "right" ? "text-right" : "text-left"
      } ${className}`}
    >
      {children}
    </td>
  );
}

export function TableMessageRow({
  colSpan,
  message,
}: {
  colSpan: number;
  message: string;
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="border-b border-[var(--gray-100)] px-4 py-10 text-center text-sm text-[var(--gray-600)]"
      >
        {message}
      </td>
    </tr>
  );
}

export function TableState({
  loading,
  isEmpty,
  columns,
  empty,
  children,
}: {
  loading: boolean;
  isEmpty: boolean;
  columns: number;
  empty: {
    icon: ReactNode;
    title: string;
    description: string;
    action?: ReactNode;
  };
  children: ReactNode;
}) {
  if (loading) {
    return <TableSkeletonRows columns={columns} />;
  }

  if (isEmpty) {
    return (
      <tr>
        <td colSpan={columns} className="border-b border-[var(--gray-100)] p-0">
          <EmptyState {...empty} />
        </td>
      </tr>
    );
  }

  return <>{children}</>;
}
