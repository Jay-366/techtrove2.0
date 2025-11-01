# AIBox Chat Page Setup

## 📁 Files Created

- `pages/chat.js` - Main chat interface page
- `lib/useAIBoxChat.js` - Custom hook for API communication
- `components/SplitText.js` - Text animation component
- `components/ui/DropdownMenu.js` - Dropdown menu component

## 🚀 Usage

### 1. Start Backend Server
```bash
cd backend
npm start
```
Server should run on `http://127.0.0.1:5000`

### 2. Start Frontend
```bash
npm run dev
```

### 3. Open Chat Page
Navigate to: `http://localhost:3000/chat`

## ✨ Features

- **Real-time Chat Interface** - Beautiful dark-themed UI
- **Calendar Integration** - Automatically creates calendar events when mentioned
- **GPT Responses** - Natural language responses from GPT-4o-mini
- **Session Management** - Persistent session IDs
- **Scroll Management** - Auto-scroll with manual override
- **Error Handling** - Graceful error messages
- **Calendar Event Display** - Shows created events with Google Calendar links

## 🔧 API Integration

The chat page connects to:
- **Endpoint**: `http://127.0.0.1:5000/chatRequest`
- **Method**: POST
- **Body**: 
  ```json
  {
    "message": "User's message",
    "email": "user@example.com"
  }
  ```

## 📋 Example Prompts

Try these in the chat:
- "Schedule a meeting tomorrow at 2pm"
- "Create a calendar event for Friday at 3pm"
- "Book a call next Monday"
- "Hello, how are you?"

## 🎨 UI Features

- **Sidebar** - Agent selection and recent chats
- **Chat Area** - Message display with timestamps
- **Input Bar** - Message input with file attachment
- **Info Drawer** - Agent information panel
- **Scroll to Bottom** - Button appears when scrolled up

## ⚙️ Configuration

Update API URL in `lib/useAIBoxChat.js` if your backend runs on a different port:
```javascript
const response = await fetch('http://127.0.0.1:5000/chatRequest', {
  // ...
});
```

## 🔍 Troubleshooting

**CORS Error:**
- Make sure backend has `cors()` middleware enabled
- Check that backend is running

**Connection Refused:**
- Verify backend server is running on port 5000
- Check firewall settings

**No Response:**
- Check browser console for errors
- Verify backend is receiving requests
- Check backend console for errors

