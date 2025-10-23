#!/bin/bash

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

PID_FILE="$PROJECT_ROOT/bin/frontend.pid"
LOG_FILE="$PROJECT_ROOT/logs/frontend.log"
PORT=3000

mkdir -p "$PROJECT_ROOT/logs"

if [ -f "$PID_FILE" ]; then
    OLD_PID=$(cat "$PID_FILE")
    if ps -p "$OLD_PID" > /dev/null 2>&1; then
        echo "Frontend service is already running (PID: $OLD_PID)"
        exit 1
    else
        rm -f "$PID_FILE"
    fi
fi

PORT_CHECK=$(lsof -ti:$PORT 2>/dev/null)
if [ -n "$PORT_CHECK" ]; then
    echo "Port $PORT is already in use by process: $PORT_CHECK"
    echo "Stopping existing process..."
    kill -9 $PORT_CHECK 2>/dev/null
    sleep 2
fi

echo "Starting QTFund Frontend service..."
echo "Project root: $PROJECT_ROOT"
echo "Log file: $LOG_FILE"

nohup npm start > "$LOG_FILE" 2>&1 &
MAIN_PID=$!

sleep 3

if ps -p $MAIN_PID > /dev/null 2>&1; then
    WEBPACK_PID=$(pgrep -P $MAIN_PID webpack)
    if [ -n "$WEBPACK_PID" ]; then
        echo $WEBPACK_PID > "$PID_FILE"
        echo "Frontend service started successfully!"
        echo "Main PID: $MAIN_PID"
        echo "Webpack PID: $WEBPACK_PID (saved to $PID_FILE)"
        echo "Access URL: http://localhost:$PORT"
        echo ""
        echo "View logs: tail -f $LOG_FILE"
    else
        echo "Failed to start webpack dev server"
        kill -9 $MAIN_PID 2>/dev/null
        exit 1
    fi
else
    echo "Failed to start frontend service"
    echo "Check logs: $LOG_FILE"
    exit 1
fi

