---
title: Local and private sites
description: FAC Chat runs in the cloud and calls your site back for every action, so a site on localhost or behind a firewall can't use it. Here are both ways forward — the free built-in MCP server, or exposing the site with a public address.
---

# Local and private sites

FAC Chat runs the assistant in **FAC Cloud** and calls your site back for every
action it takes — reading a document, creating an invoice, running a report. That
callback is not optional; it is how the assistant does anything at all.

So a site FAC Cloud cannot reach cannot use FAC Chat. If your bench runs on
`localhost`, on a private office network, or behind a firewall with no inbound
access, registration stops with a message naming the address it couldn't reach.

::: tip This is not a dead end
Local sites have a fully supported path: the **built-in MCP server**, which is free
and runs entirely on your machine. It is the better fit for personal and
development use regardless of reachability.
:::

## Which option is yours

| | Built-in MCP server | FAC Chat |
|---|---|---|
| **Where the assistant runs** | On your machine, in your AI client | In FAC Cloud |
| **Needs a reachable site** | No | Yes |
| **LLM** | Your own key and subscription | Included in the FAC Cloud plan |
| **Cost** | Free | Subscription |
| **Good for** | Local benches, personal use, development | Teams on a hosted site |

## Option A — use the built-in MCP server

This is the original FAC, and nothing about it needs your site to be reachable
from the internet. Your AI client runs on the same machine as your bench, so
`localhost` is no obstacle.

1. Go to **Desk → FAC Admin** and copy the **MCP Endpoint URL**.
2. In your AI client — Claude Desktop, Cursor, ChatGPT desktop, MCP Inspector —
   add it as a custom connector.
3. Log in with your Frappe account and authorize.
4. Ask it something about your data.

The [Quick Start](/getting-started/quick-start) has the full walkthrough per
client. You keep every tool FAC exposes, your existing roles and permissions, and
the **Assistant Audit Log**. What you don't get is the in-Frappe chat UI, shared
memory, RAG, or the workflow builder — those are FAC Chat features because they
live in the cloud.

## Option B — give the site a public address

If you can expose the site, FAC Chat works normally. For a trial, a tunnel is the
quickest route.

::: warning Do the config step too
A tunnel on its own is not enough. Frappe reports its own address during
registration, and without the config change below it keeps reporting the local
one — so registration sends `localhost` to the cloud and fails exactly as before,
even while your tunnel is up.
:::

1. **Start a tunnel** to your bench:

   ```bash
   cloudflared tunnel --url http://localhost:8000
   # or
   ngrok http 8000
   ```

2. **Tell Frappe its public address.** Add `host_name` to
   `sites/<your-site>/site_config.json`:

   ```json
   {
     "host_name": "https://your-tunnel-host"
   }
   ```

3. **Reload the config:**

   ```bash
   bench --site <your-site> clear-cache
   ```

4. **Retry registration** from the FAC Chat onboarding screen.

::: danger Tunnels are for trials, not production
The cloud calls your site on every single action, so when the tunnel stops, chat
stops with it — and a tunnel URL that changes on restart breaks the registration
that was bound to the old one. For real use, host the site somewhere with a
stable public address.
:::

## Before you retry

Registration attempts are **rate-limited to a few per day per network** to protect
the service. Retrying without changing anything will use them up and lock you out
for 24 hours, so confirm your site is genuinely reachable first — open
`https://your-public-host/api/method/frappe.ping` from a phone on mobile data, or
any network other than the one the site is on. If that loads, the cloud can reach
you too.

## What counts as unreachable

- `localhost`, `127.0.0.1`, or a `*.localhost` bench hostname
- Private network addresses — `10.x`, `172.16–31.x`, `192.168.x`
- Link-local and IPv6 loopback / unique-local addresses
- A public DNS name whose host drops inbound connections (a firewall with no port
  forward is the common case, and the one that surprises people — the name
  resolves, so the site looks fine)

The check only proves the address is **routable**; any HTTP response counts, even a
`404`. Authentication is handled separately, so a site behind HTTP auth still
passes.

## If chat breaks after a working setup

The same check runs again when a user connects their account, so a site that was
reachable at sign-up and has since moved behind a firewall reports the endpoint it
can't reach rather than failing mid-conversation. If chat stops working after a
network change, this is the first thing to verify.
