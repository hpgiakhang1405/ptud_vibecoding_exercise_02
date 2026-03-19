import { cookies } from "next/headers";

import type { AuthUser } from "@/lib/types";
import { API_BASE_URL } from "@/lib/env";

export async function getCurrentUserFromServer(): Promise<AuthUser | null> {
  const token = cookies().get("access_token")?.value;
  if (!token) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      Cookie: `access_token=${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as AuthUser;
}
