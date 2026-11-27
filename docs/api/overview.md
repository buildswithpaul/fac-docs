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

## Tasks

A stateless-era client that declares the tasks extension (`io.modelcontextprotocol/tasks` in its capabilities) is not made to wait for long work. When one of these tools has queued its work in the background, `tools/call` answers straight away with `resultType: "task"`:

| Tool | Becomes a task when | The task ends |
|---|---|---|
| `generate_report` | A prepared report has to be queued, or is already running for the same filters | `completed` with the report's result; `failed` with the report's error |
| `start_import` | The import is queued for a background worker | `completed` with the import's result once the import session has left Importing or its Data Import has ended. The result's `state` says how: `finished`; `refused` when ERPNext refused the file or some rows (the message says why); or `interrupted` when the Data Import ended in Error before every row was processed (the message says to continue). `failed` only when nothing runs the import any more and its Data Import never ended, because the worker died or the job timed out: call `start_import` again to continue it, and records already imported are skipped. A Data Import saved in the last 2 minutes whose job is not queued yet, such as the next level of a tree, reads `working` |
| `run_migration_plan` | The approved plan is running in the background | `completed` with the plan's result for Completed or Partially Completed; `failed` with the plan's last message for Failed or Stopped |

The client then polls `tasks/get` with the `taskId`:

- **Poll interval**: every answer carries `pollIntervalMs: 5000`.
- **Expiry**: a task lives 24 hours (`ttlMs: 86400000`); after that `tasks/get` answers as for an unknown task.
- **The result**: a completed task carries the same result the tool would have returned had it waited, with the user's file content fenced the same way. Nothing is stored: each poll reads the report, import session or plan again.
- **Permissions**: each poll runs as the user who started the task. If they may no longer see the report, session or plan, the task is `failed` and no data is returned. Another user's `taskId` answers as an unknown task.
- **`tasks/cancel`** marks the task cancelled and stops it being reported. It does not stop the work: the report, import or plan carries on. Stop a plan with `stop_migration_plan`.
- **A plan whose job died**: if the background job running a migration plan dies, the plan can show `working` for up to about 10 minutes, until the scheduled sweep for dead plans (every 10 minutes) marks it ended. The task then reports `failed`.
- **`tasks/update`** is not supported (no tool needs input mid-task) and answers method-not-found.

A client without the tasks extension, or a call whose work finished inside the request, gets the tool's normal result, unchanged.

Declare the tasks extension only if your client can handle a `resultType: "task"` answer. A client that declares it without that support fails these calls instead of waiting: the official TypeScript SDK client 2.4.0, for example, has no tasks support and rejects a task result.

## Discovery

OAuth metadata is published at:

```
https://your-site.com/.well-known/openid-configuration
```

This is enough for MCP clients to auto-configure — endpoints, supported scopes, registration URL, and the MCP endpoint location are all returned by discovery.
