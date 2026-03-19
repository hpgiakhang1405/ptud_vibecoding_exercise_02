import {
  BookIcon,
  ChartIcon,
  LayersIcon,
  ShieldIcon,
  SwapIcon,
  UsersIcon,
} from "@/components/icons";

export type SidebarNavigationItem = {
  href: string;
  label: string;
  icon: typeof UsersIcon;
  adminOnly?: boolean;
};

export const SIDEBAR_NAVIGATION: SidebarNavigationItem[] = [
  { href: "/doc-gia", label: "Độc giả", icon: UsersIcon },
  { href: "/sach", label: "Sách", icon: BookIcon },
  { href: "/chuyen-nganh", label: "Chuyên ngành", icon: LayersIcon },
  { href: "/muon-tra", label: "Mượn / Trả", icon: SwapIcon },
  { href: "/bao-cao", label: "Báo cáo", icon: ChartIcon },
  { href: "/quan-tri", label: "Quản trị", icon: ShieldIcon, adminOnly: true },
];
