from pydantic_settings import BaseSettings, SettingsConfigDict

_base_config = SettingsConfigDict(
    env_file="./.env", env_ignore_empty=True, extra="ignore"
)


class DatabaseSettings(BaseSettings):
    DATABASE_USER: str
    DATABASE_PASSWORD: str
    DATABASE_HOST: str
    DATABASE_PORT: int
    DATABASE_NAME: str

    model_config = _base_config

    @property
    def DATABASE_URL(self):
        return f"postgresql+asyncpg://{self.DATABASE_USER}:{self.DATABASE_PASSWORD}@{self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.DATABASE_NAME}"


class SecuritySettings(BaseSettings):
    JWT_SECRET: str
    JWT_ALGORITHM: str
    JWT_ACCESS_TOKEN_TIME_MIN: int
    JWT_REFRESH_TOKEN_TIME_DAY: int

    EMAIL_VERIFICATION_TOKEN_TIME_HOUR: int
    EMAIL_PASSWORD_RESET_TOKEN_HOUR: int

    model_config = _base_config


db_settings = DatabaseSettings()
security_settings = SecuritySettings()
