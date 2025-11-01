import { useState, useCallback } from 'react';

/**
 * Custom hook for AIBox chat functionality
 * Connects to the AIBox backend API
 */
export function useAIBoxChat() {
  const [messages, setMessages] = useState([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [confirmingAction, setConfirmingAction] = useState(null);

  const executeConfirmed = useCallback(async (originalMessage, email) => {
    if (!originalMessage) {
      console.error('executeConfirmed: No original message provided');
      return;
    }
    
    console.log('Executing confirmed action:', { originalMessage, email });
    setPending(true);
    setConfirmingAction(null);
    
    // Remove the confirmation message
    setMessages(prev => prev.filter(msg => 
      !(msg.role === 'assistant' && msg.requiresConfirmation)
    ));

    // Add status tracking message
    const statusMessage = {
      role: 'assistant',
      content: 'Executing actions...',
      timestamp: new Date().toISOString(),
      isStatusTracking: true,
      statusUpdates: []
    };
    setMessages(prev => [...prev, statusMessage]);

    try {
      const response = await fetch('http://127.0.0.1:5000/chatRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: originalMessage,
          email: email || 'user@example.com',
          confirmExecute: true
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Update status message with final result
      setMessages(prev => {
        const updated = prev.map(msg => {
          if (msg.isStatusTracking) {
            return {
              role: 'assistant',
              content: data.response || data.message || 'Actions completed',
              timestamp: new Date().toISOString(),
              isStatusTracking: true, // Keep this property!
              metadata: {
                calendar: data.calendar,
                actions: data.actions,
                status: data.status,
                logs: data.logs || [],
                statusUpdates: data.statusUpdates || []
              }
            };
          }
          return msg;
        });
        return updated;
      });
      
    } catch (err) {
      console.error('Error executing confirmed action:', err);
      setError(err.message);
      
      // Replace status message with error
      setMessages(prev => {
        const updated = prev.map(msg => {
          if (msg.isStatusTracking) {
            return {
              role: 'assistant',
              content: `Error: ${err.message}`,
              timestamp: new Date().toISOString(),
              isError: true
            };
          }
          return msg;
        });
        return updated;
      });
    } finally {
      setPending(false);
    }
  }, []);

  const send = useCallback(async (message, options = {}) => {
    if (!message.trim()) return;

    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setPending(true);
    setError(null);

    try {
      // Call AIBox backend API (detection mode)
      const response = await fetch('http://127.0.0.1:5000/chatRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          email: options.email || 'user@example.com',
          confirmExecute: false
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // If confirmation required, show confirmation message
      if (data.status === 'confirmation_required') {
        setConfirmingAction({
          originalMessage: data.originalMessage || message,
          detectedActions: data.detectedActions,
          email: options.email || 'user@example.com'
        });

        const confirmationMessage = {
          role: 'assistant',
          content: data.message || 'I detected actions that need confirmation.',
          timestamp: new Date().toISOString(),
          requiresConfirmation: true,
          detectedActions: data.detectedActions,
          originalMessage: data.originalMessage || message, // Store original message for execution
          email: options.email || 'user@example.com' // Store email for execution
        };
        
        setMessages(prev => [...prev, confirmationMessage]);
      } else {
        // Regular response (no actions)
        const assistantMessage = {
          role: 'assistant',
          content: data.response || data.message || 'No response',
          timestamp: new Date().toISOString(),
          metadata: {
            calendar: data.calendar,
            actions: data.actions,
            status: data.status,
            logs: data.logs || []
          }
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
      
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message);
      
      // Add error message
      const errorMessage = {
        role: 'assistant',
        content: `Error: ${err.message}`,
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setPending(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    setConfirmingAction(null);
  }, []);

  return {
    messages,
    send,
    pending,
    error,
    clearMessages,
    confirmingAction,
    executeConfirmed
  };
}

