---
title: FAC Chat — Home page
description: What the FAC Chat home screen shows, the "Needs you" list and the signals behind it, role-aware starters, the Desk widget's page asks, and how to turn suggestions off.
---

# The FAC Chat home page

The landing screen (and the Desk widget's welcome panel) answers three questions before
you type anything: what is waiting on you, what could you ask next, and what were you
doing last. This page covers each part, and what it does and does not do with your data.

## Needs you

"Needs you" is a short list, capped at **three items**, of things on your site that are
waiting for your attention. Each card shows a count, a one-line explanation and the
question it would ask; selecting it opens a chat with that question. It is ordered by
urgency (red, then amber, then neutral), and when nothing is waiting it says so.

The list is chosen by your roles. Everyone gets the two general signals; each role adds
its own.

| Signal | Who sees it | Counts |
|---|---|---|
| Approvals waiting for you | everyone | Documents with an open workflow action for you |
| Tasks due | everyone | Your open ToDos due today or overdue |
| Workflows that failed overnight | everyone with workflows enabled | Failed workflow runs from the last 24 hours (see below) |
| Overdue invoices | Accounts roles | Submitted sales invoices with an outstanding amount, more than 60 days past due |
| Bills due soon | Accounts roles | Submitted purchase invoices with an outstanding amount, due in the next 7 days |
| Unreconciled bank lines | Accounts roles | Submitted bank transactions with status Unreconciled |
| Quotations expiring | Sales roles | Open submitted quotations whose validity ends in the next 7 days |
| Late sales orders | Sales roles | Submitted orders past their delivery date and not fully delivered (not closed, completed or on hold) |
| Quiet leads and opportunities | Sales roles | Leads and opportunities you own with no change for 14 days (open ones only; CRM leads and deals too when the CRM app is installed) |
| Items below reorder level | Stock and Purchase roles | Items at or below a warehouse's reorder level |
| Late purchase orders | Stock and Purchase roles | Submitted orders past their required date and not fully received |
| Pending material requests | Stock and Purchase roles | Submitted material requests with status Pending |
| Leave to approve | HR roles, when HRMS is installed | Open leave applications where you are the approver |
| Expense claims to approve | HR roles, when HRMS is installed | Draft expense claims where you are the approver |

"Accounts roles" means Accounts Manager or Accounts User; Sales is Sales Manager or
Sales User; Stock and Purchase is Stock, Purchase or Item Manager roles; HR is HR Manager
or HR User. A user with several of these sees signals from all of them.

Money amounts appear on the invoice cards only when every invoice counted is in the
same currency, so the card never adds up unlike currencies.

### You only see what you could open in Desk

Every count is made with your own permissions, the same way a Desk list view counts:

- A signal appears only if you have read access to its DocType.
- User Permissions apply. If you are restricted to one company, one customer group or
  one set of warehouses, the count covers only those records.
- Approvals are re-checked against the documents themselves: a workflow action for a
  document you cannot read is not counted.
- "Items below reorder level" counts only warehouses you can read. A user with no read
  access to Warehouse does not get the card at all, because they could not see per-warehouse
  stock in Desk either.
- Company-based signals (invoices, bank lines, orders, stock) follow your default company
  when you have one. Approval queues for leave and expense claims do not: they are your
  own work whatever your default company is.

A card never shows a number that the matching Desk list, with the same filters, would
not show you.

### How fresh it is

The list is computed on your site and cached per user for about **10 minutes**, so
opening the home page repeatedly does not re-run the counts. A card can therefore lag
reality by up to ten minutes. If one signal fails to compute, the others still show.

### Failed workflows

If you use FAC workflows, a failed run in the last 24 hours (excluding archived
workflows) appears as a red card at the top of the list, linking to your workflows.
It has a dismiss button that hides the failures you have already seen; a later failure
brings it back. This card is read in your browser from the workflows API, so it still
shows if the rest of "Needs you" could not load.

## Starters by role

Below "Needs you", the home screen shows up to four starter tiles. They follow your
roles: an Accounts user sees questions about receivables and payables, a Sales user about
the pipeline, and so on, while a user with no matching role gets general business
questions. Personalised tiles (see below) still lead when they exist.

On your **first visit**, before you have any conversation, the tiles are replaced by three
labelled cards so it is obvious what you can do:

- **See it** — a chart or summary of your own data.
- **Find it** — a lookup of specific records.
- **Do it** — an action that drafts or prepares something, such as a payment reminder.

An empty "Needs you" on day one shows a short note on what will appear there instead of
disappearing.

## In the Desk widget: On this page

When the widget is open on a Desk form or list, the welcome panel shows an **On this
page** section instead of the starters: a few questions about the record or list in
front of you, for example "Why is Sales Invoice SINV-0001 still unpaid?" on an invoice.
DocTypes with no specific set get generic questions (summarise it, what changed, show
related records). The record name is filled in inside your browser and is not sent
anywhere until you pick a question.

The message box also changes its placeholder to "Ask about this Sales Invoice…" while
you are on a form, and follows you as you move between records. On a form, even on your
first visit, the page asks are shown rather than the See it / Find it / Do it cards.

## Make it yours

Everything on the home page is on by default and nobody has to configure anything. Each
person can then trim it for themselves, in two places. These are per-user choices: they
change only your own home page, and administrators have nothing to set.

**On a card.** Every "Needs you" card has a **⋯** menu with **Don't show this on my
home**. It hides that one signal for you, and a short note in its place links to
**Settings** so you can bring it back.

**In Settings → Home page.** The same choices, gathered in one place:

- **Needs you** on or off.
- **Cards to show**: 1, 2 or 3 (the default is 3).
- **Shown in Needs you**: a checklist of the signals that apply to your roles. Untick
  any you do not want; the failed-workflows card is in this list too.
- **Suggested questions** on or off (the starter tiles and first-visit cards).
- **Personalised suggestions** on or off (the ✦ tiles; see below).

Changes save as you make them.

### What uses AI

Almost nothing on the home page does, and none of it spends your usage except one item:

- The "Needs you" counts, the role starters and the "On this page" questions are
  computed on your site and use no AI.
- Selecting a card sends an ordinary chat message, the same as typing it.
- **Personalised ("For you") suggestions are the only AI part**: one small call per user
  about once a day. Turning **Personalised suggestions** off stops that generation
  itself, not only the display, so it costs you nothing.

---

## Welcome suggestions

When you open FAC Chat with no conversation loaded, the landing screen shows a small
grid of starter tiles. Rather than a fixed list, these are personalised to what you
actually work on.

### What you see

Up to four tiles. The leading ones are written for you — grounded in the DocTypes you
spend time in, the things you have asked before, and anything the assistant has
remembered about how you work. A tile personalised for you is marked with a **✦**
glyph; the others carry a category glyph (finance, data, docs, analysis, workflow,
general).

If nothing personalised is available yet, the grid falls back through pinned prompts,
your site's prompt templates, and role-appropriate defaults. **You will never see an
empty grid** — unless you have switched suggestions off yourself.

### What they are built from

Suggestions are generated from a compact summary of your own activity, gathered on your
site over a 30-day window:

- **The DocTypes you touch** — both those you have discussed in chat and those you
  navigate to in Desk. Desk navigation counts too, so useful tiles appear even if you
  have barely used chat yet.
- **Themes in what you have asked** — repeated phrasings, plus a handful of short
  sample prompts.
- **Your roles**, with generic ones (`All`, `Guest`, `Desk User`, and the admin roles)
  filtered out as noise.
- **Your saved memories**, if the assistant has any for you.

::: info What leaves your site
Only that **summary** — DocType names, repeated phrasings, a few short sample prompts,
and role names — is sent to FAC Cloud to write the tiles. Raw conversation transcripts
are never sent for this. Saved memories are already held on the FAC Cloud side and are
read there rather than being echoed back from your site.
:::

Suggestions are generated per user. You will not see tiles derived from a colleague's
activity, and they will not see yours.

### How often they refresh

Roughly **once a day**. The landing screen always serves the last generated set from a
local cache, so it renders instantly and never waits on a network call. When that cache
is empty, the screen renders immediately from fallbacks and regeneration runs in the
background — the new tiles appear on a later visit, not by blocking the current one.

Regeneration is rate-limited to about one generation per user per 20 hours, and a
failed generation backs off for an hour on the FAC Cloud side. Your site also remembers
an empty or failed result — FAC Cloud refusing the call, or a timeout — for 15 minutes,
so the landing screen does not queue the same failing job on every page load. Each
generation is a single call on the cheapest model tier, so the running cost is negligible.

Generating suggestions never holds up your own messages. On a small plan FAC Cloud runs
one chat turn at a time, and suggestions are admitted without taking that turn's place,
so a background suggestions call can no longer make your first message wait or be refused.

### Turning them off

Set **Suggested questions** to off in Settings → Home page (or **Personalised suggestions** to keep the starters but drop the AI-written ones). The grid is
then hidden entirely — not shown empty — and neither the personalisation read nor the
background regeneration runs for you.

This is a per-user preference. Turning it off affects only your own landing screen.

This hides only the starter tiles (and the first-visit cards). **"Needs you" stays**,
because it is a status list from your own site rather than a suggestion, and the Desk
widget's "On this page" questions stay too.
