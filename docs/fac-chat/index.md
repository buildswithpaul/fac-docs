---
title: FAC Chat
description: FAC Chat brings an AI assistant inside Frappe — a chat widget on every Desk page and a full-screen SPA at /copilot, powered by FAC Cloud. Ships in FAC 3.0, disabled by default.
---

# FAC Chat

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

## Requirements

FAC Chat runs the assistant in FAC Cloud and calls your site back for every action,
so **your site must be reachable from the public internet**. A bench on `localhost`,
on a private network, or behind a firewall with no inbound access cannot use FAC
Chat — registration checks this up front and tells you rather than failing later.

That is a limitation of the cloud path only. The free MCP server has no such
requirement, and it is the better fit for local and personal use. See
[Local and private sites](/fac-chat/local-sites) for both options.

## What you get

FAC Chat is an AI assistant embedded in your Frappe site, across three surfaces:

- a **floating widget** on every Desk page, built from the same components as the SPA,
- a **full-screen SPA** at `/copilot`,
- a **mobile app** over OAuth.

It supports streaming responses, tool use against your Frappe data, file
attachments, conversation history, and — through the FAC Cloud
subscription — conversation memory, RAG over your documents, and workflow
automation. Conversations are mirrored into your own Frappe database; the assistant
authenticates as a real Frappe user, so it only touches data that user can already
see, and every action stays inside your existing permissions and audit trail.

## Writes pause for approval — a FAC Chat-only gate

Over the plain MCP server, a write runs the instant the model calls it, inside the
caller's Frappe permissions — there is no pause, no card, no approver. FAC Chat adds a
human-in-the-loop step on top of that: by default, `create_document`, `update_document`,
`delete_document`, and `document_action` calls pause and show you an approval card
before they land, and nothing changes in your books until you approve or reject it.

When the write changes how the site behaves (a Server Script, Client Script, Custom
Field, Property Setter, Workflow, Report, Print Format, Notification, and similar), the
card is built for someone who has to approve it without reading code:

- **Full code.** A script, condition, query, print layout or message shows in full in a
  scrollable box that you can expand.
- **Old versus new.** On an update, the card compares the stored code with the new code
  and shows what changed.
- **Child tables.** Rows in a table field are shown as a table, not as raw data.
- **What this changes.** One plain sentence says what the write does, for example "This
  code will run every time someone submits a Sales Invoice".
- **Where a new field will appear.** For a new Custom Field the card says which tab and
  section it will land in, and shows the sentence as a warning when the field would be
  hidden: in a collapsed section, or not on the first tab.
- **Conditions in plain words.** A `depends_on`, `mandatory_depends_on` or
  `read_only_depends_on` condition is described in plain words, with the raw expression
  under **Show technical details**. The card always notes that the condition is checked
  in the Desk form only, so imports, the API and the assistant's own writes are not checked.
- **No "Don't ask again".** The card never offers it for a customisation, so every such
  change asks every time.

Each user can change this default per tool from their own approval preferences —
**Block**, **Ask** (the default for writes), or **Always Allow** — so a trusted
workflow doesn't have to click through a card every time. This gate is specific to
FAC Chat; it has no effect on MCP clients like Claude Desktop or Cursor.

While the assistant works, the activity trail names what it did: **Created**, **Updated**
or **Checked** (a dry run) with the record's name, and a step that failed shows a plain
reason underneath. Records the assistant created or changed appear as chips in the side
rail, and a chip links to the record. After a customisation write, the trail row and the
chip also show an **Open a new {doctype}** link, which opens a blank form where the change shows. Questions the assistant asks you render their
formatting (bold, lists, links).

## Memory asks first

FACO can remember preferences and facts from your conversations to give better answers.
It only does so with your consent.

Earlier versions switched memory on during FAC Chat setup instead of asking. From FAC 3.2,
anyone whose memory was switched on that way is asked once, **"Keep AI memory on?"**, and
memory is paused until they answer:

- **Keep memory on** gives consent, and memory carries on.
- **Turn off and delete memories** keeps memory off and deletes everything it remembered.
- **Decide later** closes the question for now. Memory stays paused, and you are asked again the next time you open FAC Chat.

You can change this any time in **Settings → Privacy**.

## Installing FAC Chat

FAC Chat ships inside the same `frappe_assistant_core` app you already install for the
MCP server — there is nothing extra to install. On a self-hosted bench:

```bash
# New install
bench get-app https://github.com/buildswithpaul/Frappe_Assistant_Core
bench --site yoursite install-app frappe_assistant_core

# Existing install — upgrade to the FAC 3.0 stable release
cd apps/frappe_assistant_core && git fetch origin && git checkout main && git pull
cd ../.. && bench --site yoursite migrate && bench restart
```

Run `bench migrate` on every upgrade. FAC 3.2.x adds a hidden `selected_model` field to
**FAC Chat User Preferences**, which stores each user's model choice. Until the site is
migrated, the choice is not saved on the server and FAC Chat falls back to the choice the
browser remembers.

Upgrading from 2.x leaves your MCP setup, tools, plugins, and audit log untouched —
FAC Chat is additive and starts switched off.

## Enabling FAC Chat

1. Go to **Assistant Core Settings → FAC Chat tab**.
2. Toggle **Enable FAC Chat** to ✓ and save.

That is the whole change — **no `bench restart` is required**. The chat hooks are always
registered and check the setting at runtime, so other workers pick up the new state on
their next request.

A discovery banner on the Desk landing page also walks admins through enabling
chat — it appears once per admin and can be dismissed.

After enabling:

- The chat widget appears in the corner of Frappe Desk pages. It looks like FAC Chat,
  follows Desk's light/dark theme live, and never restyles Desk itself.
- The widget's **+** button in its header starts a new chat on the spot. The chat you
  leave is kept in your history and offered on the widget's welcome screen, so you can
  go back to it. The button is greyed out while the assistant is still replying.
- The full-screen SPA is reachable at `/copilot`.
- The first time a user opens chat, they walk through a one-time onboarding that
  connects the site to FAC Cloud and links it to a subscription.

## Installing FAC Chat as an app

The full-screen chat at `/copilot` can be installed as its own app, with an icon on the
desktop or home screen and a window without browser tabs and toolbars.

- **Chrome and Edge** (desktop and Android): use the install icon in the address bar,
  or **Install app** in the account menu (the avatar at the bottom of the left rail).
  The menu item appears only when the browser can install the app.
- **iPhone and iPad** (Safari): tap **Share**, then **Add to Home Screen**. The
  **Install app** menu item shows these steps.

The installed app opens at `/copilot` and asks for a login like the browser does. Its
code is cached, so it opens quickly; without a connection it shows a "You're offline"
screen, because chat needs to reach FAC Cloud. Nothing about the user or their
conversations is stored on the device. It needs FAC Chat enabled, and the site served
over HTTPS, which browsers require before they offer installation.

On a phone, the installed app behaves like a native chat app:

- **No zoom on tap.** Text fields use 16px type on touch screens, so iOS does not zoom
  in when the message box or any other field takes focus. Pinch-zoom still works.
- **Room to read while typing.** While the message box has the keyboard, the header
  steps aside and the composer trims its padding, so the conversation keeps most of the
  screen above the keyboard.
- **Answers stay in view.** The view follows an answer as it is written, including tool
  cards and plans. Scroll up to read and it stays where you are, with a **Latest**
  button to jump back.
- **Wide tables scroll inside the answer.** Figures keep their monospace columns; words
  and codes use the normal message font. The page itself never scrolls sideways.
- **The chosen model is shown.** The model picker shows a short name ("Sonnet 4.6",
  "Auto") instead of an icon.
- **Links stay in the app.** A link in an answer that points at the site's own address
  (its `host_name`) opens on the address FAC Chat is open on, so it stays inside the
  installed app and you stay logged in, even when the app was installed from another
  address for the same site.

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

## Troubleshooting

### "The assistant stopped waiting for a reply"

FAC Chat stops waiting on the assistant and ends the turn with this message when a reply
makes no progress for seven minutes (420 seconds), or when one turn has run for 30 minutes
(1800 seconds) in total. The assistant's keep-alive signals do not count as progress: only
real steps, text or approval cards do. Whatever the assistant had already shown stays in the
conversation, marked as failed.

What to do: anything after the last step shown may not have finished. Check the record in
question (for example open it from its chip in the rail) before you try again. Then send
the request again, or ask the assistant to carry on from where it stopped. If it keeps
happening on the same request, try a smaller request.

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

## Read next

- **[Files & attachments](./attachments)** — what you can attach, the size and type
  limits, where the bytes are stored, and how attached files reach the model.
- **[Home page and suggestions](./suggestions)** — what the landing screen shows: the
  "Needs you" list, role-aware starters, the widget's page asks, and how to turn suggestions off.
- **[Browser diagnostics](./browser-diagnostics)** — how the widget helps debug a
  broken page, exactly what it records, what is redacted, and the admin kill switch.
- **[Continuing a previous conversation](./conversation-recall)** — how the assistant
  finds and reads your own earlier conversations, and the limitation worth knowing
  before you rely on it.
- **[Technical (client side)](./technical)** — how the widget mounts on Desk pages,
  how streamed responses are rendered, and how a session follows you between the
  widget, the SPA, and mobile.
