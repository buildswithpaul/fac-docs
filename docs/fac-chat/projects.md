---
title: FAC Chat — Projects & chat history
description: How the FAC Chat sidebar keeps your full history, how to search and rename chats, how projects group chats and give the assistant standing instructions, and how this data is exported and erased.
---

# Projects & chat history

The `/copilot` sidebar keeps every chat you have not archived, lets you find one by
searching, lets you rename it, and lets you group related chats into a **project** whose
instructions the assistant follows in every chat inside it.

## Your full history

**Recents** in the sidebar lists all of your chats, newest activity first, grouped by date.
Scroll to the bottom and older chats load automatically, so there is no cap on how far back
you can go. Archived chats are not listed here; they stay under the archive, as before.

A chat that belongs to a project shows the project's name on its row.

## Searching

Type in the **Search chats** box at the top of the sidebar. FAC looks at:

- the chat's **title**, and
- the **text of its messages**, yours and the assistant's.

Searching starts once you have typed **at least 2 characters**, and it waits a moment after
you stop typing. While a search is active, the results replace Recents. Clear the box to get
Recents back. Archived chats are not searched.

## Renaming a chat

A new chat is titled automatically from your first message. To change it:

- open the **⋯** menu on the chat's row in the sidebar and choose **Rename**, or
- click the chat's **title in the top bar**.

Press **Enter** to save or **Esc** to cancel. Titles can be up to 140 characters. If you save
an empty name, FAC goes back to the automatic title, and a name you set yourself is never
overwritten by the automatic one.

## Projects

A project is a named group of your chats, with optional instructions for the assistant.

### Create one

Use the **＋** next to **Projects** in the sidebar (or **New project** if you have none yet),
type a name and press Enter. You can also choose **Move to project > New project…** from a
chat's **⋯** menu to create a project and put that chat straight into it. Names can be up to
140 characters.

### The project page

Click a project in the sidebar to open its page. From there you can:

- click the **title** to rename the project,
- add or change its **instructions** with **Edit** (see below),
- start **New chat in this project**, and
- see and open the chats it contains.

The **⋯** menu on the page has **Delete project**.

The sidebar shows your five most recent projects, with **Show all** when you have more. Inside
a project chat, the top bar shows the project name before the chat title; click it to go back
to the project page.

### Instructions

Instructions tell the assistant how to work in the project, for example the tone to use, the
company or customer you are working on, or the format you want for answers. They can be up
to **8,000 characters**; the editor shows a running count and will not save more.

The instructions apply to **every chat in the project, from the next message you send** after
saving them. You do not need to start a new chat. A project with no instructions adds nothing
to the conversation.

### Moving chats in and out

Open a chat's **⋯** menu and choose **Move to project**, then pick a project, or choose
**Remove from project** to take it out. A chat belongs to at most one project, and a chat
started with **New chat in this project** is in that project from its first message.

### Deleting a project

**Delete project** (after a confirmation) removes the project and its instructions. **Its
chats are kept**: they move out of the project and stay in Recents. If the project has
[documents](#project-documents), they are kept too: they move into your Knowledge Base as
private documents.

## Project documents

A project can hold its own documents, such as policies, SOPs, contracts or long PDFs. In a
chat inside that project, the assistant looks at those documents first and still has the rest
of your Knowledge Base to fall back on.

### Add documents

Open the project page and use **Upload** in the **Documents** block, or drag files onto it.
The block sits between the instructions and the chats. It accepts the same files as the
Knowledge Base: PDF, Markdown and text files, up to 10 MB each.

Each document shows its name, size and a status:

| Status | Meaning |
|---|---|
| **Processing** | The document was uploaded and is being prepared for search. The list refreshes by itself every few seconds until nothing is processing. |
| **Ready** | The assistant can search and cite it. |
| **Failed** | The document could not be prepared. Delete it and upload it again. |

A document can still be downloaded or deleted from its **⋯** menu. Deleting asks you to
confirm, and the assistant stops using the document in this project.

### How the assistant uses them

Inside the project, the assistant sees a list of the project's documents first, and prefers
them when they are relevant to your question. When it answers from one, the source it cites is
marked as **from this project**. You do not need to ask it to search. Documents still being
processed are not searched until they are **Ready**.

### Who can see them

- **Project documents are never used outside their project.** The assistant does not list or
  search them in chats that are not in the project, or in other projects.
- **They are private to you.** Other users never see or retrieve them, and they cannot be shared
  or made public while they belong to a project.
- **They do not appear on the Knowledge Base page** while they belong to a project.

### When you delete a project

The project's documents are not deleted. They move into your Knowledge Base as **private**
documents, and from then on they behave like any other document you uploaded there.

Deleting a project needs FAC Cloud to be reachable, because FAC has to ask it to release the
documents first. If it cannot, the delete is refused with "Couldn't release this project's
documents; try again", and nothing is removed, so no document is left stranded. Try again once
the connection is back.

### Requirements

- **A FAC Cloud that supports project documents.** If yours does not yet, the Documents block is
  hidden and projects work exactly as before.
- **The knowledge base turned on** for your site. Without it the block is hidden.
- **A plan that includes the knowledge base.** Without it you can see a project's existing
  documents but the **Upload** button and drag-and-drop are not offered.

## Privacy

- **Projects are private to you.** Every project belongs to the person who created it, and
  other users cannot see, open, change or delete it, or move chats into it. System Managers
  have access to the underlying records on the site, as they do for chat messages.
- **Export and erasure.** In FAC Chat's settings, under **Your Privacy**, the **Your Data**
  section has **Download your data** ("Export all your data as a JSON file"; the button is **Download**).
  That file now includes your projects (title, instructions, created date, and the names of
  their documents when FAC Cloud is reachable) and your
  conversations (title, project, dates and archived flag). **Delete all my data**
  (**Delete Everything**, which asks for your password) permanently deletes your
  conversations and projects along with your messages. Frappe's own **Download My Data** also
  lists these records.
- If you are under a GDPR processing restriction, your messages are not stored (see
  [Files & attachments](./attachments)). A project's instructions still apply to your chats.

## Existing chats

When a site is updated to include this feature, FAC builds the history list from your
existing chat messages, so older chats appear in Recents without any action from you.
Chats you had already archived stay archived.
