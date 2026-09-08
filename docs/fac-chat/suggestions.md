---
title: FAC Chat — Welcome suggestions
description: How the starter tiles on the FAC Chat landing screen are personalised from your own usage, what data is used, and how to turn them off.
---

# Welcome suggestions

When you open FAC Chat with no conversation loaded, the landing screen shows a small
grid of starter tiles. Rather than a fixed list, these are personalised to what you
actually work on.

## What you see

Up to four tiles. The leading ones are written for you — grounded in the DocTypes you
spend time in, the things you have asked before, and anything the assistant has
remembered about how you work. A tile personalised for you is marked with a **✦**
glyph; the others carry a category glyph (finance, data, docs, analysis, workflow,
general).

If nothing personalised is available yet, the grid falls back through pinned prompts,
your site's prompt templates, and role-appropriate defaults. **You will never see an
empty grid** — unless you have switched suggestions off yourself.

## What they are built from

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

## How often they refresh

Roughly **once a day**. The landing screen always serves the last generated set from a
local cache, so it renders instantly and never waits on a network call. When that cache
is empty, the screen renders immediately from fallbacks and regeneration runs in the
background — the new tiles appear on a later visit, not by blocking the current one.

Regeneration is rate-limited to about one generation per user per 20 hours, and a
failure backs off for an hour rather than retrying on every page load. Each generation
is a single call on the cheapest model tier, so the running cost is negligible.

## Turning them off

Set **Show suggested prompts** to off in your FAC Chat user preferences. The grid is
then hidden entirely — not shown empty — and neither the personalisation read nor the
background regeneration runs for you.

This is a per-user preference. Turning it off affects only your own landing screen.
