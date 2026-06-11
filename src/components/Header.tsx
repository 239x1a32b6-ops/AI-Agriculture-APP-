'use client';

import React from 'react';
import { useApp } from '@/lib/context';
import { Globe, History, Settings, ShieldAlert, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { t, language, setLanguage } = useApp();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60 px-4 py-3 flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        {pathname !== '/' && (
          <Link
            href="/"
            className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 transition-all cursor-pointer flex items-center justify-center shadow-inner mr-1"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
        )}
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <span className="text-slate-950 font-black text-sm">AV</span>
        </div>
        <div>
          <h1 className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
            {t('title')}
          </h1>
          <p className="text-[10px] text-slate-400 font-medium tracking-tight">AI Advisory Hub</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Language selector toggle */}
        <div className="relative group">
          <button className="p-1.5 rounded-lg bg-slate-900 border border-slate-800/80 text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 text-xs">
            <Globe className="w-3.5 h-3.5" />
            <span className="uppercase text-[10px] font-bold">{language}</span>
          </button>
          <div className="absolute right-0 mt-1 w-24 bg-slate-900 border border-slate-800 rounded-lg shadow-xl hidden group-focus-within:block group-hover:block z-50">
            <button
              onClick={() => setLanguage('en')}
              className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-850 first:rounded-t-lg ${language === 'en' ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('te')}
              className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-850 ${language === 'te' ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}
            >
              తెలుగు
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-850 last:rounded-b-lg ${language === 'hi' ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}
            >
              हिन्दी
            </button>
          </div>
        </div>

        {/* History shortcut */}
        <Link
          href="/history"
          className={`p-1.5 rounded-lg border transition-all ${
            pathname === '/history'
              ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-400'
              : 'bg-slate-900 border-slate-800/80 text-slate-400 hover:text-emerald-400'
          }`}
          title={t('navHistory')}
        >
          <History className="w-3.5 h-3.5" />
        </Link>

        {/* Settings shortcut */}
        <Link
          href="/settings"
          className={`p-1.5 rounded-lg border transition-all ${
            pathname === '/settings'
              ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-400'
              : 'bg-slate-900 border-slate-800/80 text-slate-400 hover:text-emerald-400'
          }`}
          title={t('navSettings')}
        >
          <Settings className="w-3.5 h-3.5" />
        </Link>
      </div>
    </header>
  );
}
