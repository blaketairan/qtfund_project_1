#!/bin/bash

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

PID_FILE="$PROJECT_ROOT/bin/frontend.pid"
PORT=3000

echo "Stopping QTFund Frontend service..."

STOPPED=false

if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        echo "Stopping process (PID: $PID)..."
        
        PARENT_PID=$(ps -o ppid= -p "$PID" | tr -d ' ')
        if [ -n "$PARENT_PID" ] && [ "$PARENT_PID" != "1" ]; then
            kill -15 "$PARENT_PID" 2>/dev/null
            sleep 2
            if ps -p "$PARENT_PID" > /dev/null 2>&1; then
                kill -9 "$PARENT_PID" 2>/dev/null
            fi
        fi
        
        kill -15 "$PID" 2>/dev/null
        sleep 2
        
        if ps -p "$PID" > /dev/null 2>&1; then
            echo "Force killing process..."
            kill -9 "$PID" 2>/dev/null
        fi
        
        STOPPED=true
    else
        echo "Process not found (PID: $PID)"
    fi
    rm -f "$PID_FILE"
fi

PORT_PIDS=$(lsof -ti:$PORT 2>/dev/null)
if [ -n "$PORT_PIDS" ]; then
    echo "Cleaning up processes on port $PORT..."
    for PID in $PORT_PIDS; do
        kill -9 $PID 2>/dev/null
    done
    STOPPED=true
fi

WEBPACK_PIDS=$(pgrep -f "webpack.*qtfund")
if [ -n "$WEBPACK_PIDS" ]; then
    echo "Cleaning up webpack processes..."
    for PID in $WEBPACK_PIDS; do
        kill -9 $PID 2>/dev/null
    done
    STOPPED=true
fi

NPM_PIDS=$(pgrep -f "npm.*start" | xargs -I {} sh -c 'ps -o cmd= -p {} | grep -q qtfund && echo {}')
if [ -n "$NPM_PIDS" ]; then
    echo "Cleaning up npm processes..."
    for PID in $NPM_PIDS; do
        kill -9 $PID 2>/dev/null
    done
    STOPPED=true
fi

if [ "$STOPPED" = true ]; then
    echo "Frontend service stopped successfully!"
else
    echo "No frontend service was running"
fi

sleep 1
if lsof -ti:$PORT > /dev/null 2>&1; then
    echo "Warning: Port $PORT is still in use"
    exit 1
else
    echo "Port $PORT is now free"
fi

