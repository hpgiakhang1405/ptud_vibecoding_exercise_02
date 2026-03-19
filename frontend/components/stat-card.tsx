import type { ReactNode } from "react";

export function StatCard({
  icon,
  label,
  value,
  tone = "primary",
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  tone?: "primary" | "green" | "purple" | "yellow";
}) {
  const iconTone =
    tone === "green"
      ? { bg: "var(--green-light)", color: "var(--green)" }
      : tone === "purple"
        ? { bg: "var(--purple-light)", color: "var(--purple)" }
        : tone === "yellow"
          ? { bg: "var(--yellow-light)", color: "var(--yellow)" }
          : { bg: "var(--primary-light)", color: "var(--primary)" };

  return (
    <div className="surface-card h-full p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--gray-600)]">{label}</p>
          <p className="mt-3 text-2xl font-semibold leading-none text-[var(--gray-900)] sm:text-[28px]">
            {value}
          </p>
        </div>
        <span
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl"
          style={{ background: iconTone.bg, color: iconTone.color }}
        >
          {icon}
        </span>
      </div>
    </div>
  );
}
