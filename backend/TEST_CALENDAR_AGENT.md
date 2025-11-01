# Testing Calendar Agent - Step by Step Guide

## Prerequisites

1. **Google Cloud Console Setup** (if not done):
   - Go to https://console.cloud.google.com/
   - Create/select a project
   - Enable Google Calendar API
   - Create OAuth 2.0 credentials
   - Add redirect URI: `http://127.0.0.1:5000/google/callback`

2. **Update `.env` file** with your credentials:
   ```
   PORT=5000
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   GOOGLE_REDIRECT_URI=http://127.0.0.1:5000/google/callback
   ```

## Testing Steps

### Step 1: Start the Server

```bash
cd backend
npm start
```

You should see:
```
AIBox backend server running on port 5000
```

### Step 2: Test Health Endpoint (Optional)

```bash
# PowerShell
Invoke-WebRequest http://127.0.0.1:5000/health

# Or open in browser:
# http://127.0.0.1:5000/health
```

Expected: `{"ok":true,"service":"AIBox"}`

### Step 3: Connect Google Calendar

**Option A: Via Browser**
1. Open: `http://127.0.0.1:5000/auth/google/start`
2. Sign in with Google
3. Authorize calendar access
4. You'll be redirected to: `http://127.0.0.1:5000/google/callback`
5. Should see: "✅ Google Calendar connected. You can close this tab."

**Option B: Via PowerShell**
```powershell
Start-Process "http://127.0.0.1:5000/auth/google/start"
```

### Step 4: Test Calendar Event Creation

#### Method 1: Via API (PowerShell)

```powershell
$body = @{
    message = "Schedule a meeting tomorrow"
    email = "test@example.com"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://127.0.0.1:5000/chatRequest -Method POST -Body $body -ContentType "application/json" | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
```

#### Method 2: Direct Agent Test (Node.js)

Create a test file: `backend/test-calendar.js`

```javascript
import { calendarAgent } from './agents/calendarAgent.js';

async function test() {
  try {
    const result = await calendarAgent({
      userId: 'demoUser',
      summary: 'Test Meeting',
      startISO: '2025-11-05T10:00:00+08:00',
      endISO: '2025-11-05T10:30:00+08:00',
      description: 'Testing calendar agent'
    });
    
    console.log('✅ Event created!');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    if (error.needAuth) {
      console.log('❌ Auth required:');
      console.log('Visit:', error.authUrl);
    } else {
      console.error('Error:', error.message);
    }
  }
}

test();
```

Run it:
```bash
node backend/test-calendar.js
```

#### Method 3: Using curl (if available)

```bash
curl -X POST http://127.0.0.1:5000/chatRequest \
  -H "Content-Type: application/json" \
  -d '{"message":"Schedule a meeting","email":"test@example.com"}'
```

## Expected Responses

### ✅ Success Response:
```json
{
  "status": "ok",
  "calendarResult": {
    "status": "CREATED",
    "eventSummary": "Investor Call",
    "start": "2025-11-03T10:00:00+08:00",
    "end": "2025-11-03T10:30:00+08:00",
    "calendarLink": "https://www.google.com/calendar/event?eid=..."
  }
}
```

### ❌ Auth Required Response:
```json
{
  "status": "ok",
  "calendarResult": {
    "requireGoogleAuth": true,
    "authUrl": "http://127.0.0.1:5000/auth/google/start"
  }
}
```

## Quick Test Checklist

- [ ] Server starts on port 5000
- [ ] Health endpoint works
- [ ] OAuth redirect works (`/auth/google/start`)
- [ ] OAuth callback saves tokens (`/google/callback`)
- [ ] Calendar agent creates events
- [ ] Events appear in Google Calendar

## Troubleshooting

### "Google Calendar not connected"
→ Visit: `http://127.0.0.1:5000/auth/google/start` to connect

### "Missing code from Google"
→ Check that redirect URI matches in Google Cloud Console

### "Failed to get Google tokens"
→ Verify CLIENT_ID and CLIENT_SECRET in `.env`

### Port already in use
→ Change PORT in `.env` or kill process on port 5000

