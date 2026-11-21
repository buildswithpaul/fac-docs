---
title: Bringing Your Data In
description: Move a client's customers, suppliers, items, opening stock, receivables, payables and account balances into ERPNext from Excel, CSV or Tally exports, through FAC Chat. Nothing is written until you approve.
---

# Bringing Your Data In

You can move a client's data into ERPNext by talking to the assistant. Attach the file, say what it is, and the assistant checks it, explains what is wrong, and imports it when you approve.

It brings in:

- Customers, suppliers and items.
- Setup records such as Customer Groups, Item Groups, Territories and Price Lists.
- Opening stock.
- Opening receivables and payables (unpaid invoices and bills).
- Account balances (the opening trial balance).

The data comes from Excel (`.xlsx`, `.xls`) or CSV files, a Google Sheets link, or a Tally export. **Nothing is written to ERPNext until you approve it.**

## Before you start

- **Turn on the Migration plugin.** Go to **FAC Admin → Plugins** and switch on **Migration**. See [Plugin Management](plugin-management). Sites that already had the migration tools keep them on after the upgrade to 3.4.0.
- **Who can use it.** A user who can create a **Data Import**, or a System Manager. The tools also check that the user can import into the record type in the file, and that they can read the file. Only the user who started an import (and System Managers) can see it.
- **In FAC Cloud,** FACO loads the import tools when a conversation needs them. You do not switch anything on per chat.

When the plugin is on and you may import, the FAC Chat home page shows a **Bring your data in** starter. Click it to start the conversation.

## Importing one file

Every file goes through the same steps, in the same order. The assistant does not skip one, and it does not import before the check says the file is ready.

### 1. Attach the file

Attach the file to your message, or click **Bring your data in** and then attach it. Spreadsheets attach like any other [file](../fac-chat/attachments). You can also paste a Google Sheets link. Share the sheet so that anyone with the link can view it.

Say what it is. For example: "Here is the Northwind customer list. Please bring these customers into ERPNext."

The file needs a row of column headings. A title row above the headings is fine. Keep **one kind of record per file**. A workbook with several sheets becomes one import for each sheet. A `.zip` is not read: unzip it and attach the files.

The assistant opens an **import session** for the file. The session keeps its own copy of the sheet, the decisions you make, and a log of every step. You can carry on in a later chat.

### 2. The mapping card

The assistant shows a table that matches your file's columns to ERPNext fields. For example, "Customer Name" to Customer Name, "State" to Territory.

- Read it and say what to change.
- A column goes to **Don't Import** only when you say so.
- When the assistant cannot place a column, it asks you with a choice card. It does not guess.

### 3. The check

The assistant checks every row the way the real import would, and **writes nothing**. It then tells you the headline ("10 rows ready, 5 would fail") and groups the problems. It does not list every bad row.

Each group has a plain explanation, an example row, and the fixes that fit. The causes are:

| Cause | What it means |
|---|---|
| Missing link | The row points at a record that does not exist, such as a Customer Group "Retial" |
| Not an allowed option | The value is not one of the field's choices |
| Wrong date format | A date ERPNext cannot read |
| Invalid value | A value the field does not accept |
| Duplicate in the file | The same record appears twice |
| Already in ERPNext | The record exists already |
| Rejected by ERPNext | A rule of the record type, shown in ERPNext's own words |

Row numbers match your spreadsheet. Row 1 is the heading row, so the first record is row 2.

### 4. Fixing the problems

You decide what happens to each group. You can:

- **Map** the value to an existing one. "Retial" becomes "Retail". The assistant offers only names it found, with the likely one first. It never replaces a value with a different one unless you choose that.
- **Create** the missing record, such as a new Customer Group or Territory. This shows an approval card.
- **Fill** a required value that your rows leave blank.
- **Leave out** the rows, with a reason that goes in the report.
- **Fix it in the file.** Some problems, like a bad date or a duplicate, are corrected in the spreadsheet. Attach the corrected file and the assistant checks it again.

After each round the assistant checks again and tells you what still fails. Fixes are saved on the session. Your file is not changed.

### 5. The approval card

When no group is left, the assistant says how many rows will be imported and how many are left out. You ask it to import, and an approval card shows:

- the record type and the number of rows;
- whether they are new records or updates;
- the file name;
- whether the records will be submitted;
- the name of the check you saw.

Approve it and the import runs in the background through ERPNext's own **Data Import**. Emails are muted while it runs, so imported customers get no welcome mails. Progress shows live in the chat.

### 6. The result

The assistant reports the counts, with row numbers: created, failed and left out. For example: "Imported 47 Customer records. 1 row left out (duplicate: row 42)." The import also shows in Desk under **Data Import**.

Some rows can still fail at import, for example if something changed since the check. That is normal. See [Limits and tips](#limits-and-tips) for how to deal with them.

## Importing a whole migration

A real migration has many files, and they depend on each other. Items need Item Groups. Opening invoices need customers. A **migration plan** handles this. It is the better choice for two files or more.

1. **One session per file.** Attach all the files. The assistant opens a session for each.
2. **The plan.** The assistant puts the files in order, with the reason for each position. Setup records come first, then customers, suppliers and items, then what links to them, then opening stock, invoices and balances. It checks a file against the records that earlier files will create. A file that needs a record from a later file is reported as an order problem.
3. **The questions, first.** The assistant maps every file, checks them all, and asks **every question at once**, grouped by file, with its suggested answer first. You answer once. This repeats until every file is ready.
4. **One approval.** The approval card lists every decision: the records that will be created, each fix, the rows left out, the cut-off date and what happens to rows that fail.
5. **It runs unattended.** The plan creates the missing records first. It then imports each file in order, and it asks you nothing more. Each file is checked again just before its import.
6. **You can stop it.** Ask the assistant to stop the plan. It stops after the file that is importing now. What is already imported stays.

The plan asks once what to do with rows that fail when their file comes up: leave them out with their reason (the default), or stop the plan before that file.

If one file cannot be made ready now, it holds the others back. The assistant tells you which file and why, and asks whether to leave it out of the plan. That file keeps its session, so you can import it on its own later.

### Opening stock, invoices and balances

These three have their own tools. They need no Data Import permission.

| File | What ERPNext gets |
|---|---|
| Stock on hand at the cut-off | A Stock Reconciliation with the purpose Opening Stock |
| Unpaid customer invoices and supplier bills | Opening Sales or Purchase Invoices |
| The closing trial balance | An opening Journal Entry |

The assistant asks for the **company** and the **cut-off date** (the last day in the old system) once, and uses them for all three. A site with one company needs no question. The cut-off is a single-choice card with dates from your file names, the last month end and the last year end. It never guesses either.

Things to know:

- Opening stock is never made through a Stock Entry. That would post it to an expense account.
- The trial balance must balance. If debits and credits differ, nothing is ready, and you correct the file.
- Accounts are not created by the import. The chart of accounts must be right first. Replacing a chart is possible only on a company with no transactions yet, with ERPNext's **Chart of Accounts Importer** in Desk.
- Opening invoices dated after the cut-off are reported. You leave them out or fix the date.
- Temporary Opening holds the difference until stock, receivables, payables and balances are all in.

### Tally and other exports

Exports from **Tally Prime**, **Zoho Books**, **Busy**, **Marg** and **QuickBooks** are recognised by their headings. The assistant cleans them and opens the sessions with the mapping already made. It:

- finds the headings under the company and report title rows;
- leaves out totals, footers, repeated headers and group rows;
- reads amounts such as `8,45,000 Dr` and `(1,250)`, and dates such as `1-Apr-24`;
- splits a ledger list into Customers (Sundry Debtors), Suppliers (Sundry Creditors) and Accounts (every other group).

Your upload is not changed. Each session works on a cleaned copy.

A **Tally XML masters export** (Alt+E, Masters, XML) is read directly. The assistant first lists what is in it, with counts, and you choose the parts: ledgers, stock groups, stock items, ledger openings and stock openings. Vouchers are not imported.

::: warning Check the mapping on Tally files
The presets have not been checked against a real export of every system. The assistant says so, and asks you to check the mapping before the check.
:::

Not brought in from a recognised export: opening balances inside party or ledger masters (use the trial balance, outstanding bills and stock summary instead), addresses (a separate Address import), and HSN or GST category unless India Compliance is installed.

## Sign-off

When the migration is done, ask: "What did the migration bring in?" The assistant runs the **Migration Sign-off** report and makes a PDF of it, so you do not have to ask. The same report opens in Desk, for the accountant to check or print.

The report shows:

- **Records:** per record type, the rows in the files, imported, left out, failed and not imported. They always add up to the rows in the files.
- **Why Not Imported:** each reason, with the row numbers.
- **Opening Balances:** stock value, receivables and payables, in the files and in ERPNext, with the difference.
- **Trial Balance:** the accounts that differ from ERPNext, and what is left on Temporary Opening (zero once every opening balance is in).
- **Open Points:** what stands in the way of signing off.

Every number is counted by ERPNext from the files and from the books. The assistant quotes them as they are and does not add them up itself. For a plan, the report covers that plan's files only. If your sessions started on different days, for example because of test runs, the assistant asks from which date the migration counts.

## Limits and tips

- **Row limit.** One import may have at most **50,000 rows** by default. A larger file is refused with the limit, and you split it. A System Manager can change this in **Assistant Core Settings**, under **Max Rows per Import**. Large files are checked in the background, and the assistant tells you when it is running.
- **File types.** `.csv`, `.xlsx`, `.xls`, a Google Sheets link and a Tally `.xml`. CSV text can be UTF-8 or UTF-16, separated by commas, semicolons, tabs or pipes. The assistant reads older encodings too, and tells you.
- **There is no undo.** You checked the import and approved it, and it ran as your import. The assistant will not delete the imported records for you, however you ask. To correct records, update them from a corrected file. To remove records, delete them in Desk.
- **Update existing records.** To change records that are already in ERPNext, start the session as **Update Existing Records**. The assistant asks which field finds each record, for example the Tax ID. The check shows what will change, with the old and new values, before you approve.
- **Retry only the failed rows.** Fix the cause in chat, for example create the missing record. The assistant checks again, and it checks only the rows not imported yet. A new Data Import then imports just those rows. Records already imported are never touched. Stay in the **same session**: a new session would import the done rows again.
- **Fix failures in Excel.** Ask for the **failed rows file**. It has your own columns, then the original row number, the error, and a suggested fix where there is one. Correct it and attach it. The check runs again, and rows that were already imported are skipped.
- **Interrupted imports.** If an import stops part way, ask the assistant to continue. Records that went in are skipped, never duplicated.
- **Keep your old IDs.** When a file has the old system's own ID for each row (a Zoho Customer ID, a Tally ledger name), the assistant keeps the IDs on the side. Later files that refer to the records by those IDs are then translated, not corrected by hand. A preset marks this for you.
- **Your files are not kept for ever.** A session keeps its own copy of the file. When the session has ended, the copy is deleted after your chat retention window.
- **Come back later.** The session keeps every step. In Desk, open **FAC Import Session** to see where each import stands.
- **Ask something else in the middle.** You can. The assistant answers, then offers to carry on and says where the migration stands.

## Troubleshooting

**FACO says it can't import.** The Migration plugin is off, or your user cannot create a Data Import. Ask an administrator to switch on **Migration** in **FAC Admin → Plugins**, and check your role. The assistant will not import the records another way, such as one by one. That would skip the check and send emails.

**An import is stuck on Importing.** The background job may have died. A **System Manager** can release it. Open the session in Desk under **FAC Import Session** and click **Release**. A reason is required. It goes in the step log. The session becomes **Partially Completed** if anything was imported, otherwise **Failed**. What was imported stays. A session or plan whose job is still running cannot be released. A plan with no job running can be released too, and it becomes **Stopped**.

**"The file or its mapping changed since the last check."** The import is tied to the check you saw. If you attached a new file, changed the mapping, or checked again in another tab, the import is refused. Ask the assistant to check the file again, read the new result, and approve again.

**A column or file is not read.** If the assistant cannot tell which row holds the headings, it shows you the top rows and asks. If a Google Sheet is refused, share it with anyone who has the link and paste the link again.
