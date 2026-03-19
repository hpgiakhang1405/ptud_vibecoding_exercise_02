"use client";

import type { Dispatch, SetStateAction } from "react";

import { LogoutIcon, MenuIcon, XIcon } from "@/components/icons";
import { BrandMark, BrandText } from "@/components/sidebar-brand";
import { SidebarNavLink } from "@/components/sidebar-nav-link";
import { type SidebarNavigationItem } from "@/components/sidebar-navigation";
import { UserPanel } from "@/components/sidebar-user-panel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { AuthUser } from "@/lib/types";

type HeaderProps = {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
};

type SidebarContentProps = {
  initials: string;
  pathname: string;
  user: AuthUser;
  visibleNavigation: SidebarNavigationItem[];
  onLogout: () => Promise<void>;
};

type MobileDrawerProps = SidebarContentProps & {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
};

export function MobileTopbar({
  mobileMenuOpen,
  setMobileMenuOpen,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--gray-200)] bg-white/95 px-4 py-3 backdrop-blur md:hidden">
      <div className="flex items-center gap-3">
        <BrandMark />
        <BrandText />
      </div>

      <button
        type="button"
        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[var(--radius-md)] border border-[var(--gray-200)] bg-white text-[var(--gray-900)] shadow-[var(--shadow-sm)]"
        aria-label={mobileMenuOpen ? "Đóng menu điều hướng" : "Mở menu điều hướng"}
        aria-expanded={mobileMenuOpen}
        onClick={() => setMobileMenuOpen((current) => !current)}
      >
        {mobileMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
      </button>
    </header>
  );
}

export function DesktopSidebar({
  initials,
  pathname,
  user,
  visibleNavigation,
  onLogout,
}: SidebarContentProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden h-screen w-[var(--sidebar-collapsed-width)] flex-col border-r border-[var(--gray-200)] bg-white md:flex lg:w-[var(--sidebar-width)]">
      <div className="flex items-center gap-3 px-3 py-6 lg:px-5">
        <BrandMark />
        <div className="hidden lg:block">
          <BrandText />
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-2 lg:px-3">
        {visibleNavigation.map((item) => (
          <SidebarNavLink key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>

      <div className="border-t border-[var(--gray-200)] p-3 lg:p-4">
        <UserPanel initials={initials} user={user} compact />
        <Button
          variant="secondary"
          className="mt-3 w-full justify-center md:px-0 lg:px-4"
          icon={<LogoutIcon className="h-4 w-4" />}
          onClick={onLogout}
        >
          <span className="hidden lg:inline">Đăng xuất</span>
        </Button>
      </div>
    </aside>
  );
}

export function MobileSidebarDrawer({
  initials,
  mobileMenuOpen,
  pathname,
  setMobileMenuOpen,
  user,
  visibleNavigation,
  onLogout,
}: MobileDrawerProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-40 md:hidden",
        mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!mobileMenuOpen}
    >
      <div
        className={cn(
          "absolute inset-0 bg-[rgba(15,23,42,0.55)] transition-opacity duration-200",
          mobileMenuOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={() => setMobileMenuOpen(false)}
      />

      <aside
        className={cn(
          "absolute inset-y-0 left-0 flex w-[280px] max-w-[82vw] flex-col border-r border-[var(--gray-200)] bg-white shadow-[var(--shadow-md)] transition-transform duration-200 ease-out",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[var(--gray-200)] px-4 py-4">
          <div className="flex items-center gap-3">
            <BrandMark />
            <BrandText />
          </div>
          <button
            type="button"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[var(--radius-md)] text-[var(--gray-500)] transition hover:bg-[var(--gray-50)] hover:text-[var(--gray-900)]"
            aria-label="Đóng menu điều hướng"
            onClick={() => setMobileMenuOpen(false)}
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {visibleNavigation.map((item) => (
            <SidebarNavLink
              key={item.href}
              item={item}
              pathname={pathname}
              onClick={() => setMobileMenuOpen(false)}
              mobile
            />
          ))}
        </nav>

        <div className="border-t border-[var(--gray-200)] p-4">
          <UserPanel initials={initials} user={user} />
          <Button
            variant="secondary"
            className="mt-3 w-full justify-center"
            icon={<LogoutIcon className="h-4 w-4" />}
            onClick={onLogout}
          >
            Đăng xuất
          </Button>
        </div>
      </aside>
    </div>
  );
}
