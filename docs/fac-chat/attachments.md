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

Both the SPA and the Desk widget (which uses the same composer components) upload a file **the moment you select it**, not when you
send the message. That is what makes the attachment chip appear immediately, and it
means a large PDF is already uploading while you finish typing. If you press Send before
an upload has finished, the message waits for it, so the file always goes with it.
Removing a chip before you send leaves that file out of the message.

One consequence worth knowing: if you attach a file and then close the tab without ever
sending the message, or remove its chip, the uploaded file is left behind with nothing pointing at it. FAC
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
for images and scanned PDFs. The extracted text is passed to the model as reference
material on **every turn of the conversation**, not just the one that carried the file,
so you can come back to a PDF several messages later. Each file is capped at 20,000
characters of text and the whole conversation at 60,000, with the newest file read
first. The text is deliberately *not* merged into your stored message, so file contents
never pollute your conversation history, and the model is explicitly told to treat it as
data to be read rather than as instructions to follow.

The model is also told each file's **File ID**, so when you refer to "that receipt" it
knows exactly which file you mean.

**Images only — native vision.** Images up to **10 MB** are additionally sent to the
model as an image, so it can see layout, charts, and screenshots rather than just OCR
text. Up to 5 attachments per message. Images persist across turns in the conversation,
so you can keep asking about a screenshot you sent earlier.

Because images take both routes, a screenshot is both OCR'd and seen. That is
intentional — OCR text helps considerably with dense Desk screenshots where small
labels matter.

## Attaching a chat file to a document

Ask for it in plain words, for example *"attach this receipt to Purchase Invoice
PINV-26-00050"*. The assistant attaches a **copy** to that document, so the file stays in
your conversation too, and asks for your approval first, as it does for any change to
your data.

It can only attach a file **you** sent in the chat, and only to a document you are
allowed to edit: the same check Frappe applies when you attach a file yourself. If the
file is already attached to that document, it is not attached twice.

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
stored for repeated retrieval; message attachments are read within their own
conversation and then subject to your retention policy. Do not expect a file attached in chat to become
searchable in the Knowledge Base.

The Knowledge Base is part of your FAC Cloud plan. On a plan that doesn't include it, the
Knowledge Base page hides **Upload**, ignores files dragged onto it, and shows a note
saying the plan doesn't include the knowledge base — with **View plans** for admins, and
a prompt to ask an admin for everyone else. An upload that reaches FAC Cloud anyway is
refused with FAC Cloud's own explanation rather than a generic server error.

## Retention

Files that *were* sent with a message are covered by your FAC Chat retention policy —
including the **Delete Attachments on Purge** setting, which controls whether the
underlying File is removed when its conversation is purged. Files that were never sent
are swept after 24 hours as described above.
