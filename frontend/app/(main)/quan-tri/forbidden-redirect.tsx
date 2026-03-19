"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { showToast } from "@/lib/toast";

export function ForbiddenRedirect() {
  const router = useRouter();

  useEffect(() => {
    showToast("Bạn không có quyền thực hiện thao tác này", "error");
    router.replace("/doc-gia");
  }, [router]);

  return null;
}
