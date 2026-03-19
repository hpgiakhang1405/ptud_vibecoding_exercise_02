import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AuthProvider } from "@/components/auth-provider";
import { SidebarShell } from "@/components/sidebar-shell";
import { getCurrentUserFromServer } from "@/lib/auth";


type MainLayoutProps = {
  children: ReactNode;
};


export default async function MainLayout({ children }: MainLayoutProps) {
  const currentUser = await getCurrentUserFromServer();
  if (!currentUser) {
    redirect("/login");
  }

  return (
    <AuthProvider initialUser={currentUser}>
      <SidebarShell>
        <div className="page-shell w-full">{children}</div>
      </SidebarShell>
    </AuthProvider>
  );
}
