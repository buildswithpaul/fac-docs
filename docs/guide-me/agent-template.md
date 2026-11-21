# Guide me: run an agent from a template

An agent does a piece of work on its own: on a schedule, when a document changes, or when you click **Run**. Templates are ready-made agents for common jobs. Here, the **CFO Weekly Snapshot**, which reads three financial reports and writes a one-page brief.

**You need:** FAC Chat, an up-to-date FAC Cloud and the **System Manager** role.

## 1. Open the Template Marketplace

In FAC Chat, open **Agents** in the left rail and click **Template Marketplace**. The templates cover sales, finance, procurement, inventory, manufacturing, HR, projects and support.

![The Template Marketplace](/img/guide-me/agent-templates.webp)

## 2. Read what a template does

Click a template. The panel lists what it needs on your site (modules, reports and tools), which of its actions write, and each step it runs. Click **Use This Template**.

![A template's details](/img/guide-me/agent-template-details.webp)

## 3. Fill in its settings

Each template asks for a few values from your site. This one needs a **Company** and a **Fiscal Year**; the email is optional. Linked records are picked from your site, so a typing mistake cannot get through. Click **Create from Template**.

![The template's settings](/img/guide-me/agent-template-settings.webp)

## 4. Check the setup panel

The agent opens on its canvas with a **Get this agent running** panel. Set who it runs as: click **Run as me**, or pick someone else. The agent uses that person's permissions. The schedule the template brought is listed and switched **off**.

![The agent's canvas and setup panel](/img/guide-me/agent-setup.webp)

Nothing runs on its own until you click **Activate**. A write tool, here `send_email`, only runs unattended once it is set to **Allow unattended**.

## 5. Run it once by hand

Click **Run**, then **Run** again in the dialog. **Run History** shows each step as it finishes, how long the run took and the credits it used.

![The run history with a completed run](/img/guide-me/agent-run-history.webp)

Click **Full screen** to read the result. You can also copy or download it.

![The agent's result](/img/guide-me/agent-run-result.webp)

## 6. Switch it on

When the result looks right, click **Activate**. That one switch turns on the schedule and any document events.

**Next:** [Build a page by asking](./build-a-page) · **More:** [Agents, Templates & Triggers](/fac-chat/agents)
