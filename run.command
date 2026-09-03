#!/bin/bash
# Double-click this file in Finder to launch the Skill Tree app.
cd "$(dirname "$0")" || exit 1

PORT=8765
while lsof -i :$PORT >/dev/null 2>&1; do PORT=$((PORT + 1)); done

echo "Skill Tree running at http://127.0.0.1:$PORT"
echo "Close this window (or press Ctrl-C) to stop the app."

python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 &
SERVER_PID=$!
trap 'kill $SERVER_PID 2>/dev/null' EXIT

sleep 1
open "http://127.0.0.1:$PORT/index.html"
wait $SERVER_PID
