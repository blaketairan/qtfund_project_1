#!/bin/bash

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

PID_FILE="$PROJECT_ROOT/bin/frontend.pid"
LOG_FILE="$PROJECT_ROOT/logs/frontend.log"
PORT=3000
HOST="localhost"

echo "======================================"
echo "QTFund Frontend Health Check"
echo "======================================"
echo "Time: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

STATUS="UNKNOWN"
EXIT_CODE=1

if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    echo "PID File: $PID_FILE"
    echo "Process ID: $PID"
    
    if ps -p "$PID" > /dev/null 2>&1; then
        echo "Process Status: ✓ Running"
        
        CPU=$(ps -p "$PID" -o %cpu= | tr -d ' ')
        MEM=$(ps -p "$PID" -o %mem= | tr -d ' ')
        UPTIME=$(ps -p "$PID" -o etime= | tr -d ' ')
        
        echo "CPU Usage: ${CPU}%"
        echo "Memory Usage: ${MEM}%"
        echo "Uptime: $UPTIME"
    else
        echo "Process Status: ✗ Not Running"
        STATUS="STOPPED"
    fi
else
    echo "PID File: Not Found"
    echo "Process Status: ✗ Not Running"
    STATUS="STOPPED"
fi

echo ""
echo "--------------------------------------"
echo "Port Check:"
echo "--------------------------------------"

PORT_PID=$(lsof -ti:$PORT 2>/dev/null)
if [ -n "$PORT_PID" ]; then
    echo "Port $PORT: ✓ In Use (PID: $PORT_PID)"
    
    if command -v curl > /dev/null 2>&1; then
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://${HOST}:${PORT}" --connect-timeout 3)
        if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "304" ]; then
            echo "HTTP Response: ✓ $HTTP_CODE OK"
            STATUS="HEALTHY"
            EXIT_CODE=0
        else
            echo "HTTP Response: ✗ $HTTP_CODE"
            STATUS="UNHEALTHY"
        fi
    else
        if [ -n "$PORT_PID" ] && ps -p "$PORT_PID" > /dev/null 2>&1; then
            STATUS="RUNNING"
            EXIT_CODE=0
        fi
    fi
else
    echo "Port $PORT: ✗ Not In Use"
    STATUS="STOPPED"
fi

echo ""
echo "--------------------------------------"
echo "Service Status:"
echo "--------------------------------------"

case $STATUS in
    "HEALTHY")
        echo "Status: ✓ HEALTHY"
        echo "Service is running and responding"
        ;;
    "RUNNING")
        echo "Status: ⚠ RUNNING (HTTP check unavailable)"
        echo "Service appears to be running"
        ;;
    "UNHEALTHY")
        echo "Status: ✗ UNHEALTHY"
        echo "Service is running but not responding correctly"
        ;;
    "STOPPED")
        echo "Status: ✗ STOPPED"
        echo "Service is not running"
        ;;
    *)
        echo "Status: ? UNKNOWN"
        echo "Unable to determine service status"
        ;;
esac

echo ""
echo "--------------------------------------"
echo "Additional Information:"
echo "--------------------------------------"
echo "Project Root: $PROJECT_ROOT"
echo "Service URL: http://${HOST}:${PORT}"

if [ -f "$LOG_FILE" ]; then
    LOG_SIZE=$(du -h "$LOG_FILE" | cut -f1)
    echo "Log File: $LOG_FILE (${LOG_SIZE})"
    echo ""
    echo "Last 5 log lines:"
    tail -5 "$LOG_FILE" 2>/dev/null | sed 's/^/  /'
else
    echo "Log File: Not Found"
fi

echo ""
echo "======================================"

exit $EXIT_CODE

