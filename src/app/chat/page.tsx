'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/lib/context';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Disclaimer from '@/components/Disclaimer';
import { MessageSquare, Send, Mic, MicOff, Trash2, HelpCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { AIChatResult } from '@/lib/ai';

interface ChatBubble {
  id?: string;
  sender: 'user' | 'ai';
  content: string;
  confidence?: number;
  limitations?: string;
  expertWarning?: string;
}

export default function ChatScreen() {
  const { t, language, apiKeys } = useApp();
  const [messages, setMessages] = useState<ChatBubble[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-US';

        rec.onstart = () => setIsRecording(true);
        rec.onend = () => setIsRecording(false);
        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        };
        rec.onerror = (e: any) => {
          console.error("Speech recognition error:", e);
          setIsRecording(false);
        };
        recognitionRef.current = rec;
      }
    }
  }, [language]);

  // Load chat history from SQLite on mount
  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch('/api/chat?sessionId=default');
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error("Failed loading chat history:", err);
      }
    }
    fetchHistory();
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported on this browser. Please use Google Chrome, Edge or Safari.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setErrorMsg(null);
      recognitionRef.current.start();
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    if (!textToSend) {
      setInputText('');
    }

    // Append user message immediately
    const userMsg: ChatBubble = { sender: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setErrorMsg(null);

    // Map message formats for LLM history context
    const historyContext = messages.map(m => ({
      role: m.sender,
      text: m.content
    }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyContext,
          sessionId: 'default',
          lang: language,
          keys: apiKeys
        })
      });

      if (!res.ok) {
        throw new Error("Chatbot API failed.");
      }

      const aiData: AIChatResult = await res.json();
      
      const aiMsg: ChatBubble = {
        sender: 'ai',
        content: aiData.content,
        confidence: aiData.confidence,
        limitations: aiData.limitations,
        expertWarning: aiData.expertWarning
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to receive chatbot reply. Please check connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearChatHistory = async () => {
    if (confirm("Are you sure you want to clear chat logs?")) {
      try {
        const res = await fetch('/api/chat?sessionId=default', {
          method: 'DELETE'
        });
        if (res.ok) {
          setMessages([]);
        }
      } catch (err) {
        console.error("Failed to clear chat history:", err);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden relative">
        
        {/* Messages list container */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
          
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4 mt-8">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">{t('chatHeader')}</h3>
                <p className="text-[10px] text-slate-500 mt-1">Consult the AgriVision AI assistant. Ask about fertilization schedules, leaf anomalies, or climate impact.</p>
              </div>

              {/* Sample starters */}
              <div className="flex flex-col gap-2 w-full mt-2">
                <button
                  onClick={() => handleSend(t('suggestedQ1'))}
                  className="w-full text-left px-3 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800/80 rounded-xl text-[10px] text-slate-300 transition-all font-semibold"
                >
                  {t('suggestedQ1')}
                </button>
                <button
                  onClick={() => handleSend(t('suggestedQ2'))}
                  className="w-full text-left px-3 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800/80 rounded-xl text-[10px] text-slate-300 transition-all font-semibold"
                >
                  {t('suggestedQ2')}
                </button>
                <button
                  onClick={() => handleSend(t('suggestedQ3'))}
                  className="w-full text-left px-3 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800/80 rounded-xl text-[10px] text-slate-300 transition-all font-semibold"
                >
                  {t('suggestedQ3')}
                </button>
              </div>
              
              <div className="w-full mt-4">
                <Disclaimer />
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col max-w-[85%] ${
                msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              {/* Message content bubble */}
              <div
                className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-500 text-slate-950 font-semibold rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none'
                }`}
              >
                {msg.content.split('\n').map((line, lIdx) => (
                  <p key={lIdx} className={lIdx > 0 ? 'mt-1.5' : ''}>{line}</p>
                ))}
              </div>

              {/* Explainability tags for AI messages */}
              {msg.sender === 'ai' && (msg.confidence !== undefined || msg.limitations || msg.expertWarning) && (
                <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-2.5 mt-2 flex flex-col gap-2 w-full shadow-inner">
                  {msg.confidence !== undefined && (
                    <div className="flex justify-between items-center text-[8px] font-bold">
                      <span className="text-slate-500 uppercase tracking-wider">AI Confidence</span>
                      <span className="text-emerald-400 font-extrabold">{msg.confidence}%</span>
                    </div>
                  )}
                  {msg.limitations && (
                    <div className="text-[8px] border-t border-slate-900 pt-1.5">
                      <span className="text-slate-500 font-bold uppercase tracking-wider block">Limitations</span>
                      <p className="text-slate-400 mt-0.5 leading-normal">{msg.limitations}</p>
                    </div>
                  )}
                  {msg.expertWarning && (
                    <div className="text-[8px] border-t border-slate-900 pt-1.5 text-amber-200">
                      <span className="text-amber-500 font-bold uppercase tracking-wider block">Safety Alert</span>
                      <p className="text-amber-200/80 mt-0.5 leading-normal">{msg.expertWarning}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="self-start flex gap-1 items-center bg-slate-900 border border-slate-800 px-3.5 py-3 rounded-2xl rounded-tl-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-950/20 border border-red-900/40 text-red-400 rounded-xl p-3 text-[10px] font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="bg-slate-950 border-t border-slate-800/80 px-4 py-3 flex flex-col gap-2">
          
          {/* Quick tools: Clean button if messages exist */}
          {messages.length > 0 && (
            <button
              onClick={clearChatHistory}
              className="self-end text-[9px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1 bg-red-950/10 border border-red-900/35 px-2 py-1 rounded-lg transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>{t('clearHistoryBtn')}</span>
            </button>
          )}

          <div className="flex gap-2 items-center">
            {/* Voice Mic toggle */}
            <button
              onClick={toggleRecording}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
                isRecording
                  ? 'bg-red-500 border-red-400 text-slate-950 animate-pulse'
                  : 'bg-slate-900 border-slate-800 text-emerald-400 hover:text-emerald-300'
              }`}
              title={t('voiceInputBtn')}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('chatPlaceholder')}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder-slate-600 transition-colors"
            />

            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black disabled:opacity-40 transition-all flex items-center justify-center shadow-lg shadow-emerald-500/10"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
}
