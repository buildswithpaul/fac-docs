# API Reference

Frappe Assistant Core exposes a single MCP-over-HTTP endpoint plus a handful of OAuth discovery endpoints. This page documents the protocol surface — for per-tool schemas, see [Tool Reference](./tool-reference).

## Endpoints

| Endpoint | Purpose |
|---|---|
| `POST /api/method/frappe_assistant_core.api.fac_endpoint.handle_mcp` | Main MCP endpoint (JSON-RPC 2.0 over HTTP) |
| `GET /.well-known/openid-configuration` | OAuth 2.0 authorization-server metadata |
| `GET /.well-known/oauth-protected-resource` | RFC 9728 protected-resource metadata |
| `POST /api/method/frappe_assistant_core.api.oauth_registration.register_client` | RFC 7591 dynamic client registration |

OAuth uses Frappe's built-in `/api/method/frappe.integrations.oauth2.*` endpoints for authorization, token exchange, and refresh.

## Authentication

All MCP requests require an OAuth 2.0 bearer token:

```http
POST /api/method/frappe_assistant_core.api.fac_endpoint.handle_mcp HTTP/1.1
Authorization: Bearer <access_token>
Content-Type: application/json

{"jsonrpc":"2.0","method":"tools/list","id":1}
```

For legacy clients, FAC also accepts the standard Frappe `token` scheme on the same endpoint:

```http
Authorization: token <api_key>:<api_secret>
```

Bearer is the recommended path for all new integrations.

## Sessions

The MCP endpoint reads and propagates the `Mcp-Session-Id` (or `MCP-Session-Id`) header. Pass the same session id on subsequent requests in a conversation so the server can correlate them in logs and audit trails.

## MCP methods

The endpoint implements the MCP 2025-06-18 protocol. The methods you'll use:

### `initialize`

Negotiates protocol version and reports server capabilities.

```json
{
  "jsonrpc": "2.0",
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "clientInfo": { "name": "my-client", "version": "1.0.0" }
  },
  "id": 1
}
```

Returns server `serverInfo`, supported `capabilities`, and the negotiated `protocolVersion`.

### `tools/list`

Returns the catalogue of tools available to the authenticated user, with each tool's `name`, `description`, and `inputSchema`. The list is filtered by the user's role and the enable-state of each tool (see [Tool Management](../guides/tool-management)).

### `tools/call`

Invokes a tool. The request must include the tool's `name` and an `arguments` object matching the tool's `inputSchema`.

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "list_documents",
    "arguments": { "doctype": "Customer", "limit": 10 }
  },
  "id": 2
}
```

### `prompts/list` and `prompts/get`

Surface the [Prompt Templates](../guides/prompt-templates) library over MCP. Templates published with appropriate visibility appear in `prompts/list`; `prompts/get` renders one with caller-supplied arguments.

### `resources/list` and `resources/read`

Surface [Skills](../guides/skills-user-guide) as readable MCP resources. Each skill resolves to a markdown document the client can pull into context.

## Error model

Errors follow JSON-RPC 2.0:

```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32000,
    "message": "User does not have permission to call tool 'run_python_code'"
  },
  "id": 2
}
```

Common error codes:

| Code | Meaning |
|---|---|
| `-32600` | Invalid Request (malformed JSON-RPC envelope) |
| `-32601` | Method not found |
| `-32602` | Invalid params (typically tool input validation failed) |
| `-32603` | Internal server error |
| `-32000` | Application error — permission denied, tool disabled, etc. |

HTTP status:

- `200` — JSON-RPC response (success or error envelope)
- `401` — Missing or invalid bearer token
- `403` — Token valid but user lacks `assistant_enabled` or required role
- `429` — Rate limit exceeded
- `500` — Unhandled server error

## OAuth 2.0 details

FAC implements OAuth 2.0 Authorization Code flow with PKCE. See [OAuth Setup Guide](../getting-started/oauth/setup-guide) for a full walkthrough.

| Feature | Supported |
|---|---|
| Authorization Code + PKCE | ✅ Required for public clients |
| Refresh tokens | ✅ Automatic refresh |
| Dynamic Client Registration (RFC 7591) | ✅ Toggleable in Assistant Core Settings |
| Authorization Server Metadata (RFC 8414) | ✅ At `/.well-known/openid-configuration` |
| Protected Resource Metadata (RFC 9728) | ✅ At `/.well-known/oauth-protected-resource` |
| Client Credentials grant | ❌ Not supported |
| Implicit grant | ❌ Not supported (deprecated by OAuth 2.1) |

Supported scopes are returned by discovery. The default scope set provides full tool access for the authenticated user; restrict via Frappe roles rather than scope strings.

## CORS

For browser-based MCP clients (MCP Inspector, custom web apps), add the origin to **Allowed Public Client Origins** in Assistant Core Settings → OAuth. See [OAuth/CORS Configuration](../getting-started/oauth/setup-guide#cors).

## Related

- [MCP StreamableHTTP](../internals/mcp-streamable-http) — protocol-level details
- [Tool Reference](./tool-reference) — every tool with its purpose
- [OAuth Setup Guide](../getting-started/oauth/setup-guide) — full OAuth walkthrough
