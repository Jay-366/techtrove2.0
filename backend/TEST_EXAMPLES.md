# Testing AIBox Backend

## Server Running
Your server should be running at: `http://localhost:3000`

## Test Method 1: PowerShell

### Test Health Endpoint
```powershell
Invoke-WebRequest -Uri http://localhost:3000/health -Method GET | ConvertFrom-Json
```

**Expected Response:**
```json
{
  "ok": true,
  "service": "AIBox"
}
```

### Test Chat Request Endpoint
```powershell
$body = @{
    message = "Create a pitch deck for my startup"
    email = "user@example.com"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:3000/chatRequest -Method POST -Body $body -ContentType "application/json" | ConvertFrom-Json | ConvertTo-Json -Depth 3
```

**Expected Response:**
```json
{
  "status": "ok",
  "note": "chatController will orchestrate plannerAgent, agentSelector, and the execution agents later",
  "echo": {
    "message": "Create a pitch deck for my startup",
    "email": "user@example.com"
  }
}
```

## Test Method 2: Using curl (if installed)

### Test Health Endpoint
```bash
curl http://localhost:3000/health
```

### Test Chat Request Endpoint
```bash
curl -X POST http://localhost:3000/chatRequest ^
  -H "Content-Type: application/json" ^
  -d "{\"message\":\"Create a pitch deck\",\"email\":\"user@example.com\"}"
```

## Test Method 3: Using Postman / Thunder Client

### Setup
- **Method**: GET
- **URL**: `http://localhost:3000/health`

### Chat Request
- **Method**: POST
- **URL**: `http://localhost:3000/chatRequest`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (JSON):
```json
{
  "message": "Create a pitch deck for my startup",
  "email": "user@example.com"
}
```

## Test Method 4: Using a Browser

Simply open: `http://localhost:3000/health` in your browser

You should see:
```json
{"ok":true,"service":"AIBox"}
```

## Starting the Server

```bash
# In the backend folder
cd backend
npm start
```

For development with auto-reload:
```bash
npm run dev
```

