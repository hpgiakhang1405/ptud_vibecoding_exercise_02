"use client";

import {
  Children,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";

import { ChevronRightIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import type { SelectOption } from "@/lib/types";

type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string;
};

export function SelectInput({
  className,
  error,
  children,
  value,
  onChange,
  disabled,
  name,
  required,
  ...props
}: SelectInputProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const options = useMemo<SelectOption[]>(
    () =>
      Children.toArray(children).flatMap((child) => {
        if (!isValidElement<{ value?: string; disabled?: boolean; children?: ReactNode }>(child)) {
          return [];
        }
        return [
          {
            value: String(child.props.value ?? ""),
            label: child.props.children ?? "",
            disabled: Boolean(child.props.disabled),
          },
        ];
      }),
    [children],
  );

  const selectedValue =
    typeof value === "string" || typeof value === "number" ? String(value) : "";
  const selectedOption = options.find((option) => option.value === selectedValue) ?? options[0];

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  function selectOption(nextValue: string) {
    onChange?.({
      target: { value: nextValue, name },
      currentTarget: { value: nextValue, name },
    } as ChangeEvent<HTMLSelectElement>);
    setOpen(false);
  }

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <select
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        value={selectedValue}
        onChange={onChange}
        disabled={disabled}
        name={name}
        required={required}
        {...props}
      >
        {children}
      </select>

      <button
        type="button"
        className={cn(
          "ui-select flex items-center justify-between gap-3 text-left",
          !selectedOption ? "text-[var(--gray-400)]" : undefined,
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
        data-invalid={Boolean(error)}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="truncate">{selectedOption?.label ?? "Chọn giá trị"}</span>
        <ChevronRightIcon
          className={cn(
            "h-4 w-4 shrink-0 text-[var(--gray-400)] transition-transform duration-150",
            open ? "rotate-90" : "rotate-90 translate-y-0.5",
          )}
        />
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-[18px] border border-[var(--gray-200)] bg-white p-2 shadow-[0_22px_50px_rgba(15,23,42,0.14)]">
          <div className="max-h-64 overflow-auto">
            {options.map((option) => {
              const isSelected = option.value === selectedValue;

              return (
                <button
                  key={`${option.value}-${String(option.label)}`}
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between rounded-[14px] px-3 py-2.5 text-left text-sm transition-colors",
                    isSelected
                      ? "bg-[var(--primary-light)] text-[var(--primary)]"
                      : "text-[var(--gray-700)] hover:bg-[var(--gray-50)]",
                    option.disabled ? "cursor-not-allowed opacity-50" : undefined,
                  )}
                  disabled={option.disabled}
                  onClick={() => selectOption(option.value)}
                >
                  <span>{option.label}</span>
                  {isSelected ? (
                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
