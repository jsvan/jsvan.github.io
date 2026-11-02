#!/bin/sh
# Make the WebP files the site loads from the JPG/PNG masters in images/.
# Each card image gets x.webp (at most 1600 wide) and x-960.webp for phones;
# app.js pairs them in a srcset. The wallpaper gets one full-size WebP.
# Needs cwebp (brew install webp). Run from anywhere: sh tools/make-images.sh
set -e
cd "$(dirname "$0")/../images"

for src in *.jpg *.png; do
  name="${src%.*}"
  case "$src" in
    flower-wallpaper.png) continue ;;  # unused original; the site tiles the JPG
    flower-wallpaper.jpg) cwebp -quiet -q 75 "$src" -o "$name.webp"; continue ;;
  esac
  width=$(sips -g pixelWidth "$src" | awk '/pixelWidth/ {print $2}')
  big=$(( width < 1600 ? width : 1600 ))
  small=$(( width < 960 ? width : 960 ))
  cwebp -quiet -q 80 -resize "$big" 0 "$src" -o "$name.webp"
  cwebp -quiet -q 80 -resize "$small" 0 "$src" -o "$name-960.webp"
done
ls -l *.webp | awk '{s += $5} END {print NR " webp files, " s " bytes"}'
