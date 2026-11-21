# How to work a CRM lead with FACO

Inside Frappe CRM, FACO works on the lead or deal you have open. It can brief you, log what happened after a call, and convert the lead, each with your approval.

**You need:** FAC Chat, Frappe CRM, and the widget switched on for CRM in [FAC Admin → Settings → Other Frappe apps](./other-frappe-apps).

## 1. Ask for a brief

Open a lead and click the FACO robot. Ask *"Brief me on this lead."* FACO reads the whole history, including notes, calls, emails and tasks, and suggests next steps.

![FACO in Frappe CRM, briefing on a lead](/img/guide-me/crm-brief.webp)

## 2. Log what happened, in one sentence

After a call, say it the way you would to a colleague:

> I just had a 12-minute call with Priya. She wants a quote by Friday. Log the call, add a note, and remind me to send the quote on Thursday.

FACO turns that into a call log, a note and a task. Each one appears on its own approval card.

<img src="/img/guide-me/crm-log-card.webp" alt="An approval card for a CRM activity" width="420">

If something is missing, FACO asks instead of guessing. Here the call log needed the caller's phone number, which the profile did not have.

<img src="/img/guide-me/crm-log-question.webp" alt="FACO asking for a missing phone number" width="420">

## 3. Convert the lead to a deal

Say *"She's qualified. Convert this lead to a deal."* FACO uses CRM's own **Convert to Deal**, so the contact, the organisation and the lead's history carry over.

<img src="/img/guide-me/crm-convert-card.webp" alt="The approval card for converting a lead" width="420">

After you approve, FACO confirms what moved to the deal and what is still open.

<img src="/img/guide-me/crm-converted.webp" alt="FACO confirming the conversion" width="420">

## Use cases

Each of these was done on the demo site.

| You ask | What happened |
|---|---|
| "Brief me on this lead." | A summary from the lead's note and fields, with three suggested next steps |
| The call sentence above | A note and a reminder task for Thursday were saved after approval. The call log waited for a phone number |
| "She's qualified. Convert this lead to a deal." | One approval card, then the lead was converted and its open task carried over to the deal |

**Next:** [Email a CRM lead](./crm-email) · **More:** [Use the widget in other Frappe apps](/fac-chat/other-apps#frappe-crm)
