# How to choose which model answers

FACO can use several AI models, grouped into **Economy**, **Standard** and **Premium**. **Auto** picks the lightest one that can do the job. Routing rules let an administrator steer Auto for your workspace.

**You need:** FAC Chat and an up-to-date FAC Cloud. Adding rules needs a workspace admin; everyone can read them.

## 1. Pick a model yourself, or leave it on Auto

The model picker is at the top right of every chat. **Auto** chooses for you and falls back to another provider if one is unavailable. Pick a named model to pin it. Which grades you see depends on your plan.

## 2. Add a routing rule

Open **Settings → Model routing**. A rule says: when a message mentions these words, or comes from a certain page, or is a certain kind of task, use this grade. Every word you list must appear for the rule to match.

![Writing a routing rule](/img/guide-me/routing-form.webp)

## 3. Let it learn first

A new rule starts in **Learning**: FACO records when it would match but does not change which model answers. Use this to check the rule catches what you meant.

![A rule in learning](/img/guide-me/routing-learning.webp)

## 4. Take it live

Click **Go live**. The rule applies from the next message. **Back to learning**, **Suspend** and **Delete** are beside it.

![A live rule](/img/guide-me/routing-live.webp)

## Use cases

| You want to | Rule | What happened on the demo site |
|---|---|---|
| Keep routine month-end lookups cheap | When a message mentions "month-end, closing", use **Economy** | With the rule live, "For month-end closing, how many purchase invoices are still in draft?" was answered by an Economy model for 12 credits |

Other rules that fit the same form: send messages that mention "audit" to **Premium**, or keep questions asked from a list page on **Economy**.

**More:** [See your credits and usage](./credits-and-usage)
