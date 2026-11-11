"""``app.create_app``: the HTTP routes around the MCP endpoint."""

from contextlib import asynccontextmanager

from starlette.applications import Starlette
from starlette.testclient import TestClient

from radiant_mcp.app import create_app


@asynccontextmanager
async def _no_lifespan(_app):
    yield


def _client() -> TestClient:
    mcp_app = Starlette()
    mcp_app.lifespan = _no_lifespan
    return TestClient(create_app(mcp_app))


def test_cors_allows_any_origin_but_no_credentials(configure):
    client = _client()
    response = client.get("/health", headers={"Origin": "https://evil.example"})
    # Bearer tokens only: a browser must never send cookies cross-origin to this server.
    assert response.headers["access-control-allow-origin"] == "*"
    assert "access-control-allow-credentials" not in response.headers


def test_protected_resource_metadata_has_exact_urls(configure):
    # Strict MCP clients compare these URLs exactly: no trailing slash, the resource under /mcp.
    configure(mcp_base_url="https://mcp.example", oauth_supported_scopes=["openid", "offline_access"])
    response = _client().get("/.well-known/oauth-protected-resource")
    assert response.status_code == 200 and response.json() == {
        "resource": "https://mcp.example/mcp",
        "authorization_servers": ["https://kc.example/realms/radiant"],
        "scopes_supported": ["openid", "offline_access"],
        "bearer_methods_supported": ["header"],
    }
