# API Overview

Frappe Assistant Core exposes its capabilities through two surfaces:

1. **MCP endpoint** — the protocol AI clients talk to (`/api/method/frappe_assistant_core.api.fac_endpoint.handle_mcp`)
2. **Frappe whitelisted methods** — direct HTTP endpoints used by the SPA, widget, and integrations

Most external integrations should use the MCP endpoint with OAuth — that's what Claude Desktop, ChatGPT, MCP Inspector, and other MCP-compatible clients use.

## Reference

- [API Reference](./reference) — every endpoint with request/response samples
- [Tool Reference](./tool-reference) — every MCP tool, its arguments, and what it returns

## Authentication

All MCP requests require an OAuth 2.0 bearer token. See [OAuth Setup Guide](../getting-started/oauth/setup-guide).

## Discovery

OAuth metadata is published at:

```
https://your-site.com/.well-known/openid-configuration
```

This is enough for MCP clients to auto-configure — endpoints, supported scopes, registration URL, and the MCP endpoint location are all returned by discovery.
