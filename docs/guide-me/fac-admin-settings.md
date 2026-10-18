# Guide me: change a FAC setting

Every FAC setting lives on one tab in **FAC Admin**, grouped by what it controls.

**You need:** the **System Manager** role. Other admins can open the tab but cannot save.

## 1. Open FAC Admin

Go to **`/app/fac-admin`** (on Frappe v16, **`/desk/fac-admin`**), or type *FAC Admin* in the awesomebar.

![The FAC Admin page](/img/fac-admin/overview.png)

## 2. Open the Settings tab

Click **Settings** in the row of tabs. The groups are listed on the left:

| Group | What it holds |
|---|---|
| **Chat & Widget** | Context size, page-content sharing, browser diagnostics, chat message retention |
| **Other Frappe apps** | Which standalone Frappe apps show the FACO widget, and FAC Bot in Raven |
| **MCP Server** | The MCP and OAuth discovery URLs, the server name and protocol, how skills are offered |
| **OAuth** | Client registration and discovery (Frappe v15 only) |
| **Security** | Code-execution limits and audit-log retention |
| **OCR** | The OCR backend and its settings |
| **FAC Cloud connection** | This site's FAC Cloud registration (read-only) |

![The Chat & Widget group](/img/fac-admin/settings-chat-widget.png)

## 3. Pick a group and change what you need

Each field explains itself underneath. For example, **Security** holds the limits for the Python sandbox:

![The Security group: code execution limits](/img/fac-admin/settings-security.png)

And **MCP Server** shows the URLs to give an MCP client:

![The MCP Server group](/img/fac-admin/settings-mcp-server.png)

## 4. Save

Click **Save**. FAC checks the values the same way the settings form does, so a value it cannot accept is refused with a message saying why. (**Other Frappe apps** is the exception: each tick there is saved as you make it.)

::: tip Share a group
The address changes as you move between groups (for example `?tab=settings&group=security`). Copy it to send a colleague straight to that group.
:::

**More:** [The FAC Admin page](/guides/fac-admin)
