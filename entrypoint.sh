ROOT_DIR=/app

echo "Replacing env constants in JS"
for file in $ROOT_DIR/dist/assets/*.js;
do
  echo "Processing $file ...";

  sed -i 's|serverURL|'${serverURL}'|g' $file

done

http-server dist