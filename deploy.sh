#!/usr/bin/env bash
set -euo pipefail

TEN_PROJECT="projfeang21"
HOSTING_SITE="projfeang21"
PUBLIC_DIR="dist/sf3-character-manager/browser/"
SERVICE_ACCOUNT_PATH="projfeang21-firebase-adminsdk-dotr0-b8b3a3ccde.json"
SCRIPT_DIR="$(cd -- "$(dirname -- "$0")" && pwd)"
SERVICE_ACCOUNT="$SCRIPT_DIR/firebase/$SERVICE_ACCOUNT_PATH"

if [[ ! -f "$SERVICE_ACCOUNT" ]]; then
  echo "ERROR: Service Account not found: $SERVICE_ACCOUNT" >&2
  exit 1
fi

if command -v fnm >/dev/null 2>&1; then
  fnm use 22
else
  echo "WARN: fnm not found in PATH; assuming Node.js 22 is already active."
fi

export GOOGLE_APPLICATION_CREDENTIALS="$SERVICE_ACCOUNT"

npm run build
if [[ ! -f "$SCRIPT_DIR/$PUBLIC_DIR/index.html" ]]; then
  echo "ERROR: Build output not found: $SCRIPT_DIR/$PUBLIC_DIR/index.html" >&2
  exit 1
fi
firebase deploy --project "$TEN_PROJECT" --only hosting

echo "============================================================"
echo "DEPLOY SUCCESS"
echo "============================================================"
echo "Project: $TEN_PROJECT"
echo "Hosting site: $HOSTING_SITE"
echo "URL: https://${HOSTING_SITE}.firebaseapp.com/"
echo "URL: https://${HOSTING_SITE}.web.app/"
echo "============================================================"
