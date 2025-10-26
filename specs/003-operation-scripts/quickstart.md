# Quick Start Guide: Operation Scripts

**Feature**: 003-operation-scripts  
**Date**: 2025-01-27

## Prerequisites

- Node.js 18+ installed
- npm 8+ installed
- Bash 3.2+ available
- Port 3000 available

## Running the Scripts

### Start the Application

```bash
./bin/start.sh
```

**Expected Output**:
```
Starting QTFund Frontend...
Webpack dev server started on port 3000
Process ID: 12345
Application ready at http://localhost:3000
```

**Verification**:
- Check process: `pgrep -f "webpack"`
- Check port: `lsof -i :3000`
- Visit: http://localhost:3000

### Check Application Health

```bash
./bin/health.sh
```

**Expected Output**:
```
Checking application health...
✓ Process is running (PID: 12345)
✓ Port 3000 is listening
✓ HTTP response: 200 OK
Application is healthy
```

**Exit Codes**:
- 0 = Healthy
- 1 = Unhealthy (not running or not responding)

### Stop the Application

```bash
./bin/stop.sh
```

**Expected Output**:
```
Stopping QTFund Frontend...
Sending TERM signal to PID: 12345
Process stopped
Port 3000 released
Application stopped successfully
```

## Common Usage Patterns

### Start and Verify

```bash
./bin/start.sh && sleep 3 && ./bin/health.sh
```

### Development Workflow

```bash
# Start
./bin/start.sh

# Work on application

# Check health periodically
./bin/health.sh

# Stop when done
./bin/stop.sh
```

### CI/CD Integration

```bash
# In CI pipeline
./bin/start.sh
./bin/health.sh  # Assert: exit code 0
# Run tests...
./bin/stop.sh
```

## Troubleshooting

### "Port 3000 already in use"

**Cause**: Another process is using port 3000

**Solution**:
```bash
# Find the process
lsof -i :3000

# Stop it
./bin/stop.sh
# Or manually:
kill $(lsof -t -i:3000)
```

### "Health check fails"

**Cause**: Application not fully started or crashed

**Solution**:
1. Wait a few seconds for full startup
2. Check logs: `npm run start`
3. Verify webpack is running: `pgrep -f webpack`

### "Script not executable"

**Cause**: Scripts need execute permissions

**Solution**:
```bash
chmod +x bin/*.sh
```

## Verification Scenarios

### Scenario 1: Fresh Start

1. Run `./bin/start.sh`
2. Wait 2 seconds
3. Run `./bin/health.sh`
4. Verify: exit code 0, "healthy"
5. Open browser to http://localhost:3000
6. Verify: application loads

### Scenario 2: Already Running

1. Application is running
2. Run `./bin/start.sh` again
3. Verify: message indicates already running
4. Exit code: 0 (success, no action needed)

### Scenario 3: Stop When Not Running

1. Application is not running
2. Run `./bin/stop.sh`
3. Verify: message indicates not running
4. Exit code: 0 (success, no action needed)

### Scenario 4: Stop and Verify

1. Start application
2. Run `./bin/stop.sh`
3. Wait 3 seconds
4. Run `./bin/health.sh`
5. Verify: exit code 1, "not running"
6. Check port: `lsof -i :3000`
7. Verify: empty (port released)

## Integration with npm Scripts

Scripts can be invoked via npm:

```bash
npm run bin:start
npm run bin:health
npm run bin:stop
```

If scripts are added to package.json scripts section.

