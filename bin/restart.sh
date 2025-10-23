#!/bin/bash

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "======================================"
echo "Restarting QTFund Frontend Service"
echo "======================================"
echo ""

bash "$PROJECT_ROOT/bin/stop.sh"

echo ""
echo "Waiting 3 seconds before restart..."
sleep 3
echo ""

bash "$PROJECT_ROOT/bin/start.sh"

