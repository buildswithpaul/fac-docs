# Guide me: bring your data in

Moving to ERPNext? Attach an export from your old system and FACO maps it, checks every row, asks about what does not fit, and imports once you approve. Here, a customer list exported from Tally.

**You need:** FAC Chat, an up-to-date FAC Cloud, the **Migration** plugin switched on (it is on for new installs), and permission to create a Data Import or the **System Manager** role.

## 1. Attach the file and say what it is

Attach the spreadsheet to your message and say what it holds. FACO opens an import session for the file and starts reading it.

![Asking FACO to import an attached customer list](/img/guide-me/import-ask.webp)

## 2. Check the column mapping

FACO shows how each of your columns maps to an ERPNext field. Change any row from its drop-down. A column with no home is marked **Don't import**.

![The column mapping](/img/guide-me/import-mapping.webp)

## 3. Answer the questions, all at once

FACO checks every row without writing anything, then asks every open question in one card, each with a suggested answer: a customer group ERPNext does not have, missing territories, a customer listed twice. Pick the answers and click **Send answers**.

![The questions card with every answer picked](/img/guide-me/import-questions.webp)

## 4. Approve the records it needs first

If your answers mean creating missing records, here 20 territories, a card lists exactly what will be created. Click **Approve**.

![The card for creating the missing territories](/img/guide-me/import-create-card.webp)

## 5. Approve the import

A second card states the file, the record type, how many rows will be created and how many are left out. Nothing has been imported until you click **Approve** here.

![The import approval card](/img/guide-me/import-approve.webp)

## 6. Read the result

The import runs through ERPNext's own Data Import. FACO reports what was created, what was left out and why, and anything still open. The panel on the right tracks the file from **Read** to **Imported**.

![The import result](/img/guide-me/import-done.webp)

**More:** [Bringing your data in](/guides/data-migration) covers several files at once, opening stock, opening invoices, account balances and the chart of accounts.
