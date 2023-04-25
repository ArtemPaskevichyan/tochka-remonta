#!/bin/sh

ROOT_DIR=/app
FILE=$ROOT_DIR'/src/preferenses.js'

echo "Replacing env constants in JS"
for file in $ROOT_DIR/dist/assets/*.js;
do
  echo "Processing $file ...";

  sed -i 's|VUE_SERVER_URL|'${SERVER_URL}'|g' $file

done

http-server dist --proxy http://someurl.com
