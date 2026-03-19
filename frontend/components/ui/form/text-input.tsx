"use client";

import type { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

import { DateInput } from "./date-input";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export function TextInput({
  className,
  error,
  leftIcon,
  rightIcon,
  type,
  value,
  onChange,
  disabled,
  placeholder,
  min,
  max,
  name,
  required,
  ...props
}: TextInputProps) {
  if (type === "date") {
    return (
      <DateInput
        className={className}
        error={error}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        value={typeof value === "string" ? value : ""}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        min={typeof min === "string" ? min : undefined}
        max={typeof max === "string" ? max : undefined}
        name={name}
        required={required}
        {...props}
      />
    );
  }

  const resolvedRightIcon = rightIcon ?? null;

  if (!leftIcon && !resolvedRightIcon) {
    return (
      <input
        type={type}
        className={cn("ui-input", className)}
        aria-invalid={Boolean(error)}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        min={min}
        max={max}
        name={name}
        required={required}
        {...props}
      />
    );
  }

  return (
    <div className="relative">
      {leftIcon ? (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--gray-400)]">
          {leftIcon}
        </span>
      ) : null}
      <input
        type={type}
        className={cn(
          "ui-input",
          leftIcon ? "pl-10" : undefined,
          resolvedRightIcon ? "pr-10" : undefined,
          className,
        )}
        aria-invalid={Boolean(error)}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        min={min}
        max={max}
        name={name}
        required={required}
        {...props}
      />
      {resolvedRightIcon ? (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--gray-400)]">
          {resolvedRightIcon}
        </span>
      ) : null}
    </div>
  );
}
