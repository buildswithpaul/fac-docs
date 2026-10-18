# Use the widget in other Frappe apps

The FACO widget lives in Desk. It can also appear inside Frappe's standalone apps — Helpdesk, Insights, CRM and any other app that adds itself to the apps screen — so your team can ask FACO without leaving the app they work in. Raven is the exception: it is a chat app, so FACO answers there as [FAC Bot](#fac-bot-in-raven) instead of a widget.

## Switch it on

1. Open **FAC Admin → Settings → Other Frappe apps**.
2. Turn on each app that should show the widget. The change applies on the next page load.

FAC lists every installed app that registers its own route on the apps screen. Nothing is shown in an app until you switch it on.

## Who sees it

The same people who see it in Desk: **System Users with FAC access** while FAC Chat is enabled. Website and portal users — Helpdesk customers, for example — never get the widget, even in an app where it is on.

## Insights dashboards

On a site with Frappe Insights v3 installed, FACO can read your Insights dashboards and charts,
with their numbers. There is nothing to switch on: the Insights tools come with FAC Chat. Ask "what does this dashboard show?" or "how are sales
trending?" — FACO finds and reads the dashboard as you, so it sees only what Insights lets you see.

FACO reads the numbers with the dashboard's **default** filters; it cannot see filters you changed
on screen. Tell it the filters you are using ("for this quarter only") and it applies them.

## Frappe CRM

Open a lead or deal in Frappe CRM and FACO works on that record with you:

- **Brief me:** it reads the record's whole history (emails, notes, calls, tasks and changes) through CRM's own timeline, so its summary covers what happened, not just the fields.
- **Email the lead:** it writes the email, then shows it to you in full (recipient, subject, message and the account it sends from) before anything goes out. Approved, it is sent the way CRM's own composer sends it and appears on the record's **Emails** tab.
- **Log what happened:** one sentence can become a call log, a note and a follow-up task, each linked to the record and approved by you. A task is assigned to you unless you name someone else.
- **Convert a lead:** it uses CRM's own **Convert to Deal**, so the contact, the organization and the lead's history carry over to the deal.

![FACO in Frappe CRM showing the full email in an approval card before sending](/img/guide-me/crm-email-card.webp)

Step by step: [Guide me: email a CRM lead](/guide-me/crm-email).

## Replying on Helpdesk tickets

On a ticket, ask FACO to reply to the customer. It drafts the reply and shows it to you in an approval card. When you approve, the reply is added to the ticket thread and emailed to the person who raised it, exactly as if you had replied in Helpdesk. Only Helpdesk agents can reply.

## Posting in Raven

Ask FACO to post in Raven ("share this ticket in #support") and it drafts the message for a
channel or DM you are already in. You approve it before it is sent, and it is sent as you.

## FAC Bot in Raven

FAC Bot lets your team ask FACO from inside Raven conversations. Raven does not show the FACO widget.

- **Switch it on** in **FAC Admin → Settings → Other Frappe apps → FAC Bot in Raven**. It is off
  until an administrator turns it on, because each answer uses the asker's FACO credits.
- **Direct messages:** message **FAC Bot** like any colleague. The conversation keeps its memory.
- **Chats with a colleague:** **@mention** FAC Bot in a direct message with another person; it answers in a thread, and you both see the answer.
- **Channels:** add FAC Bot to a channel, then **@mention** it. It answers in a thread on your
  message. **Everyone in the channel can read the answer**, so ask about sensitive figures in a DM.
- **Files:** send a PDF, a spreadsheet or an image with your question and FACO reads it.
- **Who it answers:** only people who can use FACO in the widget, and always with their own ERPNext
  permissions. Someone without a FACO seat gets a reply saying why.
- **Changing data:** when FACO needs your approval (or asks you a question), FAC Bot posts a link
  that opens the conversation in FAC Chat, where you approve, decline or answer.
- **Stop:** delete FAC Bot's reply while it is still writing.
- Raven cannot draw charts. FAC Bot replaces them with a link to the same conversation in FAC Chat.

## What works outside Desk

Chat, streamed answers, attachments, approvals and conversation history work as in Desk.

**FACO knows which document you have open** in Helpdesk (tickets), CRM (leads and deals) and Insights (dashboards, charts and queries). Ask "what is this ticket about?" and it reads the ticket for you, with your own permissions. On any other page it knows only which app you are in. It never reads the text on your screen, only the document itself, so a ticket's wording cannot steer it.

These need Desk and are not available inside other apps:

- **Reading the screen, navigation and screenshots** — FACO cannot see filters you applied on screen, move you around the app, or capture it. For an Insights dashboard, tell it any filters you are using.
- **Approval prompts while the widget is closed** — open the widget to see an approval that is waiting.

A link to a Desk page in an answer opens in a new tab, so you keep your place in the app.
