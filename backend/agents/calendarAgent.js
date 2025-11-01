import { google } from 'googleapis';
import dotenv from 'dotenv';
import { getGoogleToken, saveGoogleToken } from '../tokenStore.js';

dotenv.config();

/**
 * Calendar Agent - Creates events in Google Calendar
 * @param {Object} params - Event parameters
 * @param {string} params.userId - User identifier
 * @param {string} params.summary - Event title/summary
 * @param {string} params.startISO - Start time in ISO format (e.g. "2025-11-03T10:00:00+08:00")
 * @param {string} params.endISO - End time in ISO format (e.g. "2025-11-03T10:30:00+08:00")
 * @param {string} [params.description] - Event description
 * @returns {Promise<Object>} Result object with status and event details
 */
export async function calendarAgent({ userId, summary, startISO, endISO, description }) {
  // 1. Check if we have a token for this user
  const token = getGoogleToken(userId);
  
  console.log(`[calendarAgent] Checking token for userId: ${userId}`);
  console.log(`[calendarAgent] Token exists: ${token ? 'YES' : 'NO'}`);
  
  if (!token) {
    // We tell the caller they need to connect first
    const authUrl = `http://127.0.0.1:${process.env.PORT || 5000}/auth/google/start`;
    console.log(`[calendarAgent] No token found, auth required: ${authUrl}`);
    const err = new Error('Google Calendar not connected');
    err.needAuth = true;
    err.authUrl = authUrl;
    throw err;
  }
  
  console.log(`[calendarAgent] Token found, proceeding with calendar API call`);

  // 2. Rebuild an OAuth2 client using saved tokens
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    access_token: token.accessToken,
    refresh_token: token.refreshToken,
    expiry_date: token.expiryDate
  });

  // OPTIONAL: handle refresh if expired
  // If token expired, googleapis can refresh it automatically
  oauth2Client.on('tokens', (newTokens) => {
    if (newTokens.access_token) {
      // update stored token with fresh access_token
      saveGoogleToken(userId, {
        accessToken: newTokens.access_token,
        refreshToken: newTokens.refresh_token || token.refreshToken,
        expiryDate: newTokens.expiry_date || token.expiryDate
      });
    }
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  // 3. Build event resource
  const event = {
    summary,
    description: description || '',
    start: {
      dateTime: startISO, // "2025-11-03T10:00:00+08:00"
      timeZone: 'Asia/Kuala_Lumpur'
    },
    end: {
      dateTime: endISO,   // "2025-11-03T10:30:00+08:00"
      timeZone: 'Asia/Kuala_Lumpur'
    }
  };

  // 4. Insert event into the user's primary calendar
  const result = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event
  });

  // result.data will include htmlLink, etc.
  return {
    status: 'CREATED',
    eventSummary: summary,
    start: startISO,
    end: endISO,
    calendarLink: result.data.htmlLink
  };
}

