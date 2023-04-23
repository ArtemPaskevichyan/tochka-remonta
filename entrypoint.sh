#!/bin/sh

ROOT_DIR=/app

echo "Replacing env constants in JS"
do
  echo "Processing ...";
  sed -i 's|serverURL|'${SERVER_URL}'|g' $ROOT_DIR'/src/preferenses.js'

done

http-server dist
