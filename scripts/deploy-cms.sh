#!/usr/bin/env bash
# Deploys the CloudIA CMS service of a site with the version rule of the built-in updater
# (docs/UPDATER.md section 5): start the higher of the git baseline and the version the host
# helper cloudia-updater installed last, never a lower one. Copy it into the site repository and
# adjust the settings below.
#
#   ./scripts/deploy-cms.sh             # wait for a running update, pull and start the cms service
#   ./scripts/deploy-cms.sh version     # print the version to start, for other compose commands:
#   export CLOUDIA_CMS_VERSION=$(./scripts/deploy-cms.sh version)
#
# Or source it from an existing deploy script and call cms_effective_version and cms_deploy.
# cms_deploy waits for the helper's lock, exports CLOUDIA_CMS_VERSION, checks that the backups and
# updater directories belong to the container user, then pulls and starts the service.

# --- Settings (environment variables override them; paths are relative to CMS_COMPOSE_DIR)
CMS_INSTANCE=${CMS_INSTANCE:-skzic}                 # the --instance given to install.sh
CMS_COMPOSE_DIR=${CMS_COMPOSE_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}                  # where docker compose runs
CMS_BASELINE_FILE=${CMS_BASELINE_FILE:-cloudia/cms-version} # tracked git baseline
CMS_BACKUPS_DIR=${CMS_BACKUPS_DIR:-/home/jamie/cms-backups/skzic}             # mounted at /app/backups
CMS_UPDATER_DIR=${CMS_UPDATER_DIR:-cloudia-updater}         # mounted at /app/updater
CMS_SERVICE=${CMS_SERVICE:-cms}
CMS_STATE_DIR=${CMS_STATE_DIR:-/var/lib/cloudia-updater/$CMS_INSTANCE}
CMS_LOCK_WAIT=${CMS_LOCK_WAIT:-600} # seconds to wait for a running update
CMS_UID=1000                        # the container user (node)
# The compose command; set the array before sourcing to add --env-file, -f or -p.
if ! declare -p CMS_COMPOSE >/dev/null 2>&1; then CMS_COMPOSE=(docker compose -f docker-compose.prod.yml); fi

# Prints the version on the first line of a file, or nothing when it is missing.
cms_read_version() {
  local v=''
  [[ -f $1 ]] || return 0
  IFS= read -r v <"$1" || true
  v=${v//[[:space:]]/}
  if [[ ! $v =~ ^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$ ]]; then
    echo "deploy-cms: $1 does not hold a version like 1.4.0: '$v'" >&2
    return 1
  fi
  printf '%s' "$v"
}

# True when strict semver $1 is greater than $2 (numeric per part, no sort -V).
cms_version_gt() {
  local -a a b
  local i
  IFS=. read -r -a a <<<"$1"
  IFS=. read -r -a b <<<"$2"
  for i in 0 1 2; do
    if ((10#${a[i]} > 10#${b[i]})); then return 0; fi
    if ((10#${a[i]} < 10#${b[i]})); then return 1; fi
  done
  return 1
}

# Prints the higher of the baseline and the helper's version file. Fails when neither holds a
# version, or when one is damaged: starting the other could be a downgrade.
cms_effective_version() (
  cd "$CMS_COMPOSE_DIR" || exit 1
  base=$(cms_read_version "$CMS_BASELINE_FILE") || exit 1
  state=$(cms_read_version "$CMS_STATE_DIR/version") || exit 1
  version=$base
  if [[ -n $state ]] && { [[ -z $version ]] || cms_version_gt "$state" "$version"; }; then
    version=$state
  fi
  if [[ -z $version ]]; then
    echo "deploy-cms: no version: create $CMS_BASELINE_FILE (for example 1.4.0) and commit it" >&2
    exit 1
  fi
  echo "deploy-cms: CloudIA CMS $version (baseline ${base:-none}, updater ${state:-none})" >&2
  printf '%s\n' "$version"
)

# Makes a bind-mounted directory exist and belong to the container user.
cms_owned_dir() {
  local dir=$1 owner
  [[ $dir == /* ]] || dir=$PWD/$dir
  if [[ ! -d $dir ]]; then
    if ((EUID == 0)); then
      mkdir -p "$dir" || return 1
    else
      echo "deploy-cms: $dir does not exist. Create it for the container user (uid $CMS_UID):" >&2
      echo "  sudo mkdir -p $(printf '%q' "$dir") && sudo chown $CMS_UID:$CMS_UID $(printf '%q' "$dir")" >&2
      return 1
    fi
  fi
  owner=$(stat -c '%u:%g' "$dir") || return 1
  [[ $owner == "$CMS_UID:$CMS_UID" ]] && return 0
  if ((EUID == 0)); then
    chown "$CMS_UID:$CMS_UID" "$dir" || return 1
    return 0
  fi
  echo "deploy-cms: $dir is owned by $owner; the CMS (uid $CMS_UID) cannot write to it. Run:" >&2
  echo "  sudo chown $CMS_UID:$CMS_UID $(printf '%q' "$dir")" >&2
  return 1
}

# The helper's lock: /run/cloudia-updater/<instance>.lock, or STATE_DIR/lock where /run is not
# writable. Prints nothing when neither exists and none can be created (no helper has run).
cms_lock_file() {
  local run=/run/cloudia-updater
  if ((EUID == 0)) && mkdir -p "$run" 2>/dev/null; then
    printf '%s' "$run/$CMS_INSTANCE.lock"
  elif [[ -e $run/$CMS_INSTANCE.lock ]]; then
    printf '%s' "$run/$CMS_INSTANCE.lock"
  elif [[ -e $CMS_STATE_DIR/lock ]]; then
    printf '%s' "$CMS_STATE_DIR/lock"
  elif [[ -d $run && -w $run ]]; then
    printf '%s' "$run/$CMS_INSTANCE.lock"
  fi
}

# Runs in a subshell, so the lock is released when it returns. Every step checks its own result:
# set -e does not apply when the caller writes `cms_deploy || ...`.
cms_deploy() (
  cd "$CMS_COMPOSE_DIR" || exit 1

  # One update or deploy at a time: the helper holds this lock for a whole update.
  lock=$(cms_lock_file)
  if [[ -n $lock ]] && command -v flock >/dev/null 2>&1; then
    # flock needs only a readable descriptor, so a deploy user can wait on root's lock file.
    if [[ -w $lock || ! -e $lock ]]; then exec 9>>"$lock" || exit 1; else exec 9<"$lock" || exit 1; fi
    if ! flock -n 9; then
      echo "deploy-cms: an update is in progress; waiting up to $CMS_LOCK_WAIT s"
      flock -w "$CMS_LOCK_WAIT" 9 || {
        echo 'deploy-cms: an update is still in progress; try again later' >&2
        exit 1
      }
    fi
  elif [[ -n $lock && -d $lock.d ]]; then
    # The helper's fallback without flock is a lock directory.
    echo "deploy-cms: an update is in progress ($lock.d exists); try again later" >&2
    exit 1
  fi

  # Read after the lock: an update that just finished may have raised the version file.
  version=$(cms_effective_version) || exit 1
  export CLOUDIA_CMS_VERSION=$version

  owned=1
  cms_owned_dir "$CMS_BACKUPS_DIR" || owned=0
  cms_owned_dir "$CMS_UPDATER_DIR" || owned=0
  ((owned)) || exit 1

  "${CMS_COMPOSE[@]}" pull "$CMS_SERVICE" || exit 1
  "${CMS_COMPOSE[@]}" up -d "$CMS_SERVICE" || exit 1
)

# Run directly: deploy, or print the version. Sourced: only define the functions.
if [[ ${BASH_SOURCE[0]} == "$0" ]]; then
  case ${1:-deploy} in
    deploy) cms_deploy ;;
    version) cms_effective_version ;;
    *)
      echo "usage: $0 [deploy|version]" >&2
      exit 2
      ;;
  esac
fi
