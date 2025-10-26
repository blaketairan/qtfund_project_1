# Data Model: Operation Scripts

**Feature**: 003-operation-scripts  
**Date**: 2025-01-27

## Script State Model

### Application State

```json
{
  "running": "boolean - is the application currently running",
  "port": "number - port number (3000)",
  "pid": "number|null - process ID of running instance",
  "lastStartTime": "string|null - timestamp of last start",
  "healthStatus": "string - healthy|unhealthy|unknown"
}
```

**State Management**:
- No persistent storage required
- State derived from system process inspection
- Each script detects current state independently

### Process Information

```json
{
  "pid": "number - process identifier",
  "command": "string - command being executed",
  "port": "number - port the process is listening on",
  "startTime": "string - process start timestamp"
}
```

**Detection Method**:
- Uses `pgrep` and `ps` commands
- Cross-platform process listing
- Port checking via `lsof`

## Script Contracts

### Start Script

**Input**: None (reads environment automatically)

**Output**: Success/failure status

**Behavior**:
1. Check if port 3000 is available
2. Check if webpack process already running
3. Start webpack dev server if not running
4. Log PID and verify startup
5. Return exit code 0 on success, non-zero on failure

### Health Check Script

**Input**: None

**Output**: Health status message and exit code

**Behavior**:
1. Check if webpack process is running
2. Check if port 3000 is responding to HTTP
3. Verify HTTP response (200 OK expected)
4. Return exit code 0 if healthy, non-zero if unhealthy

### Stop Script

**Input**: None

**Output**: Stop confirmation message

**Behavior**:
1. Find all webpack processes by PID
2. Send TERM signal for graceful shutdown
3. Wait 2 seconds
4. Send KILL signal if still running
5. Verify port 3000 is released
6. Return exit code 0 if successful, non-zero on error

## Error Handling Model

### Error Types

```json
{
  "portConflict": {
    "description": "Port 3000 already in use",
    "resolution": "Stop existing instance or use different port"
  },
  "alreadyRunning": {
    "description": "Application already started",
    "resolution": "Information only, no action needed"
  },
  "notRunning": {
    "description": "Application not running when expected",
    "resolution": "Start application first"
  },
  "startFailure": {
    "description": "Failed to start application",
    "resolution": "Check logs and system resources"
  }
}
```

**Handling Strategy**:
- Clear error messages for each scenario
- Appropriate exit codes for CI/CD integration
- Graceful handling of edge cases

