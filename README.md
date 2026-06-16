# SampTA — Upcoming Conference Content

Dedicated repository for the **"Upcoming Conference"** text and images, edited
through **Decap CMS**. It is intentionally decoupled from the main website code
so conference organizers and editors with access can update content without
touching site infrastructure.

## What's here

- `content/upcoming.md` — the editable upcoming-conference content (the only
  content file).
- `images/` — uploaded media, served at `https://upcoming.sampta.org/images/`.
- `admin/` — the Decap CMS portal (`config.yml`, `index.html`, custom
  `preview.js`). Reached at `https://upcoming.sampta.org/admin/`.
- `index.html` — redirects the bare domain to `/admin/`.
- `.github/workflows/trigger-sampta-rebuild.yml` — on every push to `main`,
  pings the main site's Netlify build hook so `sampta.org` rebuilds and
  refetches this content.

## How publishing works

Editors sign in to the CMS with GitHub (OAuth app brokered by Netlify's OAuth
endpoint), edit the content, and click **Publish**. Decap commits straight to
`main` (immediate publish — `editorial_workflow` is deliberately **off**). The
push triggers the GitHub Action, which rebuilds the main site. The main site
fetches `content/upcoming.md` at build time, so the change goes live within one
rebuild.

> Full system reference (hosting, fetch mechanism, security, the other admin
> panel) lives in the main repo: `SampTA/ARCHITECTURE.md`.
