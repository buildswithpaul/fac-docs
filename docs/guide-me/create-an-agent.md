# Guide me: build an agent by asking

An agent does a piece of work on its own. You can start from a [template](./agent-template), draw one on the canvas, or describe it in chat and let FACO build it. This guide shows the last way.

**You need:** FAC Chat, an up-to-date FAC Cloud and the **System Manager** role.

## 1. Describe the job

Say what it should do, when it should run, and what it must not do.

> Create an agent that runs every Monday at 9 AM and lists Northwind Demo Co's sales invoices overdue by more than 30 days, grouped by customer. Don't email anyone; keep the result in the run.

## 2. Approve the design

FACO checks your site first: the company, the fields it will read, and the tools and models available. It then shows the design in plain words: each step, what is read-only, the schedule and how "overdue" is defined. Nothing is created until you answer **Yes**.

![The agent design, waiting for approval](/img/guide-me/newagent-plan.webp)

## 3. Decide when to switch it on

FACO builds the agent as a **Draft** and asks whether to turn on the schedule now. Choose **Not yet** to test it by hand first.

![The created agent and the schedule question](/img/guide-me/newagent-created.webp)

## 4. Open it in the builder

**Open in builder** shows the agent on the canvas. Every step FACO described is a node you can click and edit.

![The new agent on the canvas](/img/guide-me/newagent-builder.webp)

## 5. Run it once

Click **Run**. **Run History** shows the result, the time taken and the credits used. When you are happy, click **Activate**.

![The run history after a manual run](/img/guide-me/newagent-run.webp)

## Use cases

Each of these was done on the demo site.

| You ask | What happened |
|---|---|
| The overdue invoices request above | FACO read the site, proposed a three-step read-only design, and built it as a Draft after one "yes". Building it cost 108 credits |
| A manual run of that agent | Completed in 7.6 seconds for 9.8 credits. Only the grouping step used AI |

Other jobs that suit an agent: a morning list of quotations about to expire, an alert when a large sales order is submitted, or a weekly stock check.

**More:** [Run an agent from a template](./agent-template) · [Agents, Templates & Triggers](/fac-chat/agents)
