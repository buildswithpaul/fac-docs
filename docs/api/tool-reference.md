# Tool Reference

Frappe Assistant Core ships **41 built-in tools across 5 plugins**. All tools are exposed over MCP at `/api/method/frappe_assistant_core.api.fac_endpoint.handle_mcp`.

| Plugin | Tools | Description |
|---|---|---|
| `core` | 19 | Always enabled. Document CRUD, search, metadata, reports, workflow, email, builder checks. |
| `data_science` | 3 | Optional. Python execution, SQL queries, file content extraction. |
| `faco` | 16 | Optional, **FAC Cloud only**. Document generation, browser automation, and tools for Frappe CRM, Helpdesk and Insights. These act inside FAC Chat, so they are not offered to other MCP clients. |
| `visualization` | 3 | Optional. Dashboards and charts. |
| `custom_tools` | — | Mechanism for external Frappe apps to register their own tools via the `assistant_tools` hook. No shipped tools. |

To toggle plugins, see [Plugin Management](../guides/plugin-management). To control which tools each role can call, see [Tool Management](../guides/tool-management).

## Core plugin (19 tools)

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

`create_document`, `update_document` and `document_action` run as the calling user. Frappe checks the user's permission on the DocType and then on the document itself, and a DocType can add document-level rules of its own. When the DocType-level check fails, the tool returns `{"success": false, "error": "Insufficient create permissions for <DocType>", "error_type": "permission_error"}`. When the document-level check refuses a create (for example, a ToDo allocated to someone else, when the caller holds no role that grants ToDo access beyond the automatic roles, on Frappe before v16.32.0 / v15.119.0), the tool's result has `success: false`, the reason in `error`, and `error_type: "permission_error"`:

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

- **Dry runs.** `create_document` with `validate_only: true` runs the same create-permission check as a real create, so a dry run does not report success for a document the real create would refuse. A dry run does the preparation Frappe does at insert time before validation: defaults, naming, `before_insert`, link validation and `before_validate`. It then runs the document's own validation. Everything is rolled back, whatever the outcome. Naming-series counters are restored, but an autoincrement id is not reclaimed, so a dry run on an autoincrement DocType uses up one id, as a failed real insert does ([`_prepare_for_insert`](../../../apps/frappe_assistant_core/frappe_assistant_core/plugins/core/tools/create_document.py#L66)). It does **not** check mandatory fields, so a real create can still fail on a missing value. A dry run refused by validation or permissions is the answer the caller asked for, so it writes no Error Log row.
- **Plain-language refusals.** A refused write to a protected customisation DocType returns `error_type: "permission_error"` with a message that says what is missing. Changing a Server Script needs a System Manager who also holds the Script Manager role. A Query or Script Report needs the Script Manager role too.

#### Customisation results

Customisation records change how a site behaves: Server Script, Client Script, Custom Field, Property Setter, Workflow (and its State and Action Master), Custom DocPerm, DocType, Role, Report, Print Format, Notification and FAC Page. A successful `create_document` or `update_document` on any record adds `url`, a link to the saved record in Desk. For these DocTypes it also adds:

| Key | When | Meaning |
|---|---|---|
| `applies_to` | Custom Field, Property Setter, Client Script, Server Script, Print Format, Notification | `{doctype, url}`: the form the customisation changes, and a link to a new document of that type, where the change shows |
| `location` | Custom Field | `{tab, section, collapsed, first_tab}`: where the field shows on its form, read after the save. `collapsed` is true when its section starts folded, and `first_tab` is false when it sits on a later tab |
| `placement_warning` | Custom Field | A plain sentence, present only when the field lands in a collapsed section or off the first tab, for example "Will appear on the Details tab, in the Extra section (collapsed, hidden until someone opens it). People may not notice it: the section is collapsed." |
| `page_url` | FAC Page | The <code v-pre>/app/fac-pages/&lt;slug&gt;</code> link where the page opens. `url` stays the link to its form |
| `warning` | Report | Present when a non-standard Script Report is saved while server scripts are switched off: the report is saved, but it shows an error when someone runs it |

([`customisation_result`](../../../apps/frappe_assistant_core/frappe_assistant_core/utils/customisation.py#L362))

#### Server scripts switched off

Frappe runs Server Scripts only when the site's server-scripts setting is on, and switching it on needs access to the server (on Frappe Cloud, a private bench). While it is off:

- `get_doctype_info` for `Server Script` or `Report` returns `server_scripts_enabled` (`true` or `false`) so the assistant can check before it plans ([`get_doctype_info`](../../../apps/frappe_assistant_core/frappe_assistant_core/plugins/core/tools/metadata_tools.py#L213)).
- `create_document` or `update_document` refuses an **active** Server Script with `error_type: "server_scripts_disabled"`, because a DocType Event script would stop its document type from saving. Saving the script with `disabled` set to 1 is allowed, and it does nothing until scripts are switched on ([`server_script_guard`](../../../apps/frappe_assistant_core/frappe_assistant_core/utils/customisation.py#L106)).
- `update_document` never renames a record. A rename sent as `new_name`, `rename`, or a `data.name` that differs from the record is skipped, the other changes are saved, and the result carries a `warning` pointing to Rename in Desk. An update that holds only a rename returns `error_type: "rename_not_supported"`. The skills therefore name records by what they do ("Discount limit on Sales Invoice submit"), never by a value that may change, so changing a value needs no rename.
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
| `generate_report` | Execute a Script or Query Report. Report Builder reports are not supported. Returns at most `max_rows` rows (default 500, up to 5000) with `row_count` and `truncated`; a totals row is kept. `summary_only` returns the count and columns without rows. A prepared report is awaited for at most 15 seconds, then the call returns `status: "timeout"` (still being prepared); calling again with the same filters picks up the same report. Every successful result has `defaulted_filters`, the filters FAC filled in |

#### Answering business questions

When a user asks a business question ("what are our overdue receivables?", "sales by territory this quarter"), the assistant is instructed (in the tool descriptions; the code does not enforce the order) to try sources in this order and stop at the first that fits:

1. **A matching custom report on the site.** A report someone built in the UI is the site's own definition of the number, so on an equal match a report built on this site ranks above a standard one.
2. **A standard ERPNext report.**
3. **A grouped query on the right DocType**, using `list_documents` with `group_by` and `aggregate`. `get_doctype_info` with `topic` finds the DocType first when the subject is not obvious.

The answer names the report and the filters it ran with, or the records and DocType it used. When FAC filled in a filter the user did not give (period, company), the answer states the value used; the `defaulted_filters` field of `generate_report` lists them.

**Finding a report: `report_list`**

- `query` ranks the reports the user can run against the question. `limit` caps the list (default 10, maximum 25).
- `report_type` is ignored when `query` is given.
- Each `query` result carries `origin` (`custom` or `standard`), `ref_doctype` (the source DocType), `mandatory_filters`, `prepared` (the report runs in the background) and `purpose` (a short description for standard reports, otherwise null). Results from `module` or `report_type` without `query` carry `name`, `report_name`, `report_type`, `module`, `is_standard` and `disabled` instead.
- With no arguments the tool returns a count of reports per module rather than every report.
- Only reports the user may run are listed: enabled, permitted by the report's roles, and with `report` permission on its reference DocType. This is Frappe's own rule.

**Running a report: `generate_report`**

- A prepared report is awaited for at most 15 seconds. If it is not ready, the result is `status: "timeout"` with the report's `prepared_report_name`: the report is still being prepared, not empty. Call again with the same filters and the retry picks up that report.
- A prepared report that fails returns `success: false` and `status: "error"` with the error text.
- For totals, the assistant uses `summary_only`, which returns the columns, `row_count` and `report_summary` without rows.

**Locating data: `get_doctype_info` with `topic`**

Passing `topic` (for example `"bookings"`) instead of `doctype` returns up to eight DocTypes whose name or module matches, singular or plural, custom DocTypes first on a tie. Each entry has `has_data` (yes or no, never a count), `date_fields`, `amount_fields`, `party_fields` and `custom_fields`. Only DocTypes the user may read are listed, and fields above the user's permission level or marked sensitive are left out. Child tables and Single DocTypes are not listed. For users with the Assistant User role, the settings DocTypes FAC hides from that role are also left out.

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
- Submittable DocTypes default to submitted documents unless you pass `docstatus`; the response says so with `docstatus_defaulted`.
- Restricted, higher-permlevel and non-numeric (for `sum` and `avg`) fields are refused with an explanation. For users with the Assistant User role, the settings DocTypes FAC hides from that role (System Settings, Print Settings, Email Domain, Social Login Key and similar) are refused; virtual DocTypes are refused for everyone.
- `limit` caps the number of groups (default 100); `has_more` is true when groups were cut off.

### Workflow (2)

| Tool | Purpose |
|---|---|
| `run_workflow` | Trigger a workflow action (`Approve`, `Reject`, etc.) on a document |
| `get_pending_approvals` | List documents awaiting the current user's workflow action — this queries Frappe's own Workflow Actions, not an AI approval gate (see [FAC Chat](../fac-chat/) for that). Only documents the user can open are listed: User Permissions on the referenced document apply |

### Email (1)

| Tool | Purpose |
|---|---|
| `send_email` | Queue an email via the site's Email Account |

### Builder checks (3)

Read-only tools the assistant uses while it builds a customisation, so it does not learn the Server Script sandbox by trial and error. They save nothing, run no code and never switch user. Only System Managers can call them, and they are classified read-only, so FAC Chat shows no approval card for them.

| Tool | Purpose |
|---|---|
| `test_as_user` | Check what another user is allowed to do: up to 20 checks of a permission type (`read`, `write`, `create`, `delete`, `submit`, `cancel` and so on) on a DocType or one record. Frappe's own rules decide, for that user: role permissions, User Permissions, ownership, shares and `has_permission` hooks. Each check returns `allowed`, `refused` or `error` with a fixed reason, plus `roles_that_allow`, the roles that grant it. The result never carries the record's content ([`TestAsUser`](../../../apps/frappe_assistant_core/frappe_assistant_core/plugins/core/tools/test_as_user.py#L131)) |
| `sandbox_reference` | List the names a Server Script can use on this site, built from Frappe's own sandbox, optionally filtered by a prefix such as `frappe.db`. Names unavailable in DocType Event scripts (`commit`, `rollback`, `add_index`) are listed under `not_in_doctype_event`, and `rules` lists the limits that are not names, such as SELECT-only `frappe.db.sql` ([`SandboxReference`](../../../apps/frappe_assistant_core/frappe_assistant_core/plugins/core/tools/sandbox_reference.py#L95)) |
| `recent_errors` | Read recent Error Log entries and failed scheduled jobs, newest first, optionally filtered by text such as a script name. Error text can include request data, so treat it as private ([`RecentErrors`](../../../apps/frappe_assistant_core/frappe_assistant_core/plugins/core/tools/recent_errors.py#L47)) |

A permission hook that reads `frappe.session.user` instead of its `user` argument answers `test_as_user` for the caller, not the user being checked. Administrator is always allowed.

## Data Science plugin (3 tools)

Optional. Requires `pandas` and `numpy`.

| Tool | Permissions | Purpose |
|---|---|---|
| `run_python_code` | System Manager | Execute Python in an isolated subprocess sandbox. Pre-loaded: `pd`, `np`, `frappe`, `math`, `datetime`, `json`, `re`, `random`. Plotting libraries are not available. |
| `run_database_query` | System Manager | Execute read-only `SELECT` queries. INSERT/UPDATE/DELETE/DDL and multi-statement queries are rejected. Never returns more than 1000 rows (a larger `LIMIT` is clamped) and reports `truncated` when rows were cut. |
| `extract_file_content` | File read | OCR and text extraction from File DocType attachments. Supports PDF, images, DOCX, XLSX, TXT. Backend is PaddleOCR (default) or Ollama vision (configurable). |

See [Python Code Orchestration](../guides/python-code-orchestration) and [Code Execution Security](../guides/code-execution-security) for the sandbox details.

## FACO plugin (16 tools)

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

### Frappe CRM, Helpdesk and Insights (8)

These work on sites with the app installed, and always as the user asking, with that
user's own permissions in the app.

| Tool | Purpose |
|---|---|
| `get_crm_activity` | Read a CRM lead's or deal's whole history (emails, notes, calls, tasks, comments and field changes, newest first) through CRM's own timeline |
| `send_crm_email` | Email a CRM lead or deal from the record, as CRM's email composer does: it lands on the record's **Emails** tab and goes out from the user's email account. The user sees the full email in an approval card first |
| `add_crm_activity` | Add a note, a follow-up task or a call log to a lead or deal, linked so it shows on the record's **Notes**, **Tasks** or **Calls** tab. A task is assigned to the user unless someone else is named |
| `convert_crm_lead` | Convert a lead into a deal through CRM's own conversion, as the **Convert to Deal** button does: a contact and organization are created or reused and the deal carries the lead's history. Converting the same lead again returns its deal |
| `reply_to_helpdesk_ticket` | Reply to the customer on a Helpdesk ticket, as an agent would: the reply is added to the ticket thread and emailed to the person who raised it. The user approves the reply in a card first. Only Helpdesk agents can reply |
| `list_insights_dashboards` | List the Insights dashboards the user can open, optionally searching titles |
| `get_insights_dashboard` | Read an Insights dashboard as the user sees it: its filters and each chart's numbers, with the dashboard's default filters or the overrides given |
| `get_insights_chart` | Read one Insights chart in depth, applying its dashboard's filters |

Writes such as these pause for approval in FAC Chat, so nothing is sent or changed until the
user approves it. See [Use the widget in other Frappe apps](../fac-chat/other-apps).

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
