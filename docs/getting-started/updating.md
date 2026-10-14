# Updating FAC

New FAC releases bring new FAC Chat features, fixes and security updates. Frappe does not
update apps on its own, so a site keeps running the version it was installed with until
someone updates it.

## Check your version

In Desk, open **Help → About**. The list of installed apps shows the
**Frappe Assistant Core** version. On a self-hosted bench you can also run:

```bash
bench version
```

Compare it with the latest release on
[GitHub](https://github.com/buildswithpaul/Frappe_Assistant_Core/releases).

## Frappe Cloud

1. Open your site's bench group in the **Frappe Cloud dashboard**.
2. When an update for **Frappe Assistant Core** is available, the dashboard offers it. Deploy it.
3. Update your site to the new deploy. Frappe Cloud runs the migration and the frontend
   build for you.

## Self-hosted (bench)

From your bench directory (replace `yoursite`):

```bash
# 1. Pull the new code
cd apps/frappe_assistant_core && git pull && cd ../..

# 2. Install any new Python dependencies
bench setup requirements --python

# 3. Migrate the site
bench --site yoursite migrate

# 4. Rebuild the frontend (needs Node.js 22+)
bench build --app frappe_assistant_core

# 5. Restart
bench restart
```

`bench update` does the same for every app on the bench at once, if you would rather update
everything together.

## After updating

Reload Desk and FAC Chat in your browser so they pick up the new frontend. The version under
**Help → About** should now show the new release.
