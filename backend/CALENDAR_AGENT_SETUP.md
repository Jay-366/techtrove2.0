# Calendar Agent Setup Guide

## ✅ Implementation Complete

The Calendar Agent is now integrated into AIBox. Here's what was created:

### Files Created/Modified:
- ✅ `backend/tokenStore.js` - In-memory token storage
- ✅ `backend/server.js` - Added Google OAuth routes
- ✅ `backend/agents/calendarAgent.js` - Calendar event creation agent
- ✅ `backend/chatController.js` - Added calendar event handling
- ✅ `backend/registry.js` - Added calendar agent to registry

## 🔧 Setup Instructions

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google Calendar API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"
4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URI: `http://127.0.0.1:5000/google/callback`
   - Copy the **Client ID** and **Client Secret**

### 2. Update .env File

Add these to your `backend/.env`:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://127.0.0.1:5000/google/callback
```

### 3. Install Dependencies

Already installed:
```bash
npm install googleapis  # ✅ Done
```

## 📖 Usage

### Step 1: Connect Google Calendar

1. Start your server:
   ```bash
   npm start
   ```

2. Open browser and navigate to:
   ```
   http://127.0.0.1:5000/auth/google/start
   ```

3. Sign in with Google and authorize calendar access

4. You'll be redirected back and see: "✅ Google Calendar connected"

### Step 2: Create Calendar Events

#### Via API:
```bash
POST http://127.0.0.1:5000/chatRequest
Content-Type: application/json

{
  "message": "Schedule a meeting tomorrow",
  "email": "user@example.com"
}
```

#### Direct Agent Call:
```javascript
import { calendarAgent } from './agents/calendarAgent.js';

const result = await calendarAgent({
  userId: 'demoUser',
  summary: 'Investor Call',
  startISO: '2025-11-03T10:00:00+08:00',
  endISO: '2025-11-03T10:30:00+08:00',
  description: 'Discuss funding round'
});
```

## 🔍 API Endpoints

### OAuth Routes

- **GET `/auth/google/start`** - Initiates Google OAuth flow
- **GET `/google/callback`** - Handles OAuth callback from Google

### Event Creation

The calendar agent is automatically called when the chat request contains keywords:
- "calendar"
- "meeting"
- "schedule"

## 📋 Response Format

### Success Response:
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

### Auth Required Response:
```json
{
  "status": "ok",
  "calendarResult": {
    "requireGoogleAuth": true,
    "authUrl": "http://127.0.0.1:5000/auth/google/start"
  }
}
```

## 🔒 Security Notes

- **Current Implementation**: Uses hardcoded `userId = "demoUser"` for demo
- **Token Storage**: In-memory (tokens lost on server restart)
- **Production**: Should use database for token storage and proper user authentication

## 🚀 Next Steps

1. Integrate with `plannerAgent` to automatically detect calendar events
2. Extract event details from natural language (NLP)
3. Add user authentication system
4. Move token storage to database
5. Add event update/delete functionality

