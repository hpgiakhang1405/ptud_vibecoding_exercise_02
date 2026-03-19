"use client";

import { useEffect, useState } from "react";

import { ToastRegion, type ToastItem } from "@/components/ui/toast";
import { consumePersistedToast, subscribeToast } from "@/lib/toast";

const TOAST_DURATION = 3000;

export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const persistedToast = consumePersistedToast();
    if (persistedToast) {
      setToasts((current) => [...current, persistedToast]);
      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== persistedToast.id));
      }, TOAST_DURATION);
    }

    return subscribeToast((toast) => {
      setToasts((current) => [...current, toast]);
      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== toast.id));
      }, TOAST_DURATION);
    });
  }, []);

  return <ToastRegion toasts={toasts} />;
}
