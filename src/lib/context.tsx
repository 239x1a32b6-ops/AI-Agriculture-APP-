'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from './translations';

interface ApiKeys {
  gemini: string;
  openai: string;
  groq: string;
}

interface UserProfile {
  name: string;
  location: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  apiKeys: ApiKeys;
  setApiKeys: (keys: ApiKeys) => void;
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  t: (key: keyof typeof translations['en']) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [apiKeys, setApiKeysState] = useState<ApiKeys>({ gemini: '', openai: '', groq: '' });
  const [profile, setProfileState] = useState<UserProfile>({ name: 'Farmer Partner', location: 'Hyderabad, TS' });
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedLang = localStorage.getItem('agri_lang');
      if (storedLang) setLanguageState(storedLang as Language);

      const storedKeys = localStorage.getItem('agri_keys');
      if (storedKeys) setApiKeysState(JSON.parse(storedKeys));

      const storedProfile = localStorage.getItem('agri_profile');
      if (storedProfile) setProfileState(JSON.parse(storedProfile));
    } catch (e) {
      console.error("Failed loading configurations from localStorage:", e);
    }
    setIsInitialized(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('agri_lang', lang);
    }
  };

  const setApiKeys = (keys: ApiKeys) => {
    setApiKeysState(keys);
    if (typeof window !== 'undefined') {
      localStorage.setItem('agri_keys', JSON.stringify(keys));
    }
  };

  const setProfile = (prof: UserProfile) => {
    setProfileState(prof);
    if (typeof window !== 'undefined') {
      localStorage.setItem('agri_profile', JSON.stringify(prof));
    }
  };

  // Translation lookup helper
  const t = (key: keyof typeof translations['en']): string => {
    const langDict = translations[language] || translations['en'];
    return (langDict[key] || translations['en'][key] || key) as string;
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-emerald-950 text-white flex items-center justify-center flex-col gap-4">
        <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-semibold text-emerald-100 text-sm tracking-wider">AgriVision AI Initialization...</p>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ language, setLanguage, apiKeys, setApiKeys, profile, setProfile, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
