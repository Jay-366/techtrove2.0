import { gptAgent } from './agents/gptAgent.js';
import { calendarAgent } from './agents/calendarAgent.js';
import { eventParser } from './agents/eventParser.js';

/**
 * Agent Coordinator - Orchestrates multiple agents to fulfill user requests
 * This is the collaboration layer that coordinates between different agents
 */
export class AgentCoordinator {
  constructor(userId = 'demoUser') {
    this.userId = userId;
    this.results = {};
  }

  /**
   * Process user request and coordinate appropriate agents
   * @param {string} userPrompt - User's request
   * @returns {Promise<Object>} Coordinated result from all agents
   */
  async processRequest(userPrompt) {
    this.results = {
      message: '',
      calendar: null,
      actions: []
    };

    // Detect what type of request this is
    const requestType = this.detectRequestType(userPrompt);
    console.log(`[Coordinator] Detected request type: ${requestType}`);

    // Handle calendar requests
    if (requestType === 'calendar') {
      await this.handleCalendarRequest(userPrompt);
    }

    // Always get GPT response (with context about actions taken)
    await this.handleGPTResponse(userPrompt);

    return this.results;
  }

  /**
   * Detect what type of request the user is making
   * @param {string} prompt - User prompt
   * @returns {string} Request type: 'calendar', 'general', etc.
   */
  detectRequestType(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    if (/schedule|calendar|meeting|book|appointment|remind|event/i.test(lowerPrompt)) {
      return 'calendar';
    }
    
    return 'general';
  }

  /**
   * Handle calendar-related requests
   * @param {string} userPrompt - User's calendar request
   */
  async handleCalendarRequest(userPrompt) {
    try {
      console.log('[Coordinator] Processing calendar request...');
      
      // Parse event details from natural language
      const eventDetails = await eventParser(userPrompt);
      console.log('[Coordinator] Parsed event:', eventDetails);

      // Create calendar event
      const calendarResult = await calendarAgent({
        userId: this.userId,
        summary: eventDetails.summary,
        startISO: eventDetails.startISO,
        endISO: eventDetails.endISO,
        description: eventDetails.description
      });

      this.results.calendar = calendarResult;
      this.results.actions.push({
        type: 'calendar',
        status: 'success',
        result: calendarResult
      });
      
      console.log('[Coordinator] ✅ Calendar event created');

    } catch (error) {
      console.error('[Coordinator] Calendar error:', error.message);
      
      if (error.needAuth) {
        this.results.calendar = {
          error: 'Google Calendar not connected',
          authRequired: true,
          authUrl: error.authUrl,
          message: 'Calendar connection required'
        };
      } else {
        this.results.calendar = {
          error: error.message,
          message: 'Failed to create calendar event'
        };
      }
      
      this.results.actions.push({
        type: 'calendar',
        status: 'error',
        error: error.message
      });
    }
  }

  /**
   * Get GPT response with context about actions taken
   * @param {string} userPrompt - Original user prompt
   */
  async handleGPTResponse(userPrompt) {
    try {
      // Build system message with context about actions taken
      let systemContext = 'You are a helpful AI assistant.';
      
      if (this.results.calendar?.status === 'CREATED') {
        systemContext += ` The user just asked to schedule something, and you successfully created a calendar event. Confirm this naturally in your response. Event: ${this.results.calendar.eventSummary} at ${this.results.calendar.start}.`;
      } else if (this.results.calendar?.authRequired) {
        systemContext += ` The user asked to schedule something, but Google Calendar needs to be connected. Mention this in a helpful way.`;
      }

      // Get GPT response
      const gptResponse = await gptAgent(userPrompt, systemContext);
      this.results.message = gptResponse;
      
      console.log('[Coordinator] ✅ GPT response generated');

    } catch (error) {
      console.error('[Coordinator] GPT error:', error.message);
      this.results.message = `I encountered an error: ${error.message}`;
    }
  }
}

/**
 * Convenience function to process a request
 * @param {string} userPrompt - User's request
 * @param {string} userId - User identifier
 * @returns {Promise<Object>} Coordinated result
 */
export async function coordinateAgents(userPrompt, userId = 'demoUser') {
  const coordinator = new AgentCoordinator(userId);
  return await coordinator.processRequest(userPrompt);
}

