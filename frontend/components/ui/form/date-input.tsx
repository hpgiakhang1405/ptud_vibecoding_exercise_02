"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

import { CalendarIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

import { DateInputPopover } from "./date-input-popover";
import { DATE_LABEL, formatDateValue, parseDateValue, startOfMonth } from "./date-input-utils";

type DateInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export function DateInput({
  className,
  error,
  leftIcon,
  rightIcon,
  value = "",
  onChange,
  disabled,
  placeholder,
  min,
  max,
  name,
  required,
  id,
  autoFocus,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...props
}: DateInputProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const selectedDate = parseDateValue(typeof value === "string" ? value : "");
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(selectedDate ?? new Date()));
  const resolvedRightIcon = rightIcon ?? <CalendarIcon className="h-4 w-4" />;
  const minValue = typeof min === "string" ? min : undefined;
  const maxValue = typeof max === "string" ? max : undefined;

  useEffect(() => {
    if (selectedDate) {
      setViewMonth(startOfMonth(selectedDate));
    }
  }, [selectedDate]);

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

  const displayValue = selectedDate ? DATE_LABEL.format(selectedDate) : "";

  function updateDate(nextDate: Date) {
    const nextValue = formatDateValue(nextDate);
    onChange?.({
      target: { value: nextValue, name },
      currentTarget: { value: nextValue, name },
    } as ChangeEvent<HTMLInputElement>);
    setOpen(false);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        value={typeof value === "string" ? value : ""}
        onChange={onChange}
        name={name}
        required={required}
        readOnly
      />

      <button
        type="button"
        className={cn(
          "ui-input flex items-center justify-between gap-3 text-left",
          leftIcon ? "pl-10" : undefined,
          resolvedRightIcon ? "pr-10" : undefined,
          !displayValue ? "text-[var(--gray-400)]" : undefined,
          className,
        )}
        aria-describedby={ariaDescribedBy}
        aria-expanded={open}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        data-invalid={Boolean(error)}
        disabled={disabled}
        id={id}
        autoFocus={autoFocus}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{displayValue || placeholder || "Chọn ngày"}</span>
      </button>

      {leftIcon ? (
        <span className="pointer-events-none absolute left-3 top-[23px] -translate-y-1/2 text-[var(--gray-400)]">
          {leftIcon}
        </span>
      ) : null}
      {resolvedRightIcon ? (
        <span className="pointer-events-none absolute right-3 top-[23px] -translate-y-1/2 text-[var(--gray-400)]">
          {resolvedRightIcon}
        </span>
      ) : null}

      {open ? (
        <DateInputPopover
          value={typeof value === "string" ? value : ""}
          viewMonth={viewMonth}
          minValue={minValue}
          maxValue={maxValue}
          onPreviousMonth={() =>
            setViewMonth(
              (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
            )
          }
          onNextMonth={() =>
            setViewMonth(
              (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
            )
          }
          onSelectDate={updateDate}
        />
      ) : null}
    </div>
  );
}
