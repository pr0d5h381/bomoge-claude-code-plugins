#!/bin/bash
# Detect web framework from package.json

PACKAGE_JSON="${1:-package.json}"

if [ ! -f "$PACKAGE_JSON" ]; then
  echo "unknown"
  exit 0
fi

# Check for frameworks in order of specificity
if grep -q '"next"' "$PACKAGE_JSON"; then
  echo "nextjs"
elif grep -q '"nuxt"' "$PACKAGE_JSON"; then
  echo "nuxt"
elif grep -q '"@sveltejs/kit"' "$PACKAGE_JSON"; then
  echo "sveltekit"
elif grep -q '"@remix-run' "$PACKAGE_JSON"; then
  echo "remix"
elif grep -q '"astro"' "$PACKAGE_JSON"; then
  echo "astro"
elif grep -q '"gatsby"' "$PACKAGE_JSON"; then
  echo "gatsby"
elif grep -q '"react"' "$PACKAGE_JSON"; then
  echo "react"
elif grep -q '"vue"' "$PACKAGE_JSON"; then
  echo "vue"
else
  echo "unknown"
fi
