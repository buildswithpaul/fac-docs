# Guide me: ask FAC Bot in Raven

In Raven, FACO answers as **FAC Bot**: message it like a colleague, or @mention it in a channel.

**You need:** Raven installed, FAC Chat enabled, and the **System Manager** role to switch FAC Bot on. People who ask it need a FACO seat.

## 1. Switch FAC Bot on

Open **FAC Admin → Settings → Other Frappe apps** and tick **FAC Bot in Raven**. The tick is saved at once. It is off until you turn it on, because each answer uses the asker's FACO credits.

![FAC Admin, Other Frappe apps, with FAC Bot in Raven](/img/fac-admin/settings-other-apps.png)

## 2. Message it directly

In Raven, open a direct message with **FAC Bot** and ask your question. It answers with your own ERPNext permissions, and the conversation keeps its memory.

![A direct message to FAC Bot listing the customers who owe the most](/img/guide-me/raven-dm.webp)

## 3. Ask it in a channel

Add FAC Bot to the channel, then @mention it: *"@FAC Bot how did sales go last month?"*. It answers in a thread on your message.

![FAC Bot answering an @mention in a thread](/img/guide-me/raven-mention.webp)

::: warning Channels are shared
Everyone in the channel can read the answer. Ask about sensitive figures in a direct message instead.
:::

## When FACO needs your approval

If your question would change data, FAC Bot does not act from Raven. It posts a link that opens the conversation in FAC Chat, where you approve or decline.

**More:** [FAC Bot in Raven](/fac-chat/other-apps#fac-bot-in-raven)
