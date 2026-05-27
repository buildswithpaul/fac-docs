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
      text: View on GitHub
      link: https://github.com/buildswithpaul/Frappe_Assistant_Core

features:
  - icon: 🔌
    title: MCP-native
    details: Expose your data and operations to any MCP-compatible client — Claude Desktop, ChatGPT, IDEs, MCP Inspector — over OAuth-secured StreamableHTTP.
  - icon: 🛠
    title: 24 built-in tools
    details: Document CRUD, search, reports, dashboards, workflow actions, and code execution — ready to use out of the box.
  - icon: 🔐
    title: OAuth 2.0 out of the box
    details: Authorization Code flow with PKCE, dynamic client registration, and automatic token refresh. RFC 6749, 7591, 8414, and 9728 compliant.
  - icon: 🧩
    title: Plugins and Skills
    details: Add custom tools from your own apps via hooks. Ship markdown skills that teach the model how to use them.
  - icon: 📚
    title: Prompt templates
    details: Reusable, parameterized prompts surfaced via the MCP prompts API — categorized, versioned, and role-scoped.
  - icon: 🔒
    title: Role-based access
    details: Inherits permissions, audit logging, sensitive-data filtering, and per-user enablement from your existing site.
---
