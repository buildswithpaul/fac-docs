# Installation

FAC runs on top of Frappe / ERPNext. Two install paths are supported.

## Option 1 — Frappe Cloud (one-click, free)

If your site is hosted on [Frappe Cloud](https://frappecloud.com), FAC is published in the marketplace and installs in a single click — free of cost.

1. Open your site in the **Frappe Cloud dashboard**
2. Go to the **Apps** tab
3. Find **Frappe Assistant Core** and click **Install**
4. Frappe Cloud handles the install and migration for you

Marketplace listing: <https://cloud.frappe.io/marketplace/apps/frappe_assistant_core>

Once the install completes, jump to [Enable the assistant](#enable-the-assistant) below.

## Option 2 — Self-hosted (bench)

For self-hosted Frappe benches.

### Prerequisites

- **Frappe / ERPNext** v15 or v16
- **Python** 3.10+ (3.12+ recommended)
- **Node.js 22.12 or newer** — on every bench, **including Frappe v15**. FAC's frontend (the FAC
  Chat SPA and the Desk chat widget) is part of `bench build`, which needs it. Check with
  `node --version`. If the frontend was never built, the Desk widget simply doesn't appear;
  Desk and the MCP server are unaffected.
- **MariaDB** or **MySQL**
- **Administrator** access to the bench and a site

### Install the app

From your bench directory:

```bash
# 1. Download
bench get-app https://github.com/buildswithpaul/Frappe_Assistant_Core

# 2. Install on a site (replace `yoursite`)
bench --site yoursite install-app frappe_assistant_core

# 3. Migrate
bench --site yoursite migrate

# 4. Build the frontend (needs Node.js 22.12+)
bench build --app frappe_assistant_core

# 5. Restart
bench restart
```

### Verify

```bash
bench --site yoursite list-apps | grep frappe_assistant_core
```

You should see `frappe_assistant_core` listed.

## Enable the assistant

1. In Desk, go to **Setup → Integrations → Assistant Core Settings**
2. Make sure **Server Enabled** is checked
3. Save

## Grant a user access

1. Go to **Desk → Users**
2. Open your user
3. Add the **Assistant User** or **Assistant Admin** role
4. Check **Assistant Enabled** on the user record
5. Save

## Web server settings

FAC Chat streams every answer over a web request that stays open until the answer is
finished. Bench starts gunicorn with synchronous workers by default, so each chat holds a
whole worker for as long as it streams, and a few people chatting at once can leave the rest
of the site waiting. Run gunicorn with threaded workers so one worker can carry several chats:

```bash
gunicorn --worker-class gthread --threads 8 --workers 4 --timeout 120 frappe.app:application
```

Add the same flags to the gunicorn line in your `Procfile` or supervisor config, then restart
the web process. A setting of 8 threads on 4 workers gives 32 request slots.

FAC checks this for you. It reads the flags the running gunicorn master was started with and
wants at least twice as many request slots (`workers x threads`) as people you expect to chat
at the same time: one slot for the stream, one for that person's other requests. Set that
number in **FAC Chat Settings → Expected Concurrent Chatters** (default 10).

The check shows up in two places:

- **FAC Chat Settings** shows an orange indicator and the reason when the web server cannot
  carry the number you set.
- The **Registration health** card in FAC Chat settings has a **Web server** row after you run
  diagnostics.

The check cannot judge a server it cannot see. If gunicorn was not started directly (for
example `bench serve` in development) or its command line is hidden from the app, the check
reports nothing instead of guessing.

## Next steps

- [Quick Start](./quick-start) — connect Claude Desktop in 5 minutes
- [OAuth Setup Guide](./oauth/setup-guide) — configure OAuth for external MCP clients
