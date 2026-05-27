# Changelog

A summary of public releases of Frappe Assistant Core. For granular release notes, see [`change_log/v2/`](https://github.com/buildswithpaul/Frappe_Assistant_Core/tree/main/frappe_assistant_core/change_log/v2) in the repository.

## 3.0.0-beta — current

Internal-track release. Prepares the codebase for the next major version.

## 2.4.3

**Security**
- SSTI hardening in prompt templates — `preview_template` and stored `Prompt Template` content now render through `jinja2.sandbox.SandboxedEnvironment`, blocking `__class__` / `__mro__` / `__subclasses__` attribute walks
- `Prompt Category` read restricted to the `Assistant User` role

**Fixes**
- `update_document` supports `allow_on_submit` fields on submitted docs (#179)
- `update_document` accepts date strings in child rows (#168)
- `create_document` warns on silent field overrides triggered by controller `validate()` (#181)
- OCR: `tesseract` reinstated as a backend option alongside PaddleOCR and Ollama
- `chardet` constraint loosened for Frappe 15.107+ (#176)

**Improvements**
- Removed dead wildcard `doc_events` that fired on every save across the bench

## 2.4.2

**Fixes**
- `update_document` now properly handles child tables (#168) with auto-detected patch vs replace mode
- `update_document` rejects direct child-doctype calls and returns a clear retry suggestion
- `create_document` no longer reports false-positive missing fields (#165) populated by controller `set_missing_values()`
- `create_document` fixed `UnboundLocalError` in the `MandatoryError` handler
- Audit log no longer redacts legitimate token-count metrics
- `chatgpt_fetch` signature aligned with `filter_sensitive_fields` — restored from a crash on every call
- `update_tool_role_access` accepts JSON-string roles from the admin UI
- HRMS Skill schema mismatch on `bench migrate` is now safely no-op across HRMS schemas

**Improvements**
- Conventional-commit linting and pip-audit are available as local pre-commit hooks

## 2.4.1

**Fixes**
- HRMS Skill link corruption (#153) — removed the v2.4.0 rename migration that incorrectly renamed HRMS's own `Skill` DocType to `FAC Skill`. A repair patch heals affected sites automatically on upgrade.

## 2.4.0

**New — Skills & Agent Orchestration**
- **FAC Skills subsystem** — new `FAC Skill` DocType lets administrators author and publish reusable LLM skills (markdown + frontmatter). Admin page now has Skills and Prompts tabs. External Frappe apps can register their own skills via a new hook API.
- **Tool response image support** — tool results can include image data alongside text
- **`get_pending_approvals` tool** — agents can discover workflow actions waiting on the current user

**Improvements**
- **Sandbox isolation for `run_python_code`** — user code runs in a disposable subprocess so RLIMIT and SIGALRM only affect the child process, never the Frappe worker
- **Leaner sandbox** — matplotlib / seaborn / plotly / scipy removed from pre-loaded libraries (they consumed 200–400 MB and never returned plots). `max_recursion_depth` default raised from 100 to 500.
- Audit log accuracy fixes and richer captured payload
- Signal-based timeouts skip cleanly when running inside a worker thread

**Security**
- Fixed (#132) SQL injection in the removed `create_visualization` tool — tool deleted
- Fixed (#133) unprotected whitelist decorators on duplicate config endpoints
- Fixed (#134) `extract_file_content` now enforces parent-document permission check
- Fixed (#140) usage statistics restricted to assistant admins

**Community**
- GitHub Sponsors enabled
- Professional services available via Promantia

## 2.3.4

**Fixes**
- OAuth auth isolation — fixed a critical bug where OAuth token requests permanently monkey-patched `frappe.get_request_header`, causing all subsequent API key authentication on the same Gunicorn worker to fail with 403

## 2.3.3

**Fixes**
- PaddleOCR dependencies made optional — install with `pip install frappe-assistant-core[ocr]`. Without the extra, users get a clear message guiding them to install or switch to Ollama vision.

**Improvements**
- CI now tests on Frappe v15 (Python 3.12) and v16 (Python 3.14)
- Automated releases via semantic-release
- Conventional-commit enforcement via commitlint

## 2.3.2

**New — OCR & Document Extraction**
- PaddleOCR integration for image and scanned-PDF extraction with multi-language support
- Ollama-based vision model support as an alternative OCR backend (e.g. `deepseek-ocr`)
- Configurable OCR backend, language, timeout, and memory limits in Assistant Core Settings

**Improvements**
- Audit log retention policy (default 180 days)
- Better report-tool feedback with actionable guidance on misuse
- OAuth localhost support — native apps can register HTTP localhost redirect URIs without errors
- MCP 2025-06-18 spec
- Code execution limits (timeout, memory, CPU) configurable
- Settings defaults correctly applied on fresh installs and upgrades

**Security**
- Fixed unauthorized access to protected API endpoints
- Fixed sensitive credential values appearing in server logs
- Removed unused API endpoints

## 2.3.1

**Database-Backed Plugin & Tool Management**
- `FAC Plugin Configuration` DocType — atomic plugin enable/disable with audit trail
- `FAC Tool Configuration` DocType — per-tool enable/disable, category assignment, and role-based access
- Automatic tool category detection via AST parsing
- Frappe v16 compatibility alongside v15
- Database locks replace file-based plugin state management

## 2.3.0

**MCP Prompt Templates**
- Prompt Templates system — reusable, parameterized prompts that users can customize and execute via AI clients
- MCP prompts protocol support (`prompts/list`, `prompts/get`)
- Template rendering with Jinja2, Format String, and Raw engines
- Access control: Private, Shared, or Public visibility with role-based sharing
- 7 built-in templates (Sales, Manufacturing, HR, CRM, Procurement, Documentation, Data Quality)
- Dark theme for FAC Admin and Assistant Core Settings
- OAuth timezone fix — tokens no longer expire prematurely in non-UTC timezones

## 2.2.2

**OAuth Enhancements**
- OAuth client registration returns complete RFC 7591 metadata
- Repository migrated to `buildswithpaul/Frappe_Assistant_Core`
- Claude Desktop UI setup documented
- ChatGPT integration documented

## 2.2.1

**Multi-Tool Orchestration & Report Polling**
- Multi-tool orchestration for `run_python_code` — call `tools.get_documents()` / `tools.generate_report()` inside the Python sandbox for 80–95% token savings
- Prepared-report polling with exponential backoff
- Dual authentication — OAuth Bearer tokens and API key/secret for STDIO clients
- Plugin state fix — custom tools now properly respect disabled plugin state
- `frappe._dict` → plain dict conversion for pandas DataFrame compatibility

## 2.2.0

**StreamableHTTP Transport & OAuth 2.0**
- Migrated from STDIO bridge to StreamableHTTP transport
- OAuth 2.0 authentication with Dynamic Client Registration (RFC 7591), PKCE, and automatic token refresh
- Custom MCP server optimized for Frappe — handles datetime, Decimal, and `frappe._dict` serialization natively
- OAuth discovery endpoints — `/.well-known/openid-configuration`, Protected Resource Metadata (RFC 9728)
- Frappe v15/v16 compatibility with automatic version detection for OAuth settings
- FAC Admin page with MCP endpoint URL display and plugin management

If you are still on the legacy STDIO bridge, see [Migration from STDIO](../getting-started/migration).

## 2.0.1

**Bug Fixes & Improvements**
- Document creation overhauled — proper child-table handling, required-field validation; success rate improved from ~60% to ~95%
- Dashboard chart system rebuilt — fixed field mapping, filter format conversion, and smart field auto-detection (reliability ~40% → ~98%)
- Custom tool discovery fixed for external Frappe apps through the hooks system
- Validation framework added with pre-creation checks and `validate_only` mode
- Better error messages with specific guidance and recovery suggestions

## 2.0.0

**Architecture Overhaul**
- Plugin-based architecture with auto-discovery — tools organized into Core, Data Science, Visualization, and Custom Tools
- 21 comprehensive tools across document operations, search, metadata, reports, workflows, analytics, and visualization
- Plugin Manager with runtime enable/disable through the web interface
- `BaseTool` framework for standardized tool development
- Multi-layer security framework with role-based access control, document-level permissions, and field-level data protection
- Comprehensive audit trail for all tool operations
- License change: **MIT → AGPL-3.0** (forever free for open-source and personal use; see [COMMERCIAL.md](https://github.com/buildswithpaul/Frappe_Assistant_Core/blob/main/COMMERCIAL.md) for commercial licensing)
- Modern Python packaging with `pyproject.toml`
