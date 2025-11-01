# AIBox Backend Architecture

## 📐 Overall Structure

```
backend/
├── server.js              # 🚀 Entry point - Express server + OAuth routes
├── chatController.js      # 📥 API handler - receives HTTP requests
├── agentCoordinator.js    # 🎯 Orchestrator - coordinates all agents
├── tokenStore.js          # 💾 Token management - stores OAuth tokens
├── utils/                 # 🛠️ Utility functions
│   ├── unifiedParser.js  # 📋 Universal parser (uses JSON Schema)
│   └── schemas.js        # 📐 JSON Schema definitions
└── agents/                # 🤖 All agents live here
    ├── gptAgent.js
    ├── calendarAgent.js
    ├── emailAgent.js
    ├── invoiceAgent.js
    └── paymentAgent.js
```

---

## 🔄 Request Flow

```
User Request (HTTP)
    ↓
server.js (/chatRequest endpoint)
    ↓
chatController.js (handleUserRequest)
    ↓
agentCoordinator.js (coordinateAgents)
    ↓
    ├── Detect request types
    ├── Parse user intent (using parsers)
    ├── Execute actions (using agents)
    └── Generate response (using gptAgent)
    ↓
Response to User
```

---

## 📦 Component Roles

### 🚀 **Entry Layer** (Server & API)

#### `server.js`
- **Role**: Express server entry point
- **Responsibilities**:
  - Sets up Express server on port 5000
  - Handles Google OAuth routes (`/auth/google/start`, `/google/callback`)
  - Receives HTTP POST requests at `/chatRequest`
  - Delegates to `chatController.js`
- **Does NOT invoke agents directly**

#### `chatController.js`
- **Role**: Thin API handler
- **Responsibilities**:
  - Receives user message from HTTP request
  - Calls `agentCoordinator.coordinateAgents()`
  - Formats response for HTTP response
- **Does NOT invoke agents directly** - only passes to coordinator

---

### 🎯 **Orchestration Layer**

#### `agentCoordinator.js` ⭐ **THE COORDINATOR**
- **Role**: Central orchestrator - invokes and coordinates all agents
- **Key Class**: `AgentCoordinator`
- **Responsibilities**:
  1. **Detects request types** (`detectRequestTypes()`)
     - Identifies: calendar, email, invoice, payment requests
   
  2. **Parses user intent** (using unified parser with JSON schemas)
     - `unifiedParser` with `EVENT_SCHEMA` - extracts calendar event details
     - `unifiedParser` with `INVOICE_SCHEMA` - extracts invoice details
     - `unifiedParser` with `EMAIL_SCHEMA` - extracts email details
   
  3. **Executes actions** (using action agents)
     - `invoiceAgent` - creates Excel invoices
     - `paymentAgent` - creates Stripe payment links
     - `calendarAgent` - creates Google Calendar events
     - `emailAgent` - sends emails via Gmail API
   
  4. **Generates response** (using gptAgent)
     - `gptAgent` - creates natural language response with context
   
  5. **Coordinates workflow**
     - Processes in logical order (invoice → payment → calendar → email)
     - Combines results from multiple agents
     - Handles errors gracefully

**Main Function**: `coordinateAgents(userPrompt, userId)`

---

### 🤖 **Agent Layer** (`/agents/` directory)

Agents are specialized modules that perform specific tasks. They are divided into:

#### **Unified Parser System** (Extracts structured data from user text)
All parsing is now centralized using a unified JSON schema approach.

**`utils/unifiedParser.js`** - Universal parser engine
- **Purpose**: Extracts structured data from natural language using JSON Schema
- **How it works**: Takes user prompt + JSON Schema → Returns structured data
- **Invoked by**: `agentCoordinator` for all parsing needs
- **Uses**: OpenAI GPT-4o-mini with structured output

**`utils/schemas.js`** - JSON Schema definitions
- **Purpose**: Defines data structures for all entity types
- **Schemas**:
  - `EVENT_SCHEMA` - Calendar event structure
  - `INVOICE_SCHEMA` - Invoice structure  
  - `EMAIL_SCHEMA` - Email structure
- **Options**: Includes validation rules, defaults, and fallbacks for each schema

**Parsing Flow:**
```
agentCoordinator
  ↓
unifiedParser(userPrompt, SCHEMA, entityType, OPTIONS)
  ↓
OpenAI GPT (with JSON Schema)
  ↓
Structured data object
```

**Benefits:**
- ✅ Single parsing implementation (no duplicate code)
- ✅ JSON Schema standardization (consistent structure)
- ✅ Easy to add new entity types (just add schema)
- ✅ Centralized validation and error handling

#### **Action Agents** (Perform actual actions)
These execute real-world actions (API calls, file operations, etc.)

4. **`gptAgent.js`** 💬
   - **Purpose**: Generates natural language responses
   - **Input**: User prompt + context about actions taken
   - **Output**: Human-readable text response
   - **Invoked by**: `agentCoordinator.handleGPTResponse()`
   - **Uses**: OpenAI GPT-4o-mini
   - **Note**: This is the ONLY agent that generates the final user-facing message

5. **`calendarAgent.js`** 📅
   - **Purpose**: Creates Google Calendar events
   - **Input**: Event details from `eventParser`
   - **Output**: Calendar event with Google Calendar link
   - **Invoked by**: `agentCoordinator.handleCalendarRequest()`
   - **Uses**: Google Calendar API
   - **Dependencies**: OAuth token from `tokenStore.js`

6. **`invoiceAgent.js`** 📄
   - **Purpose**: Creates Excel invoice files
   - **Input**: Invoice details from `invoiceParser`
   - **Output**: Excel file saved to `/invoices/` folder
   - **Invoked by**: `agentCoordinator.handleInvoiceRequest()`
   - **Uses**: Excel generation library (likely `exceljs`)

7. **`paymentAgent.js`** 💳
   - **Purpose**: Creates Stripe payment checkout sessions
   - **Input**: Payment amount + invoice details
   - **Output**: Stripe checkout URL
   - **Invoked by**: `agentCoordinator.handlePaymentRequest()`
   - **Uses**: Stripe API
   - **Note**: Lazy-loaded (optional - won't crash if Stripe not installed)

8. **`emailAgent.js`** 📧
   - **Purpose**: Sends emails via Gmail API
   - **Input**: Email details from `emailParser` + optional attachments
   - **Output**: Sent email confirmation
   - **Invoked by**: `agentCoordinator.handleEmailRequest()`
   - **Uses**: Gmail API
   - **Dependencies**: OAuth token from `tokenStore.js`
   - **Helper Functions**: `createCalendarButton()`, `createCalendarLink()`

---

### 💾 **Support Layer**

#### `tokenStore.js`
- **Role**: Manages Google OAuth tokens
- **Functions**:
  - `saveGoogleToken(userId, token)` - Saves token to file
  - `getGoogleToken(userId)` - Retrieves token from file
- **Storage**: `backend/tmp/tokens.json` (file-based)
- **Used by**: `calendarAgent`, `emailAgent`

---

## 🔄 Example: Complete Request Flow

### User says: "Schedule meeting with John tomorrow at 2pm and email him at john@example.com"

```
1. HTTP POST to /chatRequest
   ↓
2. server.js → chatController.js
   ↓
3. chatController.js → agentCoordinator.coordinateAgents()
   ↓
4. agentCoordinator.detectRequestTypes()
   → Detects: ['calendar', 'email']
   ↓
5. agentCoordinator.handleCalendarRequest()
   ├── Calls: eventParser(userPrompt)
   │   → Returns: { summary: "Meeting with John", startISO: "...", ... }
   ├── Calls: calendarAgent({ summary, startISO, ... })
   │   → Creates Google Calendar event
   │   → Returns: { status: 'CREATED', calendarLink: '...' }
   └── Stores result in: this.results.calendar
   ↓
6. agentCoordinator.handleEmailRequest()
   ├── Calls: unifiedParser(userPrompt, EMAIL_SCHEMA, ...)
   │   → Returns: { to: "john@example.com", subject: "...", body: "..." }
   ├── Adds calendar button to email body
   ├── Calls: emailAgent({ to, subject, body, ... })
   │   → Sends email via Gmail API
   │   → Returns: { status: 'SENT', messageId: '...' }
   └── Stores result in: this.results.email
   ↓
7. agentCoordinator.handleGPTResponse()
   ├── Builds context: "I created a calendar event and sent an email..."
   ├── Calls: gptAgent(userPrompt, systemContext)
   │   → Returns: "I've scheduled the meeting and emailed John..."
   └── Stores result in: this.results.message
   ↓
8. agentCoordinator returns: { message, calendar, email, actions }
   ↓
9. chatController.js formats response
   ↓
10. server.js sends HTTP response
```

---

## 🎯 Key Design Patterns

### 1. **Separation of Concerns**
- **Parsers**: Extract structured data (don't perform actions)
- **Agents**: Perform actions (don't parse text)
- **Coordinator**: Orchestrates everything

### 2. **Workflow Order**
```
Invoice → Payment → Calendar → Email → GPT Response
```
This ensures:
- Files are created before being attached
- Payment links are created before being included in emails
- Calendar events are created before links are sent
- GPT has full context of all actions

### 3. **Error Handling**
- Each agent handles its own errors
- Coordinator continues even if one agent fails
- GPT response explains what succeeded/failed

### 4. **Lazy Loading**
- `paymentAgent` is lazy-loaded (won't crash if Stripe not installed)
- Only loads when actually needed

---

## 📊 Agent Classification

### By Function:
- **Parsers**: `eventParser`, `invoiceParser`, `emailParser`
- **Actions**: `calendarAgent`, `invoiceAgent`, `paymentAgent`, `emailAgent`
- **Response**: `gptAgent`

### By Invocation:
- **Directly invoked by coordinator**: All agents
- **Invoked by other agents**: None (agents don't call each other)

### By Dependency:
- **Requires OAuth tokens**: `calendarAgent`, `emailAgent`
- **Requires external API keys**: `gptAgent` (OpenAI), `paymentAgent` (Stripe)
- **File operations**: `invoiceAgent`
- **No external dependencies**: Parsers (only use OpenAI)

---

## 🔑 Key Takeaways

1. **`agentCoordinator.js` is the brain** - it invokes ALL agents
2. **Agents are specialized** - each does ONE thing well
3. **Parsers extract, Agents act** - clear separation
4. **`gptAgent` generates the final message** - with context from other agents
5. **Workflow is orchestrated, not sequential** - coordinator manages the flow

---

## 🛠️ Adding a New Agent

1. Create agent file in `/agents/` (e.g., `newAgent.js`)
2. Create parser if needed (e.g., `newParser.js`)
3. Import in `agentCoordinator.js`
4. Add detection logic in `detectRequestTypes()`
5. Add handler method (e.g., `handleNewRequest()`)
6. Call handler in `processRequest()` with proper ordering
7. Update GPT context to include new agent results

---

This architecture ensures:
- ✅ Modularity (each agent is independent)
- ✅ Scalability (easy to add new agents)
- ✅ Maintainability (clear separation of concerns)
- ✅ Testability (agents can be tested individually)

