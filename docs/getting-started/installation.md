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

# 4. Restart
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

## Next steps

- [Quick Start](./quick-start) — connect Claude Desktop in 5 minutes
- [OAuth Setup Guide](./oauth/setup-guide) — configure OAuth for external MCP clients
