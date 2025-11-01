import { coordinateAgents } from './agentCoordinator.js';

/**
 * Handles user chat requests
 * Uses Agent Coordinator to orchestrate multiple agents
 */
export async function handleUserRequest(message, email) {
  try {
    console.log(`\n💬 User request: ${message}`);
    
    // Use coordinator to orchestrate agents
    const result = await coordinateAgents(message, 'demoUser');

    return {
      status: 'ok',
      response: result.message,
      calendar: result.calendar,
      actions: result.actions,
      logs: result.logs || [], // Include backend logs for frontend display
      userId: 'demoUser'
    };

  } catch (error) {
    console.error('Error in handleUserRequest:', error);
    return {
      status: 'error',
      message: error.message,
      echo: { message, email }
    };
  }
}

