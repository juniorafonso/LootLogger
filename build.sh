#!/bin/sh -e

LINUX=0

while getopts 'l' flag; do
  case "${flag}" in
    l) LINUX=1 ;;
  esac
done

if [[ "$LINUX" -eq 1 ]]; then
  OUTPUT_FILE="loot-logger-linux"
else
  OUTPUT_FILE="loot-logger-win.exe"
fi

set -x

# make sure we have a node_modules with only production dependencies
rm -rf node_modules && npm install --omit=dev

# clear old builds (if any)
rm -rf loot-logger && mkdir -p loot-logger

# copy assets that needs to be packaged
cp -r node_modules/ src/ loot-logger

cp package.json loot-logger

# install dependencies needes to package the app
npm install --no-save caxa

# package the app
npx caxa --input loot-logger --output "${OUTPUT_FILE}" -- '{{caxa}}/node_modules/.bin/node' '{{caxa}}/src/index.js'

# inject the ico and metadata into the .exe file
if [[ "$LINUX" -eq 0 ]]; then
  echo "Adding icon and metadata to Windows executable..."
  curl -L -O https://github.com/electron/rcedit/releases/latest/download/rcedit-x64.exe

  ./rcedit-x64.exe "${OUTPUT_FILE}" --set-icon "assets/logo.ico"
  ./rcedit-x64.exe "${OUTPUT_FILE}" --set-version-string "ProductName" "Albion Online Loot Logger"
  ./rcedit-x64.exe "${OUTPUT_FILE}" --set-version-string "FileDescription" "Transparent loot logging tool for Albion Online"
  ./rcedit-x64.exe "${OUTPUT_FILE}" --set-version-string "CompanyName" "Community Fork"
  ./rcedit-x64.exe "${OUTPUT_FILE}" --set-version-string "LegalCopyright" "Open Source Project - MIT License"
  ./rcedit-x64.exe "${OUTPUT_FILE}" --set-file-version "1.2.5.0"
  ./rcedit-x64.exe "${OUTPUT_FILE}" --set-product-version "1.2.5.0"

  rm -rf rcedit-x64.exe
  echo "Metadata added successfully!"
fi
