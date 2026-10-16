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
| `list_documents` | Paginated list with filters, fields, and ordering. Pass `offset` to skip rows; when `has_more` is true the response carries `next_offset` for the next page. `group_by` with `aggregate` returns database-computed totals per group instead (see [Answering business questions](#answering-business-questions)) |

#### Permissions and error messages

`create_document`, `update_document` and `document_action` run as the calling user. Frappe checks the user's permission on the DocType and then on the document itself, and a DocType can add document-level rules of its own. When the DocType-level check fails, the tool returns `{"success": false, "error": "Insufficient create permissions for <DocType>"}` with no `error_type`. When the document-level check refuses a create (for example, a ToDo allocated to someone else, when the caller holds no role that grants ToDo access beyond the automatic roles, on Frappe before v16.32.0 / v15.119.0), the tool's result has `success: false`, the reason in `error`, and `error_type: "permission_error"`:

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

Over MCP, this tool result is nested under the `result` key in the response, and the top-level `error_type` is `ToolReportedError`.

- **Dry runs.** `create_document` with `validate_only: true` runs the same create-permission check as a real create, so a dry run does not report success for a document the real create would refuse.
- **ToDo.** Frappe decides who may create a ToDo. Before v16.32.0 / v15.119.0, a user without a role that grants ToDo access beyond the automatic roles (on a stock site, System Manager) could create only a ToDo that names them, as `allocated_to` or `assigned_by`. From those releases the ToDo's owner is also accepted, and the creator owns it, so a user may create any ToDo. On the older releases, `create_document` allocates a ToDo that names nobody to the calling user instead of failing; on the newer ones it changes nothing. Administrator and System Managers are unaffected: their ToDo stays unallocated. On the older releases a ToDo allocated to someone else is still refused, and `error` says why. If the ToDo also names a `reference_type` and `reference_name`, allocating it to you also assigns that document to you, exactly as Assign to me does in the Desk: you are added to the document's assignments and an Assigned comment is posted on its timeline.

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
| `get_doctype_info` | Field definitions, link fields, permissions, and naming info for a DocType. Pass `topic` instead of `doctype` to find where a subject's data lives |

### Reports (3)

| Tool | Purpose |
|---|---|
| `report_list` | Find reports the user can run. `query` searches by what the user asked (`limit` default 10, max 25); `module` and `report_type` (`Script Report`, `Query Report`, `Report Builder`) filter. With no arguments it returns a per-module report count, not every report |
| `report_requirements` | Describe a report's required filters, columns, and metadata before running it |
| `generate_report` | Execute a Script or Query Report. Report Builder reports are not supported. Returns at most `max_rows` rows (default 500, up to 5000) with `row_count` and `truncated`; a totals row is kept. `summary_only` returns the count and columns without rows. A prepared report is awaited for at most 15 seconds, then the call returns `status: "timeout"` (still being prepared); calling again with the same filters picks up the same report. Every result has `defaulted_filters`, the filters FAC filled in |

#### Answering business questions

When a user asks a business question ("what are our overdue receivables?", "sales by territory this quarter"), the assistant tries sources in this order and stops at the first that fits:

1. **A matching custom report on the site.** A report someone built in the UI is the site's own definition of the number, so it ranks above a standard report.
2. **A standard ERPNext report.**
3. **A grouped query on the right DocType**, using `list_documents` with `group_by` and `aggregate`. `get_doctype_info` with `topic` finds the DocType first when the subject is not obvious.

The answer names the report and the filters it ran with, or the records and DocType it used. When FAC filled in a filter the user did not give (period, company), the answer states the value used; the `defaulted_filters` field of `generate_report` lists them.

**Finding a report: `report_list`**

- `query` ranks the reports the user can run against the question. `limit` caps the list (default 10, maximum 25).
- Each result carries `origin` (`custom` or `standard`), `ref_doctype` (the source DocType), `mandatory_filters`, `prepared` (the report runs in the background) and, for standard reports, a short `purpose`.
- With no arguments the tool returns a count of reports per module rather than every report.
- Only reports the user may run are listed: enabled, permitted by the report's roles, and with `report` permission on its reference DocType. This is Frappe's own rule.

**Running a report: `generate_report`**

- A prepared report is awaited for at most 15 seconds. If it is not ready, the result is `status: "timeout"` with the report's `prepared_report_name`: the report is still being prepared, not empty. Call again with the same filters and the retry picks up that report.
- A prepared report that fails returns `success: false` and `status: "error"` with the error text.
- For totals, the assistant uses `summary_only`, which returns the columns, `row_count` and `report_summary` without rows.

**Locating data: `get_doctype_info` with `topic`**

Passing `topic` (for example `"bookings"`) instead of `doctype` returns up to eight DocTypes whose name or module matches, singular or plural, custom DocTypes first on a tie. Each entry has `has_data` (yes or no, never a count), `date_fields`, `amount_fields`, `party_fields` and `custom_fields`. Only DocTypes the user may read are listed, and fields above the user's permission level or marked sensitive are left out. Child tables and Single DocTypes are not listed.

**Grouped totals: `list_documents` with `group_by` and `aggregate`**

```json
{
  "doctype": "Sales Invoice",
  "filters": {"posting_date": [">=", "2026-01-01"]},
  "group_by": "territory",
  "aggregate": [{"function": "sum", "field": "base_grand_total"}]
}
```

- `function` is `sum`, `count`, `avg`, `min` or `max`, with at most 5 aggregates. `sum` and `avg` need a numeric field (Currency, Float, Int or Percent).
- The database computes each figure over only the records the user may read, under both role permissions and User Permissions. The numbers are not summed from a truncated listing.
- Submittable DocTypes default to submitted documents; the response says so with `docstatus_defaulted`.
- Restricted, higher-permlevel and non-numeric (for `sum` and `avg`) fields are refused with an explanation. Admin-only DocTypes and virtual DocTypes are refused.
- `limit` caps the number of groups (default 100); `has_more` is true when groups were cut off.

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
| `run_database_query` | System Manager | Execute read-only `SELECT` queries. INSERT/UPDATE/DELETE/DDL and multi-statement queries are rejected. Never returns more than 1000 rows (a larger `LIMIT` is clamped) and reports `truncated` when rows were cut. |
| `analyze_business_data` | DocType read | Statistical / trend / correlation / aggregation analysis on a DocType. Modes: `summary`, `trends`, `correlations`, `aggregations`, `comparisons`. |
| `extract_file_content` | File read | OCR and text extraction from File DocType attachments. Supports PDF, images, DOCX, XLSX, TXT. Backend is PaddleOCR (default) or Ollama vision (configurable). |

See [Python Code Orchestration](../guides/python-code-orchestration) and [Code Execution Security](../guides/code-execution-security) for the sandbox details.

## FACO plugin (8 tools)

Optional, and **reachable only from FAC Cloud**. Every tool here needs something no
other MCP client can provide: the browser tools run inside the FAC Chat page and talk to
it over Socket.IO, `generate_document` renders through FAC Chat's rich-block
renderer, and `attach_chat_file` acts on files uploaded in FAC Chat.

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
| `attach_chat_file` | Attach a file the user uploaded in chat to a document, as a copy |
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
