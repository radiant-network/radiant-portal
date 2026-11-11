"""Server configuration, read from the environment once and validated.

Every variable the server reads is a field of ``Settings``. ``__main__`` calls
``get_settings()`` at startup, so a missing or malformed value stops the server
before it accepts a request instead of failing the first tool that reads it.
Modules call ``get_settings()``, never ``os.getenv``. Tests install their own
instance with ``use_settings()``.
"""

import re
import ssl
from pathlib import Path
from typing import Annotated

from pydantic import Field, ValidationError, field_validator, model_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict

_DB_NAME = re.compile(r"^[A-Za-z0-9_]{1,64}$")


def _split(value: object) -> object:
    """``"openid, profile"`` → ``["openid", "profile"]``: comma-separated, blanks dropped."""
    if isinstance(value, str):
        return [s.strip() for s in value.split(",") if s.strip()]
    return value


class Settings(BaseSettings):
    model_config = SettingsConfigDict(frozen=True, extra="ignore")

    # -- OAuth (Keycloak) ---------------------------------------------------------
    # Bare realm URL, e.g. https://kc.example.com/realms/radiant. Required: there is
    # no unauthenticated mode.
    keycloak_realm_url: str = Field(min_length=1)
    # Expected `aud` claim. Unset: DCR-registered clients have no audience mapper.
    keycloak_audience: str | None = None
    oauth_required_scopes: Annotated[list[str], NoDecode] = ["openid"]
    # Advertised in the protected-resource metadata; Claude requests offline_access.
    oauth_supported_scopes: Annotated[list[str], NoDecode] = ["openid", "offline_access"]
    # Server root URL (not /mcp).
    mcp_base_url: str = "http://localhost:8000"
    # Proxies whose X-Forwarded-* headers uvicorn trusts.
    forwarded_allow_ips: str = "*"
    # Tool bodies running at once, for all callers (see workers.py), and how long a
    # call waits for a free slot before failing with "busy".
    mcp_max_concurrent_calls: int = Field(20, ge=1)
    mcp_queue_timeout: float = Field(10.0, gt=0)

    # -- StarRocks (connection target only: each call authenticates with the caller's JWT)
    starrocks_host: str = "localhost"
    starrocks_port: int = Field(9030, ge=1, le=65535)
    starrocks_db: str | None = None
    starrocks_connection_timeout: int = Field(10, gt=0)
    starrocks_query_timeout: int = Field(60, gt=0)
    starrocks_max_rows: int = Field(500, ge=1)
    # Check the FE certificate chain and hostname. Off by default until every
    # deployment sets it (the local stack uses a self-signed keystore).
    starrocks_ssl_verify: bool = False
    # PEM file of the CA that signed the FE certificate. Unset: the system CA bundle.
    starrocks_ssl_ca: str | None = None

    # -- Radiant portal ------------------------------------------------------------
    # Unset: the tools backed by the portal API are not registered.
    radiant_api_url: str | None = None
    # Seconds to wait for each response (read), and to open the connection.
    radiant_api_timeout: float = Field(60.0, gt=0)
    radiant_api_connect_timeout: float = Field(5.0, gt=0)
    # Unset: the tools return no portal_url.
    radiant_portal_url: str | None = None
    # StarRocks database of the shared tables (staging_sequencing_experiment, clinvar, ...).
    radiant_shared_db: str = "radiant"

    @field_validator("oauth_required_scopes", "oauth_supported_scopes", mode="before")
    @classmethod
    def _comma_separated(cls, value: object) -> object:
        return _split(value)

    @field_validator(
        "keycloak_audience", "starrocks_db", "starrocks_ssl_ca", "radiant_api_url", "radiant_portal_url",
        mode="before",
    )
    @classmethod
    def _blank_is_unset(cls, value: object) -> object:
        if isinstance(value, str) and not value.strip():
            return None
        return value.strip() if isinstance(value, str) else value

    @field_validator("keycloak_realm_url", "mcp_base_url", "radiant_api_url", "radiant_portal_url")
    @classmethod
    def _no_trailing_slash(cls, value: str | None) -> str | None:
        return value.rstrip("/") if value else value

    @field_validator("radiant_shared_db")
    @classmethod
    def _database_name(cls, value: str) -> str:
        if not _DB_NAME.match(value):
            raise ValueError(f"not a database name: {value!r}")
        return value

    @field_validator("starrocks_ssl_ca")
    @classmethod
    def _existing_file(cls, value: str | None) -> str | None:
        if value is not None and not Path(value).is_file():
            raise ValueError(f"no such file: {value}")
        return value

    @model_validator(mode="after")
    def _ca_to_verify_with(self) -> "Settings":
        if self.starrocks_ssl_verify and self.starrocks_ssl_ca is None and system_ca_bundle() is None:
            raise ValueError("STARROCKS_SSL_VERIFY needs STARROCKS_SSL_CA: no system CA bundle found")
        return self

    @property
    def starrocks_ca_file(self) -> str | None:
        """The CA file the StarRocks connection verifies against, or None when it does not verify."""
        if not self.starrocks_ssl_verify:
            return None
        return self.starrocks_ssl_ca or system_ca_bundle()


def system_ca_bundle() -> str | None:
    """The system CA bundle (``SSL_CERT_FILE`` or OpenSSL's default), if the file exists.

    The connector's C extension does not load the system store by itself: it
    needs the bundle as ``ssl_ca``.
    """
    return ssl.get_default_verify_paths().cafile


_current: Settings | None = None


def get_settings() -> Settings:
    """The settings in effect, read from the environment on the first call."""
    global _current
    if _current is None:
        _current = Settings()
    return _current


def use_settings(settings: Settings | None) -> None:
    """Install ``settings`` (tests); ``None`` reads the environment again on the next call."""
    global _current
    _current = settings


def load_or_exit() -> Settings:
    """``get_settings()`` for startup: an invalid environment exits with one line per error."""
    try:
        return get_settings()
    except ValidationError as exc:
        lines = [
            f"  {str(err['loc'][0]).upper()}: {err['msg']}" if err["loc"] else f"  {err['msg']}"
            for err in exc.errors()
        ]
        raise SystemExit("Invalid configuration:\n" + "\n".join(lines)) from None
