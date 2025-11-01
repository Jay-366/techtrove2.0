'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Bot, Search, Plus, Settings, Info, Calendar, Sparkles, MessageCircle, ChevronDown, Mail, FileText, CreditCard, Check, Clock, AlertCircle } from 'lucide-react';
import { useAIBoxChat } from '../lib/useAIBoxChat';
import SplitText from '../components/SplitText';
import { PromptInputBox } from '../components/ai-prompt-box';

// Helper to create a stable session id per tab
function useStableSessionId(key = 'aibox_session_id') {
  const ref = useRef(null);
  if (ref.current === null) {
    if (typeof window !== 'undefined') {
      const fromStore = window.sessionStorage.getItem(key);
      if (fromStore) {
        ref.current = fromStore;
      } else {
        const id =
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : String(Date.now()) + '-' + Math.random().toString(36).slice(2);
        window.sessionStorage.setItem(key, id);
        ref.current = id;
      }
    } else {
      ref.current = 'server-' + Date.now();
    }
  }
  return ref.current;
}

export default function ChatPage() {
  const sessionId = useStableSessionId();
  const [isMounted, setIsMounted] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('ai-agent');
  const [showInfoDrawer, setShowInfoDrawer] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const { messages, send, pending, error, clearMessages, confirmingAction, executeConfirmed } = useAIBoxChat();
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
      setShowScrollToBottom(false);
    }
  };

  // Handle scroll events
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollToBottom(!isNearBottom && messages.length > 0);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesContainerRef.current && messages.length > 0) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

      if (isNearBottom) {
        scrollToBottom();
      }
    }
  }, [messages]);

  if (!isMounted) {
    return null;
  }

  const agents = [
    {
      id: 'ai-agent',
      name: 'AIBox Agent',
      tag: 'AI Assistant & Calendar',
    },
  ];

  const handleDropdownAgentSelect = (agentId, agentName) => {
    console.log('Selected agent:', agentId, '-', agentName);
    setSelectedAgent(agentId);
  };


  const dropdownOptions = [
    {
      label: 'AIBox Agent',
      onClick: () => handleDropdownAgentSelect('ai-agent', 'AIBox Agent'),
    },
  ];

  const currentAgent = agents.find((a) => a.id === selectedAgent) || agents[0];

  const handleSend = (messageText, files = []) => {
    if (messageText && messageText.trim()) {
      send(messageText.trim(), { 
        sessionId, 
        agent: selectedAgent,
        email: 'user@example.com'
      });

      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  };

  return (
    <div
      className="flex"
      style={{
        backgroundColor: '#161823',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        padding: 0,
      }}
    >
      {/* Sidebar - Agent List */}
      <div
        className="hidden md:flex flex-col"
        style={{
          width: '280px',
          minWidth: '280px',
          backgroundColor: '#1C1F2B',
          borderRight: '1px solid rgba(80, 96, 108, 0.4)',
        }}
      >
        {/* Sidebar Header - Logo Row */}
        <div
          className="flex items-center gap-2 px-4"
          style={{
            height: '60px',
          }}
        >
          <Image
            src="/intellibox.png"
            alt="AIBox Logo"
            width={28}
            height={28}
            style={{
              objectFit: 'contain',
            }}
          />
          <h2
            style={{ color: '#FBede0', fontSize: '16px', fontWeight: 600 }}
          >
          </h2>
        </div>

        {/* Sidebar Content */}
        <div className="p-4">
          {/* Search Bar */}
          <div className="relative mb-3">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
              style={{ color: 'rgba(251, 237, 224, 0.5)' }}
            />
            <input
              type="text"
              placeholder="Search agent..."
              className="w-full pl-9 pr-3 py-2 rounded-xl outline-none transition-all"
              style={{
                backgroundColor: '#161823',
                border: '1px solid #50606C',
                color: 'rgba(251, 237, 224, 0.8)',
                fontSize: '14px',
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = '0 0 8px rgba(251, 237, 224, 0.12)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Agent Selection Dropdown */}
          <div className="mb-3">
            <div className="relative w-full">
              <button
                onClick={() => {
                  const firstOption = dropdownOptions[0];
                  if (firstOption) firstOption.onClick();
                }}
                className="w-full px-3 py-2 rounded-xl flex items-center justify-between transition-all duration-200"
                style={{
                  backgroundColor: '#161823',
                  border: '1px solid #50606C',
                  color: 'rgba(251, 237, 224, 0.8)',
                  fontSize: '14px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(80, 96, 108, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#161823';
                }}>
                <span>Select Agent</span>
                <ChevronDown className="w-4 h-4 opacity-50" />
              </button>
            </div>
          </div>

           {/* New Chat Button */}
           <div>
             <button
               onClick={clearMessages}
               className="w-full px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
               style={{
                 border: '1px solid #FBede0',
                 backgroundColor: 'transparent',
                 color: '#FBede0',
                 fontSize: '14px',
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.backgroundColor = '#FBede0';
                 e.currentTarget.style.color = '#161823';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.backgroundColor = 'transparent';
                 e.currentTarget.style.color = '#FBede0';
               }}>
               <Plus className="w-4 h-4" />
               New Chat
             </button>
           </div>
         </div>

         {/* Horizontal Line - Full Width */}
         <div
           style={{
             height: '1px',
             backgroundColor: 'rgba(80, 96, 108, 0.4)',
             width: '100%',
           }}
         />

        {/* Agent List */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="p-2">
            <h3
              className="mb-3 mt-2"
              style={{
                color: 'rgba(251, 237, 224, 0.6)',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Recent Chats
            </h3>

            <div className="space-y-1">
              {messages.length > 0 ? (
                // Show only the first user message as the current chat title
                (() => {
                  const firstUserMessage = messages.find(msg => msg.role === 'user');
                  if (firstUserMessage) {
                    return (
                      <button
                        className="w-full p-3 rounded-xl flex items-center gap-3 transition-all duration-200 text-left"
                        style={{ backgroundColor: 'transparent' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(80, 96, 108, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: 'rgba(251, 237, 224, 0.3)' }}
                        />
                        <div className="flex-1 min-w-0">
                          <div
                            style={{
                              color: 'rgba(251, 237, 224, 0.9)',
                              fontSize: '14px',
                            }}
                            className="truncate"
                          >
                            {firstUserMessage.content.substring(0, 30)}
                            {firstUserMessage.content.length > 30 ? '...' : ''}
                          </div>
                        </div>
                      </button>
                    );
                  }
                  return null;
                })()
              ) : (
                <div
                  style={{
                    color: 'rgba(251, 237, 224, 0.4)',
                    fontSize: '13px',
                    padding: '8px',
                  }}
                >
                  No recent chats
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Panel */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div
          className="flex items-center justify-between px-3 md:px-6"
          style={{
            height: '60px',
            backgroundColor: '#161823',
            borderBottom: '1px solid #50606C',
          }}
        >
          <div className="flex items-center gap-3">
            <div>
              <div
                style={{
                  color: '#FBede0',
                  fontSize: '15px',
                  fontWeight: 500,
                }}
              >
                {currentAgent.name}
              </div>
              <div
                style={{
                  color: 'rgba(251, 237, 224, 0.6)',
                  fontSize: '13px',
                }}
              >
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(80, 96, 108, 0.3)';
                e.currentTarget.style.boxShadow = '0 0 8px rgba(251, 237, 224, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Settings
                className="w-5 h-5"
                style={{ color: 'rgba(251, 237, 224, 0.8)' }}
              />
            </button>
            <button
              onClick={() => setShowInfoDrawer(!showInfoDrawer)}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(80, 96, 108, 0.3)';
                e.currentTarget.style.boxShadow = '0 0 8px rgba(251, 237, 224, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Info
                className="w-5 h-5"
                style={{ color: 'rgba(251, 237, 224, 0.8)' }}
              />
            </button>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-3 md:px-6 py-4 relative"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: messages.length === 0 ? 'center' : 'flex-start',
            alignItems: 'center',
          }}
        >
          <div className="max-w-4xl mx-auto space-y-2 w-full px-2 md:px-0" style={{ flex: messages.length === 0 ? 'none' : 1, display: 'flex', flexDirection: 'column', justifyContent: messages.length === 0 ? 'center' : 'flex-start' }}>
            {/* Welcome Message and Input - Only shown when no messages */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center" style={{ 
                gap: '32px',
                width: '100%'
              }}>
                <div
                  style={{
                    color: '#FBede0',
                    fontSize: 'clamp(24px, 5vw, 36px)',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    textAlign: 'center',
                  }}
                >
                  <SplitText
                    text="Hello, What can I help with?"
                    className="text-center"
                    tag="h2"
                    delay={100}
                    duration={0.8}
                  />
                  
                  {/* Description Text */}
                  <div
                    style={{
                      fontSize: 'clamp(12px, 3vw, 16px)',
                      textAlign: 'center',
                      color: 'rgba(251, 237, 224, 0.7)',
                      marginTop: '12px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Orchestrate your AI workflows with{' '}
                    <span style={{ color: 'oklch(89.9% 0.061 343.231)' }}>unprecedented</span>{' '}
                    <span style={{ color: 'oklch(89.9% 0.061 343.231)' }}>intelligence</span> and{' '}
                    <span style={{ color: 'oklch(91.7% 0.08 205.041)' }}>seamless coordination</span>
                  </div>
                </div>
                
                {/* AI Prompt Input Container - Empty State */}
                <div className="w-full max-w-3xl px-2 md:px-0" style={{ paddingBottom: '5px' }}>
                  <PromptInputBox
                    onSend={handleSend}
                    isLoading={pending}
                    placeholder="Message AIBox agent..."
                    className="w-full"
                  />
                </div>

                {/* Suggested Prompts */}
                <div className="w-full max-w-3xl flex flex-wrap justify-center gap-2 px-2 md:px-0">
                  {[
                    { text: 'Schedule a meeting', icon: Calendar, prompt: 'Schedule a meeting tomorrow at 2pm' },
                    { text: 'Plan my week', icon: Sparkles, prompt: 'Plan my week ahead' },
                    { text: 'What can you help with?', icon: MessageCircle, prompt: 'What can you help me with?' }
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          handleSend(item.prompt);
                        }}
                        className="px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5"
                        style={{
                          backgroundColor: 'rgba(251, 237, 224, 0.1)',
                          border: 'none',
                          color: 'rgba(251, 237, 224, 0.8)',
                          fontSize: '12px',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(251, 237, 224, 0.15)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(251, 237, 224, 0.1)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {item.text}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
                style={{
                  marginTop: index === 0 ? '5px' : '8px',
                  marginBottom: '0',
                }}
              >
                <div className="flex flex-col w-full max-w-[90%] md:max-w-[70%]">
                  <div
                    className="px-4 py-3 transition-all duration-200 rounded-2xl"
                    style={{
                      backgroundColor: msg.isError ? '#dc2626' : (
                        msg.role === 'user' ? '#50606C' : '#1C1F2B'
                      ),
                      border:
                        msg.role === 'assistant' && !msg.isError ? '1px solid #50606C' : 'none',
                      color: msg.isError ? '#FBede0' : '#FBede0',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {msg.content.trim()}
                    
                    {/* Confirmation buttons */}
                    {msg.requiresConfirmation && msg.detectedActions && (
                      <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(80, 96, 108, 0.5)' }}>
                        {/* Execution Plan Header */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold mb-1" style={{ color: '#FBede0' }}>
                            Execution Plan
                          </h4>
                          <p className="text-xs" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
                            A preview of AI agents being coordinated to complete your request.
                          </p>
                        </div>

                        {/* Agent List */}
                        <div className="space-y-3 mb-4">
                          {msg.detectedActions.map((action, idx) => {
                            console.log(`[Chat] ==== ACTION ${idx} DEBUG ====`);
                            console.log('[Chat] Full action object:', JSON.stringify(action, null, 2));
                            console.log(`[Chat] action.icon value:`, action.icon);
                            console.log(`[Chat] action.icon type:`, typeof action.icon);
                            
                            // Render icon directly based on icon name
                            const renderIcon = (iconName) => {
                              const iconProps = {
                                className: "w-4 h-4",
                                style: { color: 'rgba(251, 237, 224, 0.8)' }
                              };
                              
                              console.log(`[Chat] Switch checking icon: "${iconName}" (type: ${typeof iconName})`);
                              
                              switch(iconName) {
                                case 'Calendar':
                                  return <Calendar {...iconProps} />;
                                case 'Mail':
                                  return <Mail {...iconProps} />;
                                case 'FileText':
                                  return <FileText {...iconProps} />;
                                case 'CreditCard':
                                  return <CreditCard {...iconProps} />;
                                case 'MessageCircle':
                                  return <MessageCircle {...iconProps} />;
                                // default:
                                //   console.warn(`[Chat] ⚠️ USING DEFAULT ICON! iconName was: "${iconName}"`);
                                //   return <Settings {...iconProps} />;
                              }
                            };

                            return (
                              <div
                                key={idx}
                                className="p-3 rounded-lg border transition-all duration-200"
                                style={{
                                  backgroundColor: 'rgba(251, 237, 224, 0.05)',
                                  border: '1px solid rgba(251, 237, 224, 0.2)'
                                }}
                              >
                                {/* Agent Header */}
                                <div className="flex items-center gap-2 mb-2">
                                  {renderIcon(action.icon)}
                                  <span className="text-sm font-medium" style={{ color: '#FBede0' }}>
                                    {action.agent || action.description}
                                  </span>
                                </div>
                                
                                {/* Agent Description */}
                                <p className="text-xs leading-relaxed" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                                  {action.description || `Executes ${action.action || action.type} functionality`}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                        <button
                          onClick={() => {
                            // Get original message from the confirmation message itself
                            const originalMsg = msg.originalMessage || (confirmingAction?.originalMessage);
                            const email = msg.email || (confirmingAction?.email) || 'user@example.com';
                            if (originalMsg) {
                              executeConfirmed(originalMsg, email);
                            } else {
                              console.error('Original message not found for confirmation');
                            }
                          }}
                          className="px-4 py-2 rounded-lg transition-all duration-200 font-medium"
                          style={{
                            backgroundColor: '#FBede0',
                            color: '#161823',
                            border: 'none'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '0.9';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = '1';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                          disabled={pending}
                        >
                          Confirm & Execute
                        </button>
                      </div>
                    )}
                    
                    {/* Agent Execution Progress - Animated Progress Bars */}
                    {msg.isStatusTracking && (
                      <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(80, 96, 108, 0.5)' }}>
                        {console.log('[Progress] Status tracking message:', { 
                          isStatusTracking: msg.isStatusTracking, 
                          hasMetadata: !!msg.metadata,
                          statusUpdates: msg.metadata?.statusUpdates,
                          statusUpdatesLength: msg.metadata?.statusUpdates?.length 
                        })}
                        <div className="mb-3">
                          <h4 className="text-sm font-semibold mb-1" style={{ color: '#FBede0' }}>
                             Agent Execution Progress
                          </h4>
                          <p className="text-xs" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
                            Watch as multiple AI agents coordinate to complete your request
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          {msg.metadata?.statusUpdates && msg.metadata.statusUpdates.length > 0 ? (
                            // Group status updates by agent to show smooth transitions
                            (() => {
                              const agentGroups = {};
                              
                              // Group updates by agent type
                              msg.metadata.statusUpdates.forEach((update, idx) => {
                                const lowerMsg = update.message.toLowerCase();
                                let agentKey = 'general';
                                
                                if (lowerMsg.includes('calendar') || lowerMsg.includes('event')) {
                                  agentKey = 'calendar';
                                } else if (lowerMsg.includes('email') || lowerMsg.includes('mail')) {
                                  agentKey = 'email';
                                } else if (lowerMsg.includes('invoice')) {
                                  agentKey = 'invoice';
                                } else if (lowerMsg.includes('payment')) {
                                  agentKey = 'payment';
                                }
                                
                                if (!agentGroups[agentKey]) {
                                  agentGroups[agentKey] = [];
                                }
                                agentGroups[agentKey].push({ ...update, originalIndex: idx });
                              });
                              
                              return Object.entries(agentGroups).map(([agentKey, updates], agentIndex) => {
                                // Get the latest update for this agent
                                const latestUpdate = updates[updates.length - 1];
                                const isSuccess = latestUpdate.status === 'success';
                                const isError = latestUpdate.status === 'error';
                                const isProgress = latestUpdate.status === 'progress';
                                
                                // Calculate animation delay based on agent order (sequential)
                                const animationDelay = agentIndex * 2.5; // Each agent waits 2.5s for previous to finish
                                
                                // Map agent key to icon and info
                                const getAgentInfo = (key) => {
                                  switch(key) {
                                    case 'calendar':
                                      return { Icon: Calendar, name: 'Event Planning Agent', color: 'oklch(0.708 0 0)' };
                                    case 'email':
                                      return { Icon: Mail, name: 'Email Agent', color: 'oklch(0.708 0 0)' };
                                    case 'invoice':
                                      return { Icon: FileText, name: 'Invoice Agent', color: 'oklch(0.708 0 0)' };
                                    case 'payment':
                                      return { Icon: CreditCard, name: 'Payment Agent', color: 'oklch(0.708 0 0)' };
                                    default:
                                      return { Icon: MessageCircle, name: 'AI Agent', color: 'oklch(0.708 0 0)' };
                                  }
                                };
                                
                                const agentInfo = getAgentInfo(agentKey);
                                const AgentIcon = agentInfo.Icon;
                                
                                return (
                                  <div
                                    key={agentKey}
                                    className="p-3 rounded-lg transition-all duration-500 ease-in-out"
                                    style={{
                                      backgroundColor: 'rgba(251, 237, 224, 0.05)',
                                      border: '1px solid rgba(251, 237, 224, 0.15)',
                                      animation: `fadeInAgent 0.5s ease-out forwards ${animationDelay * 0.3}s`,
                                      opacity: 0
                                    }}
                                  >
                                    {/* Agent Header */}
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <AgentIcon 
                                          className="w-4 h-4 transition-all duration-300" 
                                          style={{ color: agentInfo.color }}
                                        />
                                        <span className="text-xs font-medium" style={{ color: '#FBede0' }}>
                                          {agentInfo.name}
                                        </span>
                                      </div>
                                      <div className="flex items-center transition-all duration-300">
                                        {isSuccess ? (
                                          <Check className="w-4 h-4 animate-in fade-in duration-300" style={{ color: '#10B981' }} />
                                        ) : isError ? (
                                          <AlertCircle className="w-4 h-4 animate-in fade-in duration-300" style={{ color: '#EF4444' }} />
                                        ) : (
                                          <Clock className="w-4 h-4 animate-pulse" style={{ color: 'oklch(0.708 0 0)' }} />
                                        )}
                                      </div>
                                    </div>
                                    
                                    {/* Status Message with smooth transition */}
                                    <p 
                                      className="text-xs mb-2 transition-all duration-500 ease-in-out" 
                                      key={latestUpdate.message} // Key triggers re-render for animation
                                      style={{ 
                                        color: isSuccess 
                                          ? 'rgba(34, 197, 94, 0.9)'
                                          : isError
                                          ? 'rgba(220, 38, 38, 0.9)'
                                          : 'rgba(251, 237, 224, 0.7)'
                                      }}
                                    >
                                      {latestUpdate.message}
                                    </p>
                                    
                                    {/* Animated Progress Bar with Sequential Timing */}
                                    <div 
                                      className="h-1.5 rounded-full overflow-hidden"
                                      style={{ backgroundColor: 'rgba(251, 237, 224, 0.1)' }}
                                    >
                                      <div
                                        className="h-full rounded-full progress-fill"
                                        style={{
                                          width: isSuccess ? '100%' : isProgress ? '60%' : '100%',
                                          backgroundColor: isSuccess 
                                            ? agentInfo.color
                                            : isError 
                                            ? '#EF4444'
                                            : agentInfo.color,
                                          animation: isProgress 
                                            ? `progressFill 2s ease-out forwards ${animationDelay}s, pulse 1.5s ease-in-out infinite ${animationDelay + 2}s` 
                                            : `progressFill 2s ease-out forwards ${animationDelay}s`,
                                          transformOrigin: 'left center',
                                          opacity: isSuccess ? '1' : isProgress ? '0.7' : '1'
                                        }}
                                      />
                                    </div>
                                  </div>
                                );
                              });
                            })()
                          ) : (
                            // Fallback: Show simple progress when no status updates yet
                            <div className="p-3 rounded-lg" style={{
                              backgroundColor: 'rgba(251, 237, 224, 0.05)',
                              border: '1px solid rgba(251, 237, 224, 0.15)'
                            }}>
                              <div className="flex items-center gap-2 mb-2">
                                <MessageCircle className="w-4 h-4" style={{ color: 'oklch(0.708 0 0)' }} />
                                <span className="text-xs font-medium" style={{ color: '#FBede0' }}>
                                  AI Agent Coordinator
                                </span>
                                <Clock className="w-4 h-4" style={{ color: 'oklch(0.708 0 0)' }} />
                              </div>
                              <p className="text-xs mb-2" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                                Initializing agent coordination...
                              </p>
                              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(251, 237, 224, 0.1)' }}>
                                <div className="h-full rounded-full progress-fill" style={{
                                  width: '30%',
                                  backgroundColor: 'oklch(0.708 0 0)',
                                  animation: 'progressFill 1.5s ease-out forwards, pulse 1.5s ease-in-out infinite 1.5s'
                                }} />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {pending && (
                          <div className="mt-3 flex items-center gap-2 text-xs" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
                            <div className="flex gap-1">
                              <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ 
                                backgroundColor: 'rgba(251, 237, 224, 0.6)',
                                animationDelay: '0ms'
                              }} />
                              <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ 
                                backgroundColor: 'rgba(251, 237, 224, 0.6)',
                                animationDelay: '150ms'
                              }} />
                              <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ 
                                backgroundColor: 'rgba(251, 237, 224, 0.6)',
                                animationDelay: '300ms'
                              }} />
                            </div>
                            <span>Coordinating agents...</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Show backend logs - visible in chat for transparency */}
                    {msg.metadata?.logs && msg.metadata.logs.length > 0 && (
                      <div className="mt-3 pt-3 border-t" style={{ borderColor: 'rgba(80, 96, 108, 0.5)' }}>
                        <div className="text-xs mb-1 font-mono" style={{ color: 'rgba(251, 237, 224, 0.4)' }}>Backend Processing:</div>
                        {msg.metadata.logs.slice(-5).map((log, idx) => (
                          <div 
                            key={idx} 
                            className="text-xs font-mono mb-1"
                            style={{ 
                              color: log.level === 'error' ? 'rgba(220, 38, 38, 0.7)' : 'rgba(251, 237, 224, 0.5)',
                              fontSize: '11px'
                            }}
                          >
                            [{new Date(log.timestamp).toLocaleTimeString()}] {log.message}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Show calendar event info if available */}
                    {msg.metadata?.calendar?.status === 'CREATED' && (
                      <div className="mt-2 pt-2 border-t border-gray-600">
                        <div className="text-xs text-green-400">
                           Calendar event created: {msg.metadata.calendar.eventSummary}
                        </div>
                        {msg.metadata.calendar.calendarLink && (
                          <a
                            href={msg.metadata.calendar.calendarLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-400 hover:underline"
                          >
                            View in Google Calendar →
                          </a>
                        )}
                      </div>
                    )}
                    {msg.metadata?.calendar?.authRequired && (
                      <div className="mt-2 pt-2 border-t border-gray-600">
                        <div className="text-xs text-yellow-400 mb-2">
                          🔐 Google Calendar needs to be connected
                        </div>
                        <a
                          href={msg.metadata.calendar.authUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:underline"
                        >
                          Connect Google Calendar →
                        </a>
                      </div>
                    )}
                  </div>
                  <div
                    className="mt-1 mb-0 text-right"
                    style={{
                      color: 'rgba(251, 237, 224, 0.5)',
                      fontSize: '12px',
                      lineHeight: '1.2',
                    }}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {pending && (
              <div className="flex justify-start">
                <div
                  className="px-4 py-3 rounded-2xl flex items-center gap-1"
                  style={{
                    backgroundColor: '#50606C',
                    maxWidth: '80px',
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: 'rgba(251, 237, 224, 0.7)',
                      animationDelay: '0ms',
                    }}
                  />
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: 'rgba(251, 237, 224, 0.7)',
                      animationDelay: '150ms',
                    }}
                  />
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: 'rgba(251, 237, 224, 0.7)',
                      animationDelay: '300ms',
                    }}
                  />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Scroll to Bottom Button */}
        {showScrollToBottom && (
          <div
            className="absolute bottom-48 left-1/2 transform translate-x-8 z-20"
            style={{ marginLeft: '1cm' }}
          >
            <button
              onClick={scrollToBottom}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <svg
                width="32px"
                height="32px"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12C1.25 6.06294 6.06294 1.25 12 1.25ZM9.03033 10.4697C8.73744 10.1768 8.26256 10.1768 7.96967 10.4697C7.67678 10.7626 7.67678 11.2374 7.96967 11.5303L11.4697 15.0303C11.7626 15.3232 12.2374 15.3232 12.5303 15.0303L16.0303 11.5303C16.3232 11.2374 16.3232 10.7626 16.0303 10.4697C15.7374 10.1768 15.2626 10.1768 14.9697 10.4697L12 13.4393L9.03033 10.4697Z"
                  fill="#FBede0"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Input Bar (Fixed Bottom) - Only shown when there are messages */}
        {messages.length > 0 && (
        <div
          className="px-3 md:px-6"
          style={{
            backgroundColor: '#161823',
            paddingTop: '12px',
            paddingBottom: '17px',
            marginBottom: '5px',
          }}
        >
          <div className="max-w-4xl mx-auto px-2 md:px-0">
            <PromptInputBox
              onSend={handleSend}
              isLoading={pending}
              placeholder="Message AIBox agent..."
              className="w-full"
            />
          </div>
        </div>
        )}
      </div>

      {/* Info Drawer */}
      {showInfoDrawer && (
        <div
          className="transition-all duration-300 overflow-y-auto fixed md:relative inset-y-0 right-0 z-50"
          style={{
            width: '100%',
            maxWidth: '360px',
            backgroundColor: '#1C1F2B',
            borderLeft: '1px solid #50606C',
            animation: 'slideIn 300ms ease-out',
          }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3
                style={{
                  color: '#FBede0',
                  fontSize: '18px',
                  fontWeight: 600,
                }}
              >
                Agent Info
              </h3>
              <button
                onClick={() => setShowInfoDrawer(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(80, 96, 108, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <div
                  style={{
                    color: '#FBede0',
                    fontSize: '20px',
                    fontWeight: 600,
                    marginBottom: '8px',
                  }}
                >
                  {currentAgent.name}
                </div>
                <div
                  style={{
                    color: 'rgba(251, 237, 224, 0.6)',
                    fontSize: '14px',
                  }}
                >
                  {currentAgent.tag}
                </div>
              </div>

              <div>
                <div
                  className="mb-2"
                  style={{
                    color: 'rgba(251, 237, 224, 0.7)',
                    fontSize: '13px',
                  }}
                >
                  Model Version
                </div>
                <div style={{ color: '#FBede0', fontSize: '14px' }}>
                  GPT-4o-mini
                </div>
              </div>

              <div>
                <div
                  className="mb-2"
                  style={{
                    color: 'rgba(251, 237, 224, 0.7)',
                    fontSize: '13px',
                  }}
                >
                  Skills
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Chat', 'Calendar', 'Event Planning', 'Natural Language'].map(
                    (skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-lg"
                        style={{
                          backgroundColor: '#50606C',
                          color: '#FBede0',
                          fontSize: '12px',
                        }}
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div>
                <div
                  className="mb-3"
                  style={{
                    color: 'rgba(251, 237, 224, 0.7)',
                    fontSize: '13px',
                  }}
                >
                  Backend API
                </div>
                <div style={{ color: '#FBede0', fontSize: '12px' }}>
                  http://127.0.0.1:5000
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.7;
            transform: scaleX(1);
          }
          50% {
            opacity: 1;
            transform: scaleX(1.02);
          }
        }

        @keyframes progressFill {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @keyframes fadeInAgent {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .progress-fill {
          transform-origin: left center;
          transform: scaleX(0);
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes animate-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-in {
          animation: animate-in 0.3s ease-out;
        }

        .fade-in {
          animation: fade-in 0.3s ease-out;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        input::placeholder,
        textarea::placeholder {
          color: rgba(251, 237, 224, 0.5);
        }

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(80, 96, 108, 0.5);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(80, 96, 108, 0.7);
        }
      `}</style>
    </div>
  );
}

