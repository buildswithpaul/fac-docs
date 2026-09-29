# Setting Up ERPNext by Conversation

FAC ships six built-in **skills** that let the assistant check how your ERPNext site is set up and help you configure it, by talking about your business rather than showing you ERP screens.

## What you can ask for

| Ask something like… | Skill the assistant uses | What it does |
|---|---|---|
| "Check my setup", "what's missing before go-live?" | **Site Health Check** (`site-health-check`) | A read-only audit: company default accounts, fiscal years, taxes, stock settings, negative stock, the scheduler, outgoing email and stale drafts. You get one table sorted by severity. Nothing is changed. |
| "Help me set up ERPNext for my business" | **Guided Setup** (`guided-setup`) | Asks about your business ("do you hold stock?", "more than one branch?") and turns the answers into a setup plan it carries out one area at a time. |
| "Add a field for the site engineer's name on Delivery Note" | **Adding a Custom Field** (`add-custom-field`) | Checks the field isn't already there, picks the right field type and position, and adds it. |
| "Purchase orders above ₹50,000 need approval" | **Setting Up an Approval Workflow** (`set-up-approval-workflow`) | Builds the Workflow: states, actions, roles and the amount condition. |
| "Invoice numbers should include the financial year" | **Configuring Naming Series** (`configure-naming-series`) | Changes the numbering series and tells you where to set the starting number. |
| *(used by all the above)* | **Setup Change Protocol** (`setup-change-protocol`) | The safety procedure every setup change follows. |

## How changes are kept safe

A wrong chart of accounts or tax setup is expensive to unwind, so every setup change follows the same steps:

1. **Plan first.** The assistant reads what already exists, then shows a table of every record it will create or change. For changes, it includes the current value.
2. **It flags what's hard to undo.** For example: a new company creates its whole chart of accounts, an activated workflow stamps a state on every existing document, and deleting a custom field deletes its data.
3. **You confirm once** for the whole plan. Each write still shows its own approval card.
4. **It dry-runs each new record** before creating it.
5. **It stops at the first failure** rather than improvising.
6. **It ends with a change log**: every record it touched, with links and how to undo each one.

## Example

> **You:** Purchase orders above ₹50,000 should need the purchase manager's approval.
>
> **Assistant:** asks who raises POs and what happens on rejection, checks that someone holds the Purchase Manager role, then shows a plan. The plan creates the missing workflow states and actions, then the workflow. It warns that the Submit button will be replaced by workflow actions, and that existing submitted POs will be marked Approved. You confirm; it builds the workflow and gives you the change log.

## Who can use them

- **Site Health Check:** anyone can run it, and it reports only what you have permission to read. The system section needs a System Manager.
- **Custom fields, approval workflows and naming series:** these need a **System Manager**. FAC protects `Custom Field`, `Property Setter` and `Workflow` records from every other role, so the assistant will tell you up front rather than try.
- **Guided setup:** each area needs whatever permission its records need. For example, creating warehouses needs Stock Manager rights.

## What's not covered yet

- **Importing data** (customers, items, opening balances from Excel or Tally). Use ERPNext's **Data Import** and **Opening Invoice Creation Tool** in Desk.
- **The first-run setup wizard.** Finish it in the browser first. It creates your first company, chart of accounts and fiscal year.
- **Passwords and images.** An email account's password, or a letterhead logo, is set in Desk. The assistant takes you to the right page, and never asks for a password in chat.

## For developers

The skills are ordinary system skills. They are listed in `frappe_assistant_core/data/system_skills.json`, with their content in `docs/skills/*.md`, and installed on `bench migrate` by `_install_system_skills`. They are `Workflow` skills with no linked tool. They use the existing document tools (`create_document`, `update_document`, `list_documents`, `get_doctype_info`) and add no tools of their own. `tests/test_system_skill_manifest.py` fails if a manifest entry's content file is missing, because the installer only logs that and skips the skill.

See the [Skills guide](./skills-user-guide.md) for how skills work in general, and how to write your own.
