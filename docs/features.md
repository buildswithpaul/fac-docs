---
title: Everything FAC does
description: One page listing every feature of Frappe Assistant Core and FAC Chat, each with a link to its guide.
---

# Everything FAC does

Every feature in one place, with a line on what it is and a link to the guide. Features marked **Cloud** need FAC Chat connected to FAC Cloud; the rest work with the open-source app alone.

## Two ways to use FAC

| | What it is | Guide |
|---|---|---|
| **FAC Connect** | Your ERPNext as a tool server for Claude, ChatGPT, Cursor and other MCP clients. Free and open source | [Quick start](/getting-started/quick-start) · [OAuth setup](/getting-started/oauth/quick-start) |
| **FAC Chat** · Cloud | An assistant, FACO, inside ERPNext: a widget on every Desk screen and a full-screen app. No API keys or models to set up | [Get started with FAC Chat](/guide-me/get-started) · [Overview](/fac-chat/) |

## Chatting with FACO · Cloud

| Feature | What it does | Guide |
|---|---|---|
| Widget on every Desk screen | Ask about the record or list you are looking at | [Overview](/fac-chat/) |
| Full-screen app | Chats, projects, pages, agents and settings at `/copilot` | [Overview](/fac-chat/) |
| Home page | **Needs you** cards for overdue invoices, late orders and waiting approvals, plus where you left off | [Home page & suggestions](/fac-chat/suggestions) · [Choose what your home shows](/guide-me/home-page) |
| Attachments | Add spreadsheets, PDFs and images to a message | [Files & attachments](/fac-chat/attachments) |
| Voice input | Speak a question, in English or several other languages | Set the language in Settings → Profile |
| Web search | Let FACO look something up on the web for one message | Toggle under the message box |
| Thinking level | Ask for more careful reasoning on a hard question | Toggle under the message box |
| Charts, tables and documents | Answers come with charts and tables, and can be turned into a PDF | [Overview](/fac-chat/) |
| Projects | Keep chats, instructions, documents and memory for one piece of work together | [Start a project](/guide-me/start-a-project) · [Projects & chat history](/fac-chat/projects) |
| Chat history | Search, rename, move and archive conversations | [Organise your chats](/guide-me/organise-chats) |
| Conversation recall | FACO can look back at earlier conversations when you ask | [Conversation recall](/fac-chat/conversation-recall) |
| Prompt templates | Saved questions with blanks to fill in | [Use a prompt template](/guide-me/prompt-templates) |
| Feedback on answers | Thumbs up or down, a short check-in, and one-click reporting of a failed answer | [Rate an answer or report a failed one](/guide-me/rate-answers) |
| Interrupted turns | A turn that stops part-way is detected and can be retried | [Overview](/fac-chat/#retry-and-interrupted-turns) |
| Install as an app | Give FAC Chat its own window and icon, on desktop or phone | [Install FAC Chat as an app](/guide-me/install-app) |
| Other Frappe apps | The widget inside CRM, Helpdesk and Insights | [FACO in Helpdesk, CRM & Insights](/guide-me/other-frappe-apps) · [Email a CRM lead](/guide-me/crm-email) |
| FAC Bot in Raven | Ask FACO in a direct message or a channel | [Ask FAC Bot in Raven](/guide-me/fac-bot-raven) |

## Changing things safely

| Feature | What it does | Guide |
|---|---|---|
| Approval cards | Every write pauses and shows exactly what will change before you approve | [Overview](/fac-chat/) |
| Build plan | Larger changes come as one plan, with a mockup, before anything is built | [Build a page by asking](/guide-me/build-a-page) |
| Go-live card | Everything that switches on for other people is listed on one card, code included | [Build a page by asking](/guide-me/build-a-page) |
| Changes list and undo | Each answer lists what it changed, and records the chat created can be undone | [Overview](/fac-chat/) |
| Your permissions, always | FACO reads and writes as you, including field-level permissions | [Tool management](/guides/tool-management) |
| Bulk changes | Create, update or delete up to 100 records in one step, with a dry run first | [Overview](/fac-chat/) |

## Building and customising

| Feature | What it does | Guide |
|---|---|---|
| FAC Pages | Full-screen pages with live figures, charts, sections teams fill in, present mode and PDF | [Build a page by asking](/guide-me/build-a-page) · [Full-screen pages](/fac-chat/#full-screen-pages-fac-page) |
| Customisations | Custom fields, scripts, reports and print formats from a description, each shown before it goes live | [Setting up ERPNext by conversation](/guides/setup-skills) |
| Dashboards | Create ERPNext dashboards and dashboard charts | [Plugin management](/guides/plugin-management) |
| Data analysis | Run reports, query data and analyse it with Python in a sandbox | [Python code orchestration](/guides/python-code-orchestration) · [Code execution security](/guides/code-execution-security) |
| Reading files | Extract text and tables from PDFs, images and spreadsheets | [Files & attachments](/fac-chat/attachments) |

## Bringing data in

| Feature | What it does | Guide |
|---|---|---|
| Import from a file | Customers, suppliers, items and setup records from Excel, CSV, Google Sheets or Tally | [Bring your data in](/guide-me/import-data) |
| Whole migrations | Several files in the right order, with one round of questions and one approval | [Bringing your data in](/guides/data-migration) |
| Openings | Opening stock, opening invoices, account balances and a chart of accounts | [Bringing your data in](/guides/data-migration) |

## Automation · Cloud

| Feature | What it does | Guide |
|---|---|---|
| Agents | Multi-step work that runs on a schedule, on a document event or by hand | [Agents, templates & triggers](/fac-chat/agents) |
| Template marketplace | Ready-made agents for finance, sales, procurement, stock, manufacturing, HR, projects and support | [Run an agent from a template](/guide-me/agent-template) |
| Visual builder | A canvas of steps: AI tasks, direct tool calls, conditions, decisions, loops and outputs | [Agents, templates & triggers](/fac-chat/agents) |
| Run history | Every run with each step's input, output, time and credits | [Run an agent from a template](/guide-me/agent-template) |

## Knowledge and memory · Cloud

| Feature | What it does | Guide |
|---|---|---|
| Knowledge Base | Answers from your own documents, with the page used | [Answer from your own documents](/guide-me/knowledge-base) |
| Team notes | One shared note every team member's FACO can use | [Answer from your own documents](/guide-me/knowledge-base) |
| Memory | FACO remembers your preferences and standing facts, with your consent | [See and manage what FACO remembers](/guide-me/memory) |
| Project memory | Memory kept inside one project | [Review a project's memory](/guide-me/project-memory) |

## Skills, templates and packs

| Feature | What it does | Guide |
|---|---|---|
| Skills | Written know-how FACO reads before a task, so it follows your way of working | [Skills](/guides/skills-user-guide) |
| Setup skills | Guided setup of ERPNext areas by conversation | [Setting up ERPNext by conversation](/guides/setup-skills) |
| Prompt templates | Write and share your own saved questions | [Prompt templates](/guides/prompt-templates) |
| Industry packs · Cloud | Prompts and skills tailored to an industry, switched on per workspace | Settings → Industry Packs |

## Models and cost · Cloud

| Feature | What it does | Guide |
|---|---|---|
| Model picker and Auto | Pick a model, or let Auto choose the lightest one that can do the job | [Choose which model answers](/guide-me/model-routing) |
| Routing rules | Workspace rules for which grade of model Auto uses | [Choose which model answers](/guide-me/model-routing) |
| Tools load as needed | FACO carries only the tools a conversation needs | [Choose how FACO loads its tools](/guide-me/tool-loading) |
| Credits and usage | What each answer cost, your usage over time, and the workspace's | [See your credits and usage](/guide-me/credits-and-usage) |
| Plans, credits and invoices | Change plan, buy credits, billing details and invoices | [See your credits and usage](/guide-me/credits-and-usage) |

## Workspace and privacy · Cloud

| Feature | What it does | Guide |
|---|---|---|
| Users and seats | Invite people, set roles and a credit limit for each | Settings → Users |
| Your data | Download your data, archive every chat, or delete everything | [See and manage what FACO remembers](/guide-me/memory) |
| Workspace privacy | How long conversations are kept, and whether memory starts on or off | Settings → Workspace |
| Connections | Connect other tool servers alongside your site | Settings → Connections |
| Local and private sites | Use FAC Chat on a site the internet cannot reach | [Local & private sites](/fac-chat/local-sites) |
| Support | Raise a ticket, follow it and reply, inside FAC Chat | [Get help and track your tickets](/guide-me/get-support) |

## Administration

| Feature | What it does | Guide |
|---|---|---|
| FAC Admin | One page for tools, prompts, skills and settings | [FAC Admin page](/guides/fac-admin) · [Change a FAC setting](/guide-me/fac-admin-settings) |
| Plugins | Switch groups of tools on or off | [Plugin management](/guides/plugin-management) |
| Tool access | Limit a tool to roles or to named users | [Tool management](/guides/tool-management) |
| Audit log | A record of every tool call | [FAC Admin page](/guides/fac-admin) |
| Updating | Keep FAC up to date | [Updating](/getting-started/updating) |
