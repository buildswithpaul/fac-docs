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

When a write carries code, the card shows the code in full, not just a field name. On an
update it shows a line diff against the stored version. This covers scripts, report and
print templates (including a raw print's commands and a print designer layout), a
Workflow transition's condition, a Notification recipient's condition, cc and bcc, and a
field's `eval:` display condition, which also gets a plain-English reading.

The card's title says what will happen in your words, built from the call's arguments: "Create
ToDo “Call Blue Harbor Cafés about the renewal”", "Submit Sales Order SO-0042", "Publish the
work-planner page" or "Switch on the Work Plan Rules script". Fields show by their labels, a
check field reads **Yes** or **No**, and a value that is only a date reads as a date ("27 Oct
2026"); anything else, including a date followed by more text, shows exactly as sent. A card
waiting for you carries a quiet **Waiting for you** mark, **Approve** reads **Approving…** while
it is sent, and once you decide, the card folds to one line saying what you approved or
rejected. ([`approvalHeadline`](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/frontend/src/components/chat/interactions/approvalHeadline.js#L61), [`displayValue`](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/frontend/src/components/chat/interactions/helpers.js#L212))

When the write changes how the site behaves (a Server Script, Client Script, Custom
Field, Property Setter, Workflow, Report, Print Format, Notification, FAC Page, and similar), the
card is built for someone who has to approve it without reading code:

- **Full code.** A script, condition, query, print layout or message is on the card in full.
  Each block names its length ("Script · 135 lines"); a long one shows its first 14 lines and
  scrolls, and **Show all N lines** opens the rest. Lines wrap, so nothing is cut off at the
  edge. For a FAC Page, its HTML, script and style all show as code.
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

One kind of customisation change shows no card: one that nobody but you can feel yet. That is a script or notification that is switched off, a FAC Page that is not published, or a brand-new custom DocType that only System Manager can use, that has no records yet and that nothing else uses (plus its fields and permissions). Creating a new table that is not used by any other form yet needs no card either, but once it exists, changing or deleting it asks, because it can sit inside other forms. The same goes for a DocType that something else points at: a link field or a Connections link on another form, a Web Form, a Report, a workspace link, shortcut or quick list, a dashboard chart or number card, a notification, a workflow, a print format, a script, a webhook, a kanban board, an assignment rule, an auto repeat or a user permission. If the assistant changes two scripts, two notifications or two FAC Pages in one step, such as a script's code and switching that script on, both changes show a card, so the card never shows code that the other change then replaces. It still appears in the activity trail. The hidden checks that decide this (`customisation_impact`, and `check_build_plan` for build plans) save nothing and write no audit-log row of their own. Switching it on, publishing a FAC Page or changing a published one, giving another role access, or touching a DocType that other people use or that already has records asks as usual, and so does every other kind of customisation. When a change switches a script or notification on, the card shows the code that will go live, so you see what you are turning on and not just the switch. If the assistant cannot tell, or you set the tool to **Ask**, you get the card. This needs FAC 3.3 and an up-to-date FAC Cloud. If an administrator switches off the `customisation_impact` tool or the FAC Cloud plugin, every customisation change asks for approval again.

On a card for an ordinary record, **Don't ask again when FACO creates records** (or updates,
deletes, or submits, cancels or amends records) switches that tool to **Always Allow** for you.

Each user can change this default per tool from their own approval preferences —
**Block**, **Ask** (the default for writes), or **Always Allow** — so a trusted
workflow doesn't have to click through a card every time. This gate is specific to
FAC Chat; it has no effect on MCP clients like Claude Desktop or Cursor.

A `create_document` call with `validate_only` set saves nothing, and its card says so:
"Checks this record against your rules without saving it. Rules that run before save
still run." A batch says "these records" instead. The card still appears, because the
check runs the doctype's validate hooks and any Before Save server script, and those
can have effects outside the database (an API call, an email, a file) that the rollback
does not undo.

When the assistant is about to build something that takes several records, such as a page, a workspace or a set of fields and scripts, it can show one **Build plan** card first instead of asking for each write. This needs FAC 3.3 and an up-to-date FAC Cloud that offers build plans; without one you get the per-write cards above. The card lists every change with its action and groups them under **Goes live** and **Stays dormant**, so you see which ones take effect for your users at once. When the build includes a screen, the card shows a static mockup of it. A personal ("Only me") FAC Page needs no plan: the assistant builds and changes it directly,
and it runs in a [walled-off frame](#how-a-personal-page-runs) that asks you before it changes anything. Press **Approve plan** to approve all of it. To change something, press **Ask for changes** or type what you want in the composer. The assistant then revises the plan and shows a new card.

Before the card appears, FAC checks the plan against your site with the hidden `check_build_plan` tool, which saves nothing. An entry FAC could never match to a save, such as a doctype that does not exist and is not created in the same plan, or a child-table row like a role assignment (which is saved as an update of each User), goes back to the assistant to fix, and no card is shown. A plan entry carries no field values, so FAC cannot prove that a new role, DocType, field or permission is dormant; such an entry marked as dormant is shown under **Goes live** to be safe, and so is a change to a script that is switched on now. If the check cannot run, for example on an older FAC, the plan is shown as proposed and each write is still checked as usual.

An approved plan covers only the changes it lists, until the assistant proposes another plan, the conversation ends or 24 hours pass. A record the assistant creates under the plan can also be edited under it, but never deleted. Anything not on the plan still shows its own card, as does a change listed as dormant that would now go live, and a tool set to **Block** or **Ask** is still blocked or asked. A scheduled or unattended run is never covered by a plan you approved in chat.

When the assistant builds a Server Script, it looks up what the script sandbox allows first (`sandbox_reference`) instead of saving trial scripts to find out. It builds the script switched off, so you get no card while it drafts, and asks once to switch it on. If the script then fails, it reads the error (`recent_errors`) rather than asking you to describe it, and it can check who may read or change the records involved (`test_as_user`). None of these checks change anything, so they need no approval.

While the assistant works, the activity trail names what it did: **Created**, **Updated**
or **Checked** (a dry run) with the record's name, and a step that failed shows a plain
reason underneath. Frappe's error markup (such as `<strong>`) is dropped from that reason,
so it reads as text in the chat app and the Desk widget ([`failureReason`](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/frontend/src/utils/toolResult.js#L84)). Records the assistant created or changed appear as chips in the side
rail, and a chip links to the record. After a customisation write, the trail row and the
chip also show an **Open a new {doctype}** link, which opens a blank form where the change shows. Questions the assistant asks you render their
formatting (bold, lists, links).

When the assistant asks you several questions at once, they arrive as one card that says how
many there are. Questions open one at a time. Each answer folds into a line showing what you
picked, with **Change** to reopen it, and the footer counts how many you have answered.
Nothing reaches the assistant until you press **Send answers**, which unlocks once every
question has an answer. A single question still sends as soon as you pick an answer, and the
option you picked stays marked while it sends.

## Full-screen pages (FAC Page)

Some screens need a layout of their own, such as a planner, a board or a tracker, rather
than the cards, shortcuts and charts a Workspace gives. The assistant builds these as a
**FAC Page**: a record that holds the page's HTML, script and style, and opens in Desk at
<code v-pre>/app/fac-pages/&lt;name&gt;</code>. The list of pages is at `/app/fac-page`.

A page is **personal** ("Only me", the default) or **shared**:

- **Personal pages.** Any Desk user can have one. It opens only for the user who built it, not
  even for System Managers. Building or changing your own personal page needs no approval
  card. It loads and runs by itself, inside a walled-off frame that reads only what you may and
  asks you before it changes anything (see [How a personal page runs](#how-a-personal-page-runs)).
  Its name is the slug plus a short tag for its owner
  (for example `sales-summary-3fa9c1`), so two people can use the same slug. Website users
  cannot build pages, and a page cannot be shared with Frappe's Share button.
- **Shared pages.** Only System Manager can share a page, publish it, choose its roles or change a
  shared page. The assistant's tools refuse anyone else even if the DocType's permissions are
  widened, because a page carries code. A shared page's name is its slug.

- **Slug.** Lower-case words joined by single hyphens, at most 80 characters, unique among
  shared pages and among each user's own pages. It cannot change after the page is saved.
- **Who can open a shared page.** Users who hold any role in the page's **Roles** table. With no roles,
  only System Manager can open it. Listing **All** or **Guest** opens it to every logged-in
  user, website users included. Logged-out visitors can never open a FAC Page.
- **Drafts.** A shared page that is not published is a draft. Only System Manager can open it, and
  to everyone else it reads as not found. A draft previews in a locked-down frame: no script
  runs, forms do not work, and outside images, fonts and links do not load. The server also
  leaves out the draft's script and cleans its HTML. The script and outside resources work
  once the page is published.
- **How it renders.** A shared page renders inside its own shadow root, so its style does not
  leak into Desk, and its script runs with the viewer's own session, so it can read and change
  only what that user may; its code was approved on the publish card. A personal page runs in a
  walled-off frame instead (see [How a personal page runs](#how-a-personal-page-runs)). The mockup
  kit's `mk-` classes, the ones a build plan's mockup uses, work in both.
- **Approvals.** Creating, changing or deleting a draft, or a page that is only yours, needs no
  approval card. Publishing a page, making a page **Shared**, switching a rule on, or changing
  code or roles that are already live, always asks. One card leads with **This goes live** and
  **Goes live to**, with the page's roles as tags ("System Managers only" when it has none, and a
  note when the roles include All or Guest), then shows the HTML, script and style in full. The card appears even when an approved build
  plan lists the page as going live, because the code was written after you approved the plan.
  A page that stays "Only me" never counts as going live.
  ([`customisation_impact`](../../../apps/frappe_assistant_core/frappe_assistant_core/utils/customisation.py#L313), [`_personal_page_impact`](../../../apps/frappe_assistant_core/frappe_assistant_core/utils/customisation.py#L285))

### How a personal page runs

A personal page loads and runs as soon as it opens, and again after every change the assistant
makes. There is no code to check and nothing to click: you judge the page by its figures. What
keeps this safe is where it runs.

- **A walled-off frame.** The page runs in a sandboxed frame with its own opaque origin: it has
  no cookies, no login and no CSRF token, it cannot make requests itself (`connect-src 'none'`),
  open windows, submit forms, navigate or reach the chat around it, and WebRTC is removed. Images
  and fonts load only from your site's `/files/` and `/assets/`. ([`pageFrameCsp`](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/frontend/src/utils/pageFrameDoc.js#L32), [`guardLoadingElements`](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/frontend/src/pageFrame/hardening.js#L92))
- **Reads go through at once.** The page's only way to data is its `frappe` object, which asks
  the chat or Desk to make the call for it, as you. A fixed list of Frappe's own read endpoints
  (`frappe.client.get`, `get_list`, `get_count`, `get_value`, `get_single_value`, the report view
  and `query_report.run`, and `getdoc`) runs without asking, always as a read-only request. ([`PAGE_READ_METHODS`](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/frontend/src/utils/pageFrameHost.js#L37))
- **Everything else asks.** Any other call shows a prompt over the page: **Allow once**, **Allow
  for this page** or **Don't allow**. **Allow for this page** is offered only for a Server Script
  API method (the kind of endpoint the assistant writes), and only after the server confirms
  that the name really is one and is not remapped; it covers that method on this version of the
  page, and a new version starts afresh. ([`mayTrustForPage`](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/frontend/src/utils/pageRequestPrompt.js#L302), [`is_page_api_method`](../../../apps/frappe_assistant_core/frappe_assistant_core/api/fac_page.py#L126))
- **Record changes ask every time.** Creating, changing, submitting, cancelling or deleting a
  record is allowed one at a time, never for the page. The prompt lists every field it sets, in
  full, and for a change reads the current record first and shows each field before → after.
  What it shows is exactly what is sent. A save that changes only ordinary fields is sent as
  just those fields (`set_value`), so a field you can't read is never touched. ([`describePageRequest`](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/frontend/src/utils/pageRequestPrompt.js#L224))
- **Some changes are refused outright,** with no prompt: saving or inserting a record that is
  not a draft, changing its submit status, owner, creation or parent, and fields whose names
  start with `_`.
- **No rushing.** The prompt sits over the page without moving it, **Allow** is disabled for
  700 ms after a prompt appears, queued prompts show "1 of N", at most five wait at once, a
  method you refused is not asked about again for that version, and after three refusals the
  page is read-only until it changes. ([`PageWritePrompt`](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/frontend/src/components/chat/pages/PageWritePrompt.vue#L67))
- **Walled-off, not sealed.** A deliberately malicious script could still leak small amounts of
  what it reads through DNS lookups, preconnects or timing, which no browser policy closes. Only
  code the assistant wrote for the page runs there.

### Safety rules for a personal page

The server also cleans a personal page's HTML and style before it hands the page to the
browser. A shared page is served as approved.

- **HTML is sanitised with an allowlist.** Inline handlers (`onclick`, `onerror` and the rest),
  `javascript:` and `data:` URLs, `srcdoc`, `<script>`, `<iframe>`, `<object>`, `<embed>`,
  `<base>` and SVG animation are removed. Forms, inputs and buttons stay. Code can live only in
  the script. The blocked tags are taken out before Frappe's
  sanitiser runs, so Frappe 15 (whose sanitiser would otherwise show them as text) and Frappe 16
  give the same page. ([`_personal_html`](../../../apps/frappe_assistant_core/frappe_assistant_core/api/fac_page.py#L199), [`_without_tags`](../../../apps/frappe_assistant_core/frappe_assistant_core/api/fac_page.py#L244), [`PERSONAL_DISALLOWED_TAGS`](../../../apps/frappe_assistant_core/frappe_assistant_core/api/fac_page.py#L51))
- **Style is parsed, not pattern-matched.** The stylesheet is parsed with tinycss2 and written
  back from what survives. `@import`, any at-rule other than `@media`, `@supports`,
  `@keyframes` and `@font-face`, and any `url()`, `image-set()` or similar that does not point at
  a `/files/` or `/assets/` path on your site are stripped. Inline `style` attributes follow the
  same rule. A stylesheet that does not parse cleanly is served empty. ([`_personal_style`](../../../apps/frappe_assistant_core/frappe_assistant_core/api/fac_page.py#L261))
- **Paint stays in the page's frame.** Nothing the page draws can cover Desk, the chat or a
  prompt.
- **Escape record values.** A script should not write record text back as HTML. Escape it with
  `frappe.utils.escape_html`, which works in Desk and in the chat panel.

A `create_document` or `update_document` result for a FAC Page includes `page_url`, the link
to the page itself, next to `url`, the link to its form. To link a page from a Workspace, add
a shortcut of type **URL** that points to its <code v-pre>/app/fac-pages/&lt;name&gt;</code> address.

### Pages beside the chat

Ask for a report, a summary or "a PDF of" your own figures (sales this month, overdue invoices)
and the assistant builds it as a personal page; `generate_document` stays for documents it
writes, such as a proposal. Each page it writes shows as a chip in its reply.

- **It opens by itself.** In the full-screen chat (`/copilot`), a page the assistant saves in
  this turn opens in a panel beside the conversation, so it can look at it at once. A page you
  already have open stays open, and the new one waits behind its chip. Reloading an old
  conversation opens nothing. ([`trackPageWrites`](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/frontend/src/composables/usePagePanel.js#L76))
- **On a phone** (under 768px wide) a saved page does not open over the reply; tap its chip.
- **In the Desk widget** the chip opens the page in Desk.
- **While a page is open** on a screen 1024px or wider, the chat sidebar folds so the
  conversation keeps a readable width, and unfolds when you close the page.
- **The panel header** shows the title, the version (v1, v2, …), **Updating…** while the
  assistant changes the page, then icon buttons for **My pages**, **Full screen** (opens it in
  Desk) and **Share**, the **Download PDF** button, and **Close**. **Share** asks the assistant
  to share the page when you are a System Manager, and otherwise says a System Manager can
  share it.
- **What runs in the panel.** The page runs in its [walled-off frame](#how-a-personal-page-runs)
  with the mockup kit. Its script reaches data only through a small part of Desk's
  `frappe` object; reads run at once and anything else asks. The panel offers a small part of Desk's
  `frappe` object (`frappe.call`, `frappe.db.get_list`, `get_value`, `get_doc`, `insert`,
  `set_value` and `delete_doc`, `frappe.session.user`, `frappe.datetime.get_today` and
  `str_to_user`, `frappe.format`, `frappe.utils.escape_html`, and `__`). A page that needs more of Desk shows **Open in
  Desk** instead.
- **Charts.** A page script draws bar, line and pie charts with `fac.chart(el, option)`, which
  takes an ECharts option and draws SVG, in the panel and in Desk alike.
- **Download PDF** prints a snapshot of the page through your browser's print dialog: A4, in
  landscape when the page is wide, with the suggested file name "title date".
- **The assistant can look at the page.** With FAC Cloud and FAC 3.3.0 or later, the assistant can take a
  screenshot of the page open in the panel, after a card asks you: "FACO wants to look at the page open beside
  the chat and send the assistant a picture of it and the text it shows." It captures only that page, never the
  chat. The picture is drawn inside the page's own frame, so nothing the page contains is drawn or loaded
  outside it. With the picture come `page_text` (the page's visible text, figures and table cells, marked as
  untrusted page content) and `page_errors` (script errors and calls that failed), even when the picture can't
  be taken. The card offers **Allow on this page in this chat**, never a wider trust. ([`capturePage`](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/frontend/src/pageFrame/capture.js#L168))
- **The assistant tests a page before it says it's done.** After every save it looks at the page and checks
  the figures and `page_errors`. When it can't take a picture (a phone, the Desk widget, another page open),
  it runs the page's queries itself and tells you what it checked. To look at your data while building, it
  uses the read tools that don't ask (`get_doctype_info` for a doctype's fields, `list_documents` with
  `group_by` and `aggregate`), not `run_database_query`, which asks on every call, and never
  `run_python_code` to read a doctype's fields. After publishing or changing a shared page it runs
  `browser_capture_diagnostics` on it and fixes any script error first.
- **Open Full Assistant mid-turn.** If you move a conversation from the Desk widget to the full-screen chat
  while the assistant is still working, the chat claims the running turn, and its browser calls (such as the
  page screenshot) go to the chat from then on, including any already waiting. A tool that only works in
  Desk answers at once that the conversation moved. The claim ends with your next message. ([`claim_live_turn`](../../../apps/frappe_assistant_core/frappe_assistant_core/chat/api/chat/live_turn.py#L230), [`claim_session_for_spa`](../../../apps/frappe_assistant_core/frappe_assistant_core/plugins/faco/tools/browser_bridge.py#L139))

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
