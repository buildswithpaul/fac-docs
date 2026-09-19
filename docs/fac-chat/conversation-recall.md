---
title: FAC Chat — Continuing a previous conversation
description: How the assistant finds and reads your own earlier FAC Chat conversations — what it can see, how search matches your wording, and the current_session_id limitation worth knowing about.
---

# Continuing a previous conversation

You can ask the assistant to pick up something from an earlier chat — "continue
where we left off", "what did we decide about the invoice reminders?", "like we
did last time" — and it can find that conversation and read it back, without you
hunting through your conversation list yourself.

## What it is

A tool called `recall_conversations`, available to the assistant in every FAC
Chat conversation and to any MCP client connected to your site (Claude Desktop,
Cursor, or your own BYO-LLM setup). It works in two steps: first it searches
your recent conversations, then it reads the one you meant.

A matching **FAC Skill** (`recall-conversations`) ships alongside it and teaches
the assistant when to reach for the tool and how to handle the results — asking
you to disambiguate when more than one conversation could match, rather than
guessing.

## What it solves

Without this, each conversation is an island — ask the assistant to continue
something from yesterday and it has no way to find it. `recall_conversations`
gives it a bounded, permission-scoped way to search and read your own history,
so "what did we decide about X" is answerable instead of a dead end.

It also makes long conversations useful again. A very long conversation is
periodically **compacted**: FAC Cloud replaces its oldest messages with a
generated summary so the conversation can keep going without hitting a context
limit. Recall reads that summary plus everything since, so picking up a long
conversation still gets the full picture rather than a random slice of it.

## How it works

**Finding a conversation.** Call it with no session id and it lists your recent
conversations — optionally filtered by a keyword:

<code v-pre>recall_conversations(query="invoice reminders")</code>

The match is on **individual words**, not the exact phrase, so a conversation
about an "invoice reminder" (singular) is still found by a search for "invoice
reminders" (plural) — the assistant is expected to paraphrase your own wording,
not quote it back exactly. If your words match nothing, the tool doesn't return
an empty result — it falls back to your most recent conversations instead, and
says plainly that it did (so the assistant can tell you "I didn't find one about
that, but here's what we discussed recently" rather than presenting an
unrelated conversation as a match).

Each result includes when it happened, how many messages it has, a short
preview, and — when your search matched — the snippet of text that matched, so
the assistant (or you, reading the raw response) can tell two similar-looking
conversations apart without opening either one.

**Reading a conversation.** Call it again with the `session_id` from the list:

<code v-pre>recall_conversations(session_id="…")</code>

If that conversation was compacted at some point, you get back its latest
summary plus every message since — not the raw start of a possibly very long
conversation, and not just an arbitrary tail either.

### Example

> **You:** "Pick up where we left off on the overdue invoice reminders."
>
> The assistant calls `recall_conversations(query="overdue invoice reminders")`,
> gets back one clearly matching conversation from two days ago, reads it with
> `recall_conversations(session_id="...")`, and replies: *"Picking up from the
> invoice reminders we set up on Tuesday — you'd asked me to draft a reminder
> for anything 30+ days overdue. Want me to continue from there?"*

## Only your own, only active conversations

- **Only conversations you own are reachable.** This is enforced on every
  query, unconditionally — there is no way to ask the tool for someone else's
  conversation, not even as a System Manager. There is deliberately no `user`
  parameter for the assistant to fill in.
- **Archiving hides a conversation from recall.** Once you archive a
  conversation from your conversation list, it drops out of both search results
  and direct lookup. If you're sure you discussed something and recall can't
  find it, check whether it's sitting in your archive — reopening it there
  makes it reachable again.
- **Everything recalled is treated as data, not instructions.** Text from a
  past conversation is wrapped so the assistant reads it as a quoted record —
  never as a new command to obey, even if an old message happens to contain
  something that reads like one.

## Summaries you can now read yourself

FAC Chat marks the point where a long conversation was compacted with a small
divider — "Earlier messages were summarized to stay within context limits" —
in the middle of the transcript. That divider now **survives a page reload**
(it used to only appear for the live turn it happened on and vanish after),
and you can **click it to expand and read the summary** the assistant is
actually working from.

Treat that summary for what it is: a compressed account written by a model,
not a verbatim transcript. It's a reliable reminder of what was covered, not
a quote to hold anyone to.

## Why we built it

Conversations in FAC Chat already lived in your own database — the missing
piece was giving the assistant a safe, bounded way to search and read them
itself, instead of you having to manually reopen the right one and paste
context back in. Doing the search on term-matches rather than an exact phrase
was a deliberate choice too: people don't quote their own earlier wording
back precisely, and a literal-phrase search would have missed the conversation
it was supposed to find most of the time.

## A limitation worth knowing

The listing call accepts a `current_session_id` argument specifically so the
conversation you're *currently* having doesn't show up in its own search
results. In practice, models don't reliably pass it — the identifier available
to the tool on the server side is a lower-level transport id, not the chat
session id, so the tool has no way to work this out on its own if the model
omits it. If you ever see your own live conversation listed as a "prior"
result, that's why. The [skill](https://github.com/buildswithpaul/Frappe_Assistant_Core)
that ships with the tool tells the assistant to fall back to recognising its
own conversation by its preview text when the id wasn't passed, but this is a
known rough edge rather than a solved problem.

## Deep dive

For the guards, the search algorithm, and how a compacted conversation is
reassembled for recall, see [Technical (client side) — Conversation recall](./technical#conversation-recall).
