import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Be_Vietnam_Pro } from "next/font/google";

import { ToastProvider } from "@/components/ui/toast-provider";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hệ thống Quản lý Thư viện",
  description: "Frontend Next.js 14 cho hệ thống quản lý thư viện",
};


type RootLayoutProps = {
  children: ReactNode;
};


export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="vi">
      <body className={beVietnamPro.className}>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
