export const DATE_LABEL = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export const MONTH_LABEL = new Intl.DateTimeFormat("vi-VN", {
  month: "long",
  year: "numeric",
});

export const WEEKDAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function isValidDateParts(year: number, month: number, day: number) {
  if (!year || !month || !day) {
    return false;
  }

  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function parseDateValue(value: string) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  if (!isValidDateParts(year, month, day)) {
    return null;
  }

  return new Date(year, month - 1, day);
}

export function parseDisplayDate(value: string) {
  if (!value) {
    return null;
  }

  const [day, month, year] = value.split("/").map(Number);
  if (!isValidDateParts(year, month, day)) {
    return null;
  }

  return new Date(year, month - 1, day);
}

export function formatDateValue(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(date: Date) {
  return DATE_LABEL.format(date);
}

export function formatDisplayDateInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getLeadingEmptySlots(date: Date) {
  return (date.getDay() + 6) % 7;
}

export function getDaysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function isDateDisabled(value: string, min?: string, max?: string) {
  if (min && value < min) {
    return true;
  }
  if (max && value > max) {
    return true;
  }
  return false;
}
