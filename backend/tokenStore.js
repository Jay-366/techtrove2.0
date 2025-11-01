import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TOKEN_FILE = path.join(__dirname, 'tmp', 'tokens.json');

/**
 * Token store - persists to file so tokens survive server restarts
 * In production, this would be a database
 */
let tokenStore = {
  google: {
    // [userId]: { accessToken, refreshToken, expiryDate }
  }
};

// Load tokens from file on startup
function loadTokens() {
  try {
    if (fs.existsSync(TOKEN_FILE)) {
      const data = fs.readFileSync(TOKEN_FILE, 'utf8');
      tokenStore = JSON.parse(data);
      console.log('📁 Tokens loaded from file:', TOKEN_FILE);
    } else {
      // File doesn't exist yet - that's okay, tokens will be saved on first connect
      console.log('📁 No token file found yet:', TOKEN_FILE);
    }
  } catch (error) {
    console.error('Error loading tokens:', error.message);
  }
}

// Save tokens to file
function saveTokens() {
  try {
    // Ensure tmp directory exists
    const tmpDir = path.dirname(TOKEN_FILE);
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenStore, null, 2));
    console.log('💾 Tokens saved to file');
  } catch (error) {
    console.error('Error saving tokens:', error.message);
  }
}

// Load tokens on module load
loadTokens();

/**
 * Save Google OAuth token for a user
 * @param {string} userId - User identifier
 * @param {Object} tokenObj - Token object with accessToken, refreshToken, expiryDate
 */
export function saveGoogleToken(userId, tokenObj) {
  tokenStore.google[userId] = tokenObj;
  saveTokens();
}

/**
 * Get Google OAuth token for a user
 * @param {string} userId - User identifier
 * @returns {Object|null} Token object or null if not found
 */
export function getGoogleToken(userId) {
  // Reload from file to get latest tokens (important for test scripts)
  try {
    if (fs.existsSync(TOKEN_FILE)) {
      const data = fs.readFileSync(TOKEN_FILE, 'utf8');
      const loadedStore = JSON.parse(data);
      // Merge with in-memory store (file takes precedence)
      tokenStore = loadedStore;
    }
  } catch (error) {
    // Ignore errors, use in-memory store
  }
  
  const token = tokenStore.google[userId] || null;
  if (token) {
    console.log(`[tokenStore] Token found for ${userId}`);
  } else {
    console.log(`[tokenStore] No token found for ${userId}`);
  }
  return token;
}

