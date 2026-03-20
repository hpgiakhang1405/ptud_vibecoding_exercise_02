import type {
  AccountStatus,
  AuthRole,
  CopyStatus,
  Gender,
  LoanStatus,
  ReaderStatus,
} from "@/lib/types";

export function formatGenderLabel(value: Gender) {
  return value === "nu" ? "Nữ" : "Nam";
}

export function formatRoleLabel(value: AuthRole) {
  return value === "admin" ? "Quản trị viên" : "Thủ thư";
}

export function formatAccountStatusLabel(value: AccountStatus) {
  return value === "active" ? "Đang hoạt động" : "Ngừng hoạt động";
}

export function formatReaderStatusLabel(value: ReaderStatus) {
  return value === "active" ? "Đang hoạt động" : "Bị khóa";
}

export function formatCopyStatusLabel(value: CopyStatus) {
  switch (value) {
    case "san_sang":
      return "Sẵn sàng";
    case "dang_muon":
      return "Đang mượn";
    default:
      return "Hỏng";
  }
}

export function formatLoanStatusLabel(value: LoanStatus) {
  return value === "dang_muon" ? "Đang mượn" : "Đã trả";
}
