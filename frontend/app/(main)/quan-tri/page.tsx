import { redirect } from "next/navigation";

import QuanTriPageClient from "./page-client";
import { ForbiddenRedirect } from "./forbidden-redirect";
import { getCurrentUserFromServer } from "@/lib/auth";

export default async function QuanTriPage() {
  const currentUser = await getCurrentUserFromServer();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.quyen !== "admin") {
    return <ForbiddenRedirect />;
  }

  return <QuanTriPageClient />;
}
