import { redirect } from "next/navigation";

import { getCurrentUserFromServer } from "@/lib/auth";

import { LoginPageClient } from "./page-client";

export default async function LoginPage() {
  const currentUser = await getCurrentUserFromServer();

  if (currentUser) {
    redirect("/doc-gia");
  }

  return <LoginPageClient />;
}
