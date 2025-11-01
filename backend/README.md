# AIBox Backend

AI agent orchestrator backend for breaking down user requests into tasks and executing them using specialized agents.

## Project Structure

```
backend/
├── server.js              # Express app with health and chatRequest routes
├── chatController.js      # Handles user chat requests
├── agentCoordinator.js    # Orchestrates multiple agents
├── tokenStore.js          # OAuth token storage
├── agents/
│   ├── gptAgent.js        # GPT text generation agent
│   ├── calendarAgent.js    # Google Calendar event creation
│   ├── eventParser.js     # Parses event details from natural language
│   └── emailAgent.js      # Email agent (placeholder)
├── tmp/                   # Temporary files directory
├── package.json           # Project dependencies
└── .env                   # Environment variables
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
PORT=5000
```

3. Run the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### GET /health
Returns server health status.

**Response:**
```json
{
  "ok": true,
  "service": "AIBox"
}
```

### POST /chatRequest
Handles user chat requests.

**Request Body:**
```json
{
  "message": "User's request message",
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "status": "ok",
  "note": "chatController will orchestrate plannerAgent, agentSelector, and the execution agents later",
  "echo": {
    "message": "User's request message",
    "email": "user@example.com"
  }
}
```

## Development Status

✅ **Completed:**
- [x] GPT agent for text generation
- [x] Calendar agent for Google Calendar integration
- [x] Agent coordinator for orchestration
- [x] Event parser for natural language processing
- [x] OAuth token management

🚧 **To be implemented:**
- [ ] Email agent implementation
- [ ] Additional agents (slides, video, etc.)

## Technologies

- Node.js with ES modules
- Express.js
- CORS
- dotenv

