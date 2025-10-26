#!/bin/bash

echo "Starting QTFund Frontend..."

if ! command -v npm >/dev/null 2>&1; then
    echo "Error: npm is not installed"
    echo "Please run: ./bin/setup.sh first"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo "Error: package.json not found"
    echo "Please ensure you are in the project root directory"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "Dependencies not installed. Running setup..."
    ./bin/setup.sh
    if [ $? -ne 0 ]; then
        echo "Error: Setup failed"
        exit 1
    fi
fi

PORT_CHECK=$(lsof -i :3000 2>/dev/null)
if [ -n "$PORT_CHECK" ]; then
    echo "Warning: Port 3000 is already in use"
    pgrep -f "webpack.*serve" >/dev/null
    if [ $? -eq 0 ]; then
        echo "Application is already running"
        exit 0
    else
        echo "Error: Port 3000 is in use by another application"
        exit 1
    fi
fi

WEBPACK_PROCESS=$(pgrep -f "webpack.*serve")
if [ -n "$WEBPACK_PROCESS" ]; then
    echo "Webpack dev server is already running (PID: $WEBPACK_PROCESS)"
    exit 0
fi

echo "Starting webpack dev server on port 3000..."
npm run start > /dev/null 2>&1 &
WEBPACK_PID=$!

sleep 3

if pgrep -f "webpack.*serve" >/dev/null; then
    echo "✓ Application started successfully"
    echo "PID: $WEBPACK_PID"
    echo "Access at: http://localhost:3000"
else
    echo "✗ Failed to start application"
    exit 1
fi

