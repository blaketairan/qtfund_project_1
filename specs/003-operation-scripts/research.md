# Technical Research: Operation Scripts

**Feature**: 003-operation-scripts  
**Date**: 2025-01-27

## Cross-Platform Compatibility

### Shell Selection

**Decision**: Use bash with version compatibility checks

**Rationale**:
- macOS includes bash 3.2+ (older systems may have limitations)
- Linux typically has bash 4+
- `#!/bin/bash` shebang works on both platforms
- Avoid bash 4+ specific features (associative arrays, negative indices)

**Alternatives Considered**:
- Python scripts (requires Python installation)
- Node.js scripts (adds unnecessary dependency)
- /bin/sh (lacks some useful features)

### Process Management

**Decision**: Use `pgrep` and `pkill` with fallback to `ps` + `grep`

**Rationale**:
- `pgrep`/`pkill` available on both macOS and Linux
- More reliable than parsing `ps` output
- Simple process name matching for webpack
- Fallback needed for systems without these tools

**Alternatives Considered**:
- PID files (adds file management overhead)
- `lsof` for port checking (available on both platforms)

### Port Checking

**Decision**: Use `lsof` command to check if port 3000 is in use

**Rationale**:
- `lsof` available on both macOS and Linux
- Direct port checking without HTTP requests
- Clear availability detection

**Alternatives Considered**:
- HTTP curl request (requires application to be responding)
- `netstat` (less portable)

### Health Check Method

**Decision**: Use `curl` with timeout to check HTTP response

**Rationale**:
- `curl` available on both macOS and Linux by default
- Verify actual HTTP response, not just port
- Timeout prevents hanging
- Simple status code checking

**Alternatives Considered**:
- `wget` (less commonly installed)
- HTTP via netcat (more complex)

### Signal Handling

**Decision**: Use TERM signal first, then KILL if needed after timeout

**Rationale**:
- Graceful termination with SIGTERM (allows cleanup)
- Forced termination with SIGKILL if unresponsive
- Prevents zombie processes
- Standard Unix practice

**Implementation**:
```bash
kill -TERM $PID
sleep 2
if process_still_running; then
  kill -KILL $PID
fi
```

## Best Practices

### Error Handling

- Check command availability before use
- Provide clear error messages
- Exit with appropriate status codes (0 = success, non-zero = error)

### Logging

- Use `echo` for user feedback
- Color coding optional but helpful (green=success, red=error)
- Log process IDs for debugging

### Idempotency

- Check if already running before start
- Handle not-running gracefully for stop
- Safe to run multiple times

### Security

- No root privileges required
- User permissions for webpack processes only
- No file system modifications beyond log files

## Webpack Dev Server Integration

### Command to Run

Based on `package.json`:
```bash
npm run start
```

This executes: `webpack serve --mode development --port 3000`

### Process Detection

Pattern to find: `webpack serve` or `webpack-dev-server`

Commands:
- `pgrep -f "webpack.*serve"`
- `pgrep -f "webpack-dev-server"`

### Port Verification

Command: `lsof -i :3000`

Returns PID if port is in use, empty if available

## Environment Setup

### Prerequisites Checking

**Decision**: Verify Node.js and npm before installation

**Rationale**:
- npm requires Node.js to function
- Check versions to ensure compatibility
- Provide clear error messages for missing prerequisites
- Cross-platform version checking via `node --version` and `npm --version`

**Implementation**:
```bash
command -v node >/dev/null 2>&1 || { echo "Node.js not found"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npm not found"; exit 1; }
```

### Dependency Installation

**Decision**: Run `npm install` with appropriate flags

**Rationale**:
- Standard package manager for Node.js projects
- Handles package-lock.json automatically
- Supports --verbose for troubleshooting
- Can skip if node_modules exists (idempotency)

**Implementation**:
```bash
if [ -d "node_modules" ]; then
  echo "Dependencies already installed"
  npm ci
else
  npm install
fi
```

### Idempotency for Setup

**Decision**: Check for existing installation before re-installing

**Rationale**:
- Prevents redundant work
- Safe to run multiple times
- Respects user's existing setup
- Saves time and resources

## Implementation Summary

**Scripts Structure**:
- `setup.sh`: Check prerequisites, install dependencies
- `start.sh`: Check port, start server, log PID
- `health.sh`: Check process and HTTP health
- `stop.sh`: Gracefully stop server, verify cleanup

**Key Commands**:
- Process management: `pgrep`, `pkill`
- Port checking: `lsof`
- Health check: `curl`
- Process signals: `kill -TERM`, `kill -KILL`

**Compatibility**: Works on macOS 10.12+ and Linux distributions

