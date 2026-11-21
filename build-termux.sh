#!/data/data/com.termux/files/usr/bin/bash
set -e
pkg update -y
pkg install -y zip
cd "$(dirname "$0")"
zip -r pc-mouse-minimal.zip manifest.json popup.html popup.css popup.js src README.md
echo "Creado: $(pwd)/pc-mouse-minimal.zip"
