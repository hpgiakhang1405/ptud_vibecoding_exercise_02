from __future__ import annotations

from pydantic import BaseModel, ConfigDict

from app.constants import (
    AccountStatusValue,
    AuthRoleValue,
    CopyStatusEditableValue,
    CopyStatusValue,
    GenderValue,
    LoanStatusValue,
    ReaderStatusValue,
)


class MessageResponse(BaseModel):
    detail: str


class ErrorResponse(BaseModel):
    detail: str
    code: str


class LoginRequest(BaseModel):
    tai_khoan: str
    mat_khau: str


class AuthUser(BaseModel):
    ma_nguoi_dung: str
    ho_ten: str
    quyen: AuthRoleValue


class LoginResponse(AuthUser):
    pass


class ChuyenNganhBase(BaseModel):
    ma_chuyen_nganh: str
    ten_chuyen_nganh: str
    mo_ta: str


class ChuyenNganhCreate(ChuyenNganhBase):
    pass


class ChuyenNganhUpdate(ChuyenNganhBase):
    pass


class ChuyenNganhResponse(ChuyenNganhBase):
    model_config = ConfigDict(from_attributes=True)


class LichSuMuonResponse(BaseModel):
    ma_phieu: str
    ma_sach: str
    ten_dau_sach: str
    ngay_muon: str
    ngay_tra: str | None
    tinh_trang: LoanStatusValue


class DocGiaBase(BaseModel):
    ma_doc_gia: str
    ho_ten: str
    lop: str
    ngay_sinh: str
    gioi_tinh: GenderValue
    trang_thai: ReaderStatusValue


class DocGiaCreate(DocGiaBase):
    pass


class DocGiaUpdate(DocGiaBase):
    pass


class DocGiaResponse(DocGiaBase):
    model_config = ConfigDict(from_attributes=True)


class DocGiaDetailResponse(DocGiaResponse):
    lich_su_muon: list[LichSuMuonResponse]


class PhieuMuonCreate(BaseModel):
    ma_sach: str
    ma_doc_gia: str


class PhieuMuonResponse(BaseModel):
    ma_phieu: str
    ma_sach: str
    ma_doc_gia: str
    ma_thu_thu: str
    ngay_muon: str
    ngay_tra: str | None
    tinh_trang: LoanStatusValue
    ho_ten_doc_gia: str
    ten_sach: str
    ten_thu_thu: str


class BanSaoBase(BaseModel):
    ma_sach: str
    ma_dau_sach: str
    ngay_nhap: str


class BanSaoCreate(BanSaoBase):
    pass


class BanSaoUpdate(BaseModel):
    tinh_trang: CopyStatusEditableValue


class BanSaoResponse(BanSaoBase):
    tinh_trang: CopyStatusValue
    ten_dau_sach: str


class DauSachBase(BaseModel):
    ma_dau_sach: str
    ten_dau_sach: str
    nha_xuat_ban: str
    so_trang: int
    kich_thuoc: str
    tac_gia: str
    ma_chuyen_nganh: str


class DauSachCreate(DauSachBase):
    pass


class DauSachUpdate(DauSachBase):
    pass


class DauSachResponse(DauSachBase):
    so_luong: int
    ten_chuyen_nganh: str


class DauSachDetailResponse(DauSachResponse):
    ban_sao: list[BanSaoResponse]


class BaoCaoSachMuonNhieuResponse(BaseModel):
    ten_dau_sach: str
    tac_gia: str
    so_luot_muon: int


class BaoCaoChuaTraResponse(BaseModel):
    ho_ten_doc_gia: str
    lop: str
    ten_dau_sach: str
    ma_sach: str
    ngay_muon: str


class NguoiDungResponse(BaseModel):
    ma_nguoi_dung: str
    ho_ten: str
    tai_khoan: str
    quyen: AuthRoleValue
    trang_thai: AccountStatusValue

    model_config = ConfigDict(from_attributes=True)


class NguoiDungCreate(BaseModel):
    ho_ten: str
    tai_khoan: str
    mat_khau: str
    quyen: AuthRoleValue
    trang_thai: AccountStatusValue = "active"


class NguoiDungUpdate(BaseModel):
    ho_ten: str
    quyen: AuthRoleValue
    trang_thai: AccountStatusValue
    mat_khau: str | None = None
