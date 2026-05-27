# Skills Overview

**Skills** are markdown files that teach the LLM how to use a set of tools to accomplish a task. They sit between raw tools and the model — instead of describing 20 low-level tools, you can ship one skill that says "here's how to file a ticket" or "here's how to generate a sales report" and the model follows it.

## Why skills?

- **Cheaper context** — one skill replaces many tool descriptions
- **Reusable** — write once, share across users or apps
- **Discoverable** — the assistant lists available skills at conversation start
- **Versioned in your app** — ship skills the same way you ship code

## Where to start

- [Skills User Guide](../guides/skills-user-guide) — create, publish, and share skills in the UI
- [Skills Developer Guide](../development/skills-developer-guide) — register skills from your Frappe app via the `assistant_skills` hook

## Built-in skills

Every install ships with a catalogue of skills covering common Frappe operations:

### Document operations
[create_document](./create-document), [get_document](./get-document), [update_document](./update-document), [submit_document](./submit-document), [delete_document](./delete-document), [list_documents](./list-documents), [search_documents](./search-documents)

### Search
[search_doctype](./search-doctype), [search_link](./search-link), [search_vector](./search-vector), [get_doctype_info](./get-doctype-info)

### Code & reports
[run_python_code](./run-python-code), [run_database_query](./run-database-query), [generate_report](./generate-report), [analyze_business_data](./analyze-business-data), [extract_file_content](./extract-file-content)

### Dashboards
[list_user_dashboards](./list-user-dashboards), [create_dashboard_chart](./create-dashboard-chart), [insight_v3_skill](./insight-v3)

### Workflow
[run_workflow](./run-workflow)
