"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { useAuth } from "@/components/auth-provider";
import { SIDEBAR_NAVIGATION } from "@/components/sidebar-navigation";
import {
  DesktopSidebar,
  MobileSidebarDrawer,
  MobileTopbar,
} from "@/components/sidebar-shell-sections";
import { logout } from "@/lib/api";

type SidebarShellProps = {
  children: ReactNode;
};

export function SidebarShell({ children }: SidebarShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const initials = user.ho_ten.trim().charAt(0).toUpperCase();

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async (): Promise<void> => {
    await logout();
    setMobileMenuOpen(false);
    router.push("/login");
    router.refresh();
  };

  const visibleNavigation = SIDEBAR_NAVIGATION.filter(
    (item) => !item.adminOnly || user.quyen === "admin",
  );

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <MobileTopbar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <DesktopSidebar
        initials={initials}
        pathname={pathname}
        user={user}
        visibleNavigation={visibleNavigation}
        onLogout={handleLogout}
      />
      <MobileSidebarDrawer
        initials={initials}
        mobileMenuOpen={mobileMenuOpen}
        pathname={pathname}
        setMobileMenuOpen={setMobileMenuOpen}
        user={user}
        visibleNavigation={visibleNavigation}
        onLogout={handleLogout}
      />
      <main className="min-h-[calc(100vh-73px)] px-4 py-5 sm:px-5 sm:py-6 md:min-h-screen md:pl-[calc(var(--sidebar-collapsed-width)+1.5rem)] md:pr-6 md:py-7 lg:pl-[calc(var(--sidebar-width)+2rem)] lg:pr-8 lg:py-8">
        {children}
      </main>
    </div>
  );
}
