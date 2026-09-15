#!/usr/bin/env bash
set -euo pipefail
ROOT="/workspace"
STAGING="/tmp/otterehr-optometry-pack"
ZIP_NAME="otterehr-optometry-pack.zip"
OUT_PUBLIC="$ROOT/otterehr-optometry/public/$ZIP_NAME"
OUT_ARTIFACTS="/opt/cursor/artifacts/$ZIP_NAME"
OUT_ROOT="$ROOT/$ZIP_NAME"

rm -rf "$STAGING"
mkdir -p "$STAGING/otterehr-optometry-pack" "$ROOT/otterehr-optometry/public" /opt/cursor/artifacts

mkdir -p "$STAGING/otterehr-optometry-pack"
tar -C "$ROOT/otterehr-optometry" \
  --exclude node_modules \
  --exclude .next \
  --exclude tsconfig.tsbuildinfo \
  --exclude 'public/*.zip' \
  -cf - . | tar -C "$STAGING/otterehr-optometry-pack" -xf -

cat > "$STAGING/otterehr-optometry-pack/PREVIEW.txt" <<'EOF'
OtterEHR Optometry pack
=======================

Live preview (this VM):
  cd otterehr-optometry && npm install && npm run build && npm start
  Open http://localhost:3010/ehr

Contents
  src/                 fillable forms app
  drop-in/             TypeScript + FHIR to merge into masslight/ottehr
  drop-in/fhir/        54 Questionnaire JSON files
  README.md            wiring steps

Production Ottehr still needs a free Oystehr account (PROJECT_ID + M2M).
This zip is the clinical content plus a local EHR board preview.
EOF

(
  cd "$STAGING"
  zip -qr "$OUT_ROOT" otterehr-optometry-pack
)

cp -f "$OUT_ROOT" "$OUT_PUBLIC"
cp -f "$OUT_ROOT" "$OUT_ARTIFACTS"
ls -lh "$OUT_ROOT" "$OUT_ARTIFACTS"
