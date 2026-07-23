# Ulumba Compliance Tracker

A small static site (React + Vite) that tracks fleet compliance documents —
certificates of fitness, motor insurance, cross-border permits — and flags
which ones are expiring soon or already expired. Search by registration
number, filter by asset/document type or status.

This is a **prototype**: data is loaded once at build time from
`src/data/complianceData.json`. Nothing is written back anywhere, and there's
no backend. Good for visualizing the idea before any real integration.

## What's inside

```
src/
  data/complianceData.json   ← the register itself (edit this to update data)
  utils/dateUtils.js         ← computes Valid / Expiring soon / Expired live, from today's date
  components/
    SummaryCards.jsx          ← the 4 clickable count tiles at the top
    SearchFilters.jsx         ← search box + dropdown filters + sort
    StatusBadge.jsx           ← the colored pill (green/amber/red)
    ComplianceTable.jsx       ← the results table
  App.jsx / App.css           ← page layout & styling
.github/workflows/deploy.yml  ← CI/CD: builds & deploys to GitHub Pages on every push to main
```

Status is **not** trusted from a static column in the sheet — it's computed
in the browser from each row's expiry date vs. today's date, so it never goes
stale:
- **Expired** — expiry date is in the past
- **Expiring soon** — expires within 30 days (change `EXPIRING_SOON_WINDOW_DAYS`
  in `src/utils/dateUtils.js` if you want a different window)
- **Valid** — more than 30 days out

## Updating the data

Open `src/data/complianceData.json`. Each entry looks like this:

```json
{
  "id": 1,
  "assetType": "Horse",
  "regNo": "KU8903",
  "documentType": "CROSS BORDER PERMIT",
  "routeDetail": "MW-ZIM",
  "expiryDate": "2027-04-25",
  "status": "VALID",
  "responsiblePerson": "-",
  "remarks": ""
}
```

Add, edit, or remove entries, commit, and push — the site rebuilds
automatically (see CI/CD below). `expiryDate` must be `YYYY-MM-DD`.

Later, if this gets wired up to a real system, this JSON file is the one
place to swap out for a live API call.

## Running it locally

You'll need [Node.js](https://nodejs.org) 18 or later.

```bash
npm ci --ignore-scripts   # install exact, locked versions; see note on npm safety below
npm run dev               # starts a local dev server, usually http://localhost:5173
```

To build the production version (what actually gets deployed):

```bash
npm run build      # outputs to dist/
npm run preview    # serve that dist/ build locally to sanity-check it
```

## Deploying to GitHub Pages

1. **Create the GitHub repo** and push this project to it.

2. **Set the `base` path** in `vite.config.js` to match your repo name:

   ```js
   base: '/YOUR-REPO-NAME/',
   ```

   If you're deploying to a user/org site (a repo literally named
   `yourusername.github.io`), set `base: '/'` instead.

3. **Turn on GitHub Pages via GitHub Actions**, one-time setup:
   - Go to your repo → **Settings → Pages**
   - Under "Build and deployment", set **Source** to **GitHub Actions**

4. **Push to `main`.** The included workflow
   (`.github/workflows/deploy.yml`) will automatically:
   - install dependencies from the locked versions in `package-lock.json`
   - run `npm audit` (informational — won't fail the build)
   - build the site
   - deploy `dist/` to GitHub Pages

   Check the **Actions** tab on GitHub to watch it run. After it finishes,
   your site will be live at:

   ```
   https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
   ```

That's it — every future push to `main` redeploys automatically. No manual
build/upload step needed.

## Step-by-step: from zero to a pushed repo

```bash
# 1. unzip this project, then inside the folder:
git init
git add .
git commit -m "Initial commit: Ulumba compliance tracker"

# 2. create an empty repo on GitHub (no README/gitignore, keep it empty), then:
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main

# 3. On GitHub: Settings → Pages → Source → "GitHub Actions"
# 4. Watch it deploy under the Actions tab
```

## A note on npm supply-chain safety

Given the recent run of npm supply-chain attacks (malicious packages using
`postinstall` scripts to steal credentials or spread themselves), this
project is set up defensively:

- **Minimal dependencies.** Only `react`, `react-dom`, `vite`, and the
  official Vite React plugin — nothing else. Fewer packages, fewer places
  for something malicious to hide.
- **Exact pinned versions** in `package.json` (no `^` or `~`), so installs
  are deterministic.
- **`package-lock.json` is committed.** Always install with `npm ci`
  (not `npm install`) locally and in CI — `npm ci` installs exactly what's
  in the lockfile and refuses to proceed if `package.json` and the lockfile
  disagree.
- **`--ignore-scripts`** on every install, locally and in CI. This is the
  single biggest lever against the recent worm-style attacks, since almost
  all of them rely on an install/postinstall script running arbitrary code
  the moment `npm install` runs. None of this project's dependencies need
  install scripts to work.
- **`npm audit`** runs in CI on every deploy (informational, doesn't block
  the build, but you'll see warnings in the Actions log).

If you add any new dependency later: check its weekly download count and
last-publish date on npmjs.com first, pin the exact version, and re-run
`npm audit` before committing the updated lockfile.

**Known accepted risk:** `npm audit` currently reports a moderate advisory
in `esbuild` (bundled inside Vite 5), which allows a malicious website to
send requests to the *local dev server* and read the response. It does not
affect the production build or the deployed static site — only your own
machine while `npm run dev` is running. If that matters for your setup,
avoid running `npm run dev` on an untrusted network, or upgrade to Vite 6+
later (a breaking change we've deliberately avoided for this prototype).

## Design notes

- Navy/gold palette to match Ulumba's existing document branding.
- The dashed gold line under the header is a deliberate nod to a road/route
  lane marker, fitting for a logistics fleet tool.
- Expired rows get a solid red left-edge + tinted red row background;
  expiring-soon rows get amber — both are visible even without color
  (the badge text also spells out "Expired" / "Expiring soon").
- Fully responsive down to mobile; table scrolls horizontally on narrow
  screens rather than squashing columns unreadably.
