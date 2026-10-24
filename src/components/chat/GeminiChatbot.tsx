/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User as UserIcon,
  Sparkles,
  Zap,
  Shield,
  Loader2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useFirebaseAuth } from '../../features/auth/useFirebaseAuth';

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'model';
  content: string;
  modelUsed?: string;
  timestamp: string;
}

export const GeminiChatbot: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { user, saveChatMessageToFirestore } = useFirebaseAuth();

  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'welcome',
      role: 'model',
      content:
        'Namaste! I am your SwarGuard Cyber Safety Advisor. If you have received a suspicious call claiming you are under "Digital Arrest", your bank KYC is expiring, or a courier parcel was seized, describe what the caller said and I will analyze the threat markers.',
      modelUsed: 'gemini-3.8-flash',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<
    'gemini-3.8-flash' | 'gemini-4-argon' | 'gemini-3.1-flash-lite'
  >('gemini-3.8-flash');

  const [selectedRole, setSelectedRole] = useState<'advisor' | 'forensic' | 'senior'>('advisor');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const rolesConfig = {
    advisor: {
      name: 'Safety Advisor',
      modelDefault: 'gemini-3.8-flash' as const,
      systemInstruction:
        'You are SwarGuard Cyber Safety Advisor, an expert in detecting Indian telephonic voice scams (Digital Arrest, fake KYC, courier extortion). Provide clear, evidence-based guidance and actionable protective steps.',
    },
    forensic: {
      name: 'Forensic Investigator',
      modelDefault: 'gemini-4-argon' as const,
      systemInstruction:
        'You are a senior cyber fraud forensic investigator. Dissect suspect speech and caller coercion tactics with high analytical rigor, citing statutory context (e.g. Indian Penal Code, PMLA, lack of legal basis for "digital arrest"), identifying psychological manipulation tactics, and prescribing evidence-backed defensive actions.',
    },
    senior: {
      name: 'Senior Companion',
      modelDefault: 'gemini-3.1-flash-lite' as const,
      systemInstruction:
        'You are a warm, reassuring, patient voice safety companion helping senior citizens and families in India. Explain telephonic fraud in simple, calm, non-technical language. Reassure the user that they are safe, urge them not to send money, and advise them to talk to a trusted family member.',
    },
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessageItem = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInput('');
    setIsLoading(true);

    // Persist user message to Firestore if authenticated
    if (user) {
      await saveChatMessageToFirestore(
        'user',
        userMessage.content,
        selectedModel,
        rolesConfig[selectedRole].name
      );
    }

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedHistory.map((m) => ({ role: m.role, content: m.content })),
          systemInstruction: rolesConfig[selectedRole].systemInstruction,
          model: selectedModel,
          role: rolesConfig[selectedRole].name,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate response');
      }

      const botMessage: ChatMessageItem = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: data.response,
        modelUsed: data.modelUsed || selectedModel,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Persist bot message to Firestore if authenticated
      if (user) {
        await saveChatMessageToFirestore(
          'model',
          botMessage.content,
          botMessage.modelUsed || selectedModel,
          rolesConfig[selectedRole].name
        );
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessageItem = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `Error: ${err.message || 'Could not connect to Gemini service. Please verify server API key.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (roleKey: 'advisor' | 'forensic' | 'senior') => {
    setSelectedRole(roleKey);
    setSelectedModel(rolesConfig[roleKey].modelDefault);
  };

  const quickStarters = [
    'I got a call saying CBI issued a digital arrest warrant for me.',
    'Bank manager called saying my ATM is blocked unless I give OTP.',
    'FedEx called saying contraband narcotics were found in my parcel.',
  ];

  return (
    <Card variant="base" className={`flex flex-col h-[650px] p-0 overflow-hidden ${className}`}>
      {/* Chat Header Toolbar */}
      <div className="p-4 bg-[#171F3A] border-b border-[#263359] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#F2A65A]/20 border border-[#F2A65A]/40 flex items-center justify-center text-[#F2A65A]">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F6F3EC]">SwarGuard Gemini Chat</h3>
            <p className="text-[11px] text-[#9AA6BC]">
              Multi-turn voice scam advisory & interrogation assistance
            </p>
          </div>
        </div>

        {/* Model & Role Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Role Preset Selector */}
          <div className="flex items-center gap-1 bg-[#0B1020] p-1 rounded-lg border border-[#263359]">
            {(['advisor', 'forensic', 'senior'] as const).map((r) => (
              <button
                key={r}
                onClick={() => handleRoleChange(r)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors whitespace-nowrap cursor-pointer ${
                  selectedRole === r
                    ? 'bg-[#171F3A] text-[#F2A65A] border border-[#263359]'
                    : 'text-[#9AA6BC] hover:text-[#F6F3EC]'
                }`}
              >
                {rolesConfig[r].name}
              </button>
            ))}
          </div>

          {/* Model Selector Tag */}
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value as any)}
            className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-[#0B1020] border border-[#263359] text-[#56D6C2] focus:outline-none focus:border-[#F2A65A]"
          >
            <option value="gemini-3.8-flash">gemini-3.8-flash (General)</option>
            <option value="gemini-4-argon">gemini-4-argon (Complex)</option>
            <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast)</option>
          </select>
        </div>
      </div>

      {/* Message Thread (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0B1020]/40">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-[#F2A65A] text-[#0B1020]'
                    : 'bg-[#171F3A] border border-[#263359] text-[#56D6C2]'
                }`}
              >
                {isUser ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-[#F2A65A] text-[#0B1020] font-medium rounded-tr-none'
                    : 'bg-[#171F3A] text-[#F6F3EC] border border-[#263359] rounded-tl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                <div
                  className={`flex items-center justify-between gap-2 mt-2 pt-1 border-t text-[10px] font-mono tabular-nums ${
                    isUser
                      ? 'border-[#0B1020]/20 text-[#0B1020]/80'
                      : 'border-[#263359] text-[#9AA6BC]'
                  }`}
                >
                  {!isUser && msg.modelUsed && (
                    <span className="font-semibold text-[#56D6C2]">{msg.modelUsed}</span>
                  )}
                  <span className="ml-auto">{msg.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#171F3A] border border-[#263359] flex items-center justify-center text-[#56D6C2]">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-[#171F3A] p-3 rounded-2xl rounded-tl-none border border-[#263359] text-xs text-[#9AA6BC] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#F2A65A] animate-pulse" />
              <span>Analyzing scenario with {selectedModel}...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Starters */}
      {messages.length <= 2 && (
        <div className="p-2.5 bg-[#12192F] border-t border-[#263359] flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] text-[#9AA6BC] font-medium shrink-0">Try:</span>
          {quickStarters.map((starter, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(starter)}
              className="text-[11px] text-[#F6F3EC] bg-[#0B1020] hover:bg-[#171F3A] px-2.5 py-1 rounded-full border border-[#263359] whitespace-nowrap cursor-pointer transition-colors"
            >
              {starter}
            </button>
          ))}
        </div>
      )}

      {/* Message Input Footer */}
      <div className="p-3 bg-[#12192F] border-t border-[#263359]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${rolesConfig[selectedRole].name} about a call or threat...`}
            disabled={isLoading}
            className="flex-1 bg-[#0B1020] border border-[#263359] text-xs text-[#F6F3EC] px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#F2A65A]"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!input.trim() || isLoading}
            rightIcon={<Send className="w-4 h-4" />}
          >
            Send
          </Button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-[#9AA6BC] mt-2 px-1">
          <span>Active Role: {rolesConfig[selectedRole].name}</span>
          {user ? (
            <span className="text-[#56D6C2]">✓ Chat synced to Firestore</span>
          ) : (
            <span>Sign in to persist chat history</span>
          )}
        </div>
      </div>
    </Card>
  );
};
