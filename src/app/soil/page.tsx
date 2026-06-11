'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Disclaimer from '@/components/Disclaimer';
import { Sprout, BarChart3, HelpCircle, AlertTriangle, Lightbulb, Beaker } from 'lucide-react';
import { AISoilResult } from '@/lib/ai';

export default function SoilAdvisor() {
  const { t, language, apiKeys } = useApp();
  const [soilType, setSoilType] = useState('Loamy Soil');
  const [soilColor, setSoilColor] = useState('Dark Brown');
  const [pH, setPh] = useState(6.5);
  const [moisture, setMoisture] = useState(35);
  const [cropType, setCropType] = useState('Tomato');
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AISoilResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSoilSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const res = await fetch('/api/soil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          soilType,
          soilColor,
          pH,
          moisture,
          cropType,
          lang: language,
          keys: apiKeys
        })
      });

      if (!res.ok) {
        throw new Error("Soil analysis API failed.");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to complete soil advisor analysis. Please check connections and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-1 px-4 py-5 flex flex-col gap-4 overflow-y-auto">
        <h2 className="text-base font-extrabold text-white flex items-center gap-1.5 border-b border-slate-800 pb-2">
          <Sprout className="w-5 h-5 text-emerald-400" />
          <span>{t('soilHeader')}</span>
        </h2>

        {/* Input Form */}
        <form onSubmit={handleSoilSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col gap-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('soilTypeLabel')}</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="Loamy Soil">Loamy Soil</option>
                <option value="Clay Soil">Clay Soil</option>
                <option value="Sandy Soil">Sandy Soil</option>
                <option value="Silt Soil">Silt Soil</option>
                <option value="Peaty Soil">Peaty Soil</option>
                <option value="Saline Soil">Saline Soil</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('soilColorLabel')}</label>
              <select
                value={soilColor}
                onChange={(e) => setSoilColor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="Dark Brown">Dark Brown</option>
                <option value="Reddish Brown">Reddish Brown</option>
                <option value="Yellowish Clay">Yellowish Clay</option>
                <option value="Black Cotton Soil">Black Cotton Soil</option>
                <option value="Grey/Light Sandy">Grey/Light Sandy</option>
              </select>
            </div>
          </div>

          {/* pH level slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
              <span className="text-slate-400">{t('phLabel')}</span>
              <span className={`px-2 py-0.5 rounded font-black text-xs ${
                pH < 6.0 ? 'bg-amber-500/20 text-amber-400' : pH > 7.5 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>{pH.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="14.0"
              step="0.1"
              value={pH}
              onChange={(e) => setPh(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg appearance-none cursor-pointer border border-slate-800"
            />
            <div className="flex justify-between text-[8px] text-slate-500 font-semibold uppercase px-0.5">
              <span>Acidic (1-6)</span>
              <span>Neutral (7)</span>
              <span>Alkaline (8-14)</span>
            </div>
          </div>

          {/* Moisture level slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
              <span className="text-slate-400">{t('moistureLabel')}</span>
              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-black text-xs">{moisture}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={moisture}
              onChange={(e) => setMoisture(parseInt(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg appearance-none cursor-pointer border border-slate-800"
            />
            <div className="flex justify-between text-[8px] text-slate-500 font-semibold uppercase px-0.5">
              <span>Dry (0-20)</span>
              <span>Optimal (30-60)</span>
              <span>Saturated (70-100)</span>
            </div>
          </div>

          {/* Crop Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('cropTypeLabel')}</label>
            <input
              type="text"
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              placeholder="e.g. Tomato, Rice, Maize"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder-slate-600 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-1.5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/15 disabled:opacity-50 transition-all uppercase"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Analyzing soil properties...</span>
              </>
            ) : (
              <>
                <Beaker className="w-4 h-4" />
                <span>{t('soilBtn')}</span>
              </>
            )}
          </button>
        </form>

        {errorMsg && (
          <div className="bg-red-950/20 border border-red-900/40 text-red-400 rounded-xl p-3 text-[10px] font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Dashboard Results */}
        {result && (
          <div className="flex flex-col gap-4">
            
            {/* Score and Overview */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center gap-5 relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
              
              {/* Circular gauge */}
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-850"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500 transition-all duration-1000"
                    strokeDasharray={`${result.healthScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-base font-black text-white">{result.healthScore}</span>
                  <span className="text-[7px] text-slate-400 block font-bold uppercase tracking-tighter">Score</span>
                </div>
              </div>

              <div>
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block leading-none">{t('soilScore')}</span>
                <h3 className="text-sm font-extrabold text-white mt-1 leading-snug">
                  {result.healthScore >= 80 ? 'Excellent Fertility' : result.healthScore >= 60 ? 'Moderate Condition' : 'Deficient Condition'}
                </h3>
                <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                  Target crop compatibility: <span className="text-emerald-400 font-bold">{cropType}</span>
                </p>
              </div>
            </div>

            {/* Nutrient Status Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 leading-none">
                <BarChart3 className="w-4 h-4 text-emerald-400" /> {t('nutrientStatus')}
              </span>

              <div className="grid grid-cols-2 gap-3 mt-1">
                {[
                  { name: t('nitrogen'), level: result.nutrients.nitrogen },
                  { name: t('phosphorus'), level: result.nutrients.phosphorus },
                  { name: t('potassium'), level: result.nutrients.potassium },
                  { name: 'Organic Matter', level: result.nutrients.organicMatter }
                ].map((nut) => (
                  <div key={nut.name} className="bg-slate-950/40 border border-slate-800/60 p-2.5 rounded-xl flex flex-col gap-1.5">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">{nut.name}</span>
                    <span className={`text-[10px] font-extrabold self-start px-2 py-0.5 rounded-full ${
                      nut.level === 'Deficient' || nut.level === 'Low'
                        ? 'bg-red-500/20 text-red-400'
                        : nut.level === 'Excessive' || nut.level === 'High'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {nut.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fertilizer suggestions */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 leading-none">
                <Lightbulb className="w-4 h-4 text-emerald-400" /> {t('fertilizerRecs')}
              </span>
              <ul className="flex flex-col gap-2">
                {result.fertilizers.map((fert, idx) => (
                  <li key={idx} className="flex gap-2 text-[11px] text-slate-300 leading-normal">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">{idx+1}</span>
                    <span>{fert}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suitability dashboard */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 leading-none">
                <Sprout className="w-4 h-4 text-emerald-400" /> {t('cropSuitability')}
              </span>
              <p className="text-[10px] text-slate-400 leading-normal">The following crops are highly recommended for this soil profile:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {result.suitability.map((crop, idx) => (
                  <span key={idx} className="bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 font-bold px-3 py-1 rounded-xl text-[10px] uppercase">
                    {crop}
                  </span>
                ))}
              </div>
            </div>

            {/* Improvement Recommendations */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 leading-none">
                <Lightbulb className="w-4 h-4 text-emerald-400" /> {t('improvementRecs')}
              </span>
              <ul className="flex flex-col gap-2">
                {result.improvements.map((imp, idx) => (
                  <li key={idx} className="text-[10px] text-slate-300 flex items-start gap-1.5 leading-normal">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Explainability & Warnings */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 leading-none">
                <HelpCircle className="w-4 h-4 text-emerald-400" /> Explainability & Limitations
              </span>
              
              <div className="flex flex-col gap-3 bg-slate-950/40 border border-slate-800/80 p-3 rounded-xl">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-300">Soil Science Reasoning:</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal">{result.reasoning}</p>
                </div>
                <div className="border-t border-slate-800/60 pt-2.5 mt-1 text-[10px]">
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Manual entry limitations:</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal">{result.limitations}</p>
                </div>
                <div className="border-t border-slate-800/60 pt-2.5 mt-1 text-[10px]">
                  <h4 className="text-[10px] font-extrabold text-amber-500 uppercase tracking-wider">Expert Recommendation:</h4>
                  <p className="text-[10px] text-amber-200/80 mt-1 leading-normal">{result.expertWarning}</p>
                </div>
              </div>
            </div>

            <Disclaimer />
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
}
