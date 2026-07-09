# Contributing to fac-docs

Thanks for helping improve the [Frappe Assistant Core](https://github.com/buildswithpaul/Frappe_Assistant_Core)
documentation! This repo builds the site at
[docs.assistantcore.cloud](https://docs.assistantcore.cloud) with
[VitePress](https://vitepress.dev/).

## Ways to contribute

- **Fix typos, broken links, or unclear wording** — small PRs are very welcome.
- **Improve or add a guide** — walkthroughs, examples, screenshots.
- **Report a docs problem** — open an [issue](https://github.com/buildswithpaul/fac-docs/issues)
  describing the page and what's wrong or missing.

Found a **security** problem instead? Don't open an issue — see
[SECURITY.md](./SECURITY.md).

## Local setup

Requires **Node 20+**.

```bash
npm install
npm run docs:dev      # hot-reloading dev server at http://localhost:5173/
npm run docs:build    # production build — must pass before you open a PR
npm run docs:preview  # serve the built site to check the real output
```

## Making a change

1. **Fork** the repo and create a branch off `main`
   (e.g. `docs/fix-oauth-link`).
2. Edit the `.md` files under `docs/`. Pages are grouped by section
   (`getting-started/`, `guides/`, `api/`, …).
3. New pages need a sidebar entry in `docs/.vitepress/config.ts`.
4. **`npm run docs:build` must succeed** — the CI/deploy will fail otherwise.
5. Open a **pull request** against `main`. Direct pushes to `main` are not
   permitted; all changes land through PRs.

### Editing conventions

- Use **relative links** between docs pages; omit the `.md` extension
  (VitePress serves clean URLs).
- Put images under `docs/public/img/<section>/` and reference them with an
  absolute path, e.g. `/img/guides/example.png`.
- Match the voice of the surrounding pages — concise, task-oriented, examples
  over prose.

## Security expectations for contributors

Because this repo auto-deploys to a public site, please:

- **Never commit secrets** — API keys, tokens, passwords, session IDs, or real
  customer/tenant data. The repo has **secret scanning + push protection**
  enabled; a push containing a detected secret will be blocked.
- **Scrub screenshots** before adding them — no live credentials, personal
  data, private URLs, session cookies, or internal hostnames. Use demo/sample
  data.
- **Don't add runtime dependencies** unless necessary; the site is static.
  Keep `package.json` lean and let Dependabot's updates through in review.
- **Don't paste untrusted HTML/scripts** into Markdown. VitePress renders
  Markdown to static HTML — treat any raw HTML you add as something that ships
  to every visitor.
- If you touch `.github/workflows/`, keep the deploy workflow's permissions
  minimal and never echo secrets into logs.

## Licensing

By contributing, you agree that your contributions are licensed under the same
license as the project documentation (**AGPL-3.0**). Only submit content you
have the right to contribute.
