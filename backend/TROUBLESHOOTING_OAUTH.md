# Troubleshooting: "Failed to get Google tokens"

## Common Issues & Solutions

### 1. ✅ Check Your .env File

Make sure these are set correctly:
```env
GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
GOOGLE_REDIRECT_URI=http://127.0.0.1:5000/google/callback
```

**Fix:**
- Make sure there are no quotes around the values
- No trailing spaces
- Use your **actual** credentials from Google Cloud Console

### 2. 🔗 Redirect URI Mismatch

**Error:** `redirect_uri_mismatch`

**Fix:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to: **APIs & Services** > **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, make sure you have:
   ```
   http://127.0.0.1:5000/google/callback
   ```
5. Click **Save**
6. Wait 1-2 minutes for changes to propagate

### 3. 🔑 Invalid Client Credentials

**Error:** `invalid_client`

**Fix:**
- Double-check `GOOGLE_CLIENT_ID` matches exactly
- Double-check `GOOGLE_CLIENT_SECRET` matches exactly
- Make sure you're using credentials for a **Web application** type
- Restart your server after changing `.env`

### 4. ⏱️ Expired Authorization Code

**Error:** `invalid_grant`

**Fix:**
- Authorization codes expire quickly (usually within 10 minutes)
- Try the OAuth flow again: `http://127.0.0.1:5000/auth/google/start`
- Make sure you complete the authorization in one session

### 5. 🌐 Google Calendar API Not Enabled

**Fix:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to: **APIs & Services** > **Library**
3. Search for "Google Calendar API"
4. Make sure it's **Enabled** (should show green checkmark)

### 6. 🔍 Check Server Console

The improved error handler now shows detailed logs. Check your terminal/server console for:
- Specific error messages
- Error codes
- Which step failed

### 7. 🧪 Test Your Configuration

Create a test file: `backend/test-env.js`

```javascript
import dotenv from 'dotenv';

dotenv.config();

console.log('Checking environment variables...\n');

const required = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI'];

required.forEach(key => {
  const value = process.env[key];
  if (value && value !== `your_${key.toLowerCase()}_here`) {
    console.log(`✅ ${key}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${key}: NOT SET or using placeholder`);
  }
});
```

Run: `node backend/test-env.js`

## Step-by-Step Debug Checklist

- [ ] `.env` file exists in `backend/` folder
- [ ] All three Google env vars are set (not placeholders)
- [ ] Google Calendar API is enabled
- [ ] Redirect URI matches in Google Cloud Console
- [ ] Server restarted after changing `.env`
- [ ] Using correct port (5000)
- [ ] Authorization completed in browser
- [ ] Check server console for detailed error messages

## Quick Test

1. **Check config:**
   ```bash
   node backend/test-env.js
   ```

2. **Test OAuth URL:**
   ```bash
   node backend/test-oauth-url.js
   ```
   Copy the URL and open in browser manually

3. **Try OAuth flow:**
   - Visit: `http://127.0.0.1:5000/auth/google/start`
   - Authorize in browser
   - Check server console for errors

## Still Not Working?

Check the server console output when you visit `/google/callback`. The improved error handler now shows:
- Specific error type
- Helpful messages
- Links to retry

Share the console error message for more specific help!

