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
├── skills/
├── development/
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

## License

Documentation content: same as the project (AGPL-3.0).
