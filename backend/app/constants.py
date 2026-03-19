from __future__ import annotations

from typing import Literal, TypeAlias

ACCESS_TOKEN_COOKIE_KEY = "access_token"
JWT_ALGORITHM = "HS256"
COOKIE_HTTP_ONLY = True
COOKIE_SAMESITE_LAX = "lax"
COOKIE_SECURE = False

ROLE_ADMIN = "admin"
ROLE_THU_THU = "thu_thu"
AuthRoleValue: TypeAlias = Literal["admin", "thu_thu"]

ACCOUNT_STATUS_ACTIVE = "active"
ACCOUNT_STATUS_INACTIVE = "inactive"
AccountStatusValue: TypeAlias = Literal["active", "inactive"]

READER_STATUS_ACTIVE = "active"
READER_STATUS_LOCKED = "locked"
ReaderStatusValue: TypeAlias = Literal["active", "locked"]

COPY_STATUS_AVAILABLE = "san_sang"
COPY_STATUS_BORROWED = "dang_muon"
COPY_STATUS_DAMAGED = "hong"
CopyStatusEditableValue: TypeAlias = Literal["san_sang", "hong"]
CopyStatusValue: TypeAlias = Literal["san_sang", "dang_muon", "hong"]

LOAN_STATUS_BORROWED = "dang_muon"
LOAN_STATUS_RETURNED = "da_tra"
LoanStatusValue: TypeAlias = Literal["dang_muon", "da_tra"]

GENDER_MALE = "nam"
GENDER_FEMALE = "nu"
GenderValue: TypeAlias = Literal["nam", "nu"]
