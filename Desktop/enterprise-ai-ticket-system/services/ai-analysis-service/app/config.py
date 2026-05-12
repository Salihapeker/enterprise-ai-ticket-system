from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "ai-analysis-service"
    app_version: str = "0.1.0-FAZ0"
    log_level: str = "INFO"
    cors_origins: str = "http://localhost:5173,http://localhost:8082"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()