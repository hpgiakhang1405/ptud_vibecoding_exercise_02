import type { ReactNode } from "react";

export type AuthRole = "admin" | "thu_thu";
export type AccountStatus = "active" | "inactive";
export type ReaderStatus = "active" | "locked";
export type Gender = "nam" | "nu";
export type CopyStatus = "san_sang" | "dang_muon" | "hong";
export type LoanStatus = "dang_muon" | "da_tra";

export type AuthUser = {
  ma_nguoi_dung: string;
  ho_ten: string;
  quyen: AuthRole;
};

export type TopBookItem = {
  ten_dau_sach: string;
  tac_gia: string;
  so_luot_muon: number;
};

export type UnreturnedLoanItem = {
  ho_ten_doc_gia: string;
  lop: string;
  ten_dau_sach: string;
  ma_sach: string;
  ngay_muon: string;
};

export type Major = {
  ma_chuyen_nganh: string;
  ten_chuyen_nganh: string;
  mo_ta: string;
};

export type MajorFormValues = {
  ma_chuyen_nganh: string;
  ten_chuyen_nganh: string;
  mo_ta: string;
};

export type ReaderRecord = {
  ma_doc_gia: string;
  ho_ten: string;
  lop: string;
  ngay_sinh: string;
  gioi_tinh: Gender;
  trang_thai: ReaderStatus;
};

export type ReaderFormValues = {
  ma_doc_gia: string;
  ho_ten: string;
  lop: string;
  ngay_sinh: string;
  gioi_tinh: Gender;
  trang_thai: ReaderStatus;
};

export type ReaderPreview = Pick<
  ReaderRecord,
  "ma_doc_gia" | "ho_ten" | "lop" | "trang_thai"
>;

export type UserItem = {
  ma_nguoi_dung: string;
  ho_ten: string;
  tai_khoan: string;
  quyen: AuthRole;
  trang_thai: AccountStatus;
};

export type CreateUserFormValues = {
  ho_ten: string;
  tai_khoan: string;
  mat_khau: string;
  quyen: AuthRole;
};

export type UpdateUserFormValues = {
  ho_ten: string;
  quyen: AuthRole;
  trang_thai: AccountStatus;
  mat_khau: string;
};

export type CreateUserPayload = CreateUserFormValues & {
  trang_thai: AccountStatus;
};

export type UpdateUserPayload = {
  ho_ten: string;
  quyen: AuthRole;
  trang_thai: AccountStatus;
  mat_khau: string | null;
};

export type BookMajorOption = {
  ma_chuyen_nganh: string;
  ten_chuyen_nganh: string;
};

export type BookTitle = {
  ma_dau_sach: string;
  ten_dau_sach: string;
  nha_xuat_ban: string;
  so_trang: number;
  kich_thuoc: string;
  tac_gia: string;
  so_luong: number;
  ma_chuyen_nganh: string;
  ten_chuyen_nganh: string;
};

export type BookCopy = {
  ma_sach: string;
  ma_dau_sach: string;
  ten_dau_sach: string;
  ngay_nhap: string;
  tinh_trang: CopyStatus;
};

export type BookCopyPreview = Pick<BookCopy, "ma_sach" | "ten_dau_sach" | "tinh_trang">;

export type BookFormValues = {
  ma_dau_sach: string;
  ten_dau_sach: string;
  nha_xuat_ban: string;
  so_trang: string;
  kich_thuoc: string;
  tac_gia: string;
  ma_chuyen_nganh: string;
};

export type BookPayload = {
  ma_dau_sach: string;
  ten_dau_sach: string;
  nha_xuat_ban: string;
  so_trang: number;
  kich_thuoc: string;
  tac_gia: string;
  ma_chuyen_nganh: string;
};

export type CopyFormValues = {
  ma_sach: string;
  ma_dau_sach: string;
  ngay_nhap: string;
  tinh_trang: Extract<CopyStatus, "san_sang" | "hong">;
};

export type CreateCopyPayload = {
  ma_sach: string;
  ma_dau_sach: string;
  ngay_nhap: string;
};

export type UpdateCopyPayload = {
  tinh_trang: Extract<CopyStatus, "san_sang" | "hong">;
};

export type LoanItem = {
  ma_phieu: string;
  ma_sach: string;
  ma_doc_gia: string;
  ma_thu_thu: string;
  ngay_muon: string;
  ngay_tra: string | null;
  tinh_trang: LoanStatus;
  ho_ten_doc_gia: string;
  ten_sach: string;
  ten_thu_thu: string;
};

export type BorrowPayload = {
  ma_sach: string;
  ma_doc_gia: string;
};

export type SelectOption = {
  value: string;
  label: ReactNode;
  disabled: boolean;
};
