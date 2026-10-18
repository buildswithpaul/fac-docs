# The FAC Admin Page

## What it is

**FAC Admin** is the single control panel for running Frappe Assistant Core. It lives at **`/app/fac-admin`** and brings everything an administrator needs — server status, the MCP endpoint, tools, prompt templates, and skills — into one screen, instead of hunting through separate DocType lists.

Think of it as the **home base** for FAC. Almost every day-to-day admin task starts here:

- Turn the MCP server on or off, and copy the endpoint URL for your client
- See whether FAC Chat is on and how much it is being used
- Enable/disable tools and control which roles can use them
- Publish and manage prompt templates and skills
- Watch recent tool activity and jump to the full audit log
- Change every FAC setting — MCP server, OAuth, security limits, OCR, chat and widget — on one Settings tab

::: tip Who can open it
FAC Admin is available to users with the **System Manager** or **Assistant Admin** role. Other users never see it.
:::

---

## Getting there

Three ways to reach it:

- Go straight to **`/app/fac-admin`** in your browser. On Frappe v16, Desk lives under `/desk`, so the address is **`/desk/fac-admin`** (`/app/fac-admin` redirects there).
- Use the desk **awesomebar** (`Ctrl/Cmd + G`) and type *"FAC Admin"*.
- From the FAC **workspace**, click the **FAC Admin** shortcut.

---

## A tour of the page

![The FAC Admin page: the status strip, the tabbed registry on the left, and the operations column on the right](/img/fac-admin/overview.png)

The page has a status strip across the top and two columns below it: the **registry** (tabs for tools, prompts, skills and settings) on the left, and an **operations** column on the right.

### 1. Status strip

The strip shows the FAC server state, **Running** or **Stopped**, with a **Disable** (or **Enable**) button. Disabling the server stops *all* MCP clients from reaching FAC until you enable it again, so you are asked to confirm. Next to it, *Updated just now* tells you how fresh the page is, and the refresh button reloads every card.

### 2. The registry tabs

The left column holds four tabs. **Tools**, **Prompts** and **Skills** show a count in their label, so you can see at a glance how many of each the site has. They are described [below](#the-four-tabs).

### 3. The operations column

![The operations column: MCP endpoint, FAC Chat, Chat usage and Quick actions](/img/fac-admin/sidebar.png)

| Card | What it does |
|------|-------------|
| **MCP endpoint** | Your server's MCP URL with a copy button, plus **Advanced form**, which opens the raw `Assistant Core Settings` form. Day-to-day changes belong on the **Settings** tab. |
| **FAC Chat** | Whether FAC Chat is enabled, where it appears (the widget on Desk and the `/copilot` page), a button to enable or disable it, and a link that opens FAC Chat. |
| **Chat usage** | Messages this month and all time, active users, and credits used, with a 30-day sparkline of daily messages. |
| **Quick actions** | Links to the **Audit log**, **FAC Chat Settings**, **Assistant settings** and **Open Copilot**. |
| **Recent activity** | The last few tool calls (tool, user, status, time). Every tool execution is journaled in the [Assistant Audit Log](/api/reference), your record of what the assistant did and for whom. |

The MCP endpoint looks like this:

```
https://your-site/api/method/frappe_assistant_core.api.fac_endpoint.handle_mcp
```

This is the URL you paste into an MCP client (Claude Desktop, ChatGPT, Cursor and others). See [Quick Start](/getting-started/quick-start) and [OAuth Setup](/getting-started/oauth/quick-start) for wiring up a client.

---

## The four tabs

### 🔧 Tools

Controls which tools the MCP server exposes and who can use them. It has two views:

- **Plugins** — a simple on/off switch per plugin (turning one off hides all of its tools).

  ![The Tools tab in Plugins view](/img/fac-admin/tab-tools.png)

- **Individual Tools** — per-tool enable/disable, search, category and plugin filters, a badge for what each tool can do (**Read only**, **Write**, **Privileged**), **bulk actions** (*Enable matching*, *Disable matching*), and **role-based access** (restrict a tool to specific roles).

  ![The Tools tab in Individual Tools view](/img/fac-admin/tab-tools-individual.png)

➡️ Full walkthrough, including restricting a tool to a role and least-privilege setups: **[Tool Management](/guides/tool-management)**. Plugin-level control: **[Plugin Management](/guides/plugin-management)**.

### 📄 Prompt Templates

Manage reusable, parameterized prompts that clients can pull via MCP. Each card shows the template's name and slug, category, visibility, publish state (toggle), and usage count. Search and filter by status.

![The Prompt Templates tab](/img/fac-admin/tab-prompt-templates.png)

➡️ Creating templates, arguments, and rendering engines: **[Prompt Templates](/guides/prompt-templates)**.

### 🎓 Skills

Manage skills — structured guidance that teaches the assistant how to use a tool or carry out a workflow. Cards show the skill name and slug, its type (Tool Usage / Workflow), the tool it's linked to, visibility, publish toggle, and usage. Search and filter by type or status.

![The Skills tab](/img/fac-admin/tab-skills.png)

➡️ Authoring, visibility, and publishing: **[Skills](/guides/skills-user-guide)**.

---

### ⚙️ Settings

Every FAC setting in one place, grouped by what it controls. Pick a group on the left, change what you need, and click **Save**. The group's URL (`?tab=settings&group=oauth`) can be bookmarked or shared.

![The Settings tab, Chat & Widget group](/img/fac-admin/settings-chat-widget.png)

➡️ Step by step, with a screenshot of each group: **[Guide me: change a FAC setting](/guide-me/fac-admin-settings)**.

| Group | What it holds |
|-------|---------------|
| **Chat & Widget** | Context size, page-content sharing, browser diagnostics, and chat message retention |
| **Other Frappe apps** | Which standalone Frappe apps (Helpdesk, Insights, CRM…) show the FACO widget, and **FAC Bot in Raven**. See [Use the widget in other Frappe apps](/fac-chat/other-apps) |
| **MCP Server** | The MCP and OAuth discovery URLs, the server name and protocol, and how skills are offered |
| **OAuth** | Dynamic client registration, allowed public client origins, and discovery metadata. Frappe v15 only: on v16, FAC reads OAuth from Frappe's own **OAuth Settings**, so the group is not shown |
| **Security** | Code-execution limits and audit-log retention |
| **OCR** | The OCR backend and its PaddleOCR or Ollama settings |
| **FAC Cloud connection** | This site's FAC Cloud registration (read-only) |

Saving runs the same checks as the settings form, so an invalid value is rejected with the same message. Only a **System Manager** can view and save these settings; other admins see a note saying so. The MCP server switch and the FAC Chat switch stay where they were — in the status strip and the FAC Chat card.

## Where to go next

| I want to… | Go to |
|------------|-------|
| Connect an MCP client | [Quick Start](/getting-started/quick-start) · [OAuth Setup](/getting-started/oauth/quick-start) |
| Turn whole capabilities on/off | [Plugin Management](/guides/plugin-management) |
| Enable a tool or restrict it to a role | [Tool Management](/guides/tool-management) |
| Add a reusable prompt | [Prompt Templates](/guides/prompt-templates) |
| Teach the assistant a workflow | [Skills](/guides/skills-user-guide) |
| Review what the assistant did | [API Reference → Audit Log](/api/reference) |
