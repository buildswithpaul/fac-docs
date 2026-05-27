# Tool Reference

Frappe Assistant Core ships **24 built-in tools across 4 plugins**. All tools are exposed over MCP at `/api/method/frappe_assistant_core.api.fac_endpoint.handle_mcp`.

| Plugin | Tools | Description |
|---|---|---|
| `core` | 17 | Always enabled. Document CRUD, search, metadata, reports, workflow. |
| `data_science` | 4 | Python execution, SQL queries, statistical analysis, file content extraction. |
| `visualization` | 3 | Dashboards and charts. |
| `custom_tools` | — | Mechanism for external Frappe apps to register their own tools via the `assistant_tools` hook. No shipped tools. |

To toggle plugins, see [Plugin Management](../guides/plugin-management). To control which tools each role can call, see [Tool Management](../guides/tool-management).

## Core plugin (17 tools)

Always enabled. Provides essential Frappe operations.

### Document operations (6)

| Tool | Purpose |
|---|---|
| `create_document` | Create a new Frappe document |
| `get_document` | Fetch a single document by name |
| `update_document` | Update document fields (supports patch and replace modes for child tables) |
| `submit_document` | Submit a submittable document |
| `delete_document` | Delete a document (`force=true` to ignore links) |
| `list_documents` | Paginated list with filters, fields, and ordering |

### Search (5)

| Tool | Purpose |
|---|---|
| `search_documents` | Global text search across common DocTypes |
| `search_doctype` | Text search within one DocType |
| `search_link` | Link-field autocomplete search (Frappe's standard link search) |
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
| `get_pending_approvals` | List documents awaiting the current user's workflow action |

## Data Science plugin (4 tools)

Optional. Requires `pandas` and `numpy`.

| Tool | Permissions | Purpose |
|---|---|---|
| `run_python_code` | System Manager | Execute Python in an isolated subprocess sandbox. Pre-loaded: `pd`, `np`, `frappe`, `math`, `datetime`, `json`, `re`, `random`. Plotting libraries are not available. |
| `run_database_query` | System Manager | Execute read-only `SELECT` queries. INSERT/UPDATE/DELETE/DDL and multi-statement queries are rejected. |
| `analyze_business_data` | DocType read | Statistical / trend / correlation / aggregation analysis on a DocType. Modes: `summary`, `trends`, `correlations`, `aggregations`, `comparisons`. |
| `extract_file_content` | File read | OCR and text extraction from File DocType attachments. Supports PDF, images, DOCX, XLSX, TXT. Backend is PaddleOCR (default) or Ollama vision (configurable). |

See [Python Code Orchestration](../guides/python-code-orchestration) and [Code Execution Security](../guides/code-execution-security) for the sandbox details.

## Visualization plugin (3 tools)

Optional. Requires `pandas`, `numpy`, and a charting backend.

| Tool | Purpose |
|---|---|
| `create_dashboard` | Create a Frappe Dashboard with optional chart membership, filters, sharing, and refresh interval |
| `create_dashboard_chart` | Create a Dashboard Chart and optionally attach it to an existing dashboard via `dashboard_name` |
| `list_user_dashboards` | List dashboards visible to the current user (`dashboard_type`: `all`, `frappe`, `insights`) |

## Custom Tools plugin

The `custom_tools` plugin discovers tools registered by other installed Frappe apps via the `assistant_tools` hook. It ships with no tools of its own — see your installed apps' documentation for what they expose.

## Per-tool documentation

Per-tool `inputSchema`, return shape, and behaviour notes live in the source repo alongside each tool implementation:

- [`plugins/core/tools/`](https://github.com/buildswithpaul/Frappe_Assistant_Core/tree/main/frappe_assistant_core/plugins/core/tools)
- [`plugins/data_science/tools/`](https://github.com/buildswithpaul/Frappe_Assistant_Core/tree/main/frappe_assistant_core/plugins/data_science/tools)
- [`plugins/visualization/tools/`](https://github.com/buildswithpaul/Frappe_Assistant_Core/tree/main/frappe_assistant_core/plugins/visualization/tools)

The authoritative `inputSchema` for any tool is in its Python file's `__init__`.
