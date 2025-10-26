#!/bin/bash

echo "Stopping QTFund Frontend..."

WEBPACK_PROCESS=$(pgrep -f "webpack|serve|http.server")
if [ -z "$WEBPACK_PROCESS" ]; then
    echo "Application is already stopped"
    exit 0
fi

echo "Found application process (PID: $WEBPACK_PROCESS)"
echo "Sending TERM signal..."
kill -TERM $WEBPACK_PROCESS 2>/dev/null

sleep 2

if pgrep -f "webpack|serve|http.server" >/dev/null; then
    echo "Process still running, sending KILL signal..."
    pkill -f webpack
    pkill -f "serve"
    pkill -f "http.server"
    sleep 1
fi

if pgrep -f "webpack|serve|http.server" >/dev/null; then
    echo "✗ Failed to stop application"
    exit 1
fi

echo "✓ Application stopped"

PORT_CHECK=$(lsof -i :3000 2>/dev/null)
if [ -z "$PORT_CHECK" ]; then
    echo "✓ Port 3000 is released"
else
    echo "Warning: Port 3000 may still be in use"
fi

exit 0

