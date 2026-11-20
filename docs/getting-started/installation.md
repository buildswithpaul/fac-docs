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

When someone sends a chat message, the browser's request returns at once and a relay thread
inside the web process carries the answer from FAC Cloud. The turn still brings a stream of
short requests to the site: the chat's own polling, FAC Cloud's MCP callbacks for every tool
it runs, and the person's page loads. Bench starts gunicorn with synchronous workers by
default, and a sync worker serves one request at a time, so with a few people chatting those
requests queue behind each other and the rest of the site waits. Run gunicorn with threaded
workers so each worker serves several requests at once:

```bash
gunicorn --worker-class gthread --threads 8 --workers 4 --timeout 120 frappe.app:application
```

Add the same flags to the gunicorn line in your `Procfile` or supervisor config, then restart
the web process. A setting of 8 threads on 4 workers gives 32 request slots.

FAC checks this for you. It reads the flags the running gunicorn master was started with,
including any in its `GUNICORN_CMD_ARGS` environment variable, and wants at least twice as many
request slots (`workers x threads`) as people you expect to chat at the same time: one slot for
FAC Cloud's callbacks, one for that person's other requests. Set that number in **FAC Chat
Settings → Expected Concurrent Chatters** (default 10).

The check shows up in two places:

- **FAC Chat Settings** shows an orange indicator and the reason when the web server cannot
  carry the number you set.
- The **Registration health** card in FAC Chat settings has a **Web server** row after you run
  diagnostics.

What the check reports:

| Web server | Result |
|---|---|
| `sync` workers | A warning, whatever the worker count |
| `gthread` workers with fewer than twice the expected chatters in slots | A warning |
| `gthread` workers with enough slots | OK |
| Async workers (`gevent`, `eventlet`, `uvicorn`) | OK: they multiplex requests inside a worker, so no slot limit applies |
| Settings in a config file (`-c` or `--config`) | Unknown: the file can set anything, so the check does not guess. Flags on the command line still count, so `-k gthread -w 4 --threads 8` next to `-c` is judged as usual |

The check cannot judge a server it cannot see. If gunicorn was not started directly (for
example `bench serve` in development) or its command line is hidden from the app, the check
reports nothing instead of guessing.

## Chat relay workers

By default the web worker that takes a chat message also carries the answer from FAC Cloud, in
a relay thread. A web deploy or restart then cuts the answers that are being written. With
**Relay Chat Answers in a Background Job** on, the relay runs in a separate worker process instead, so a
web deploy no longer interrupts answers. It is off by default and needs relay workers (below).

**Turn it on** in FAC Admin → Settings → Chat & Widget → **Relay Chat Answers in a Background Job**,
or in the Desk **FAC Chat Settings** form. The setting is read for each new message, so changing
it never moves an answer that is already running or queued.

**Bench.** Declare the queue in `sites/common_site_config.json`, then run `bench setup supervisor`
(production) or `bench setup procfile` (development) and restart. Restart the web workers too, so
they read the new queue list. The timeout of 2100 seconds covers the longest answer (1800
seconds) plus time for busy retries and saving. Bench uses it as supervisor's stop wait.

```json
"workers": {"faco_relay": {"timeout": 2100, "background_workers": 10}}
```

**Never share the queue.** A relay worker listens on `faco_relay` only. A worker that also served
`long` would make answers wait behind reports and imports, and starve them in turn.

**Docker.** Add a service like this, and set the same `workers` entry with
`bench set-config -g workers '{"faco_relay": {"timeout": 2100}}' --parse`:

```yaml
queue-faco-relay:
  image: <same image as the other queue services>
  command: bench worker --queue faco_relay
  deploy: { replicas: 10 }
  stop_grace_period: 330s
```

**Sizing.** One relay worker carries one chat at a time, so run as many workers as **Expected
Concurrent Chatters**. Each worker is a full Frappe process, so budget its memory like any
background worker. The web workers' request slots (see [Web server settings](#web-server-settings))
still matter: FAC Cloud's tool callbacks and page loads still reach them.

**Without workers.** Chat keeps working and relays in the web workers, and the server-setup check
warns. If the dispatch decision itself fails (for example new code is served before
`bench migrate` has added the setting), the answer also relays in the web worker. Users with
GDPR restricted processing always relay in the web worker, so their answers never enter the
queue. An answer that waits in the queue for more than 3 minutes, or whose worker dies, is shown
as interrupted with **Retry**.

**Deploys.** A relay worker that is told to stop lets a running answer finish for up to
`faco_relay_job_shutdown_grace` seconds (default 300, set in site config), then saves it as
interrupted. A worker that has been told to stop no longer counts as available, so new chats
relay in the web workers while the relay workers restart. A chat already queued behind such a
worker is shown as interrupted with **Retry** after about 10 seconds.

**Server-setup check.** With the setting on, **FAC Chat Settings** and the **Registration health**
card warn when the queue is not declared, no worker listens on it, or there are fewer relay
workers than **Expected Concurrent Chatters**.

### Data in the queue

A queued relay job holds the user's message, attachments and page context in the queue's Redis.
A job that finishes is removed at once. A job that fails keeps a failed record with the turn's
content stripped. A worker that is hard-killed (SIGKILL or out of memory) runs no callback, so
its job keeps its content in Redis for Frappe's failed-job TTL, 7 days. Set
`rq_job_failure_ttl` in site config to shorten it.

## Next steps

- [Quick Start](./quick-start) — connect Claude Desktop in 5 minutes
- [OAuth Setup Guide](./oauth/setup-guide) — configure OAuth for external MCP clients
