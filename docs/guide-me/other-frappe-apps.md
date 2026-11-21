# How to use FACO in Helpdesk, CRM and Insights

The FACO widget can sit inside Frappe's other apps, so your team asks FACO without leaving the app they work in.

**You need:** FAC Chat enabled, and the **System Manager** role to switch the apps on.

## 1. Switch the apps on

Open **FAC Admin → Settings → Other Frappe apps**. Tick each app that should show the widget. Each tick is saved at once, and the widget appears the next time a page in that app loads.

![FAC Admin, Other Frappe apps: Helpdesk, Insights, CRM and FAC Bot in Raven](/img/fac-admin/settings-other-apps.png)

FAC lists every installed app that has its own place on the apps screen. Nothing appears in an app until you tick it.

## 2. Ask about the ticket you are reading

In Helpdesk, open a ticket and click the FACO robot in the corner. FACO knows which ticket is open, so you can ask *"What is this ticket about?"* or *"Were they actually billed twice?"*. It checks the ticket and the invoices in ERPNext, with your own permissions.

![FACO in Helpdesk, answering about the open ticket](/img/guide-me/helpdesk-widget.webp)

## 3. Reply to the customer from the ticket

Ask FACO to reply: *"Reply to the customer with what you found. Keep it to three sentences."* It drafts the reply and shows it on a card, with the address it will be sent from. Click **Send reply** and the reply joins the ticket and is emailed to the customer, as if you had written it in Helpdesk. Only Helpdesk agents can reply.

![The reply FACO sent, on the ticket](/img/guide-me/helpdesk-replied.webp)

## 4. Ask about a CRM lead

In Frappe CRM, open a lead or deal and ask FACO to brief you. It reads the record's whole history, including notes, calls and emails, before it answers.

![FACO in Frappe CRM, briefing on a lead](/img/guide-me/crm-brief.webp)

To log a call, convert the lead or email it, see [Work a CRM lead with FACO](./crm-lead) and [Email a CRM lead](./crm-email).

## 5. Ask about an Insights dashboard

On an Insights dashboard, ask *"What stands out on this dashboard?"*. FACO reads the charts' numbers with the dashboard's default filters. If you changed the filters on screen, tell FACO which ones you are using.

![FACO in Insights, explaining a sales dashboard](/img/guide-me/insights-widget.webp)

## Use cases

Each of these was done on the demo site.

| Where | You ask | What happened |
|---|---|---|
| Helpdesk ticket | "What is this ticket about, and were they actually billed twice?" | FACO read the ticket, checked both invoices in ERPNext and found two separate sales, not a duplicate |
| Helpdesk ticket | "Reply to the customer with what you found. Keep it to three sentences." | A reply card, then the reply was added to the ticket for the customer |
| CRM lead | "Brief me on this lead." | A summary with suggested next steps. See [Work a CRM lead with FACO](./crm-lead) |
| Insights dashboard | "What stands out on this dashboard?" | A reading of the Selling dashboard's figures with three suggested actions. It asked to run one calculation first |

**More:** [Use the widget in other Frappe apps](/fac-chat/other-apps)
