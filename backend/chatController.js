import { coordinateAgents } from './agentCoordinator.js';

/**
 * Handles user chat requests
 * Uses Agent Coordinator to orchestrate multiple agents
 */
export async function handleUserRequest(message, email, confirmExecute = false) {
  try {
    console.log(`\n💬 User request: ${message}`);
    
    const { AgentCoordinator } = await import('./agentCoordinator.js');
    const coordinator = new AgentCoordinator('demoUser');
    
    // If confirmExecute is false, only detect actions (confirmation step)
    if (!confirmExecute) {
      const detection = await coordinator.detectActions(message);
      
      // If actions detected, return confirmation request
      if (detection.hasActions) {
        const agentList = detection.actions.map(a => a.agent).join(' and ');
        const actionList = detection.actions.map(a => a.action).join(', ');
        
        return {
          status: 'confirmation_required',
          detectedActions: detection.actions,
          message: `${agentList} will be called to execute: ${actionList}. Would you like me to proceed?`,
          originalMessage: message
        };
      }
      
      // No actions, just regular chat - use GPT agent directly
      const { gptAgent } = await import('./agents/gptAgent.js');
      const gptResponse = await gptAgent(message);
      return {
        status: 'ok',
        response: gptResponse,
        userId: 'demoUser'
      };
    }
    
    // Execute mode - run all agents
    const result = await coordinateAgents(message, 'demoUser', true);

    return {
      status: 'ok',
      response: result.message,
      calendar: result.calendar,
      actions: result.actions,
      logs: result.logs || [],
      statusUpdates: result.statusUpdates || [], // Include status updates for progress display
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
