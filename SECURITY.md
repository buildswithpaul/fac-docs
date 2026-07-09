# Security Policy

This repository (`fac-docs`) holds the **documentation site** for
[Frappe Assistant Core (FAC)](https://github.com/buildswithpaul/Frappe_Assistant_Core),
published at [docs.assistantcore.cloud](https://docs.assistantcore.cloud).

Its security surface is the documentation site itself — the build/deploy
pipeline (GitHub Actions → GitHub Pages) and this repo's dependencies.

## Reporting a vulnerability

**Please do not open a public issue for security problems.**

Report privately using GitHub's **[Private vulnerability reporting](https://github.com/buildswithpaul/fac-docs/security/advisories/new)**
(Security tab → *Report a vulnerability*). This opens a private advisory that
only the maintainers can see.

Please include:

- What the issue is and where (URL, file, or workflow)
- Steps to reproduce
- The impact you foresee
- Any suggested fix, if you have one

We aim to acknowledge reports within **5 business days** and to keep you
updated as we work on a fix. Please give us a reasonable window to remediate
before any public disclosure.

## Scope

**In scope for this repo:**

- Exposure of secrets in the repo, build logs, or deployed site
- Vulnerabilities in the GitHub Actions deploy workflow (e.g. injection,
  privilege escalation, artifact tampering)
- Vulnerable dependencies (`npm`) that affect the built site
- Content that leaks sensitive information (credentials, internal URLs, tokens)
  committed by mistake

**Out of scope — report these to the main project instead:**

- Vulnerabilities in **Frappe Assistant Core** (the application, MCP server,
  tools, OAuth, etc.) → report at the
  [Frappe Assistant Core repository](https://github.com/buildswithpaul/Frappe_Assistant_Core/security/advisories/new).
- Vulnerabilities in the underlying [Frappe Framework](https://github.com/frappe/frappe)
  → report to the Frappe project.

If in doubt, report it privately here and we'll route it.

## Good to know

- The site is **fully static** — no server-side code, no database, no user
  input is processed at runtime.
- All content is public by design; there is nothing to authenticate against on
  the published site.
