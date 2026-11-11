"""
Radiant MCP Server — main entrypoint.

A FastMCP server with a /health endpoint and mandatory OAuth 2.1
authentication via Keycloak (OIDC).

KEYCLOAK_REALM_URL is required — the server refuses to boot without it. On
startup it:
  1. Configures the native fastmcp KeycloakAuthProvider — a pure JWT
     resource server that validates incoming Bearer tokens against
     Keycloak's JWKS. Self-discovering clients (Claude Desktop) obtain
     tokens via Keycloak's own Dynamic Client Registration + PKCE;
     portal clients (LibreChat) present a raw Keycloak token directly.
     Both are accepted by the same verifier.
  2. Registers the Radiant tools: describe_schema, bar_chart and the raw SQL
     tools (read_query, table_overview) always, and, if RADIANT_API_URL is
     set, the tools backed by the Radiant portal API (cases, patients,
     occurrences, variants) that forward the same JWT as a Bearer token.
     Every StarRocks query runs under the authenticated user's identity
     (JWT → StarRocks, see starrocks.py).

The component holds no StarRocks credentials: there is no static-credential
fallback and no DB-connection health check.
"""

import argparse
import logging

import uvicorn
from fastmcp import FastMCP

from . import starrocks
from .app import create_app
from .call_log import CallLog
from .results import INSTRUCTIONS
from .settings import load_or_exit
from .tools import register_tools


async def main():
    parser = argparse.ArgumentParser(description='StarRocks MCP Server with Health Endpoint')
    parser.add_argument('--host', default='0.0.0.0',
                        help='Server host (default: 0.0.0.0)')
    parser.add_argument('--port', type=int, default=8000,
                        help='Server port (default: 8000)')

    args = parser.parse_args()
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")

    # Every variable is validated here: a missing KEYCLOAK_REALM_URL (OAuth is
    # mandatory) or a malformed value stops the server before it serves anything.
    settings = load_or_exit()

    mcp = FastMCP("radiant-mcp", instructions=INSTRUCTIONS)
    mcp.add_middleware(CallLog())
    print(f"Starting server on {args.host}:{args.port}")
    print(f"Default database: {starrocks.default_database() or 'None'}")
    if settings.starrocks_ca_file:
        print(f"StarRocks TLS: certificate verified against {settings.starrocks_ca_file}")
    else:
        logging.getLogger(__name__).warning(
            "StarRocks TLS certificate is not verified: set STARROCKS_SSL_VERIFY=true "
            "(and STARROCKS_SSL_CA for a private CA)"
        )

    # ---- OAuth 2.1 configuration ----
    from fastmcp.server.auth.providers.keycloak import KeycloakAuthProvider

    # KEYCLOAK_AUDIENCE is optional: StarRocks' authentication_jwt only checks `aud`
    # when its user is created with `required_audience`, which we don't set.
    # Leaving this None lets DCR-registered clients (each with their own
    # client_id and no per-client audience mapper) validate too.
    #
    # Native fastmcp Keycloak provider: a pure JWT resource server. It holds
    # no client secret and mints no tokens — it only validates incoming
    # Bearer JWTs against Keycloak's JWKS (RS256, issuer, exp, scopes, and
    # optionally aud). Self-discovering clients (Claude Desktop) get tokens
    # via Keycloak's own DCR + PKCE; portal clients (LibreChat) present a raw
    # Keycloak token. Both hit the same verifier, so no MultiAuth is needed.
    mcp.auth = KeycloakAuthProvider(
        realm_url=settings.keycloak_realm_url,
        base_url=settings.mcp_base_url,
        audience=settings.keycloak_audience,
        required_scopes=settings.oauth_required_scopes,
    )
    print("OAuth 2.1 enabled (Keycloak native provider — JWT verifier + DCR)")

    # Radiant tools. The API-backed ones forward the caller's JWT to the
    # Radiant API — no server-held credential — and are skipped without
    # RADIANT_API_URL.
    print(f"Radiant tools registered: {', '.join(register_tools(mcp))}")
    if not settings.radiant_api_url:
        print("RADIANT_API_URL unset — Radiant API tools not registered")
    if not settings.radiant_portal_url:
        print("RADIANT_PORTAL_URL unset — tools return no portal links")

    # Get the MCP ASGI app for streamable-http transport
    mcp_app = mcp.http_app(path="/")

    # Create combined app
    app = create_app(mcp_app)

    # Run with uvicorn.
    # proxy_headers + forwarded_allow_ips let uvicorn honour the
    # X-Forwarded-Proto/-For headers set by the TLS-terminating proxy
    # (e.g. AWS ALB). Without this, uvicorn assumes http and Starlette's
    # trailing-slash redirects (and OAuth metadata URLs) are emitted as
    # http:// — which breaks HTTPS clients and the OAuth discovery flow.
    config = uvicorn.Config(
        app,
        host=args.host,
        port=args.port,
        log_level="info",
        proxy_headers=True,
        forwarded_allow_ips=settings.forwarded_allow_ips,
    )
    server = uvicorn.Server(config)
    await server.serve()
