'use client';

import React from 'react';
import { useApp } from '@/lib/context';
import { ShieldAlert } from 'lucide-react';

export default function Disclaimer() {
  const { t } = useApp();

  return (
    <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-3.5 flex items-start gap-2.5 shadow-sm shadow-amber-950/5">
      <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
      <div>
        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-0.5">
          {t('disclaimerTitle')}
        </h4>
        <p className="text-[10px] text-amber-200/80 leading-relaxed">
          {t('disclaimerText')}
        </p>
      </div>
    </div>
  );
}
