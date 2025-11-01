import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import { handleUserRequest } from './chatController.js';
import { saveGoogleToken } from './tokenStore.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// ====== GOOGLE OAUTH CONFIG ======
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI // e.g. http://127.0.0.1:5000/google/callback
);

// Routes
app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'AIBox' });
});

app.post('/chatRequest', async (req, res) => {
  try {
    const { message, email } = req.body;
    const result = await handleUserRequest(message, email);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
});

// ====== GOOGLE OAUTH ROUTES ======

// 1) Start OAuth flow
app.get('/auth/google/start', (req, res) => {
  // In production we'd identify the user (req.session.userId etc.)
  // For hackathon we hardcode userId = "demoUser"
  const scopes = [
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.readonly"
  ];  

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // we want refresh_token
    scope: scopes,
    prompt: 'consent'
  });

  res.redirect(url);
});

// 2) Handle OAuth callback
app.get('/google/callback', async (req, res) => {
  const code = req.query.code;
  const error = req.query.error;
  
  // Check for OAuth errors
  if (error) {
    console.error('OAuth error:', error);
    return res.status(400).send(`OAuth error: ${error}. ${req.query.error_description || ''}`);
  }

  if (!code) {
    return res.status(400).send('Missing code from Google. Make sure you authorized the app.');
  }

  // Verify environment variables are set
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error('Missing Google OAuth credentials in .env file');
    return res.status(500).send('Server configuration error: Missing Google OAuth credentials. Check .env file.');
  }

  try {
    console.log('Exchanging code for tokens...');
    const { tokens } = await oauth2Client.getToken(code);
    // tokens = { access_token, refresh_token, expiry_date, ... }

    if (!tokens.access_token) {
      console.error('No access token received:', tokens);
      return res.status(500).send('Failed: No access token received from Google.');
    }

    console.log('Tokens received successfully');
    console.log('Token details:', {
      hasAccessToken: !!tokens.access_token,
      hasRefreshToken: !!tokens.refresh_token,
      expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : 'none'
    });

    // Save it to our in-memory store for demo user
    saveGoogleToken('demoUser', {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate: tokens.expiry_date
    });

    console.log('✅ Token saved for demoUser');
    console.log('📝 To verify, check tokenStore in server process');
    res.send(`
      <html>
        <body style="font-family: Arial; padding: 40px; text-align: center;">
          <h1 style="color: green;">✅ Google Calendar Connected!</h1>
          <p>You can close this tab.</p>
          <p>Token saved successfully.</p>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Google token exchange error details:');
    console.error('Error message:', err.message);
    console.error('Error code:', err.code);
    console.error('Full error:', err);
    
    let errorMsg = 'Failed to get Google tokens. ';
    
    if (err.message.includes('redirect_uri_mismatch')) {
      errorMsg += 'Redirect URI mismatch. Check that GOOGLE_REDIRECT_URI in .env matches Google Cloud Console.';
    } else if (err.message.includes('invalid_client')) {
      errorMsg += 'Invalid client credentials. Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.';
    } else if (err.message.includes('invalid_grant')) {
      errorMsg += 'Invalid or expired authorization code. Try the OAuth flow again.';
    } else {
      errorMsg += `Error: ${err.message}`;
    }
    
    res.status(500).send(`
      <html>
        <body style="font-family: Arial; padding: 40px;">
          <h1 style="color: red;">❌ Connection Failed</h1>
          <p>${errorMsg}</p>
          <p><strong>Check the server console for detailed error logs.</strong></p>
          <p><a href="/auth/google/start">Try again</a></p>
        </body>
      </html>
    `);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`AIBox backend server running on port ${PORT}`);
});

export default app;

