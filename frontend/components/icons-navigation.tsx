import { BaseIcon, type IconProps } from "@/components/icon-base";

export function BookIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4.75 6.75A2.75 2.75 0 0 1 7.5 4h11.75v15.25H7.5a2.75 2.75 0 1 0 0 5.5" />
      <path d="M7.5 4v20.75" />
      <path d="M11 8.5h4.5" />
      <path d="M11 12h4.5" />
    </BaseIcon>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M15.5 19.25v-1.4a3.1 3.1 0 0 0-3.1-3.1H8.6a3.1 3.1 0 0 0-3.1 3.1v1.4" />
      <path d="M10.5 11.25A2.75 2.75 0 1 0 10.5 5.75a2.75 2.75 0 0 0 0 5.5Z" />
      <path d="M18.4 18.5v-1.1a2.5 2.5 0 0 0-1.95-2.44" />
      <path d="M15.55 6.02A2.5 2.5 0 0 1 17 10.6" />
    </BaseIcon>
  );
}

export function LayersIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m12 4.75 7 3.75-7 3.75-7-3.75 7-3.75Z" />
      <path d="m5 12.25 7 3.75 7-3.75" />
      <path d="m5 16 7 3.75L19 16" />
    </BaseIcon>
  );
}

export function SwapIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M7 7.25h10.5" />
      <path d="m14.5 4.25 3 3-3 3" />
      <path d="M17 16.75H6.5" />
      <path d="m9.5 13.75-3 3 3 3" />
    </BaseIcon>
  );
}

export function ChartIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5.5 19.25V10.5" />
      <path d="M12 19.25V6.75" />
      <path d="M18.5 19.25v-5.5" />
      <path d="M4 19.25h16" />
    </BaseIcon>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 3.75c2 1.3 4.25 1.97 6.55 1.95v5.3c0 4.15-2.45 7.96-6.24 9.72L12 20.85l-.31-.13A10.58 10.58 0 0 1 5.45 11V5.7c2.3.02 4.55-.65 6.55-1.95Z" />
      <path d="M9.75 12.15 11.3 13.7l3.35-3.4" />
    </BaseIcon>
  );
}

export function LogoutIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M10.25 4.75H7.5A2.75 2.75 0 0 0 4.75 7.5v9A2.75 2.75 0 0 0 7.5 19.25h2.75" />
      <path d="M14 16.75 18 12l-4-4.75" />
      <path d="M9.75 12h8.25" />
    </BaseIcon>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m9 6.75 5 5.25L9 17.25" />
    </BaseIcon>
  );
}
