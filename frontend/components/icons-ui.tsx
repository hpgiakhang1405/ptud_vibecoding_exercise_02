import { BaseIcon, type IconProps } from "@/components/icon-base";

export function PlusIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 5.5v13" />
      <path d="M5.5 12h13" />
    </BaseIcon>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4.75 7.25h14.5" />
      <path d="M4.75 12h14.5" />
      <path d="M4.75 16.75h14.5" />
    </BaseIcon>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="10.5" cy="10.5" r="5.75" />
      <path d="m15 15 4.25 4.25" />
    </BaseIcon>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M18.25 19.25v-1a4.5 4.5 0 0 0-4.5-4.5h-3.5a4.5 4.5 0 0 0-4.5 4.5v1" />
      <circle cx="12" cy="8.25" r="3.25" />
    </BaseIcon>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="5.75" y="10.25" width="12.5" height="9" rx="2.25" />
      <path d="M8.75 10.25V8.5a3.25 3.25 0 0 1 6.5 0v1.75" />
    </BaseIcon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m5.75 12.5 4 4 8.5-9" />
    </BaseIcon>
  );
}

export function XIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m6.75 6.75 10.5 10.5" />
      <path d="m17.25 6.75-10.5 10.5" />
    </BaseIcon>
  );
}

export function InboxIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4.75 12.25 6.7 6.5A2.25 2.25 0 0 1 8.82 5h6.36A2.25 2.25 0 0 1 17.3 6.5l1.95 5.75" />
      <path d="M4.75 12.25v4.5A2.5 2.5 0 0 0 7.25 19.25h9.5a2.5 2.5 0 0 0 2.5-2.5v-4.5" />
      <path d="M8.5 12.25a3.5 3.5 0 0 0 7 0" />
    </BaseIcon>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 7.75v4.65l3 1.6" />
    </BaseIcon>
  );
}

export function ReceiptIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M7 4.75h10v14.5l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5-2 1.5V7.75A3 3 0 0 1 7 4.75Z" />
      <path d="M9 9h6" />
      <path d="M9 12.25h6" />
    </BaseIcon>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M7.25 5.25h9.5A2.25 2.25 0 0 1 19 7.5v9.25A2.25 2.25 0 0 1 16.75 19h-9.5A2.25 2.25 0 0 1 5 16.75V7.5a2.25 2.25 0 0 1 2.25-2.25Z" />
      <path d="M8.5 3.75v3" />
      <path d="M15.5 3.75v3" />
      <path d="M5 9.25h14" />
      <path d="M8.5 12.5h3" />
    </BaseIcon>
  );
}
