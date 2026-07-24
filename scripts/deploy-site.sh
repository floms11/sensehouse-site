#!/usr/bin/env bash
#
# One-shot production deploy for the Sense House website.
#
# The runnable copy lives at /opt/sensehouse-site/deploy.sh and is exposed as
# the `sensehouse-site-deploy` command. This file in the repository is the
# source of truth; after changing it, refresh the server copy with:
#
#   sudo install -o sensehouse-site -g sensehouse-site -m 0755 \
#     /opt/sensehouse-site/app/scripts/deploy-site.sh \
#     /opt/sensehouse-site/deploy.sh
#
set -euo pipefail

APP_DIR=/opt/sensehouse-site/app
ENV_FILE=/etc/sensehouse-site.env
BRANCH="${DEPLOY_BRANCH:-main}"
SERVICE=sensehouse-site.service

step() { printf '\n\033[1;34m▶ %s\033[0m\n' "$*"; }

cd "$APP_DIR"

step "1/4  Fetch & checkout origin/${BRANCH}"
git fetch --prune origin
git reset --hard "origin/${BRANCH}"
git --no-pager log -1 --oneline

step "2/4  Install dependencies"
npm ci --include=dev

step "3/4  Build"
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a
npm run build

step "4/4  Restart ${SERVICE}"
sudo systemctl restart "$SERVICE"
sleep 3

if systemctl is-active --quiet "$SERVICE"; then
  echo "  → active"
else
  echo "  ✖ service not active — inspect: journalctl -u ${SERVICE} -n 50" >&2
  exit 1
fi

step "Deploy complete."
