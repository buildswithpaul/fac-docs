---
title: FAC Chat
---

# FAC Chat

::: info FAC 3.0 — Coming soon
FAC Chat ships in **FAC 3.0**. This page describes what it does and how it works
so you can plan ahead. It arrives **disabled by default** — nothing about your
existing MCP setup changes when you upgrade.
:::

**FAC Chat is an opt-in, in-Frappe AI chat assistant** powered by our managed
**FAC Cloud** subscription. Where the MCP server lets external LLM clients
(Claude Desktop, Cursor, ChatGPT desktop) talk to your Frappe data with your own
LLM keys, FAC Chat brings the conversation **inside Frappe itself** — a chat widget
on every Desk page and a full-screen SPA at `/copilot`.

## Two ways to use FAC

FAC 3.0 offers two ways to use it:

- **BYO-LLM (MCP server, free)** — the original FAC. Connect any MCP-ready LLM
  client (Claude Desktop, Cursor, ChatGPT desktop, etc.) to your Frappe data over
  MCP. You bring the LLM, you pay your own LLM bill, nothing leaves your stack.
  Ships **enabled by default**.
- **FAC Chat (in-Frappe chat UI, SaaS)** — opt-in. A native chat widget on every
  Desk page plus a full-screen SPA at `/copilot`, powered exclusively by our
  managed FAC Cloud. One subscription covers LLM access across providers,
  conversation memory, RAG, and workflow automation. Ships **disabled by default**.

The split is intentional: BYO-LLM keeps the existing free MCP path untouched;
FAC Chat is the managed experience for teams that want the chat inside Frappe
without wiring up their own LLM keys.

| Option | What it is | LLM | Cost | Where the chat lives |
|---|---|---|---|---|
| **BYO-LLM (MCP server)** | The original FAC. Exposes Frappe data over MCP to any MCP-ready client. | You bring your own (Anthropic, OpenAI, Gemini, Bedrock, etc.) | Free. You pay your own LLM bill. | In your external MCP client (Claude Desktop, Cursor, etc.). No chat UI inside Frappe. |
| **FAC Chat (SaaS)** | In-Frappe chat widget + `/copilot` SPA. Streaming, tool use, attachments, history, memory, RAG, workflows. | Managed by FAC Cloud. One subscription, multiple providers. | Subscription required. Sign-up flow runs inside the chat UI. | Inside Frappe Desk. |

These are **mutually exclusive at the chat layer**: the in-Frappe chat UI is only
available through FAC Cloud. There is no BYO-LLM path for FAC Chat — if you
want to bring your own LLM, use the MCP server.

Both options share the same plugin registry, the same **Assistant Audit Log**, and
the same OAuth-based authentication. Enabling FAC Chat does **not** change anything
for your MCP clients — both can run side by side.

## What you get

FAC Chat is an AI assistant embedded in your Frappe site, across three surfaces:

- a **floating widget** mounted on every Desk page,
- a **full-screen SPA** at `/copilot`,
- a **mobile app** over OAuth.

It supports streaming responses, tool use against your Frappe data, file
attachments, conversation history, and — through the FAC Cloud
subscription — conversation memory, RAG over your documents, and workflow
automation. Conversations are mirrored into your own Frappe database; the assistant
authenticates as a real Frappe user, so it only touches data that user can already
see, and every action stays inside your existing permissions and audit trail.

## Enabling FAC Chat

1. Go to **Assistant Core Settings → FAC Chat tab**.
2. Toggle **Enable FAC Chat** to ✓ and save.
3. Run `bench restart`.

A discovery banner on the Desk landing page also walks admins through enabling
chat — it appears once per admin and can be dismissed.

After enabling:

- The chat widget appears in the corner of Frappe Desk pages.
- The full-screen SPA is reachable at `/copilot`.
- The first time a user opens chat, they walk through a one-time onboarding that
  connects the site to FAC Cloud and links it to a subscription.

## Who sees the widget

The chat widget is **not shown to everyone by default**. Once FAC Chat is enabled,
the launcher appears only for:

- **Members** — users an admin has added to FAC Chat from **Settings → Users**
  (each holds a seat on your subscription), and
- **Admins** — anyone with the **System Manager** role, and the **Administrator**
  account. Admins always see the widget so they can set things up, even before they
  hold a seat.

A logged-in user who is **neither a member nor an admin sees nothing at all** — no
launcher, no prompt. When an admin adds them from **Settings → Users**, the widget
appears for them on their **next page refresh**. This keeps the assistant invisible
to staff who haven't been given access, and turns it on the moment they are.

Each user can also hide the launcher for themselves from their own preferences, and
re-enable it later — that personal choice is always respected, admins included.

## What FAC Chat is NOT

- It is **not required** for MCP server users. Skip it entirely if Claude Desktop or
  another MCP client is your only access pattern — the free MCP path keeps working
  exactly as before.
- It is **not a BYO-LLM frontend**. The in-Frappe chat UI talks only to FAC Cloud.
  If you want to bring your own LLM keys, the MCP server is the path for that.
- It does **not change** FAC's tool catalog. The same built-in tools are available
  to MCP clients and to FAC Chat alike.
- It does **not store conversations off-site without consent**. Conversation history
  lives in your Frappe database; only the LLM request payload (messages + tool-call
  results) is forwarded to FAC Cloud to generate the next response.

## How it works, under the hood

For the client-side mechanics — how the widget mounts on Desk pages, how streamed
responses are rendered, and how a session follows you between the widget, the SPA,
and mobile — see [FAC Chat Technical](./technical).
