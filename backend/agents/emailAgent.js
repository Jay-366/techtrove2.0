import { google } from 'googleapis';
import dotenv from 'dotenv';
import { getGoogleToken, saveGoogleToken } from '../tokenStore.js';
import fs from 'fs';
import path from 'path';

dotenv.config();

/**
 * Email Agent - Sends emails via Gmail API
 * @param {Object} params - Email parameters
 * @param {string} params.userId - User identifier
 * @param {string} params.to - Recipient email address
 * @param {string} params.subject - Email subject
 * @param {string} params.body - Email body content
 * @param {string} [params.from] - Sender email (optional, uses authenticated user's email)
 * @param {string} [params.attachmentPath] - Path to file to attach (optional)
 * @param {boolean} [params.isHTML] - Whether body contains HTML content (default: false)
 * @returns {Promise<Object>} Result object with status and email details
 */
export async function emailAgent({ userId, to, subject, body, from, attachmentPath, isHTML = false }) {
  // 1. Check if we have a token for this user
  const token = getGoogleToken(userId);
  
  console.log(`[emailAgent] Checking token for userId: ${userId}`);
  console.log(`[emailAgent] Token exists: ${token ? 'YES' : 'NO'}`);
  
  if (!token) {
    // We tell the caller they need to connect first
    const authUrl = `http://127.0.0.1:${process.env.PORT || 5000}/auth/google/start`;
    console.log(`[emailAgent] No token found, auth required: ${authUrl}`);
    const err = new Error('Gmail not connected');
    err.needAuth = true;
    err.authUrl = authUrl;
    throw err;
  }
  
  console.log(`[emailAgent] Token found, proceeding with Gmail API call`);

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

  // Handle token refresh if expired
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

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  // 3. Get user's email address if 'from' is not provided
  let senderEmail = from;
  if (!senderEmail) {
    try {
      const profile = await gmail.users.getProfile({ userId: 'me' });
      senderEmail = profile.data.emailAddress;
    } catch (error) {
      console.error('[emailAgent] Failed to get user profile:', error.message);
      senderEmail = 'me'; // Fallback
    }
  }

  // 4. Create the email message
  let emailContent;
  let attachmentData = null;
  
  // Handle attachment if provided
  if (attachmentPath && fs.existsSync(attachmentPath)) {
    console.log(`[emailAgent] Adding attachment: ${attachmentPath}`);
    
    const filename = path.basename(attachmentPath);
    const fileContent = fs.readFileSync(attachmentPath);
    const base64Content = fileContent.toString('base64');
    
    // Create multipart email with attachment
    const boundary = 'boundary_' + Date.now();
    const contentType = isHTML ? 'text/html; charset="UTF-8"' : 'text/plain; charset="UTF-8"';
    
    emailContent = [
      `From: ${senderEmail}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/mixed; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      `Content-Type: ${contentType}`,
      `Content-Transfer-Encoding: 7bit`,
      '',
      body,
      '',
      `--${boundary}`,
      `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`,
      `Content-Disposition: attachment; filename="${filename}"`,
      `Content-Transfer-Encoding: base64`,
      '',
      base64Content,
      '',
      `--${boundary}--`
    ].join('\n');
    
    attachmentData = { filename, size: fileContent.length };
  } else {
    // Simple email without attachment
    const contentType = isHTML ? 'text/html; charset="UTF-8"' : 'text/plain; charset="UTF-8"';
    
    emailContent = [
      `From: ${senderEmail}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: ${contentType}`,
      '',
      body
    ].join('\n');
  }

  // Encode the email in base64url format
  const encodedMessage = Buffer.from(emailContent)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  // 5. Send the email
  const result = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage
    }
  });

  console.log(`[emailAgent] ✅ Email sent successfully. Message ID: ${result.data.id}`);

  return {
    status: 'SENT',
    messageId: result.data.id,
    to: to,
    subject: subject,
    from: senderEmail,
    body: body,
    attachment: attachmentData
  };
}

/**
 * Create a calendar event button HTML for emails
 * @param {string} calendarUrl - Google Calendar event URL
 * @param {string} eventTitle - Event title/summary
 * @param {string} eventDate - Formatted event date
 * @returns {string} HTML button code
 */
export function createCalendarButton(calendarUrl, eventTitle, eventDate) {
  return `
<div style="text-align: center; margin: 30px 0; padding: 20px;">
  <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
    <tr>
      <td style="border-radius: 6px; background-color: #2563EB; text-align: center;">
        <a href="${calendarUrl}" 
           style="display: inline-block; 
                  background-color: #2563EB; 
                  color: #ffffff; 
                  padding: 15px 30px; 
                  text-decoration: none; 
                  border-radius: 6px; 
                  font-weight: bold; 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                  font-size: 16px;
                  line-height: 1.4;
                  border: none;
                  cursor: pointer;
                  transition: background-color 0.2s ease;">
          📅 View "${eventTitle}" in Calendar
        </a>
      </td>
    </tr>
  </table>
  <p style="font-size: 12px; 
            color: #6B7280; 
            margin-top: 15px; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
    📅 ${eventDate} • Google Calendar
  </p>
</div>`;
}

/**
 * Create calendar link text for plain emails (fallback)
 * @param {string} calendarUrl - Google Calendar event URL
 * @param {string} eventTitle - Event title/summary
 * @param {string} eventDate - Formatted event date
 * @returns {string} Plain text calendar link
 */
export function createCalendarLink(calendarUrl, eventTitle, eventDate) {
  return `
📅 View "${eventTitle}" in Google Calendar: ${calendarUrl}

Event Date: ${eventDate}
Click the link above to view the event in your Google Calendar.
`;
}

