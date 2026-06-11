'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Disclaimer from '@/components/Disclaimer';
import MapPicker from '@/components/MapPicker';
import { Settings, Globe, Key, User, Save, CheckCircle2, ArrowRight, Map, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const router = useRouter();
  const { t, language, setLanguage, apiKeys, setApiKeys, profile, setProfile } = useApp();

  const [username, setUsername] = useState(profile.name);
  const [location, setLocation] = useState(profile.location);
  const [showMapPicker, setShowMapPicker] = useState(false);
  
  const [geminiKey, setGeminiKey] = useState(apiKeys.gemini);
  const [openaiKey, setOpenaiKey] = useState(apiKeys.openai);
  const [groqKey, setGroqKey] = useState(apiKeys.groq);

  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save user details
    setProfile({
      name: username.trim() || 'Farmer Partner',
      location: location.trim() || 'Hyderabad, TS'
    });

    // Save API keys
    setApiKeys({
      gemini: geminiKey.trim(),
      openai: openaiKey.trim(),
      groq: groqKey.trim()
    });

    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Map Picker Modal */}
      {showMapPicker && (
        <div className="fixed inset-0 z-50">
          <MapPicker
            onSelect={(address) => {
              setLocation(address);
            }}
            onClose={() => setShowMapPicker(false)}
          />
        </div>
      )}

      <div className="flex-1 px-4 py-5 flex flex-col gap-4 overflow-y-auto">
        {/* Back Navigation */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 text-xs font-bold transition-colors w-fit"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <h2 className="text-base font-extrabold text-white flex items-center gap-1.5 border-b border-slate-800 pb-2">
          <Settings className="w-5 h-5 text-emerald-400" />
          <span>{t('settingsHeader')}</span>
        </h2>

        {showSavedToast && (
          <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-400 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{t('settingsSaved')}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          
          {/* User profile details */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 leading-none">
              <User className="w-4 h-4 text-emerald-400" /> User Profile Info
            </span>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Farmer / User Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="e.g. Ramu"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Default Location / Region</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="e.g. Hyderabad, TS or pick on map"
                />
                <button
                  type="button"
                  onClick={() => setShowMapPicker(true)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  title="Pick location on map"
                >
                  <Map className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Language selection */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 leading-none">
              <Globe className="w-4 h-4 text-emerald-400" /> {t('langSelectHeader')}
            </span>

            <div className="grid grid-cols-3 gap-2">
              {[
                { code: 'en', name: 'English' },
                { code: 'te', name: 'తెలుగు' },
                { code: 'hi', name: 'हिन्दी' }
              ].map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code as any)}
                  className={`py-2 text-[10px] font-bold rounded-xl border transition-all duration-300 ${
                    language === lang.code
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* API Key Configurations */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col gap-3.5">
            <div>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 leading-none">
                <Key className="w-4 h-4 text-emerald-400" /> {t('apiKeyHeader')}
              </span>
              <p className="text-[9px] text-slate-500 leading-normal mt-1.5">{t('apiKeyDesc')}</p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{t('geminiKey')}</label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                placeholder="AIzaSy..."
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{t('openaiKey')}</label>
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                placeholder="sk-proj-..."
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{t('groqKey')}</label>
              <input
                type="password"
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                placeholder="gsk_..."
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/15 transition-all uppercase"
          >
            <Save className="w-4 h-4" />
            <span>{t('saveSettingsBtn')}</span>
          </button>
        </form>

        {/* Diagnostic info / Quick Links */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex justify-between items-center text-[10px]">
          <span className="text-slate-400">View diagnostic reports</span>
          <Link href="/history" className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-0.5">
            <span>Historical logs</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <Disclaimer />
      </div>

      <Navigation />
    </div>
  );
}
