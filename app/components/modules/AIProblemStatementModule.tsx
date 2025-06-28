'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RefreshCw, Save, ChevronRight } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIProblemStatementModuleProps {
  ventureId: string;
  onComplete: (artifact: any) => void;
  existingArtifact?: any;
}

export default function AIProblemStatementModule({
  ventureId,
  onComplete,
  existingArtifact
}: AIProblemStatementModuleProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm here to help you create a strong problem statement for your startup. Let's start with understanding who you're trying to help. Can you tell me about the specific group of people or businesses that experience the problem you want to solve?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState<Record<string, any>>({});
  const [stage, setStage] = useState<'discovery' | 'refinement' | 'validation'>('discovery');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          context: {
            stage,
            previousAnswers: context,
            currentModule: 'Problem Statement'
          }
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.content,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        // Extract and update context
        updateContext(userMessage.content, data.content);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: error.message.includes('API key') 
          ? "It looks like the API key isn't configured. Please add your Anthropic API key to the .env.local file."
          : "I'm having trouble connecting right now. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateContext = (userInput: string, aiResponse: string) => {
    // Simple context extraction - in production, this would be more sophisticated
    if (messages.length < 3) {
      setContext(prev => ({ ...prev, targetCustomer: userInput }));
    } else if (messages.length < 5) {
      setContext(prev => ({ ...prev, problemDescription: userInput }));
    } else if (messages.length < 7) {
      setContext(prev => ({ ...prev, currentSolutions: userInput }));
    }
    
    // Progress through stages
    if (messages.length > 6 && stage === 'discovery') {
      setStage('refinement');
    } else if (messages.length > 12 && stage === 'refinement') {
      setStage('validation');
    }
  };

  const generateProblemStatement = () => {
    // AI would help generate this, but for now, use context
    const statement = `
## Problem Statement

**Target Customer**: ${context.targetCustomer || 'To be defined'}

**Core Problem**: ${context.problemDescription || 'To be defined'}

**Current Solutions**: ${context.currentSolutions || 'To be defined'}

**Our Opportunity**: Based on our conversation, there's an opportunity to create a solution that addresses these unmet needs more effectively.

### Key Insights from Our Discussion:
${messages
  .filter(m => m.role === 'user')
  .map((m, i) => `${i + 1}. ${m.content}`)
  .join('\n')}
    `;
    
    return statement;
  };

  const saveProblemStatement = async () => {
    const problemStatement = generateProblemStatement();
    
    try {
      const response = await fetch('/api/artifacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'problem_statement',
          status: 'complete',
          content: {
            statement: problemStatement,
            conversation: messages,
            context
          },
          moduleId: 'problem',
          isFoundational: true,
          ventureId
        })
      });
      
      if (response.ok) {
        const artifact = await response.json();
        onComplete(artifact);
      }
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const restartConversation = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: "Let's start fresh. Tell me about the problem you're passionate about solving. Who experiences this problem?",
      timestamp: new Date()
    }]);
    setContext({});
    setStage('discovery');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 h-[calc(100vh-200px)]">
      <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
        <div className="border-b p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">AI-Guided Problem Statement</h1>
              <p className="text-sm text-gray-600 mt-1">
                Stage: <span className="font-medium capitalize">{stage}</span> • 
                Messages: {messages.length}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={restartConversation}
                className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Restart
              </button>
              {messages.length > 4 && (
                <button
                  onClick={saveProblemStatement}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save & Complete
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className={`flex gap-3 max-w-[80%] ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}>
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                  ${message.role === 'user' ? 'bg-blue-600' : 'bg-gray-600'}
                `}>
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className={`
                  rounded-lg p-4 
                  ${message.role === 'user' 
                    ? 'bg-blue-100 text-blue-900' 
                    : 'bg-gray-100 text-gray-900'
                  }
                `}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-60 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your response..."
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            The AI mentor will guide you through creating a clear, actionable problem statement.
          </p>
        </div>
      </div>
    </div>
  );
}