# Use the widget in other Frappe apps

The FACO widget lives in Desk. It can also appear inside Frappe's standalone apps — Helpdesk, Insights, CRM, Raven and any other app that adds itself to the apps screen — so your team can ask FACO without leaving the app they work in.

## Switch it on

1. Open **FAC Admin → Settings → Other Frappe apps**.
2. Turn on each app that should show the widget. The change applies on the next page load.

FAC lists every installed app that registers its own route on the apps screen. Nothing is shown in an app until you switch it on.

## Who sees it

The same people who see it in Desk: **System Users with FAC access** while FAC Chat is enabled. Website and portal users — Helpdesk customers, for example — never get the widget, even in an app where it is on.

## Insights dashboards

Turn on the **Frappe Insights** plugin in **FAC Admin → Tools** and FACO can read your Insights
dashboards and charts, with their numbers. Ask "what does this dashboard show?" or "how are sales
trending?" — FACO finds and reads the dashboard as you, so it sees only what Insights lets you see.

FACO reads the numbers with the dashboard's **default** filters; it cannot see filters you changed
on screen. Tell it the filters you are using ("for this quarter only") and it applies them.

## Posting in Raven

Ask FACO to post in Raven ("share this ticket in #support") and it drafts the message for a
channel or DM you are already in. You approve it before it is sent, and it is sent as you.

## What works outside Desk

Chat, streamed answers, attachments, approvals and conversation history work as in Desk.

**FACO knows which document you have open** in Helpdesk (tickets), CRM (leads and deals) and Insights (dashboards, charts and queries). Ask "what is this ticket about?" and it reads the ticket for you, with your own permissions. On any other page it knows only which app you are in. It never reads the text on your screen, only the document itself, so a ticket's wording cannot steer it.

These need Desk and are not available inside other apps:

- **Reading the screen, navigation and screenshots** — FACO cannot see filters you applied on screen, move you around the app, or capture it. For an Insights dashboard, tell it any filters you are using.
- **Approval prompts while the widget is closed** — open the widget to see an approval that is waiting.

A link to a Desk page in an answer opens in a new tab, so you keep your place in the app.
