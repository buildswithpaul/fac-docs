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

## What lives on the backend (not here)

The following are handled by the managed FAC Cloud backend and are
intentionally **not** part of this client-side page: the signed request contract
between your site and the cloud, model routing and streaming, subscription quota and
billing, conversation memory and RAG, and workflow automation. FAC's role on the
client is to gate access, mirror conversations into your own database, and render
the streamed output deterministically.
