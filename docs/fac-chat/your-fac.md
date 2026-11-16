---
title: FAC Chat — Your FAC
description: The Your FAC ring on the FAC bot in FAC Chat — the six powers, what ticks each one, the explain cards, the page guides, the first-login tour, and how to turn it off.
---

# Your FAC

New users often stop at the first answer and never find the rest of FAC Chat. **Your FAC**
is a small ring around the FAC bot at the top of the left rail. It shows how much of FAC
you have tried, and one click takes you to the next thing worth trying, without leaving
the chat.

## What it is

The ring is split into one arc per **power**. Each power has its own colour, and its arc
fills in once you have used it. The bot's label reads, for example, "Your FAC: 3 of 6 tried".

Click the bot to open the **Your FAC** panel. It lists every power with a **Try** button,
shows "3 of 6 powers" and "Next: …", and says "All done. Nice work." once every power is
ticked. When you tick a power while you work, a short message says so, for example
"Unlocked: Pages · 4 of 6".

The powers, in order:

| Power | What it means | Ticks when |
|---|---|---|
| **Set up FAC** | FAC is connected and you can chat | Always ticked: you can see the ring |
| **Ask your data** | Get your first answer | You have a chat of your own |
| **Prompt templates** | Ask a ready-made question | You pin a template, or pick one to ask its question |
| **Knowledge** | Answers from your own files | A file you uploaded yourself is on the Knowledge page |
| **Pages** | Keep an answer as a live report | You own a Page |
| **Agents** | Routine work on a schedule | You create an agent |

**Knowledge** and **Agents** appear only when your site has those features. Without them
the ring has fewer arcs and counts only the powers you can use.

The ring is part of the full-screen FAC Chat (`/copilot`). The chat widget on Desk pages
does not show it.

## What it solves

FAC Chat does much more than answer one question, but nothing told a new user so. People
did not know that a template asks a question for them, that a Page keeps an answer up to
date, or that Knowledge answers from their own files. Your FAC gives each of those a
name, a one-line description and a Try button, and shows which ones you have not tried.

## How it works

### Only your own work counts

A power ticks only for something **you** did:

- your first question in a chat of your own,
- a Page you own, not a colleague's Page shared with you,
- a file you uploaded to Knowledge, not files your team shared,
- an agent you created: blank, from a template, as a copy, or by asking for one in chat,
- a template you pinned, or picked to put its question in the ask box.

You do not have to start from the panel. Using a power anywhere in FAC Chat, for example
asking for an agent in a normal chat, ticks it too.

### Ask your data and Pages explain first

Many users do not know what "ask your data" or "a Page" means, so **Try** on these two
opens a card first. The card says what the power does and gives examples. You then
choose:

- **Ask your data**: **Ask one for me** opens a new chat and asks a starter question
  picked for your role. **I'll ask my own** opens an empty new chat.
- **Pages**: **Make a Page for me** opens a new chat and asks FAC to save an answer as a
  Page. **I'll write my own** opens a new chat with that request in the ask box, for you
  to change and send.

The power ticks once you have done it: Ask your data when the chat exists, Pages when a
Page you own exists.

### Guides on the power's own page

The other powers take you to the place where you try them, with a one-line guide at the
bottom of the page:

- **Knowledge**: files you see may be shared by your team, so upload your own and ask FAC
  about it.
- **Agents**: pick a ready-made template and create your own agent. Try opens the
  template list (the marketplace tab).
- **Prompt templates**: Try opens the template list; pick one and FAC puts its question
  in the ask box for you to send.

A guide goes away once you have used that power, or when you close it with **✕**. A
closed guide stays closed on every device.

### Example

Priya, a sales user, signs in for the first time and asks one question on the home page.
The ring shows 2 of 6: Set up FAC is ticked, and so is Ask your data. She opens
the panel and clicks **Try** on Pages. The card explains that a Page keeps an answer as a
live report; she clicks **Make a Page for me**. FAC answers in a new chat and saves the
Page. A message says "Unlocked: Pages · 3 of 6" and the Pages arc fills in.

### The first-login tour

The first time you reach the FAC Chat home page, before your first chat, a short tour
points out where things are:

1. the ask box,
2. the **Needs you** cards,
3. the left rail (Knowledge, Agents, Pages and more),
4. the Your FAC ring.

A stop whose part is not on screen, such as Needs you when you have switched it off, is
skipped. You can skip the tour, and it shows only once. To see it again, open
**Settings → Help → Show me around**.

### Other small helps

- **New dots.** Knowledge and Agents in the rail show a small dot until you open them
  once.
- **Knowledge page.** Uploading starts from one **Upload** button, in its top bar. An empty
  Knowledge page shows how it works in four steps: upload a document, FAC reads it, you
  ask a question, you get the answer and the page it used.
- **Desk launcher tip.** During your first 7 days, the tip on the FAC launcher in Desk
  talks about the page you are on, for example "Ask me about your Sales Invoice list".
- **Admins, before FAC Chat is on.** The banner on Desk reads "FAC Chat is installed",
  and **Switch on FAC Chat** turns it on and opens FAC Chat in one click. The first time
  the banner shows, you also get a bell notification that links to FAC Admin, so the
  link stays after you dismiss the banner. Each admin gets it only once, and it is
  removed once FAC Chat is switched on.

### Turning it off

Open **Settings → Home page** and switch off **Your FAC progress**. The ring, the panel
and the guides go away at once, without a reload. The switch is per user and is on by
default. The panel's own footer, **Turn this off in Settings → Home**, takes you there.

What you have used, opened and closed is kept on your user preferences, so the ring looks
the same in every browser you sign in from, and two open tabs never undo each other. It
is included when you download your data (**Settings → Your Privacy → Download your data**).

The first time you open FAC Chat with Your FAC, it checks what you have already done, for
example chats and Pages from before an upgrade, and ticks those powers without a message
for each.

## Why we built it

A list of features on a help page is easy to miss. A nudge in the place users already
work, with a button that tries the feature, is not. Counting only the
user's own work keeps the ring honest: opening a colleague's Page is not the same as
making one. Explaining Ask and Pages before running them means nobody is dropped into a
chat with no idea what to type.

## Deep dive

For the stored state, the server endpoints and where the powers come from, see
[Technical (client side) — Your FAC](./technical#your-fac).
