#!/usr/bin/env bash
# Local secret scan for first-party trees. Does not print secret values.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if ! command -v gitleaks >/dev/null 2>&1; then
  echo "gitleaks is required. Install: https://github.com/gitleaks/gitleaks" >&2
  exit 1
fi

REPORT="${TMPDIR:-/tmp}/gitleaks-codex-universal.json"
gitleaks detect \
  --source "$ROOT" \
  --config "$ROOT/.gitleaks.toml" \
  --log-opts="--all" \
  --report-path "$REPORT" \
  --report-format json \
  --no-banner

COUNT="$(python3 -c 'import json,sys; print(len(json.load(open(sys.argv[1]))) )' "$REPORT" 2>/dev/null || echo 0)"
if [[ "$COUNT" != "0" ]]; then
  echo "gitleaks reported $COUNT finding(s). Open $REPORT locally; do not paste secret values into chat or tickets." >&2
  exit 1
fi

echo "gitleaks: no leaks found"
