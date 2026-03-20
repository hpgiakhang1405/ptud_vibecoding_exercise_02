"use client";

import type { CSSProperties, Ref } from "react";

import { ChevronRightIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

import {
  formatDateValue,
  getDaysInMonth,
  getLeadingEmptySlots,
  isDateDisabled,
  MONTH_LABEL,
  WEEKDAY_LABELS,
} from "./date-input-utils";

type DateInputPopoverProps = {
  value: string;
  viewMonth: Date;
  minValue?: string;
  maxValue?: string;
  containerRef?: Ref<HTMLDivElement>;
  style?: CSSProperties;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (date: Date) => void;
};

export function DateInputPopover({
  value,
  viewMonth,
  minValue,
  maxValue,
  containerRef,
  style,
  onPreviousMonth,
  onNextMonth,
  onSelectDate,
}: DateInputPopoverProps) {
  const leadingEmptySlots = getLeadingEmptySlots(viewMonth);
  const daysInMonth = getDaysInMonth(viewMonth);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden rounded-[20px] border border-[var(--gray-200)] bg-white p-3 shadow-[0_24px_60px_rgba(15,23,42,0.16)]"
      style={style}
    >
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--gray-500)] transition-colors hover:bg-[var(--gray-50)]"
          onMouseDown={(event) => event.preventDefault()}
          onClick={onPreviousMonth}
        >
          <ChevronRightIcon className="h-4 w-4 rotate-180" />
        </button>
        <p className="text-sm font-semibold capitalize text-[var(--gray-900)]">
          {MONTH_LABEL.format(viewMonth)}
        </p>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--gray-500)] transition-colors hover:bg-[var(--gray-50)]"
          onMouseDown={(event) => event.preventDefault()}
          onClick={onNextMonth}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--gray-400)]">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="py-2">
            {label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: leadingEmptySlots }).map((_, index) => (
          <span key={`empty-${index}`} className="h-10" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const date = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day);
          const dateValue = formatDateValue(date);
          const selected = dateValue === value;
          const disabled = isDateDisabled(dateValue, minValue, maxValue);

          return (
            <button
              key={dateValue}
              type="button"
              className={cn(
                "h-10 rounded-[14px] text-sm font-medium transition-colors",
                selected
                  ? "bg-[var(--primary)] text-white shadow-[0_8px_18px_rgba(37,99,235,0.22)]"
                  : "text-[var(--gray-700)] hover:bg-[var(--gray-50)]",
                disabled ? "cursor-not-allowed opacity-35 hover:bg-transparent" : undefined,
              )}
              disabled={disabled}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onSelectDate(date)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
