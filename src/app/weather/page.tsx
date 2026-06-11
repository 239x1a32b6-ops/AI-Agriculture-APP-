'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Disclaimer from '@/components/Disclaimer';
import MapPicker from '@/components/MapPicker';
import { CloudSun, Wind, Droplet, Thermometer, AlertTriangle, Leaf, Calendar, Map, ChevronLeft } from 'lucide-react';
import { WeatherData } from '@/lib/weather';

export default function WeatherDashboard() {
  const router = useRouter();
  const { t, language, profile, setProfile } = useApp();
  const [locationInput, setLocationInput] = useState(profile.location);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showMapPicker, setShowMapPicker] = useState(false);

  const loadWeatherData = async (locName: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: locName,
          lang: language
        })
      });

      if (!res.ok) {
        throw new Error("Failed to load weather logs");
      }

      const data = await res.json();
      setWeather(data);
      // Synchronize profile location
      if (locName !== profile.location) {
        setProfile({ ...profile, location: locName });
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load environmental records. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData(profile.location);
  }, []);

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (locationInput.trim()) {
      loadWeatherData(locationInput.trim());
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Map Picker Modal */}
      {showMapPicker && (
        <div className="fixed inset-0 z-50">
          <MapPicker
            onSelect={(address, lat, lng) => {
              setLocationInput(address);
              loadWeatherData(address);
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
          <CloudSun className="w-5 h-5 text-emerald-400" />
          <span>{t('weatherHeader')}</span>
        </h2>

        {/* Location Change Form */}
        <form onSubmit={handleLocationSubmit} className="flex gap-2">
          <input
            type="text"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            placeholder="Type location or pick on map…"
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder-slate-600 transition-colors"
          />
          {/* Map Picker Button */}
          <button
            type="button"
            onClick={() => setShowMapPicker(true)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            title="Pick location on map"
          >
            <Map className="w-4 h-4" />
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs uppercase transition-all"
          >
            Go
          </button>
        </form>

        {errorMsg && (
          <div className="bg-red-950/20 border border-red-900/40 text-red-400 rounded-xl p-3 text-[10px] font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-400">Fetching live weather & environment index...</p>
          </div>
        ) : weather ? (
          <div className="flex flex-col gap-4">
            
            {/* Current Weather Snapshot */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col gap-3.5 relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
              
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2.5">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('currentWeather')}</h3>
                  <p className="text-xs text-white mt-1.5 font-semibold">{weather.location}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-white">{weather.temp}°C</span>
                  <span className="text-[10px] text-emerald-400 block font-bold mt-0.5">{weather.conditions}</span>
                </div>
              </div>

              {/* 3 grid status */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-950/40 border border-slate-850 p-2 rounded-xl text-center">
                  <Droplet className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
                  <span className="text-[8px] text-slate-400 font-bold block uppercase leading-none">{t('humidity')}</span>
                  <span className="text-xs font-extrabold text-white mt-1 block">{weather.humidity}%</span>
                </div>

                <div className="bg-slate-950/40 border border-slate-850 p-2 rounded-xl text-center">
                  <CloudSun className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
                  <span className="text-[8px] text-slate-400 font-bold block uppercase leading-none">Rain Chance</span>
                  <span className="text-xs font-extrabold text-white mt-1 block">{weather.rainfallChance}%</span>
                </div>

                <div className="bg-slate-950/40 border border-slate-850 p-2 rounded-xl text-center">
                  <Wind className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
                  <span className="text-[8px] text-slate-400 font-bold block uppercase leading-none">{t('windSpeed')}</span>
                  <span className="text-xs font-extrabold text-white mt-1 block">{weather.windSpeed} km/h</span>
                </div>
              </div>
            </div>

            {/* Environmental Monitoring (Air Quality & Pollution Indicators) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Environmental Air Quality</span>
              
              <div className="bg-slate-950/40 border border-slate-850 p-3.5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none">{t('aqiLabel')}</span>
                  <span className="text-2xl font-black text-white mt-1.5 block">{weather.aqi}</span>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase ${
                    weather.aqi > 200 
                      ? 'bg-red-500/20 text-red-400' 
                      : weather.aqi > 100 
                        ? 'bg-amber-500/20 text-amber-400' 
                        : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {weather.aqi > 200 ? t('aqiPoor') : weather.aqi > 100 ? t('aqiFair') : t('aqiGood')}
                  </span>
                  <p className="text-[9px] text-slate-400 mt-2">Scale: 0 - 500 AQI</p>
                </div>
              </div>

              {/* Specific Pollution Metrics */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                {[
                  { name: "PM2.5", val: `${weather.pm25} µg/m³`, status: weather.pm25 > 35 ? 'Elevated' : 'Normal' },
                  { name: "PM10", val: `${weather.pm10} µg/m³`, status: weather.pm10 > 50 ? 'Elevated' : 'Normal' },
                  { name: "CO (Carbon)", val: `${weather.co} ppm`, status: 'Normal' },
                  { name: "NO2 (Nitrogen)", val: `${weather.no2} ppb`, status: 'Normal' }
                ].map((pol) => (
                  <div key={pol.name} className="bg-slate-950/40 border border-slate-850 p-2.5 rounded-xl flex justify-between items-center text-[10px]">
                    <div>
                      <span className="text-slate-400 block font-bold">{pol.name}</span>
                      <span className="text-white font-extrabold mt-1 block">{pol.val}</span>
                    </div>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                      pol.status === 'Elevated' ? 'bg-red-500/25 text-red-400' : 'bg-emerald-500/25 text-emerald-400'
                    }`}>{pol.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Irrigation Scheduler */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 leading-none">
                <Calendar className="w-4.5 h-4.5 text-emerald-400" /> {t('irrigationSchedule')}
              </span>
              <p className="text-[10px] text-slate-400 leading-normal">Smart weather-adjusted watering recommendations for the next 7 days:</p>

              <div className="flex flex-col gap-2 mt-1.5">
                {weather.irrigationSchedule.map((sched, idx) => (
                  <div key={idx} className="bg-slate-950/40 border border-slate-850 px-3 py-2 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-white">{sched.day}</span>
                      <p className="text-[9px] text-slate-400 font-medium leading-none mt-0.5">{sched.tip}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full block uppercase ${
                        sched.needed 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-800/40' 
                          : 'bg-slate-800/40 text-slate-400 border border-slate-800'
                      }`}>
                        {sched.needed ? `Water (${sched.amountMm}mm)` : 'Skip Water'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weather-Based AI Advisory Alerts */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 leading-none">
                <Leaf className="w-4.5 h-4.5 text-emerald-400" /> AI Weather-Based Farming Advice
              </span>

              <div className="flex flex-col gap-3 mt-1.5">
                {/* Fertilizer application */}
                <div className="bg-slate-950/40 border border-slate-850 p-3 rounded-xl flex gap-2.5 items-start">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1 shrink-0 animate-pulse" />
                  <div>
                    <h4 className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider">{t('fertilizerTiming')}</h4>
                    <p className="text-[10px] text-slate-400 leading-normal mt-1">{weather.advisories.fertilizer}</p>
                  </div>
                </div>

                {/* Harvesting window */}
                <div className="bg-slate-950/40 border border-slate-850 p-3 rounded-xl flex gap-2.5 items-start">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1 shrink-0 animate-pulse" />
                  <div>
                    <h4 className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider">{t('harvestTiming')}</h4>
                    <p className="text-[10px] text-slate-400 leading-normal mt-1">{weather.advisories.harvest}</p>
                  </div>
                </div>

                {/* Disease outbreaks */}
                <div className="bg-slate-950/40 border border-slate-850 p-3 rounded-xl flex gap-2.5 items-start">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1 shrink-0 animate-pulse" />
                  <div>
                    <h4 className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">{t('diseaseRiskAlert')}</h4>
                    <p className="text-[10px] text-amber-200/80 leading-normal mt-1">{weather.advisories.diseaseRisk}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Environmental Risk Analysis */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 leading-none">
                <AlertTriangle className="w-4.5 h-4.5 text-emerald-400" /> Environmental Risk & Sustainability
              </span>

              <div className="bg-slate-950/40 border border-slate-850 p-3.5 rounded-xl flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Risk Level</span>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                    weather.environmentalRisk.level === 'High' 
                      ? 'bg-red-500/25 text-red-400' 
                      : weather.environmentalRisk.level === 'Medium' 
                        ? 'bg-amber-500/25 text-amber-400' 
                        : 'bg-emerald-500/25 text-emerald-400'
                  }`}>
                    {weather.environmentalRisk.level} Risk
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal mt-1">{weather.environmentalRisk.description}</p>
                
                {/* Active Alerts */}
                {weather.environmentalRisk.alerts.length > 0 && (
                  <div className="border-t border-slate-800/80 pt-2.5 mt-1 flex flex-col gap-1.5">
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Active Alerts</span>
                    {weather.environmentalRisk.alerts.map((al, idx) => (
                      <p key={idx} className="text-[9px] text-amber-400 leading-normal flex items-start gap-1">
                        <span className="text-amber-500">•</span>
                        <span>{al}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Sustainability Tips */}
              <div className="flex flex-col gap-2 mt-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sustainable Actions</span>
                <ul className="flex flex-col gap-2">
                  {weather.environmentalRisk.sustainabilityTips.map((tip, idx) => (
                    <li key={idx} className="text-[10px] text-slate-300 leading-relaxed flex items-start gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">✔</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Disclaimer />
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-10">Weather records currently unavailable.</p>
        )}
      </div>

      <Navigation />
    </div>
  );
}
