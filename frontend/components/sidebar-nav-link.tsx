"use client";

import Link from "next/link";

import type { SidebarNavigationItem } from "@/components/sidebar-navigation";
import { cn } from "@/lib/cn";

type SidebarNavLinkProps = {
  item: SidebarNavigationItem;
  pathname: string;
  mobile?: boolean;
  onClick?: () => void;
};

export function SidebarNavLink({
  item,
  mobile = false,
  onClick,
  pathname,
}: SidebarNavLinkProps) {
  const active = pathname === item.href;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "group relative flex items-center rounded-[var(--radius-md)] text-sm font-medium transition-all duration-150 ease-out before:absolute before:bottom-2 before:left-0 before:top-2 before:w-[3px] before:rounded-full before:bg-[var(--primary)] before:transition-transform before:duration-150 before:content-['']",
        mobile
          ? active
            ? "min-h-[48px] gap-3 bg-[var(--primary-light)] px-4 py-3 text-[var(--primary)] before:scale-y-100"
            : "min-h-[48px] gap-3 px-4 py-3 text-[var(--gray-600)] before:scale-y-0"
          : active
            ? "min-h-[44px] bg-[var(--primary-light)] text-[var(--primary)] before:scale-y-100 md:justify-center md:px-0 md:py-3 lg:justify-start lg:gap-3 lg:px-4"
            : "min-h-[44px] text-[var(--gray-600)] before:scale-y-0 hover:bg-[var(--gray-50)] hover:text-[var(--gray-900)] md:justify-center md:px-0 md:py-3 lg:justify-start lg:gap-3 lg:px-4",
      )}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      <span className={mobile ? "inline" : "hidden lg:inline"}>{item.label}</span>
      {!mobile ? (
        <span className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 z-20 hidden -translate-y-1/2 whitespace-nowrap rounded-[var(--radius-sm)] bg-[var(--gray-900)] px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-[var(--shadow-md)] transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 md:block lg:hidden">
          {item.label}
        </span>
      ) : null}
    </Link>
  );
}
