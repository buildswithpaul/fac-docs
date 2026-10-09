# Agents, Templates and Triggers

FAC Chat agents (workflows) run on **FAC Cloud** and act on your site through your MCP tools. This page covers
what you see in FAC Chat and what your site enforces. Building and editing agents needs the **System Manager**
role; other users can view agents and their runs.

## Who an agent runs as

Every agent has a **runtime user** ("Runs as"). A run uses that user's MCP tools and approval settings, not
those of whoever opens the builder. New agents run as the person who created them.

- The builder's tool list and the green/red tool badges show the **runtime user's** tools.
- **Run this node** runs one step as the runtime user, so a test uses the same tools as the real run.
- Checking another user's tools is limited to System Managers.

## The Setup checklist

The **Setup** panel in the builder lists what an agent needs to run on its own: how it starts (schedule or
event triggers), who it runs as, whether its write tools are approved, and which model it uses. Each row shows
its current state and a shortcut to fix it (Schedule, Triggers, Settings, Re-check).

## Write actions in unattended runs

Scheduled and triggered runs have nobody to click **Approve**. A write tool (for example `create_document`)
only runs unattended when the runtime user has set it to **Always allow**. Otherwise the step is skipped and
the run still ends **Completed**. The run shows **Completed · N actions skipped**, and the run details list
the **Skipped actions**.

When you activate an agent whose write tools are not set to Always allow, the builder warns that they won't
run unattended and names the tools, so you can fix them first. The warning appears only when FAC Cloud can
report the tool's approval setting; if it cannot, no warning is shown.

## Templates

Importing a template asks for its settings. Each setting has a type: a link to a record on your site, an
email, a number, a checkbox, a choice, or text. Before anything is created, FAC checks the values on your site:
required settings must be filled in, numbers must be numbers, and a linked record (a Company, a Warehouse)
must exist here. Every problem is listed at once. Link and email settings are never pre-filled with sample
values. Importing an agent template needs System Manager.

## Triggers

A trigger starts an agent when a document is created, updated, submitted, cancelled or deleted.

- **Filters** narrow which documents fire it. Editing a trigger (even only its title) keeps its filters.
- **Test** checks the trigger against the latest document you can read and shows the data the agent would
  receive. If a filter would stop it, the result names the failed filter. The test checks filters only, not
  the event or which fields changed.
- **Loop guard.** An agent that writes back to the document that triggered it can loop. One trigger fires at
  most 5 times per document per minute and 20 times per document per hour; further fires are refused and
  logged once. These site config keys change the limits, and 0 turns a limit off:
  `fac_trigger_breaker_max_fires`, `fac_trigger_breaker_window_seconds` and
  `fac_trigger_breaker_max_fires_per_hour`.
- **What the agent receives.** The document with Password fields removed, including in child tables. Above
  256 KB the largest child tables are left out first (listed in `dropped_child_tables`); only a document that
  is too large on its own is reduced to its name and title.

## Schedules

A schedule has a cron expression and a **time zone**, so "09:00 every weekday" means 09:00 in the zone you
pick. The zone defaults to UTC; your browser's zone is offered in the list.

## Run history

The run history lists each run with its status, and **Load more** fetches older runs. Opening a run shows each
step's input and output; very long values are shown as their first 10,000 characters, and that partial view
has no Download. A run's final output can be copied, downloaded, or opened **Full screen**.

## Data tools inside agents

Agents use the same tools as chat. To keep a run's context small, `generate_report` returns at most 500 rows
unless asked for more (up to 5000), `run_database_query` returns at most 1000 rows, and `list_documents` pages
with `offset` / `next_offset`. See the [Tool Reference](../api/tool-reference).
