# Setting Up ERPNext by Conversation

FAC ships eleven built-in **skills** that let the assistant check how your ERPNext site is set up and help you configure it, by talking about your business rather than showing you ERP screens.

## What you can ask for

| Ask something like… | Skill the assistant uses | What it does |
|---|---|---|
| "Check my setup", "what's missing before go-live?" | **Site Health Check** (`site-health-check`) | A read-only audit: company default accounts, fiscal years, taxes, stock settings, negative stock, the scheduler, outgoing email and stale drafts. You get one table sorted by severity. Nothing is changed. |
| "Help me set up ERPNext for my business" | **Guided Setup** (`guided-setup`) | Asks about your business ("do you hold stock?", "more than one branch?") and turns the answers into a setup plan it carries out one area at a time. |
| "Add a field for the site engineer's name on Delivery Note" | **Adding a Custom Field** (`add-custom-field`) | Checks the field isn't already there, picks the right field type and position, and adds it. |
| "Purchase orders above ₹50,000 need approval" | **Setting Up an Approval Workflow** (`set-up-approval-workflow`) | Builds the Workflow: states, actions, roles and the amount condition. |
| "Invoice numbers should include the financial year" | **Configuring Naming Series** (`configure-naming-series`) | Changes the numbering series and tells you where to set the starting number. |
| "Don't let a sale go out below cost", "fill the sales person from the customer" | **Adding a Server Script** (`server-script`) | Picks the smallest mechanism that does the job (a field property, a Client Script, then a Server Script), shows the code in full with a plain explanation, and saves it switched off first. |
| "When a customer is chosen, fill the region" | **Adding a Client Script** (`client-script`) | Fills, shows, hides or warns on a form as the user works. It says plainly that a Client Script runs in the Desk form only, not for imports or the API. |
| "Print invoices without prices", "add bank details to the invoice" | **Creating a Print Format** (`print-format`) | Adds a version of how a document prints. |
| "Overdue invoices by sales person" | **Building a Custom Report** (`custom-report`) | Builds a report the standard lists don't give, or saves a list as a report. |
| "Email the manager when a big order is submitted", "remind me before the due date" | **Setting Up a Notification** (`notification-setup`) | Sets up an email or alert on an event, or a reminder before a date. |
| *(used by all the above)* | **Setup Change Protocol** (`setup-change-protocol`) | The safety procedure every setup change follows. |

## How changes are kept safe

A wrong chart of accounts or tax setup is expensive to unwind, so every setup change follows the same steps:

1. **Plan first.** The assistant reads what already exists, then shows a table of every record it will create or change. For changes, it includes the current value.
2. **It flags what's hard to undo.** For example: a new company creates its whole chart of accounts, an activated workflow stamps a state on every existing document, and deleting a custom field deletes its data.
3. **You confirm once** for the whole plan. Each write still shows its own approval card.
4. **It dry-runs each new record** before creating it. A dry run checks the record's own validation only, not mandatory fields, and is always rolled back.
5. **It stops at the first failure** rather than improvising.
6. **It ends with a change log**: every record it touched, with links and how to undo each one.

## Plain words

The assistant describes everything in business terms. It does not show field names, flags or option keys unless you ask: it says "after the Customer field" or "the Required By date". Conditions are written as sentences ("when the grand total is over 100,000"), not as expressions, in the plan, in questions and in the change log.

## Scripts start switched off

A script that fails can stop everyone saving a document, so a new Server Script follows a fixed order:

1. It is saved **switched off**, so it does nothing yet. The assistant shows the full code and explains what it does and when it runs.
2. It asks whether to go ahead. Only after you say yes does it switch the script on.
3. It then asks you to test it straight away on a draft or test document, and says exactly what to do.
4. It offers to switch the script off again if it misbehaves.

If server scripts are switched off for the whole site, the assistant tells you so in plain words and **asks before** doing anything else. It can save the rule switched off so it is ready, offer a Client Script or another approach, or stop. An active Server Script is refused while scripts are off. Switching server scripts on needs access to the server, and on Frappe Cloud a private bench.

## Example

> **You:** Purchase orders above ₹50,000 should need the purchase manager's approval.
>
> **Assistant:** asks who raises POs and what happens on rejection, checks that someone holds the Purchase Manager role, then shows a plan. The plan creates the missing workflow states and actions, then the workflow. It warns that the Submit button will be replaced by workflow actions, and that existing submitted POs will be marked Approved. You confirm; it builds the workflow and gives you the change log.

## Where a new field lands

When the assistant adds a custom field, it reads back where the field shows (the tab and section) and tells you in business words. If the field landed in a collapsed section or on a later tab and you did not choose that place, it moves the field somewhere visible before it reports. If you chose the place, it reports it as it is and mentions that the section starts closed.

Deleting a custom field removes it from the form but keeps its database column and the values already saved, so the assistant tells you nothing is lost, and nothing is shown.

## Site health and your customisations

When you ask what has been customised, the Site Health Check lists the records in two groups: those **made on this site**, and those **installed by an app** (for example fields that HRMS or India Compliance add). Only the first group counts as your customisations. If it cannot tell which group a record belongs to, it says so.

## Who can use them

- **Site Health Check:** anyone can run it, and it reports only what you have permission to read. The system section needs a System Manager.
- **Custom fields, approval workflows and naming series:** these need a **System Manager**. FAC protects `Custom Field`, `Property Setter` and `Workflow` records from every other role, so the assistant will tell you up front rather than try.
- **Server scripts and client scripts:** these need a **System Manager**, and a server script also needs the **Script Manager** role. If a role is missing, the message names it.
- **Print formats, custom reports and notifications:** Frappe's normal permissions apply. A Query or Script Report also needs the Script Manager role.
- **Guided setup:** each area needs whatever permission its records need. For example, creating warehouses needs Stock Manager rights.

## What's not covered yet

- **Importing data** (customers, items, opening balances from Excel or Tally). Use ERPNext's **Data Import** and **Opening Invoice Creation Tool** in Desk.
- **The first-run setup wizard.** Finish it in the browser first. It creates your first company, chart of accounts and fiscal year.
- **Passwords and images.** An email account's password, or a letterhead logo, is set in Desk. The assistant takes you to the right page, and never asks for a password in chat.

## For developers

The skills are ordinary system skills. They are listed in `frappe_assistant_core/data/system_skills.json`, with their content in `docs/skills/*.md`, and installed on `bench migrate` by `_install_system_skills`. They are `Workflow` skills with no linked tool. They use the existing document tools (`create_document`, `update_document`, `list_documents`, `get_doctype_info`) and add no tools of their own. `get_doctype_info` on `Server Script` reports `server_scripts_enabled` (see [Server scripts switched off](../api/tool-reference.md#server-scripts-switched-off)). `tests/test_system_skill_manifest.py` fails if a manifest entry's content file is missing, because the installer only logs that and skips the skill.

See the [Skills guide](./skills-user-guide.md) for how skills work in general, and how to write your own.
