# fac-docs

Documentation site for **Frappe Assistant Core (FAC)** — the open-source AI assistant for Frappe.

Built with [VitePress](https://vitepress.dev/) and hosted on GitHub Pages.

## Local development

```bash
# Install (Node 20+ recommended)
npm install

# Start dev server with hot reload
npm run docs:dev

# Build the static site
npm run docs:build

# Preview the built site
npm run docs:preview
```

The dev server runs at `http://localhost:5173/`. Pages live under `docs/` — edit a `.md` file and the page hot-reloads.

## Structure

```
docs/
├── .vitepress/config.ts   Nav, sidebar, theme
├── public/                Static assets (CNAME, favicon, logo)
├── index.md               Landing page
├── getting-started/
├── guides/
├── api/
├── fac-chat/              FAC Chat: overview, attachments, suggestions,
│                          browser diagnostics, conversation recall, technical
├── internals/
└── reference/
```

## Deployment

Pushes to `main` are auto-deployed by `.github/workflows/deploy.yml`:

1. GitHub Actions builds the site with `npm run docs:build`
2. Uploads `docs/.vitepress/dist` as the Pages artifact
3. GitHub Pages serves it

### First-time setup

1. Push this repo to GitHub
2. **Settings → Pages → Source**: select **GitHub Actions**
3. (Optional) **Settings → Pages → Custom domain**: enter your domain
4. Update `docs/public/CNAME` to match
5. Update the `base` field in `docs/.vitepress/config.ts`:
   - Custom domain: keep `'/'`
   - Project page (`username.github.io/fac-docs/`): set to `'/fac-docs/'`

## Editing tips

- Use **relative links** to `.md` files (e.g. `./oauth/setup-guide`) — VitePress rewrites them to clean URLs at build time
- Don't include `.md` extensions in links — clean URLs only
- New sections need an entry in `docs/.vitepress/config.ts` `sidebar`
- Frontmatter is optional, but `title:` overrides the H1 in the sidebar

## Drift register

Corrections made when this site's content disagreed with the shipped app. One line each, newest first.

- **2026-10-04** — `docs/api/tool-reference.md` listed `submit_document` as a current tool. The app renamed it to `document_action` and added `cancel` and `amend` actions (`plugins/core/tools/document_action.py`; `submit_document` survives only as a hidden alias in `TOOL_NAME_ALIASES`). The tool table now names `document_action` and its three actions.
- **2026-09-24** — FAC 3.0 went GA (`v3.0.0`, tag cut 2026-09-23). Removed all "public beta" / "rough edges" framing from `fac-chat/index.md`; the FAC Chat install instructions told readers to `bench get-app --branch beta` / `git checkout beta`, but `public/beta` sits at `3.0.0-beta.3` — **older** than the `main`/`v3.0.0` stable release, so following them was a downgrade. All install instructions across the site now point at `main`/stable.
- **2026-09-24** — `fac-chat/index.md` now states plainly that the pre-write approval gate (pause + approve/reject card on `create_document`/`update_document`/`delete_document`/`submit_document`) is a **FAC Chat-only** feature. Verified against the app repo: `submit_document.py`/`create_document.py` have no approval logic, every `requires_approval` enforcement point lives under `frappe_assistant_core/chat/`, and `get_pending_approvals` queries Frappe's own Workflow Actions, not an AI approval gate. Over the plain MCP server a write executes immediately, inside the caller's Frappe permissions.
- **2026-09-24** — Tool count corrected from 24 to **30 tools across 5 plugins** (`docs/api/tool-reference.md`, `docs/guides/plugin-management.md`, `docs/internals/architecture.md`, `docs/.vitepress/config.ts` OG description). The `faco` plugin (8 tools: `send_email`, `generate_document`, 6 `browser_*` tools) was missing from all four pages. FAC 3.0 also collapsed four search tools (`search`, `search_doctype`, `search_link`, `fetch`) into one `search_documents` — pages describing the old four as currently available were fixed; `core` plugin count corrected from 17 to 15.

## License

Documentation content: same as the project (AGPL-3.0).
