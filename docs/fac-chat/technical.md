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

The widget is a Vue panel built from FAC Chat's own components, so it renders replies
exactly as the SPA does. It is part of FAC's frontend build (`bench build`), which needs
**Node.js 22.12 or newer on every bench, including Frappe v15**. If the frontend was never
built, the widget simply doesn't appear and Desk is unaffected.

When FAC Chat is enabled, only a tiny launcher script loads on each Desk page. It waits
for Frappe's `app_ready` signal (with a short DOM-ready fallback), then asks the server
whether it should render for the current user before loading the panel or building any
UI. The panel mounts inside its own **Shadow DOM**, so its styles never leak into Desk
and Desk's styles never reach it. It follows Desk's light/dark theme live.

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

The launcher exposes small remount and teardown helpers so that toggling FAC Chat on
or off from the admin settings takes effect on the current Desk session without a
full reload. Disabling tears the widget down; enabling re-runs the access check and
mounts it in place.

The widget's composer has the same **Thinking** control and **Web search** toggle as FAC
Chat. The widget has no model picker: it starts on **Auto**, then follows the model you chose in FAC Chat (see [Model choice follows the user](#model-choice-follows-the-user)). **Open full assistant** hands the
conversation to FAC Chat (`/copilot`) on the same session.

## Browser tools and approvals in the widget

Browser tools (navigate, page context, form data, screenshot, diagnostics) work even
while the panel is closed. The sensitive ones — screenshot, form data and diagnostics —
ask for confirmation first, with **Reject / Approve / Always allow**. The panel opens to
ask; anything other than Approve or Always allow is treated as Reject. The
administrator's **Enable DOM Content Extraction** switch is honoured, and extraction
stays off if the setting can't be read. Any approval request opens the panel and flashes
the browser tab title so it is not missed.

## Code and tables

Replies render the same in the widget and the SPA: numbered lists, tables that scroll
horizontally in a narrow panel, and syntax-highlighted code (Python, JavaScript, JSON,
SQL, bash, HTML/XML, CSS, YAML). Thinking and tool steps appear in the order they
happened, inside a collapsible "how this ran" card.

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
rehydrated first. Once the assistant is running the resumed reply, the pending
interaction is resolved to approved / rejected / answered, and new blocks are
appended after it — so the conversation stays coherent across the pause. If the
resume fails before that (FAC Cloud cannot be reached, or is still busy with an
earlier request in the same conversation), the saved reply is left as it was, so
after a reload the approval is waiting for your answer again. An approval that
expired in the meantime is marked expired instead.

## Sessions across surfaces

A conversation is identified by a `session_id`, and that identifier is shared across
the widget, the `/copilot` SPA, and mobile. Handing a live conversation from one
surface to another (open it in the widget, continue it full-screen in the SPA, pick
it up on mobile) is done with short-lived handoff keys in the tab's `sessionStorage`:

- `faco_widget_session` — carries a conversation from the SPA into the widget.
- `faco_active_session` — carries a conversation from the widget into the SPA. The
  widget's **Open full assistant** button uses it to continue the same session in
  `/copilot`.
- `faco_widget_persistent_session` — remembers the widget's current conversation
  across page loads.

The widget header's **New chat** button
([WidgetPanel.vue:245](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/frontend/src/widget/panel/WidgetPanel.vue#L245))
asks the server for a new `session_id` through `chatStore.createSession()`, the call the
SPA's own **New chat** uses, then reloads the session list so the welcome screen offers
the conversation just left. The widget's watch on the current session writes the new id
to `faco_widget_persistent_session`, so it survives a reload. The button is disabled
while the chat is empty, while a reply streams, and while an approved card resumes
([WidgetPanel.vue:239](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/frontend/src/widget/panel/WidgetPanel.vue#L239)).

Because all three surfaces share the same `session_id` namespace, messages and
history stay consistent no matter where you continue the conversation.

### A turn that is still running

A reply streams into the surface that sent it, but any surface that opens the
conversation while the reply is still being written joins it. That includes the
widget after **Open full assistant**, the widget after **Back to Desk**, and a
second FAC Chat tab. The joining surface shows the reply as it stands (thinking,
tool steps, approvals and text, in order) and keeps streaming it, with the
working indicator and Stop.

- **The live snapshot.** While a turn runs, the site keeps a snapshot of it in
  Redis under `fac_live_turn:<session_id>`. It holds the blocks so far (the same
  shape a saved reply has), the text, the open thinking block, the turn's owner,
  and the number of the last event folded in.
  - Block changes are written at once; text and thinking at most every 500 ms.
  - The snapshot expires after 10 minutes and is deleted when the turn ends.
  - Nothing is written for users under a processing restriction.
- **Numbered events.** Every streamed event of a turn carries the turn's token
  (`turn`), a sequence number (`seq`), and the id of the client request that
  started it (`client_turn`).
- **Reading the snapshot.** `GET frappe_assistant_core.chat.api.chat.get_live_turn?session_id=…`
  returns the snapshot to the conversation's owner, or `null` when nothing is
  running. Anyone else is refused, even if the conversation has no saved
  messages.
- **Joining.** A surface that opens a conversation reads its history and the
  snapshot together, holding streamed events meanwhile. It then shows the
  snapshot as a live reply and applies only the events numbered after it.
- **Catching up.** A surface re-reads the snapshot when:
  - a sequence number is skipped;
  - its socket reconnects;
  - a turn starts on another surface. It reloads the history too, so that
    surface's question appears.

Desk tabs keep separate widget conversations (each tab claims its own), so two
Desk tabs never share a turn.

## Model choice follows the user

The model a user picks is saved on the server, so it follows them to another browser and to the Desk widget.

- **Storage.** The choice lives in the hidden `selected_model` field of **FAC Chat User Preferences**: `auto`, a model id, or empty for none. The browser's local storage is only a cache. A browser that holds a choice the server has never seen uploads it once.
- **Reading it.** `GET frappe_assistant_core.chat.api.models.get_available_models` returns `selected_model` beside the model list, empty when the user has not chosen. It reads empty on a site that has not been migrated.
- **Saving it.** `POST frappe_assistant_core.chat.api.models.set_selected_model` with `model_id` saves the choice for the session user, and returns `{success, selected_model}`. An empty `model_id` clears it, and an id over 140 characters is refused ([`set_selected_model`](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/api/models.py#L193)). The picker saves in the background and a failed save is retried on the next change or load.
- **A turn that names no model.** When a client sends no model for a turn (the Desk widget's first turn in a fresh browser, or the Raven bot), FAC runs it on the saved model if the user can still use it, and otherwise on the default. An explicit `auto` or an explicit model id is always honoured ([`_effective_model_id`](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/api/chat/messages.py#L73), [`usable_saved_model`](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/api/models.py#L67)).
- **The widget.** It keeps the choice in memory only and never writes the server value back.
- **A choice that is no longer usable** (the model left the list, or auto mode is off) is dropped locally for that browser. The server value is left alone, so a short gap in the model list does not wipe every browser's choice.

## Routing notice

When the assistant changes the model it is using, the relay passes the notice on to the client as a `routing_notice` event. Besides the earlier fields it now carries `from`, `to` and `reason` ([`_dispatch_relay_event`](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/api/chat/relay.py#L257)). For a `task_model_changed` notice the client shows one line, chosen by `reason`:

| `reason` | Line shown |
|---|---|
| `unavailable` | Switched to a different model for this task because the previous one isn't available right now |
| `rate_limited` | ... because the previous one is busy right now |
| `plan` | ... because the previous one isn't included in your plan |
| `health` | ... because the previous one is having problems right now |
| `tier` | Switched to a stronger model for this step |
| anything else | Switched to a different model for this task |

## A reply that stops making progress

The relay watches the stream from the assistant. It ends the turn with a `stream_error` carrying `error_code: "RELAY_STALLED"` when it sees a heartbeat and:

- no non-heartbeat event has arrived for `RELAY_NO_PROGRESS_SECONDS` (420 s), or
- the turn has run for `RELAY_MAX_TURN_SECONDS` (1800 s).

Heartbeats prove the connection is alive, not that the turn is moving, so they never reset the progress clock ([`_relay_deadline_tripped`](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/api/chat/relay.py#L366)). The check runs only when a heartbeat arrives, so a real event is never replaced by the stall. The partial turn is saved as errored, and the user sees "The assistant stopped waiting for a reply". See [Troubleshooting](./index.md#the-assistant-stopped-waiting-for-a-reply).

## Reading the stored code (`get_current_code`)

The approval card compares the stored code with the proposed code on an update. It reads the stored code with `GET frappe_assistant_core.chat.api.current_code.get_current_code?doctype=…&name=…&fields=[…]` ([`get_current_code`](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/api/current_code.py#L37)).

- The caller needs **read** permission on that record, or the call is refused.
- Only code-bearing fields are returned: `script`, `condition`, `query`, `html`, `javascript`, `report_script`, `css` and `message`. Other names, fields the doctype does not have, and fields above the caller's permission level are ignored.
- The result is `{fieldname: value}`, with an empty string for a field with no value, or `{}` when nothing was requested that qualifies.

## Field placement (`get_field_placement`)

The approval card shows where a new Custom Field will appear before anything is saved. It asks `GET frappe_assistant_core.chat.api.field_placement.get_field_placement?doctype=…&insert_after=…&fieldtype=…` ([`get_field_placement`](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/api/field_placement.py#L37)).

- The caller needs **read** permission on the doctype. A child table is allowed when the caller can read a parent that embeds it.
- The result is `{tab, section, collapsed, first_tab, sentence, warning}`, or `{}` when the location cannot be predicted. `sentence` is the plain description, and `warning` is true when the field would be collapsed or not on the first tab, which the card shows in a warning style. Nothing is written.
- After a save, `create_document` and `update_document` report the real location, plus `placement_warning` when it is hidden. See [Customisation results](../api/tool-reference.md#customisation-results).

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
([relay.py:120](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/api/chat/relay.py#L120)
→ [fac_chat_summary.py:45](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/doctype/fac_chat_summary/fac_chat_summary.py#L45)),
called from the shared event dispatcher's `context_summarized` branch
([relay.py:120](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/api/chat/relay.py#L120),
branch at [relay.py:133](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/api/chat/relay.py#L133))
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

## Installable app (PWA)

The SPA ships a web app manifest and a service worker, following Raven's approach, so
browsers can install `/copilot` as an app. Nothing outside FAC is configured: no web
server or nginx change.

- **Manifest.** A static `manifest.webmanifest` in the SPA build, linked from the page
  head, sets `/copilot/` as the app's id, start URL and scope, `standalone` display,
  the colours, and the icons (192 and 512 px, a maskable 512 px for Android, and a
  180 px Apple touch icon).
- **Service worker at `/copilot/sw.js`.** A worker only controls pages under the path
  its script is served from, and the build lands under `/assets/`, so a Frappe page
  renderer serves the built worker from within the SPA's path, with
  `Cache-Control: no-cache` so a deploy reaches installed apps without a stale-worker
  window. With FAC Chat switched off, the renderer declines and the URL answers 404
  like the rest of `/copilot`.
- **What is cached.** The precache holds what the first screen needs (the entry
  script, its static imports and CSS, fonts, icons and the offline page), read from
  Vite's build manifest, about 0.6 MB. Every other chunk (diagram renderers, the
  workflow builder) is cached the first time it is used; chunk names carry a content
  hash, so a cached copy never goes stale.
- **Navigations always go to the network.** The rendered `/copilot` page carries the
  user's boot data and CSRF token, so it is never cached. When the network fails, the
  worker answers with the precached offline page. Only `/copilot` navigations are
  handled; Desk, `/api` and the rest of the site are untouched.
- **Install prompt.** Chrome and Edge fire `beforeinstallprompt` once, often before the
  app mounts, so the SPA captures it at start-up. The account menu's **Install app**
  item shows while the browser offers installation and the app is not already running
  installed; on iPhone and iPad, which have no prompt, it explains Add to Home Screen.

The Desk widget is built separately and has no service worker.

## What lives on the backend (not here)

The following are handled by the managed FAC Cloud backend and are
intentionally **not** part of this client-side page: the signed request contract
between your site and the cloud, model routing and streaming, subscription quota and
billing, conversation memory and RAG, and workflow automation. FAC's role on the
client is to gate access, mirror conversations into your own database, and render
the streamed output deterministically.
