"""Shared fixtures for sandbox pytest suites.

All connection settings come from environment variables — no defaults. Set them
to match your running sandbox before invoking pytest:

    RADIANT_API_HOST          http(s)://host:port of the running Radiant API
    RADIANT_KEYCLOAK_URL      http(s)://host:port of Keycloak
    RADIANT_REALM             Keycloak realm
    RADIANT_CLIENT_ID         OAuth client_id (client-credentials grant)
    RADIANT_CLIENT_SECRET     OAuth client secret
"""
import os
from collections.abc import Iterator

import pytest
import requests

from radiant_python import ApiClient, Configuration
from radiant_python.api.variant_api import VariantApi


REQUIRED_ENV_VARS = (
    "RADIANT_API_HOST",
    "RADIANT_KEYCLOAK_URL",
    "RADIANT_REALM",
    "RADIANT_CLIENT_ID",
    "RADIANT_CLIENT_SECRET",
)


def _required_env(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        pytest.fail(
            f"missing required env var: {name}. "
            f"Set sandbox values for {', '.join(REQUIRED_ENV_VARS)} before running."
        )
    return value


@pytest.fixture(scope="session")
def api_host() -> str:
    return _required_env("RADIANT_API_HOST")


@pytest.fixture(scope="session")
def keycloak_token() -> str:
    base = _required_env("RADIANT_KEYCLOAK_URL")
    realm = _required_env("RADIANT_REALM")
    token_url = f"{base}/realms/{realm}/protocol/openid-connect/token"
    payload = {
        "client_id": _required_env("RADIANT_CLIENT_ID"),
        "client_secret": _required_env("RADIANT_CLIENT_SECRET"),
        "grant_type": "client_credentials",
    }
    resp = requests.post(token_url, data=payload, timeout=10)
    resp.raise_for_status()
    return resp.json()["access_token"]


@pytest.fixture(scope="session")
def api_config(api_host: str, keycloak_token: str) -> Configuration:
    return Configuration(host=api_host, access_token=keycloak_token)


@pytest.fixture(scope="session")
def api_client(api_config: Configuration) -> Iterator[ApiClient]:
    with ApiClient(api_config) as client:
        yield client


@pytest.fixture(scope="session")
def variant_api(api_client: ApiClient) -> VariantApi:
    return VariantApi(api_client)
