"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { CalendarIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

import { DateInputPopover } from "./date-input-popover";
import { useDismissibleLayer } from "./use-dismissible-layer";
import {
  formatDateValue,
  formatDisplayDate,
  formatDisplayDateInput,
  parseDateValue,
  parseDisplayDate,
  startOfMonth,
} from "./date-input-utils";

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
  const [portalStyle, setPortalStyle] = useState<CSSProperties>();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const suppressNextFocusOpenRef = useRef(false);
  const inputValue = typeof value === "string" ? value : "";
  const selectedDate = parseDateValue(inputValue);
  const [displayValue, setDisplayValue] = useState(() =>
    selectedDate ? formatDisplayDate(selectedDate) : "",
  );
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(selectedDate ?? new Date()));
  const resolvedRightIcon = rightIcon ?? <CalendarIcon className="h-4 w-4" />;
  const minValue = typeof min === "string" ? min : undefined;
  const maxValue = typeof max === "string" ? max : undefined;

  useEffect(() => {
    const nextSelectedDate = parseDateValue(inputValue);
    setDisplayValue(nextSelectedDate ? formatDisplayDate(nextSelectedDate) : "");
    if (nextSelectedDate) {
      setViewMonth(startOfMonth(nextSelectedDate));
    }
  }, [inputValue]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const updatePosition = () => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      const rect = input.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownWidth = 304;
      const spacing = 8;
      const estimatedHeight = 360;
      const spaceBelow = viewportHeight - rect.bottom - spacing;
      const spaceAbove = rect.top - spacing;
      const shouldOpenUp = spaceBelow < estimatedHeight && spaceAbove > spaceBelow;

      setPortalStyle({
        position: "fixed",
        left: Math.min(rect.left, window.innerWidth - dropdownWidth - spacing),
        top: shouldOpenUp
          ? Math.max(spacing, rect.top - estimatedHeight - spacing)
          : rect.bottom + spacing,
        width: dropdownWidth,
        zIndex: 80,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  useDismissibleLayer({
    open,
    refs: [wrapperRef, popoverRef],
    onDismiss: () => setOpen(false),
  });

  function emitValueChange(nextValue: string) {
    onChange?.({
      target: { value: nextValue, name },
      currentTarget: { value: nextValue, name },
    } as ChangeEvent<HTMLInputElement>);
  }

  function openCalendar() {
    if (disabled || open) {
      return;
    }

    const parsedDisplayDate =
      displayValue.length === 10 ? parseDisplayDate(displayValue) : null;
    setViewMonth(startOfMonth(parsedDisplayDate ?? selectedDate ?? new Date()));
    setOpen(true);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const nextDisplayValue = formatDisplayDateInput(event.target.value);
    setDisplayValue(nextDisplayValue);

    if (!nextDisplayValue) {
      emitValueChange("");
      return;
    }

    if (nextDisplayValue.length !== 10) {
      return;
    }

    const nextDate = parseDisplayDate(nextDisplayValue);
    if (!nextDate) {
      return;
    }

    const nextValue = formatDateValue(nextDate);
    if ((minValue && nextValue < minValue) || (maxValue && nextValue > maxValue)) {
      return;
    }

    emitValueChange(nextValue);
  }

  function handleInputBlur() {
    if (!displayValue) {
      emitValueChange("");
      return;
    }

    const nextDate = parseDisplayDate(displayValue);
    if (!nextDate) {
      setDisplayValue(selectedDate ? formatDisplayDate(selectedDate) : "");
      return;
    }

    const nextValue = formatDateValue(nextDate);
    if ((minValue && nextValue < minValue) || (maxValue && nextValue > maxValue)) {
      setDisplayValue(selectedDate ? formatDisplayDate(selectedDate) : "");
      return;
    }

    setDisplayValue(formatDisplayDate(nextDate));
    emitValueChange(nextValue);
  }

  function handleInputFocus() {
    if (suppressNextFocusOpenRef.current) {
      suppressNextFocusOpenRef.current = false;
      return;
    }

    openCalendar();
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        className={cn(
          "ui-input",
          leftIcon ? "pl-10" : undefined,
          resolvedRightIcon ? "pr-10" : undefined,
          className,
        )}
        aria-describedby={ariaDescribedBy}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-invalid={Boolean(error)}
        disabled={disabled}
        id={id}
        autoFocus={autoFocus}
        value={displayValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onClick={openCalendar}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "Enter") {
            event.preventDefault();
            openCalendar();
          }

          if (event.key === "Escape") {
            setOpen(false);
            suppressNextFocusOpenRef.current = true;
            inputRef.current?.blur();
          }
        }}
        placeholder={placeholder || "dd/mm/yyyy"}
        inputMode="numeric"
        autoComplete="off"
        name={name}
        required={required}
        {...props}
      />

      {leftIcon ? (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--gray-400)]">
          {leftIcon}
        </span>
      ) : null}
      {resolvedRightIcon ? (
        <button
          type="button"
          className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center justify-center text-[var(--gray-400)]"
          aria-label="Mở lịch"
          aria-expanded={open}
          disabled={disabled}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            if (open) {
              suppressNextFocusOpenRef.current = true;
              setOpen(false);
              inputRef.current?.focus();
              return;
            }

            openCalendar();
            inputRef.current?.focus();
          }}
        >
          {resolvedRightIcon}
        </button>
      ) : null}

      {open && portalStyle
        ? createPortal(
            <DateInputPopover
              containerRef={popoverRef}
              style={portalStyle}
              value={inputValue}
              viewMonth={viewMonth}
              minValue={minValue}
              maxValue={maxValue}
              onPreviousMonth={() =>
                setViewMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
              }
              onNextMonth={() =>
                setViewMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
              }
              onSelectDate={(nextDate) => {
                setDisplayValue(formatDisplayDate(nextDate));
                emitValueChange(formatDateValue(nextDate));
                suppressNextFocusOpenRef.current = true;
                inputRef.current?.focus();
                setOpen(false);
              }}
            />,
            document.body,
          )
        : null}
    </div>
  );
}
