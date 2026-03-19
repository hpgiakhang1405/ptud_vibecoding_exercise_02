import type { ReactNode } from "react";

import { ChevronRightIcon } from "@/components/icons";

export function PageHeader({
  breadcrumb,
  title,
  description,
  actions,
}: {
  breadcrumb: string[];
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-1 text-xs font-medium text-[var(--gray-400)]">
          {breadcrumb.map((item, index) => (
            <span key={`${item}-${index}`} className="inline-flex items-center gap-1">
              {index > 0 ? <ChevronRightIcon className="h-3.5 w-3.5" /> : null}
              <span>{item}</span>
            </span>
          ))}
        </div>
        <h1 className="mt-2 text-[1.75rem] font-semibold leading-tight text-[var(--gray-900)] sm:text-2xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm text-[var(--gray-600)]">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto lg:justify-end">
          {actions}
        </div>
      ) : null}
    </header>
  );
}
