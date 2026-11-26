# API Overview

Frappe Assistant Core exposes its capabilities through two surfaces:

1. **MCP endpoint** — the protocol AI clients talk to (`/api/method/frappe_assistant_core.api.fac_endpoint.handle_mcp`)
2. **Frappe whitelisted methods** — direct HTTP endpoints used by the SPA, the Desk widget, and integrations

Most external integrations should use the MCP endpoint with OAuth — that's what Claude Desktop, ChatGPT, MCP Inspector, and other MCP-compatible clients use.

## Reference

- [API Reference](./reference) — every endpoint with request/response samples
- [Tool Reference](./tool-reference) — every MCP tool, its arguments, and what it returns

## Authentication

All MCP requests require an OAuth 2.0 bearer token. See [OAuth Setup Guide](../getting-started/oauth/setup-guide).

## Supported protocol versions

The endpoint serves two eras of MCP side by side, so clients on either one work without configuration:

| Era | Versions | How a client starts |
|---|---|---|
| Handshake | 2024-11-05, 2025-03-26, 2025-06-18 | `initialize` first, then requests |
| Stateless | 2026-07-28 | Any request; `server/discover` lists what the server supports |

A stateless request carries `MCP-Protocol-Version` and `Mcp-Method` headers (plus `Mcp-Name` for `tools/call`, `prompts/get` and `resources/read`) and the protocol version and client capabilities in `params._meta`. A request that names a version the server does not speak gets HTTP 400 with error code `-32022` and the list of supported versions. Stateless-era results carry `resultType`, and list results carry `ttlMs` with `cacheScope: "private"`, because the tool list depends on who is asking. `ping` and `logging/setLevel` do not exist in that era and answer HTTP 404.

## Discovery

OAuth metadata is published at:

```
https://your-site.com/.well-known/openid-configuration
```

This is enough for MCP clients to auto-configure — endpoints, supported scopes, registration URL, and the MCP endpoint location are all returned by discovery.
