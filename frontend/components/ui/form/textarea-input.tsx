"use client";

import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type TextareaInputProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
};

export function TextareaInput({ className, error, ...props }: TextareaInputProps) {
  return (
    <textarea
      className={cn("ui-textarea min-h-28 resize-y", className)}
      aria-invalid={Boolean(error)}
      {...props}
    />
  );
}
