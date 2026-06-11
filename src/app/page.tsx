'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/lib/context';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Disclaimer from '@/components/Disclaimer';
import Link from 'next/link';
import { Camera, Sprout, CloudSun, MessageSquare, ArrowRight, ShieldAlert, Thermometer, Wind } from 'lucide-react';
import { WeatherData } from '@/lib/weather';

export default function Home() {
  const { t, profile } = useApp();
  const [weatherSnapshot, setWeatherSnapshot] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);

  useEffect(() => {
    // Fetch a quick weather snapshot for the user's configured location
    async function loadWeather() {
      try {
        const res = await fetch('/api/weather', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: profile.location || 'Hyderabad, TS',
            lang: 'en'
          })
        });
        if (res.ok) {
          const data = await res.ok ? await res.json() : null;
          setWeatherSnapshot(data);
        }
      } catch (err) {
        console.error("Error loading weather snapshot:", err);
      } finally {
        setIsLoadingWeather(false);
      }
    }
    loadWeather();
  }, [profile.location]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-1 px-4 py-5 flex flex-col gap-5 overflow-y-auto">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">{t('welcomeMsg')}</p>
          <h2 className="text-xl font-extrabold text-white mt-1">
            Hello, {profile.name}!
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            {t('homeDesc')}
          </p>
          <div className="mt-2.5 inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-300 bg-slate-950/40 px-2.5 py-1 rounded-full border border-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Region: {profile.location}</span>
          </div>
        </div>

        {/* Quick Weather Widget */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 shadow-md">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Local Environmental Snapshot</span>
            <Link href="/weather" className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-0.5">
              <span>View Full</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {isLoadingWeather ? (
            <div className="flex items-center justify-center py-4 gap-2">
              <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] text-slate-400">Loading conditions...</span>
            </div>
          ) : weatherSnapshot ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 bg-slate-950/40 border border-slate-800/60 p-2.5 rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <CloudSun className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 leading-none">Temp & Sky</p>
                  <p className="text-sm font-extrabold text-white mt-1">{weatherSnapshot.temp}°C</p>
                  <p className="text-[9px] text-emerald-400 font-medium leading-none mt-0.5">{weatherSnapshot.conditions}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-950/40 border border-slate-800/60 p-2.5 rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 leading-none">Air Quality (AQI)</p>
                  <p className="text-sm font-extrabold text-white mt-1">{weatherSnapshot.aqi}</p>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-0.5 inline-block ${
                    weatherSnapshot.aqi > 150 
                      ? 'bg-red-500/20 text-red-400' 
                      : weatherSnapshot.aqi > 100 
                        ? 'bg-amber-500/20 text-amber-400' 
                        : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {weatherSnapshot.aqi > 150 ? 'Unhealthy' : weatherSnapshot.aqi > 100 ? 'Moderate' : 'Good'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-2">Weather insights currently unavailable.</p>
          )}
        </div>

        {/* Feature Cards Grid */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">AgriVision AI Assistant Modules</span>
          
          <div className="grid grid-cols-2 gap-3">
            <Link 
              href="/analyze" 
              className="bg-slate-900 hover:bg-slate-850 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-3 transition-all duration-300 group shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {t('cropDoctorTitle')}
                </h3>
                <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                  Diagnose leaves & identify pests from photos.
                </p>
              </div>
            </Link>

            <Link 
              href="/soil" 
              className="bg-slate-900 hover:bg-slate-850 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-3 transition-all duration-300 group shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {t('soilAdvisorTitle')}
                </h3>
                <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                  Get soil health advisor analysis & fertilizers.
                </p>
              </div>
            </Link>

            <Link 
              href="/weather" 
              className="bg-slate-900 hover:bg-slate-850 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-3 transition-all duration-300 group shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CloudSun className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {t('weatherTitle')}
                </h3>
                <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                  Irrigation calendar & sustainability alerts.
                </p>
              </div>
            </Link>

            <Link 
              href="/chat" 
              className="bg-slate-900 hover:bg-slate-850 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-3 transition-all duration-300 group shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {t('chatTitle')}
                </h3>
                <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                  Consult our intelligent agriculture chatbot.
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Safety Disclaimer */}
        <div className="mt-2">
          <Disclaimer />
        </div>
      </div>

      <Navigation />
    </div>
  );
}
