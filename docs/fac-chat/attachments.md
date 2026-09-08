---
title: FAC Chat — Files & attachments
description: What you can attach to a FAC Chat message, the size and type limits, where the file is stored, and how its contents reach the model.
---

# Files & attachments

You can attach a document or an image to a FAC Chat message from the `/copilot` SPA
composer, from the Desk widget, or from mobile. This page covers what is accepted,
where the file goes, and how the assistant actually reads it.

## What you can attach

| Limit | Value |
|---|---|
| Maximum file size | **50 MB** |
| Uploads per minute | 10 per user |
| Allowed types | `.pdf` `.txt` `.md` `.csv` `.json` `.xml` `.png` `.jpg` `.jpeg` `.gif` `.webp` |

Anything outside that list is rejected outright. Uploads are validated on more than the
file name — the extension, the declared MIME type, and (for binary formats) the file's
actual leading bytes all have to agree, so renaming a `.exe` to `.pdf` does not get it
through. Filenames are sanitised on the way in.

## Uploads happen when you pick the file

Both the SPA and the widget upload a file **the moment you select it**, not when you
send the message. That is what makes the attachment chip appear immediately, and it
means a large PDF is already uploading while you finish typing.

One consequence worth knowing: if you attach a file and then close the tab without ever
sending the message, the uploaded file is left behind with nothing pointing at it. FAC
flags these on upload and a daily cleanup job deletes anything still unreferenced after
24 hours, so abandoned attachments do not accumulate on your site.

## Where the file is stored

In **your own Frappe site** — as a private File under `Home/Attachments`, on your
site's private files directory (or your S3 bucket, if you have configured one).

**The file itself is never uploaded to FAC Cloud.** Documents are read on your server
and reach the model as extracted text. Images are the one exception: they are sent as
image data in the request body so the model can actually look at them. Nothing is
stored on the FAC Cloud side either way.

::: tip Frappe de-duplicates file contents
Frappe content-addresses uploads, so two files with identical bytes share one file URL.
That URL is therefore not a unique identifier for a single upload.
:::

## How the assistant reads it

Two routes, and a single attachment can travel both.

**Every file — text extraction on your server.** FAC runs its own extraction locally:
text and tables out of PDFs, tabular data out of CSV, the text formats as-is, plus OCR
for images and scanned PDFs. The extracted text is passed to the model as reference material for that one
turn. It is deliberately *not* merged into your stored message, so file contents never
pollute your conversation history, and the model is explicitly told to treat it as data
to be read rather than as instructions to follow.

**Images only — native vision.** Images up to **10 MB** are additionally sent to the
model as an image, so it can see layout, charts, and screenshots rather than just OCR
text. Up to 5 attachments per message. Images persist across turns in the conversation,
so you can keep asking about a screenshot you sent earlier.

Because images take both routes, a screenshot is both OCR'd and seen. That is
intentional — OCR text helps considerably with dense Desk screenshots where small
labels matter.

## Permissions

You can only attach files **you own**. Ownership is checked when the file is linked to
your message, so naming someone else's private file does not let you read it through
the assistant. Everything else follows your normal Frappe permissions: the assistant
acts as you, and can only reach data you can already see.

If a user is under a GDPR processing restriction, their messages are not persisted, so
no file is linked and no extraction runs — the turn proceeds on the prompt alone.

## Knowledge Base uploads are different

Uploading a document to the **Knowledge Base** (for RAG over your documents) is a
separate flow from attaching a file to a single message. Knowledge Base documents are
stored for repeated retrieval; message attachments are read for one turn and then
subject to your retention policy. Do not expect a file attached in chat to become
searchable in the Knowledge Base.

## Retention

Files that *were* sent with a message are covered by your FAC Chat retention policy —
including the **Delete Attachments on Purge** setting, which controls whether the
underlying File is removed when its conversation is purged. Files that were never sent
are swept after 24 hours as described above.
