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
    if pgrep -f "webpack|serve|http.server" >/dev/null; then
        echo "Application is already running"
        exit 0
    else
        echo "Error: Port 3000 is in use by another application"
        exit 1
    fi
fi

SERVER_PROCESS=$(pgrep -f "webpack|serve|http.server")
if [ -n "$SERVER_PROCESS" ]; then
    echo "Application is already running (PID: $SERVER_PROCESS)"
    exit 0
fi

echo "Building production bundle..."
npm run build > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "✗ Build failed"
    exit 1
fi

echo "Starting production server on port 3000..."

if command -v npx >/dev/null 2>&1; then
    npx serve -s dist -l 3000 > /dev/null 2>&1 &
    SERVER_PID=$!
elif command -v python3 >/dev/null 2>&1; then
    cd dist && python3 -m http.server 3000 > /dev/null 2>&1 &
    SERVER_PID=$!
    cd ..
else
    echo "Error: No static server available (install npx or python3)"
    exit 1
fi

sleep 2

if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✓ Application started successfully"
    echo "PID: $SERVER_PID"
    echo "Access at: http://localhost:3000"
    echo "Mode: Production (static files from dist/)"
else
    echo "✗ Failed to start application"
    exit 1
fi

