#!/usr/bin/env bash
# Build the Jekyll site and deploy _site/ to Netlify production.
set -euo pipefail

cd "$(dirname "$0")"

SITE_ID="56dc7cda-3373-4cc4-8dd1-99ce2b350158"

bundle exec jekyll build

# Refuse to publish anything secret-looking.
leaks=$(find _site \( -name '.*' -o -name '*.pem' -o -name '*.key' -o -name 'credentials*' \) -print)
if [[ -n "$leaks" ]]; then
  echo "Refusing to deploy; suspicious files in _site:" >&2
  echo "$leaks" >&2
  exit 1
fi

netlify deploy --prod --dir _site --site "$SITE_ID" "$@"
