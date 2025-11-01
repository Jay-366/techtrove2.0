import { useState, useCallback } from 'react';

/**
 * Custom hook for AIBox chat functionality
 * Connects to the AIBox backend API
 */
export function useAIBoxChat() {
  const [messages, setMessages] = useState([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

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
      // Call AIBox backend API
      const response = await fetch('http://127.0.0.1:5000/chatRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          email: options.email || 'user@example.com'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Extract GPT response
      const assistantMessage = {
        role: 'assistant',
        content: data.response || data.message || 'No response',
        timestamp: new Date().toISOString(),
        metadata: {
          calendar: data.calendar,
          actions: data.actions,
          status: data.status,
          logs: data.logs || [] // Include backend processing logs
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
      
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
  }, []);

  return {
    messages,
    send,
    pending,
    error,
    clearMessages
  };
}

