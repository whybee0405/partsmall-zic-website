#!/usr/bin/env bash
#
# Production deploy: rebuilds the app image from the current source tree
# (uncommitted changes included — the build context is the local filesystem,
# not git) and restarts the container via docker-compose.prod.yml.
#
# Usage:
#   ./deploy.sh              interactive: shows a summary, asks to confirm
#   ./deploy.sh -y           skip the confirmation prompt
#   ./deploy.sh --no-check   skip the local `tsc --noEmit` pre-flight gate
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

COMPOSE_FILE="docker-compose.prod.yml"
SKIP_CONFIRM=false
SKIP_CHECK=false

for arg in "$@"; do
  case "$arg" in
    -y|--yes) SKIP_CONFIRM=true ;;
    --no-check) SKIP_CHECK=true ;;
    *)
      echo "Unknown option: $arg" >&2
      echo "Usage: $0 [-y|--yes] [--no-check]" >&2
      exit 1
      ;;
  esac
done

log() { echo "==> $*"; }
warn() { echo "!!  $*" >&2; }

# --- pre-flight ---------------------------------------------------------

if ! command -v docker >/dev/null 2>&1; then
  warn "docker is not installed or not on PATH."
  exit 1
fi

if ! docker ps >/dev/null 2>&1; then
  warn "Can't reach the Docker daemon (permission denied or it isn't running)."
  warn "If you were just added to the docker group, that only applies to new"
  warn "login sessions — open a fresh shell (or reconnect) and try again."
  warn "As a one-off workaround: sudo ./deploy.sh"
  exit 1
fi

if [ ! -f "$COMPOSE_FILE" ]; then
  warn "$COMPOSE_FILE not found — run this from the project root."
  exit 1
fi

if [ ! -f .env ]; then
  warn ".env not found. NEXT_PUBLIC_* variables (GA4 measurement ID, Search"
  warn "Console verification) are baked in at BUILD time — without .env,"
  warn "they silently stay disabled rather than failing loudly. Copy"
  warn ".env.example to .env and fill it in first if that's not intended."
  read -r -p "Continue anyway? [y/N] " reply
  [[ "$reply" =~ ^[Yy]$ ]] || exit 1
else
  # Read directly from .env rather than trusting the current shell's
  # environment — docker compose's ${VAR} substitution in
  # docker-compose.prod.yml reads .env the same way.
  GA_ID_IN_ENV=$(grep -E '^NEXT_PUBLIC_GA_MEASUREMENT_ID=' .env | tail -1 | cut -d= -f2-)
  if [ -z "$GA_ID_IN_ENV" ]; then
    warn "NEXT_PUBLIC_GA_MEASUREMENT_ID is empty in .env — GA4 will silently"
    warn "not load in this build. Not an error if that's intentional."
  else
    log "GA4 measurement ID for this build: $GA_ID_IN_ENV"
  fi
fi

if [ "$SKIP_CHECK" = false ]; then
  log "Type-checking (skip with --no-check)..."
  npx tsc --noEmit
fi

# --- summary + confirmation ---------------------------------------------

DIRTY_COUNT=$(git status --short 2>/dev/null | wc -l | tr -d ' ')
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

log "Branch:  $BRANCH @ $COMMIT"
if [ "$DIRTY_COUNT" != "0" ]; then
  warn "$DIRTY_COUNT uncommitted change(s) in the working tree — these WILL"
  warn "be included in the build (Docker builds from disk, not git HEAD)."
fi

if [ "$SKIP_CONFIRM" = false ]; then
  read -r -p "Rebuild and redeploy the production container now? [y/N] " reply
  [[ "$reply" =~ ^[Yy]$ ]] || { log "Aborted."; exit 1; }
fi

# --- build + deploy -------------------------------------------------------

log "Building and starting the app container..."
docker compose -f "$COMPOSE_FILE" up -d --build

log "Waiting for the container to come up..."
UP=false
for i in $(seq 1 15); do
  if curl -fsS -o /dev/null "http://127.0.0.1:3000/"; then
    UP=true
    break
  fi
  sleep 2
done

if [ "$UP" = false ]; then
  warn "Container didn't respond on 127.0.0.1:3000 after 30s."
  warn "Check logs: docker compose -f $COMPOSE_FILE logs --tail=100 app"
  exit 1
fi
log "Container is responding on 127.0.0.1:3000."

# The container responding only proves the server started — it doesn't
# prove build args actually made it into the bundle (this is exactly how
# GA4 silently went missing once already: build succeeded, container ran,
# tag just wasn't in the output). Check the real HTML, not just that it's up.
if [ -n "${GA_ID_IN_ENV:-}" ]; then
  if curl -fsS "http://127.0.0.1:3000/" | grep -q "googletagmanager.com/gtag/js?id=${GA_ID_IN_ENV}"; then
    log "Confirmed: GA4 tag ($GA_ID_IN_ENV) is present in the served HTML."
  else
    warn "GA4 measurement ID is set in .env but the tag is NOT in the served"
    warn "HTML. The build likely didn't receive it as a build arg — check"
    warn "docker-compose.prod.yml's build.args and the Dockerfile's ARG/ENV"
    warn "lines in the builder stage."
  fi
fi

echo
log "Deploy complete. If a reverse proxy (Caddy, nginx) sits in front of"
log "this container, no further action is needed — it proxies straight"
log "through. Verify the live domain directly to be sure."
