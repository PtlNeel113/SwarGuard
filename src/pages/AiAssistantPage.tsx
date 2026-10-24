/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bot, Mic, Radio, MessageSquare, ShieldAlert, Sparkles, Database } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { GeminiChatbot } from '../components/chat/GeminiChatbot';
import { AudioTranscriber } from '../components/audio/AudioTranscriber';
import { LiveVoiceConversation } from '../components/audio/LiveVoiceConversation';
import { GroundedSearchIntelligence } from '../components/chat/GroundedSearchIntelligence';
import { FixtureTag } from '../components/ui/StatusBadge';
import { useFirebaseAuth } from '../features/auth/useFirebaseAuth';
import { useI18n } from '../i18n/i18nContext';
import { Globe } from 'lucide-react';

export const AiAssistantPage: React.FC = () => {
  const { t } = useI18n();
  const { user } = useFirebaseAuth();
  const [activeTab, setActiveTab] = useState<'chat' | 'live' | 'transcribe' | 'grounded'>('chat');

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        title="Gemini Intelligence Hub & Voice Safety Assistant"
        subtitle="Conversational threat interrogation, real-time live voice guidance, and microphone transcription powered by Google Gemini models."
        kicker="Full-Stack Gemini AI Suite"
        actions={
          <div className="flex items-center gap-2">
            {user ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-[#56D6C2] bg-[#12192F] border border-[#56D6C2]/40 px-3 py-1 rounded-lg">
                <Database className="w-3.5 h-3.5" />
                Firestore Synced
              </span>
            ) : (
              <span className="text-xs text-[#9AA6BC]">Demo Mode (Sign in for Cloud Sync)</span>
            )}
          </div>
        }
      />

      {/* Feature Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#12192F] border border-[#263359] overflow-x-auto">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'chat'
              ? 'bg-[#171F3A] text-[#F2A65A] border border-[#263359] shadow-sm'
              : 'text-[#9AA6BC] hover:text-[#F6F3EC]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Multi-Turn Chatbot</span>
          <span className="text-[10px] font-mono text-[#56D6C2] opacity-80">(gemini-3.8 / 4-argon)</span>
        </button>

        <button
          onClick={() => setActiveTab('live')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'live'
              ? 'bg-[#171F3A] text-[#F2A65A] border border-[#263359] shadow-sm'
              : 'text-[#9AA6BC] hover:text-[#F6F3EC]'
          }`}
        >
          <Radio className="w-4 h-4 text-[#F2A65A]" />
          <span>Live Voice Call</span>
          <span className="text-[10px] font-mono text-[#F2A65A] opacity-80">(gemini-3.8-live)</span>
        </button>

        <button
          onClick={() => setActiveTab('transcribe')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'transcribe'
              ? 'bg-[#171F3A] text-[#F2A65A] border border-[#263359] shadow-sm'
              : 'text-[#9AA6BC] hover:text-[#F6F3EC]'
          }`}
        >
          <Mic className="w-4 h-4 text-[#56D6C2]" />
          <span>Microphone Transcription</span>
          <span className="text-[10px] font-mono text-[#56D6C2] opacity-80">(gemini-3.5-transcribe)</span>
        </button>

        <button
          onClick={() => setActiveTab('grounded')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'grounded'
              ? 'bg-[#171F3A] text-[#A855F7] border border-[#263359] shadow-sm'
              : 'text-[#9AA6BC] hover:text-[#F6F3EC]'
          }`}
        >
          <Globe className="w-4 h-4 text-[#0EA5E9]" />
          <span>Search Grounding Intel</span>
          <span className="text-[10px] font-mono text-[#0EA5E9] opacity-80">(gemini-3.8-flash)</span>
        </button>
      </div>

      {/* Active Tab View */}
      {activeTab === 'chat' && (
        <div className="space-y-4">
          <GeminiChatbot />
        </div>
      )}

      {activeTab === 'live' && (
        <div className="space-y-4">
          <LiveVoiceConversation />
        </div>
      )}

      {activeTab === 'transcribe' && (
        <div className="space-y-4">
          <AudioTranscriber />
        </div>
      )}

      {activeTab === 'grounded' && (
        <div className="space-y-4">
          <GroundedSearchIntelligence />
        </div>
      )}
    </div>
  );
};
