# Docker for dev & prod — design

## Context

This is a single-page Next.js 15 marketing site (SK ZIC South Africa), no CMS, no database,
no external services besides static assets. It will be deployed to a brand-new, currently
empty Hetzner VPS. It is explicitly the first of a series of near-identical house-brand
landing pages (PMC, Wingster, Essence follow later), but per user decision this design covers
**only this one site** — no shared/multi-site reverse proxy scaffolding yet. That gets
revisited when the second site is actually being built.

The developer works on Windows locally. `next dev` and `npm install` currently run bare
(no Docker) — this design adds Docker as the way to run the app in both dev and prod without
removing the ability to run bare `next dev` locally.

## Goals

- One Dockerfile, two targets: `dev` (hot reload) and `runner` (production).
- Dev: `docker compose up` serves the app on `localhost:3000` with hot reload on file edits.
- Prod: `docker compose -f docker-compose.prod.yml up -d --build` serves the app over HTTPS
  on the real domain, TLS handled automatically.
- Deploy flow is manual SSH + `git pull` + compose rebuild — no CI/registry required.

## Non-goals

- Multi-site / shared reverse proxy setup for future house-brand sites — deferred.
- CI/CD pipeline (GitHub Actions build+push) — deferred; can be added later without changing
  the Dockerfile itself.
- Any external TLS provider (Cloudflare tunnel/proxy) — Caddy in-container handles TLS.

## Architecture

### Dockerfile (multi-stage)

- `base` stage: `node:20-alpine` (or current LTS matching `@types/node` in package.json),
  sets workdir, copies `package.json`/`package-lock.json`.
- `deps` stage: `npm ci` (installs full deps, including devDependencies — needed for both
  `next dev` and `next build`).
- `dev` target: built from `deps`, copies source, runs `next dev`. Source is bind-mounted
  at runtime via compose, so the COPY here mainly matters for building the image once with
  deps installed.
- `builder` stage: from `deps`, copies full source, runs `next build`. Requires
  `next.config.mjs` to set `output: 'standalone'` so the build emits a minimal
  standalone server (`./.next/standalone`) plus `./.next/static` and `./public`.
- `runner` target: minimal `node:20-alpine`, copies only `.next/standalone`, `.next/static`,
  and `public` from `builder`. Runs `node server.js`. This is the production image — no
  devDependencies, no full `node_modules`, no source tree.

### .dockerignore

Excludes `node_modules`, `.next`, `.git`, `scratch/`, and other local-only artifacts so the
build context stays small and host `node_modules` (Windows-built) never leaks into the image.

### docker-compose.yml (dev)

- One service, `app`, building the `dev` target.
- Bind-mounts the repo root into `/app`.
- Uses a **named volume** for `/app/node_modules` so the container's own Linux-built
  `node_modules` persists across restarts and is never shadowed by the host bind mount
  (host is Windows; native binaries in `node_modules` are platform-specific and would break
  if mounted from the host).
- Publishes `3000:3000`.
- No environment variables required — the site has no external services.

### docker-compose.prod.yml (prod)

- `app` service: builds the `runner` target. Not published to the host directly — only
  reachable from other containers on the compose network.
- `caddy` service: official `caddy` image, mounts a `Caddyfile` from the repo plus named
  volumes for `caddy_data`/`caddy_config` (so certificates persist across restarts/rebuilds).
  Publishes `80:80` and `443:443` — the only ports exposed on the VPS.
- `Caddyfile` contains the real domain and `reverse_proxy app:3000`; Caddy requests and
  renews the Let's Encrypt certificate automatically. Requires the domain's DNS A record to
  already point at the VPS's IP before first boot.

### next.config.mjs change

Add `output: 'standalone'` to the existing config object. No other changes needed — this
only affects the `next build` output shape, not dev behavior or existing `images.formats`.

## Dev workflow

1. `docker compose up` (or `--build` after adding a dependency).
2. Edit files on Windows as normal — the bind mount means the running container picks up
   changes immediately; Next.js hot-reloads.
3. Adding a package (`npm install <pkg>` inside the container, or editing `package.json` and
   rebuilding) requires `docker compose up --build` to reinstall into the named volume.
4. Bare `next dev` outside Docker continues to work unchanged; the two are not exclusive.

## Prod workflow

**First deploy:**
1. Point the domain's DNS A record at the VPS IP.
2. Clone the repo on the VPS.
3. Set the real domain in `Caddyfile` (or via an env var substituted into it — exact
   mechanism decided during implementation).
4. `docker compose -f docker-compose.prod.yml up -d --build`.
5. Caddy obtains the TLS cert automatically on first request.

**Subsequent deploys:**
1. SSH into the VPS.
2. `git pull`.
3. `docker compose -f docker-compose.prod.yml up -d --build` — rebuilds only the `app`
   image (source changed), restarts just that container. Caddy keeps running, so the
   certificate is not re-requested.

## Testing / verification

- Dev: `docker compose up`, confirm `localhost:3000` loads and hot reload works on an edit.
- Prod (local smoke test before shipping to VPS): build the `runner` target locally
  (`docker build --target runner .`) and confirm `docker run` serves the site correctly
  before relying on it on the VPS.
- On the VPS: confirm HTTPS loads on the real domain and that a second `up -d --build` after
  a `git pull` restarts cleanly with no downtime-worthy gap.

## Open items for implementation

- Exact Node base image version (should match or exceed what `@types/node` implies — Node 20
  LTS is the safe default as of this writing).
- Whether the domain is substituted into `Caddyfile` via a committed placeholder edited on
  the VPS, or via a `.env` + Caddy's env-var support — small implementation detail, doesn't
  change the architecture above.
