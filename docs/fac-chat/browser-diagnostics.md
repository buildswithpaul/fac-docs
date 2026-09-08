---
title: FAC Chat — Browser diagnostics
description: How the FAC Chat widget helps debug a broken Desk page — exactly what it records, what is redacted, when it is sent, and the admin kill switch.
---

# Browser diagnostics

When you tell the assistant "this page is broken" from the Desk widget, it can look at
what your browser actually recorded — the console errors and failed requests behind the
symptom — instead of guessing from your description.

This page documents exactly what that means for your data, because the honest answer is
that diagnostics are privacy-relevant and you should know the boundaries before leaving
them on.

::: warning Desk widget only
This applies to the chat widget on Frappe Desk pages. The `/copilot` SPA and mobile do
not record or send diagnostics.
:::

## What is recorded, continuously

While the widget is loaded on a Desk page, it keeps two small in-memory rings, each
holding at most **100 entries**:

- **Console** — `console.error` and `console.warn` calls, uncaught errors (including
  assets that failed to load), and unhandled promise rejections. Identical repeated
  messages collapse into one entry with a count, so a loop that logs the same line
  hundreds of times does not flood the buffer.
- **Network** — every request's method, masked URL, status, and duration.

Buffers live in per-tab session storage, survive navigation within that tab, and
entries older than **5 minutes** are dropped on load.

Recording is designed so that it can never break your page: every hook is wrapped so a
fault in the recorder degrades to "no diagnostics", never to a broken Desk.

## What is never captured

Regardless of any redaction, at no layer does the recorder capture:

- **Request bodies**
- **Successful response bodies**
- **HTTP headers** (so no cookies, no `Authorization`)

Only a **failed** response — HTTP 400 and above, or a request that never completed — is
inspected at all, and then only its body, to pull out the server's error type and
message.

## What is redacted

On top of that, everything recorded passes through redaction before it is stored:

| Rule | Effect |
|---|---|
| Query strings | Keys are kept, every **value** is replaced with `***`. A Frappe filter string carries document names and field values, which is exactly the data not meant to be captured. |
| Secret-like keys | Any value whose key looks like `password`, `secret`, `token`, `api_key`, `key`, `otp`, `pwd`, `sid`, or `csrf` is replaced. |
| Inline secrets in text | `key=value` and `key: value` pairs inside free text — tracebacks, joined console arguments — are masked, including quoted keys and multi-word quoted values. |
| Error envelopes | Only the recognisable parts of a Frappe error are kept: the exception type, the first few server messages, and a length-capped traceback. |

If the redaction module is somehow unavailable, the recorder **fails closed**, not open:
query strings are dropped entirely rather than masked, and console and network text is
blanked. Degraded-but-safe is the deliberate choice; recording unredacted is not a state
it can reach.

## Nothing is sent until you ask, and approve

Recording is local. The buffers sit in your browser and go nowhere on their own.

What the assistant gets for free is a **count** — "this user's browser has recorded 3
console errors and 1 failed request recently". Counts only; no text, no URLs. The
wording of that hint is composed on your server, not by your browser, so the page cannot
inject text into the assistant's prompt through this route.

If your message suggests something is broken, the assistant then asks to run
**`browser_capture_diagnostics`**, which is what actually drains the buffers. That call
surfaces as an **approval card** you have to accept — and the card says plainly that the
result may contain any PII visible on screen or named in an error.

By default that call also takes a screenshot of your current page. It is deliberately a
**single** approval covering both: having approved "collect diagnostics", you are not
prompted a second time for the screenshot it implies. If you would rather not send an
image, the assistant can be asked to collect diagnostics without one, and the console
and network entries still come back.

So the full chain is: recorded locally → counts hinted → **you approve** → sent.

## The admin kill switch

**FAC Chat Settings → Enable Browser Diagnostics**, a checkbox that is **on by
default**.

Turning it off does more than stop the tool being useful — it uninstalls the recording
hooks entirely and clears both the in-memory buffers and the stored blob. Nothing keeps
being collected, and what had already been buffered is discarded.

The setting is resolved on every Desk page load, ahead of the decision about whether to
show the widget at all, so it is honoured even for users who never see the launcher. It
takes effect on the next page refresh.

When the master **Enable FAC Chat** switch is off, diagnostics are off unconditionally —
there is no assistant to consume the buffers, so recording would be pure cost.

## Related settings

**FAC Chat Settings → Enable DOM Content Extraction** (also on by default) is a
different control. It governs whether the assistant can read the content of the page you
are looking at when you ask about it. Diagnostics is about errors; DOM extraction is
about page content. Turning one off does not turn off the other.
