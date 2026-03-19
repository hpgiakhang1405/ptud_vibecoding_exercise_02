import type { ToastItem } from "@/components/ui/toast";

type ToastListener = (toast: ToastItem) => void;

const PENDING_TOAST_KEY = "__library_pending_toast__";
const listeners = new Set<ToastListener>();

export function showToast(message: string, variant: ToastItem["variant"] = "success") {
  const toast: ToastItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    message,
    variant,
  };

  listeners.forEach((listener) => listener(toast));
}

export function subscribeToast(listener: ToastListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function persistToast(message: string, variant: ToastItem["variant"] = "success") {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    PENDING_TOAST_KEY,
    JSON.stringify({ message, variant }),
  );
}

export function consumePersistedToast() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(PENDING_TOAST_KEY);
  if (!rawValue) {
    return null;
  }

  window.sessionStorage.removeItem(PENDING_TOAST_KEY);

  try {
    const parsed = JSON.parse(rawValue) as Pick<ToastItem, "message" | "variant">;
    return {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      message: parsed.message,
      variant: parsed.variant,
    } satisfies ToastItem;
  } catch {
    return null;
  }
}
