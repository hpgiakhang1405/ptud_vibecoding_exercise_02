from __future__ import annotations

from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    secret_key: str = Field(validation_alias="SECRET_KEY")
    database_url: str = Field(validation_alias="DATABASE_URL")
    access_token_expire_hours: int = Field(validation_alias="ACCESS_TOKEN_EXPIRE_HOURS")
    allowed_origins: str = Field(validation_alias="ALLOWED_ORIGINS")
    admin_username: str = Field(validation_alias="ADMIN_USERNAME")
    admin_password: str = Field(validation_alias="ADMIN_PASSWORD")

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def access_token_expire_seconds(self) -> int:
        return self.access_token_expire_hours * 60 * 60

    @property
    def allowed_origins_list(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.allowed_origins.split(",")
            if origin.strip()
        ]


settings = Settings()
