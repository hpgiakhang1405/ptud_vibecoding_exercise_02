const rawApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

if (!rawApiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured");
}

export const API_BASE_URL = rawApiUrl.replace(/\/+$/, "");
