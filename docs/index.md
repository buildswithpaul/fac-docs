---
layout: home

hero:
  name: FAC
  text: The AI assistant, built for ERP.
  tagline: An MCP server, OAuth, tools, and an extensible plugin system — open source under AGPL-3.0.
  image:
    light: /fac_logo_light.svg
    dark: /fac_logo_dark.svg
    alt: FAC
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started/installation
    - theme: alt
      text: One-click install on Frappe Cloud
      link: https://cloud.frappe.io/marketplace/apps/frappe_assistant_core
    - theme: alt
      text: View on GitHub
      link: https://github.com/buildswithpaul/Frappe_Assistant_Core

features:
  - icon: ☁️
    title: One-click on Frappe Cloud
    details: 'Hosted on Frappe Cloud? FAC is in the marketplace — install with a single click, free of cost.'
  - icon: 🔌
    title: MCP-native
    details: Expose your data and operations to any MCP-compatible client — Claude Desktop, ChatGPT, IDEs, MCP Inspector — over OAuth-secured StreamableHTTP.
  - icon: 🛠
    title: 24 built-in tools
    details: Document CRUD, search, reports, dashboards, workflow actions, and code execution — ready to use out of the box.
  - icon: 🔐
    title: OAuth 2.0 out of the box
    details: Authorization Code flow with PKCE, dynamic client registration, and automatic token refresh. RFC 6749, 7591, 8414, and 9728 compliant.
  - icon: 📚
    title: Prompt templates
    details: Reusable, parameterized prompts surfaced via the MCP prompts API — categorized, versioned, and role-scoped.
  - icon: 🔒
    title: Role-based access
    details: Inherits permissions, audit logging, sensitive-data filtering, and per-user enablement from your existing site.
---

<div class="support-callout">

## Support, issues, and sponsorship

**Found a bug or have a feature request?** Open an issue on [GitHub Issues](https://github.com/buildswithpaul/Frappe_Assistant_Core/issues) — that's the canonical place to report problems, suggest features, or follow active work.

**FAC is free and open source under AGPL-3.0.** If it saves your team time, please consider supporting ongoing maintenance and new features on [GitHub Sponsors](https://github.com/sponsors/buildswithpaul). Recurring or one-time contributions are welcome.

</div>

<style scoped>
.support-callout {
  max-width: 1152px;
  margin: 0 auto;
  padding: 48px 24px 24px;
}
.support-callout h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 32px;
}
.support-callout p {
  color: var(--vp-c-text-2);
  line-height: 1.7;
}
</style>
