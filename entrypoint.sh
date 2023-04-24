#!/bin/sh

ROOT_DIR=/app
FILE=$ROOT_DIR'/src/preferenses.js'

echo "Replacing env constants in JS"
sed -i 's|serverURL|'${SERVER_URL}'|g' $FILE

http-server dist
