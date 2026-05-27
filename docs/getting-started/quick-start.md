# Quick Start

Get from a fresh install to a working Claude Desktop connection in about five minutes.

## 1. Install Frappe Assistant Core

If you haven't already, follow the [Installation](./installation) guide.

## 2. Enable OAuth

In Desk:

1. Go to **Setup → Integrations → Assistant Core Settings**
2. Open the **OAuth** tab
3. Check:
   - **Show Authorization Server Metadata**
   - **Enable Dynamic Client Registration**
   - **Show Protected Resource Metadata**
4. Save

## 3. Connect Claude Desktop

In Claude Desktop:

1. Open **Settings → Connectors → Add Custom Connector**
2. Fill in:
   - **Name**: `Frappe Assistant`
   - **Transport**: `StreamableHTTP`
   - **Server URL**: `https://your-site.com/api/method/frappe_assistant_core.api.fac_endpoint.handle_mcp`
   - **Authentication**: `OAuth 2.0`
   - **OAuth Discovery URL**: `https://your-site.com/.well-known/openid-configuration`
3. Save
4. When Claude opens your browser, sign in to Frappe and authorize the connector

::: tip
Replace `your-site.com` with your actual Frappe site URL.
:::

## 4. Try a command

In a new Claude Desktop conversation:

> "How many customers do I have in Frappe?"

If you get a real answer, you're connected.

## Where next?

- [Tool Reference](../api/tool-reference) — what the assistant can do
- [OAuth Setup Guide](./oauth/setup-guide) — for the long version
- [Plugin Management](../guides/plugin-management) — turn capabilities on and off
