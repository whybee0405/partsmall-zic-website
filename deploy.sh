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
  warn ".env not found. RESEND_* (enquiry email) and NEXT_PUBLIC_GSC_VERIFICATION"
  warn "come from it; without it they silently stay disabled. Copy .env.example"
  warn "to .env and fill it in first if that's not intended."
  read -r -p "Continue anyway? [y/N] " reply
  [[ "$reply" =~ ^[Yy]$ ]] || exit 1
fi
if [ ! -f cloudia/cms.env ]; then
  warn "cloudia/cms.env not found — copy cloudia/cms.env.example and fill it in."
  exit 1
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

# The CMS first, at the version rule's version (scripts/deploy-cms.sh), then the site.
log "Starting the CloudIA CMS..."
./scripts/deploy-cms.sh
export CLOUDIA_CMS_VERSION=$(./scripts/deploy-cms.sh version)

log "Building and starting the app container..."
docker compose -f "$COMPOSE_FILE" up -d --build app

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

# The container responding only proves the server started. Check that the
# page really rendered from the CMS (a product name only the CMS supplies).
if curl -fsS "http://127.0.0.1:3000/" | grep -q "ZIC X7"; then
  log "Confirmed: the homepage renders products from CloudIA."
else
  warn "The homepage did not render CMS products — check: docker compose -f $COMPOSE_FILE logs --tail=50 app cms"
fi

echo
log "Deploy complete. If a reverse proxy (Caddy, nginx) sits in front of"
log "this container, no further action is needed — it proxies straight"
log "through. Verify the live domain directly to be sure."
