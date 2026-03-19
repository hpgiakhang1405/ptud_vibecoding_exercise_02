from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import TypedDict

import bcrypt
from jose import JWTError, jwt

from app.config import settings
from app.constants import JWT_ALGORITHM


class TokenPayload(TypedDict):
    sub: str
    role: str
    exp: int


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode("utf-8"), hashed_password.encode("utf-8")
    )


def get_password_hash(password: str) -> str:
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    return hashed_password.decode("utf-8")


def create_access_token(
    subject: str, role: str, expires_delta: timedelta | None = None
) -> str:
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(hours=settings.access_token_expire_hours)
    )
    payload: TokenPayload = {
        "sub": subject,
        "role": role,
        "exp": int(expire.timestamp()),
    }
    return jwt.encode(payload, settings.secret_key, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> TokenPayload:
    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[JWT_ALGORITHM],
        )
    except JWTError as exc:
        raise ValueError("Invalid token") from exc

    return TokenPayload(
        sub=str(payload["sub"]),
        role=str(payload["role"]),
        exp=int(payload["exp"]),
    )
