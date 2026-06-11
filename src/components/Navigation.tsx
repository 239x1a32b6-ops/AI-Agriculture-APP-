'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/context';
import { Home, Camera, Sprout, CloudSun, MessageSquare } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const { t } = useApp();

  const navItems = [
    { href: '/', label: t('navHome'), icon: Home },
    { href: '/analyze', label: t('navAnalyze'), icon: Camera },
    { href: '/soil', label: t('navSoil'), icon: Sprout },
    { href: '/weather', label: t('navWeather'), icon: CloudSun },
    { href: '/chat', label: t('navChat'), icon: MessageSquare },
  ];

  return (
    <nav className="fixed bottom-0 z-40 w-full max-w-md bg-slate-950/80 backdrop-blur-md border-t border-slate-800/60 flex items-center justify-around py-2 px-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all duration-300 relative group ${
              isActive
                ? 'text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {/* Active glow backing */}
            {isActive && (
              <div className="absolute inset-0 bg-emerald-500/5 blur-md rounded-full -z-10 animate-pulse" />
            )}

            <Icon
              className={`w-5 h-5 mb-0.5 transition-transform duration-300 ${
                isActive ? 'scale-110 stroke-[2.5]' : 'group-hover:scale-105'
              }`}
            />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
