---
title: FAC Chat — Technical
description: Client-side mechanics of FAC Chat — how the widget mounts on Frappe Desk pages, how streamed responses render as blocks, and how sessions move between widget, SPA, and mobile.
---

# FAC Chat — Technical (client side)

::: info Scope
This page covers the **client-side** mechanics of FAC Chat — how the widget mounts
on Desk pages, how streamed responses are rendered, and how a session follows a user
across surfaces. The managed cloud engine that runs the LLM (streaming, model routing,
billing, memory, RAG, workflows) is a separate backend and is not documented here.
:::

For what FAC Chat is and how to enable it, start with the
[FAC Chat overview](./index).

## The widget on the Desk page

When FAC Chat is enabled, the widget's assets are loaded on every Desk page. The
widget does not render immediately on load — it waits for Frappe's `app_ready`
signal (with a short DOM-ready fallback), then asks the server whether it should
render for the current user before building any UI.

That server check returns two independent flags:

- **`show_widget`** — whether the launcher renders on the page **at all**.
- **`can_use`** — whether the user can actually chat, versus seeing an onboarding
  screen.

The launcher only mounts when `show_widget` is true — that is, for FAC Chat members
and for admins (System Manager / Administrator). For anyone else the widget never
appears; there is no hidden DOM, no launcher, nothing. See
[Who sees the widget](./index#who-sees-the-widget) for the user-facing rules.

On top of that, each user can hide the launcher for themselves via a per-user
preference. That opt-out is checked **after** `show_widget`, so it applies to
everyone who can see the widget — admins included — and can be toggled back on later.

Because the visibility decision is made per request (not baked in at login), adding
a user to FAC Chat takes effect on their **next page refresh** — no server restart,
no re-login.

### Hot toggle

The widget exposes small remount and teardown helpers so that toggling FAC Chat on
or off from the admin settings takes effect on the current Desk session without a
full reload — the launcher can be mounted or removed in place.

## Rendering streamed responses (blocks)

FAC Chat renders assistant replies as a sequence of **blocks** — thinking, text,
tool calls, interactive approvals, sources, and plans — rather than one opaque
string. This keeps a long, tool-using answer readable as it streams.

1. When a message is sent, an assistant **shell** message is created up front, so a
   reply that is interrupted and resumed can always be matched back to its message.
2. As the response streams, each event (a chunk of thinking, a chunk of text, a tool
   call starting, a tool result, an approval request, a source citation, a plan
   update) is folded into the growing blocks structure on the server.
3. Interactive steps — where the assistant pauses to ask you to approve or answer
   something — become **interaction blocks** whose status updates in place once you
   respond.
4. When the response completes, the finished blocks are saved as a snapshot on the
   conversation message.

On refresh, the SPA and widget render that saved snapshot **directly** — there is no
event replay and no re-streaming. What you saw when the message finished is exactly
what you see when you come back to it.

If a reply was paused for an approval and later resumed, the saved blocks are
rehydrated first, the pending interaction is resolved to approved / rejected /
answered, and new blocks are appended after it — so the conversation stays coherent
across the pause.

## Sessions across surfaces

A conversation is identified by a `session_id`, and that identifier is shared across
the widget, the `/copilot` SPA, and mobile. Handing a live conversation from one
surface to another (open it in the widget, continue it full-screen in the SPA, pick
it up on mobile) is done with short-lived handoff cookies:

- `faco_widget_session` — carries a conversation from the SPA into the widget.
- `faco_active_session` — carries a conversation from the widget into the SPA.
- `faco_widget_persistent_session` — remembers the widget's current conversation
  across page loads.

Because all three surfaces share the same `session_id` namespace, messages and
history stay consistent no matter where you continue the conversation.

## Conversation recall (`recall_conversations`)

For what this looks like to use, see
[Continuing a previous conversation](./conversation-recall). This section covers
the guards, the search algorithm, and how a compacted conversation is
reassembled — all of it local FAC code, registered on the `faco` MCP plugin
alongside the browser and document tools
([plugin.py:82](../../../apps/frappe_assistant_core/frappe_assistant_core/plugins/faco/plugin.py#L82)).
The tool is classified **read-only**
([tool_category_detector.py:85](../../../apps/frappe_assistant_core/frappe_assistant_core/utils/tool_category_detector.py#L85)),
so it defaults to "Always allow" rather than sitting behind an approval card.

### Ownership is structural, not a permission check

Every query in `RecallConversations`
([recall_conversations.py:122](../../../apps/frappe_assistant_core/frappe_assistant_core/plugins/faco/tools/recall_conversations.py#L122))
filters on `frappe.session.user` directly, in both the listing path
([`_index`](../../../apps/frappe_assistant_core/frappe_assistant_core/plugins/faco/tools/recall_conversations.py#L191))
and the transcript path
([`_transcript`](../../../apps/frappe_assistant_core/frappe_assistant_core/plugins/faco/tools/recall_conversations.py#L366)).
That closes the System Manager exemption present in the shared FAC Chat Message
permission condition — an admin gets no special reach through this tool — and
it is why the tool has no `user` argument at all: the model has no vocabulary
to ask for someone else's history. Archived messages (`is_archived=1`) are
excluded from every filter, so an archived conversation is unreachable by
either listing or direct `session_id` lookup.

### Listing: term-matching, not phrase-matching

`_terms()` ([recall_conversations.py:102](../../../apps/frappe_assistant_core/frappe_assistant_core/plugins/faco/tools/recall_conversations.py#L102))
splits a query into lowercase content words, drops stop-words, and trims a
trailing `s` (length > 3, not a double-`s`) so "reminders" and "reminder" both
reduce to the same term. `_matching_session_ids()`
([recall_conversations.py:263](../../../apps/frappe_assistant_core/frappe_assistant_core/plugins/faco/tools/recall_conversations.py#L263))
then runs one `LIKE` query per term (values parameterised throughout) and
intersects the resulting session-id sets in Python — a session qualifies when
every term appears *somewhere* in that session, not necessarily the same
message. When the intersection is empty, the tool falls back to the plain
recent-conversations listing and sets `fell_back_to_recent: true` rather than
returning nothing.

Per-session `preview` and `matched_snippet` text are fetched with one bounded
query per session id, not a single shared-limit query across all of them —
see the docstrings on `_previews()` and `_snippets()`
([recall_conversations.py:291](../../../apps/frappe_assistant_core/frappe_assistant_core/plugins/faco/tools/recall_conversations.py#L291),
[recall_conversations.py:321](../../../apps/frappe_assistant_core/frappe_assistant_core/plugins/faco/tools/recall_conversations.py#L321)).
A single shared row budget ordered by creation can be spent entirely by one
chatty session before the query reaches a sparser one, leaving it listed but
without a preview.

### Transcript: latest summary + messages after its anchor

`_transcript()` ([recall_conversations.py:366](../../../apps/frappe_assistant_core/frappe_assistant_core/plugins/faco/tools/recall_conversations.py#L366))
reads the newest non-superseded row from **FAC Chat Summary**
(`FACChatSummary.latest_for_session`,
[fac_chat_summary.py:78](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/doctype/fac_chat_summary/fac_chat_summary.py#L78)),
resolves its `anchor_message_id` to that message's `creation` timestamp, and
returns the summary text plus every message **after** that timestamp — cutting
at the anchor message, not at the summary row's own (later) creation time,
since the summary is written after every message of the turn it describes.
An anchor that no longer resolves (its message was purged) degrades to the
plain recent-messages tail; the summary still carries the earlier context.

This is deliberately not "the whole conversation" or "the last N messages" —
compactions are cumulative (each new summary is written from the *previous*
summary plus everything since, so it subsumes it), which is exactly what makes
`latest summary + post-anchor messages` a complete account of the conversation
rather than a slice of it. **FAC Chat Summary** rows are written by the relay
as the compaction event arrives —
`_persist_chat_summary()` calls `FACChatSummary.record()`
([relay.py:92](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/api/chat/relay.py#L92)
→ [fac_chat_summary.py:45](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/doctype/fac_chat_summary/fac_chat_summary.py#L45)),
called from the shared event dispatcher's `context_summarized` branch
([relay.py:110](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/api/chat/relay.py#L110),
branch at [relay.py:127](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/api/chat/relay.py#L127))
— and `record()` supersedes every prior row for that session in the same call,
so exactly one row is ever "live" per session even though older rows are kept
(each one still anchors a divider in the transcript; see below). A failed
summary write is caught and logged rather than allowed to fail the turn.

`get_session_history` returns every summary for a session (oldest first, for
rebuilding dividers) alongside its usual message page
([sessions.py:21](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/api/chat/sessions.py#L21),
`FACChatSummary.all_for_session` called at
[sessions.py:55](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/api/chat/sessions.py#L55)).

### The summarization divider is now durable and expandable

Earlier, the "Earlier messages were summarized" divider was pushed only by the
live `context_summarized` socket event — a page reload showed an unbroken
transcript with no sign a compaction had happened, and the summary text was
never visible anywhere. `mergeSummaryDividers()`
([summaryDividers.js:15](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/frontend/src/stores/chat/summaryDividers.js#L15))
now rebuilds one divider per **FAC Chat Summary** row on load and on
reconnect-reconciliation, keyed to the message it anchors to (a summary whose
anchor has aged out of the loaded window is appended instead of dropped — the
compaction still happened). `ChatInterface.vue` renders a matching divider as
clickable and expands it in place to show `summaryText`, with the expanded-set
keyed by `anchorMessageId` (falling back to the row's timestamp) rather than
list position — a v-for index is not stable across a session switch or as
older rows age out of the server's windowed history, so an index-keyed set
could leak "expanded" onto the wrong divider entirely.

## What lives on the backend (not here)

The following are handled by the managed FAC Cloud backend and are
intentionally **not** part of this client-side page: the signed request contract
between your site and the cloud, model routing and streaming, subscription quota and
billing, conversation memory and RAG, and workflow automation. FAC's role on the
client is to gate access, mirror conversations into your own database, and render
the streamed output deterministically.
