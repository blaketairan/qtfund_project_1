#!/bin/bash

echo "Checking QTFund Frontend health..."

WEBPACK_PROCESS=$(pgrep -f "webpack")
if [ -z "$WEBPACK_PROCESS" ]; then
    echo "✗ Application is not running"
    exit 1
fi

echo "✓ Process is running (PID: $WEBPACK_PROCESS)"

PORT_CHECK=$(lsof -i :3000 2>/dev/null)
if [ -z "$PORT_CHECK" ]; then
    echo "✗ Port 3000 is not listening"
    exit 1
fi

echo "✓ Port 3000 is listening"

HTTP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")
if [ "$HTTP_RESPONSE" = "200" ]; then
    echo "✓ HTTP response: 200 OK"
    echo "✓ Application is healthy"
    exit 0
elif [ "$HTTP_RESPONSE" = "000" ]; then
    echo "✗ Unable to connect to http://localhost:3000"
    exit 1
else
    echo "✗ HTTP response: $HTTP_RESPONSE"
    exit 1
fi

