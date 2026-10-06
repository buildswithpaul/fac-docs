# Tool Reference

Frappe Assistant Core ships **30 built-in tools across 5 plugins**. All tools are exposed over MCP at `/api/method/frappe_assistant_core.api.fac_endpoint.handle_mcp`.

| Plugin | Tools | Description |
|---|---|---|
| `core` | 16 | Always enabled. Document CRUD, search, metadata, reports, workflow, email. |
| `data_science` | 4 | Optional. Python execution, SQL queries, statistical analysis, file content extraction. |
| `faco` | 7 | Optional, **FAC Cloud only**. Document generation and browser automation. These act inside the FAC Chat page, so they are not offered to other MCP clients. |
| `visualization` | 3 | Optional. Dashboards and charts. |
| `custom_tools` | — | Mechanism for external Frappe apps to register their own tools via the `assistant_tools` hook. No shipped tools. |

To toggle plugins, see [Plugin Management](../guides/plugin-management). To control which tools each role can call, see [Tool Management](../guides/tool-management).

## Core plugin (16 tools)

Always enabled. Provides essential Frappe operations.

### Document operations (6)

| Tool | Purpose |
|---|---|
| `create_document` | Create a new Frappe document |
| `get_document` | Fetch a single document by name |
| `update_document` | Update document fields (supports patch and replace modes for child tables) |
| `document_action` | Submit, cancel or amend a submittable document (`action`: `submit`, `cancel`, `amend`). `submit_document` is still accepted as a hidden alias |
| `delete_document` | Delete a document (`force=true` to ignore links) |
| `list_documents` | Paginated list with filters, fields, and ordering |

### Search (3)

FAC 3.0 collapsed the four search tools that older versions shipped (`search`,
`search_doctype`, `search_link`, a bare `fetch`) into a single `search_documents`
tool, plus the two OpenAI-compatible adapters below that wrap it.

| Tool | Purpose |
|---|---|
| `search_documents` | Text search across DocTypes |
| `chatgpt_search` | OpenAI MCP-compatible `search` adapter — wraps `search_documents` and returns `{id, title, url}` items |
| `chatgpt_fetch` | OpenAI MCP-compatible `fetch` adapter — returns full document content as `{id, title, text, url, metadata}` |

### Metadata (1)

| Tool | Purpose |
|---|---|
| `get_doctype_info` | Field definitions, link fields, permissions, and naming info for a DocType |

### Reports (3)

| Tool | Purpose |
|---|---|
| `report_list` | List available reports, optionally filtered by `report_type` (`Script Report`, `Query Report`, `Report Builder`) |
| `report_requirements` | Describe a report's required filters, columns, and metadata before running it |
| `generate_report` | Execute a Script or Query Report. Report Builder reports are not supported. |

### Workflow (2)

| Tool | Purpose |
|---|---|
| `run_workflow` | Trigger a workflow action (`Approve`, `Reject`, etc.) on a document |
| `get_pending_approvals` | List documents awaiting the current user's workflow action — this queries Frappe's own Workflow Actions, not an AI approval gate (see [FAC Chat](../fac-chat/) for that) |

### Email (1)

| Tool | Purpose |
|---|---|
| `send_email` | Queue an email via the site's Email Account |

## Data Science plugin (4 tools)

Optional. Requires `pandas` and `numpy`.

| Tool | Permissions | Purpose |
|---|---|---|
| `run_python_code` | System Manager | Execute Python in an isolated subprocess sandbox. Pre-loaded: `pd`, `np`, `frappe`, `math`, `datetime`, `json`, `re`, `random`. Plotting libraries are not available. |
| `run_database_query` | System Manager | Execute read-only `SELECT` queries. INSERT/UPDATE/DELETE/DDL and multi-statement queries are rejected. |
| `analyze_business_data` | DocType read | Statistical / trend / correlation / aggregation analysis on a DocType. Modes: `summary`, `trends`, `correlations`, `aggregations`, `comparisons`. |
| `extract_file_content` | File read | OCR and text extraction from File DocType attachments. Supports PDF, images, DOCX, XLSX, TXT. Backend is PaddleOCR (default) or Ollama vision (configurable). |

See [Python Code Orchestration](../guides/python-code-orchestration) and [Code Execution Security](../guides/code-execution-security) for the sandbox details.

## FACO plugin (7 tools)

Optional, and **reachable only from FAC Cloud**. Every tool here needs something no
other MCP client can provide: the browser tools run inside the FAC Chat page and talk to
it over Socket.IO, and `generate_document` renders through FAC Chat's rich-block
renderer.

So these tools are hidden from any other client. They do not appear in `tools/list`, and
`tools/call` refuses them, for Claude Desktop, ChatGPT, Cursor or anything you connect
yourself. FAC recognises FAC Cloud by the OAuth client its token belongs to, not by
anything the client claims about itself.

Before this, they were offered to every client and could not work: calling
`browser_take_screenshot` from Claude Desktop published a request to a page that was not
there and failed only after a 30 second timeout.

`send_email` has no such dependency, so it lives in the **core** plugin and stays
available to every MCP client.

| Tool | Purpose |
|---|---|
| `generate_document` | Render rich-block content to an HTML/PDF document |
| `browser_get_form_data` | Read form field values from the user's current page |
| `browser_get_page_context` | Get structured info about the user's current page |
| `browser_capture_diagnostics` | Collect console errors, network errors, and a screenshot from the user's browser |
| `browser_navigate_to` | Navigate the user's browser to a Frappe route |
| `browser_take_screenshot` | Capture a screenshot of the user's current page |
| `browser_wait_for_page` | Wait for the user's page to finish loading |

The browser tools act on the user's own browser, not on the server, and need the FAC
Chat page open to reach it.

## Visualization plugin (3 tools)

Optional. Requires `pandas`, `numpy`, and a charting backend.

| Tool | Purpose |
|---|---|
| `create_dashboard` | Create a Frappe Dashboard with optional chart membership, filters, sharing, and refresh interval |
| `create_dashboard_chart` | Create a Dashboard Chart and optionally attach it to an existing dashboard via `dashboard_name` |
| `list_user_dashboards` | List dashboards visible to the current user (`dashboard_type`: `all`, `frappe`, `insights`) |

## Custom Tools plugin

The `custom_tools` plugin discovers tools registered by other installed Frappe apps via the `assistant_tools` hook. It ships with no tools of its own — see your installed apps' documentation for what they expose.

## Permission denials

Frappe signals a document-level permission denial by raising a bare `frappe.PermissionError`
and keeping the readable reason in `frappe.flags.error_message`, so `str(exception)` is an
empty string. A tool that reported that exception directly returned an empty `error`, and the
model treated the denial as a field problem and retried.

Every write tool now reports a denial in one shape
([`permission_error_result`](../../../apps/frappe_assistant_core/frappe_assistant_core/core/base_tool.py#L94)):

```json
{
  "success": false,
  "error": "You need the 'create' permission on ToDo to perform this action.",
  "error_type": "permission_error",
  "doctype": "ToDo",
  "guidance": "Insufficient permissions for this operation.",
  "suggestion": "Contact your system administrator to grant necessary permissions for this DocType"
}
```

`error` carries Frappe's own reason as plain text, recovered by
[`exception_message`](../../../apps/frappe_assistant_core/frappe_assistant_core/core/base_tool.py#L74), which falls back to the exception's text,
then Frappe's reason, then a per-tool default, then the exception class name — so it is never
empty. Markup is stripped from both sources, because Frappe and ERPNext messages embed
`<strong>` and `<a href>`. The tools that return this shape:

| Tool | Denial handler |
|---|---|
| `create_document` | [create_document.py:355](../../../apps/frappe_assistant_core/frappe_assistant_core/plugins/core/tools/create_document.py#L355) |
| `update_document` | [update_document.py:395](../../../apps/frappe_assistant_core/frappe_assistant_core/plugins/core/tools/update_document.py#L395) |
| `document_action` (submit) | [document_action.py:241](../../../apps/frappe_assistant_core/frappe_assistant_core/plugins/core/tools/document_action.py#L241) |
| `document_action` (cancel) | [document_action.py:352](../../../apps/frappe_assistant_core/frappe_assistant_core/plugins/core/tools/document_action.py#L352) |
| `document_action` (amend) | [document_action.py:524](../../../apps/frappe_assistant_core/frappe_assistant_core/plugins/core/tools/document_action.py#L524) |
| `create_dashboard` | [create_dashboard.py:134](../../../apps/frappe_assistant_core/frappe_assistant_core/plugins/visualization/tools/create_dashboard.py#L134) |
| `create_dashboard_chart` | [create_dashboard_chart.py:206](../../../apps/frappe_assistant_core/frappe_assistant_core/plugins/visualization/tools/create_dashboard_chart.py#L206) |

`delete_document` keeps its own result shape (`permission_error: true`) but reports the same
recovered reason ([delete_document.py:136](../../../apps/frappe_assistant_core/frappe_assistant_core/plugins/core/tools/delete_document.py#L136)).
Any tool that does not catch the exception itself falls through to `BaseTool._safe_execute`
([base_tool.py:288](../../../apps/frappe_assistant_core/frappe_assistant_core/core/base_tool.py#L288)), which applies the same recovery.

`error_type: "permission_error"` means the request was refused, not malformed: retrying with
different field values cannot succeed.

### ToDo creation

Frappe decides who may create a ToDo. Before Frappe v16.32.0 / v15.119.0, a user without a role
granting ToDo create (such as System Manager) may create only a ToDo naming them
(`allocated_to` or `assigned_by`), so `create_document` allocates a ToDo that names nobody to
the calling user, and one naming someone else is still refused. From those releases
([frappe/frappe#41869](https://github.com/frappe/frappe/pull/41869)) ownership alone carries the
create, and the ToDo is left exactly as written.

## Per-tool documentation

Per-tool `inputSchema`, return shape, and behaviour notes live in the source repo alongside each tool implementation:

- [`plugins/core/tools/`](https://github.com/buildswithpaul/Frappe_Assistant_Core/tree/main/frappe_assistant_core/plugins/core/tools)
- [`plugins/data_science/tools/`](https://github.com/buildswithpaul/Frappe_Assistant_Core/tree/main/frappe_assistant_core/plugins/data_science/tools)
- [`plugins/faco/tools/`](https://github.com/buildswithpaul/Frappe_Assistant_Core/tree/main/frappe_assistant_core/plugins/faco/tools)
- [`plugins/visualization/tools/`](https://github.com/buildswithpaul/Frappe_Assistant_Core/tree/main/frappe_assistant_core/plugins/visualization/tools)

The authoritative `inputSchema` for any tool is in its Python file's `__init__`.
