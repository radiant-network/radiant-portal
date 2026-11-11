"""OAuth .well-known metadata workaround endpoints.

With the native KeycloakAuthProvider the MCP server is a pure resource server:
authorization-server metadata lives on Keycloak, so we only serve RFC 9728
protected-resource metadata here. It advertises Keycloak's realm as the
authorization server, which is where clients then run OIDC discovery + DCR.
"""

import json

from starlette.responses import Response

from .settings import get_settings


async def protected_resource_metadata(request):
    """RFC 9728: OAuth protected resource metadata with normalised URLs.

    We serve this by hand (rather than relying on the provider's built-in
    route) because Pydantic's AnyHttpUrl serialisation appends trailing slashes
    that strict MCP clients reject on exact comparison, and because the path the
    provider advertises must be served at the app root (see app.py).

    ``authorization_servers`` points at the Keycloak realm, so clients fetch
    authorization-server metadata straight from Keycloak.

    ``scopes_supported`` must include every scope a client will request — MCP
    clients (Claude Code/Desktop) use this set for their DCR registration, then
    request the same scopes at /authorize. It defaults to "openid offline_access"
    because Claude requests ``offline_access`` (for a refresh token) at authorize;
    if it isn't advertised, the DCR-registered client is created without it and
    Keycloak rejects the authorize request with ``invalid_scope``.
    """
    # MCP_BASE_URL is the server root (e.g. http://localhost:8000); the MCP
    # resource itself lives under /mcp.
    settings = get_settings()
    body = json.dumps({
        "resource": settings.mcp_base_url + "/mcp",
        "authorization_servers": [settings.keycloak_realm_url],
        "scopes_supported": settings.oauth_supported_scopes,
        "bearer_methods_supported": ["header"],
    })
    return Response(body, media_type="application/json")
