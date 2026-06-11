'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/context';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Disclaimer from '@/components/Disclaimer';
import { History, Calendar, Trash2, ChevronDown, ChevronUp, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

interface UnifiedHistoryRecord {
  id: string;
  recordType: 'analysis' | 'soil';
  type?: 'disease' | 'pest' | 'waste';
  itemName?: string;
  confidence?: number;
  severity?: string;
  explanation?: string;
  reasoning?: string;
  recommendations?: string[];
  organicSolutions?: string[];
  chemicalSolutions?: string[];
  preventionTips?: string[];
  limitations?: string;
  expertWarning?: string;
  boundingBoxes?: any;
  image?: string;
  
  // Soil properties
  soilType?: string;
  soilColor?: string;
  pH?: number;
  moisture?: number;
  cropType?: string;
  healthScore?: number;
  nutrients?: any;
  fertilizers?: string[];
  suitability?: string[];
  improvements?: string[];
  createdAt: string;
}

export default function HistoryDashboard() {
  const { t, language } = useApp();
  const [history, setHistory] = useState<UnifiedHistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleClearHistory = async () => {
    if (confirm("Are you sure you want to permanently delete all records?")) {
      try {
        const res = await fetch('/api/history', { method: 'DELETE' });
        if (res.ok) {
          setHistory([]);
          setExpandedId(null);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-1 px-4 py-5 flex flex-col gap-4 overflow-y-auto">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <h2 className="text-base font-extrabold text-white flex items-center gap-1.5">
            <History className="w-5 h-5 text-emerald-400" />
            <span>{t('historyTitle')}</span>
          </h2>

          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-[9px] font-bold text-red-400 hover:text-red-350 bg-red-950/15 border border-red-900/40 px-2 py-1 rounded-lg transition-colors flex items-center gap-0.5"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-400">Loading history records...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4 mt-8">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
              <History className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 leading-normal">{t('noHistory')}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {history.map((record) => {
              const isExpanded = expandedId === record.id;
              const dateStr = new Date(record.createdAt).toLocaleDateString(
                language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-US',
                { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
              );

              return (
                <div
                  key={record.id}
                  className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden transition-all duration-300 shadow-md"
                >
                  {/* Card Header clickable to toggle expand */}
                  <div
                    onClick={() => toggleExpand(record.id)}
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-850/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {record.recordType === 'analysis' ? (
                        record.image ? (
                          <img
                            src={record.image}
                            alt="Crop icon"
                            className="w-10 h-10 rounded-lg object-cover bg-slate-950 border border-slate-800"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <AlertCircle className="w-5 h-5" />
                          </div>
                        )
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400">
                          <FileText className="w-5 h-5" />
                        </div>
                      )}

                      <div>
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block leading-none">
                          {record.recordType === 'analysis' ? record.type : 'Soil Advisor'}
                        </span>
                        <h4 className="text-xs font-bold text-white mt-1 leading-snug">
                          {record.recordType === 'analysis' ? record.itemName : `Soil suitability: ${record.cropType}`}
                        </h4>
                        <span className="text-[9px] text-slate-400 flex items-center gap-1 mt-1 leading-none">
                          <Calendar className="w-3 h-3 text-emerald-500" /> {dateStr}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        record.recordType === 'analysis'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-800/40'
                          : 'bg-teal-500/10 text-teal-400 border border-teal-850'
                      }`}>
                        {record.recordType === 'analysis' ? `${record.confidence}%` : `Score: ${record.healthScore}`}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>

                  {/* Expanded Report Details */}
                  {isExpanded && (
                    <div className="border-t border-slate-800/80 p-4 bg-slate-950/40 flex flex-col gap-4">
                      {record.recordType === 'analysis' ? (
                        <>
                          {/* Image Preview with overlay if bounding boxes exist */}
                          {record.image && (
                            <div className="relative w-full max-h-48 rounded-xl overflow-hidden border border-slate-800 bg-slate-950/40 flex items-center justify-center">
                              <img src={record.image} alt="Report capture" className="max-h-48 object-contain" />
                              {record.boundingBoxes && record.boundingBoxes.map((box: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="absolute border-2 border-emerald-400 bg-emerald-400/15 pointer-events-none flex flex-col"
                                  style={{
                                    left: `${box.x}%`,
                                    top: `${box.y}%`,
                                    width: `${box.width}%`,
                                    height: `${box.height}%`,
                                  }}
                                >
                                  <span className="bg-emerald-500 text-slate-950 text-[8px] font-black px-1 leading-none rounded-br">
                                    {box.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Severity Level</span>
                            <span className={`text-xs font-extrabold ${
                              record.severity === 'High' ? 'text-red-400' : record.severity === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                            }`}>{record.severity}</span>
                          </div>

                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Analysis summary</span>
                            <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/40">{record.explanation}</p>
                          </div>

                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Treatment Recommendations</span>
                            <ul className="flex flex-col gap-1.5 pl-1.5">
                              {record.recommendations?.map((rec, i) => (
                                <li key={i} className="text-[10px] text-slate-350 leading-normal flex gap-1.5">
                                  <span className="text-emerald-500">•</span>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {record.organicSolutions && record.organicSolutions.length > 0 && (
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Organic solutions</span>
                              <ul className="flex flex-col gap-1.5 pl-1.5">
                                {record.organicSolutions.map((o, idx) => (
                                  <li key={idx} className="text-[10px] text-slate-350 leading-normal flex gap-1.5">
                                    <span className="text-emerald-500">•</span>
                                    <span>{o}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {record.preventionTips && record.preventionTips.length > 0 && (
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Prevention Tips</span>
                              <ul className="flex flex-col gap-1.5 pl-1.5">
                                {record.preventionTips.map((p, idx) => (
                                  <li key={idx} className="text-[10px] text-slate-350 leading-normal flex gap-1.5">
                                    <span className="text-emerald-500">•</span>
                                    <span>{p}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="border-t border-slate-800 pt-2 flex flex-col gap-1">
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Limitations & warnings</span>
                            <p className="text-[9px] text-slate-400 leading-normal">{record.limitations}</p>
                            <p className="text-[9px] text-amber-200/80 leading-normal mt-1">{record.expertWarning}</p>
                          </div>
                        </>
                      ) : (
                        // Soil advisor expanded card details
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-900 border border-slate-850 p-2.5 rounded-xl">
                              <span className="text-[8px] text-slate-400 font-bold uppercase leading-none">Soil Specs</span>
                              <p className="text-[10px] text-white font-extrabold mt-1">{record.soilType} ({record.soilColor})</p>
                            </div>
                            <div className="bg-slate-900 border border-slate-850 p-2.5 rounded-xl">
                              <span className="text-[8px] text-slate-400 font-bold uppercase leading-none">pH & moisture</span>
                              <p className="text-[10px] text-white font-extrabold mt-1">pH {record.pH} / {record.moisture}%</p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Nutrients status</span>
                            <div className="grid grid-cols-2 gap-2 mt-0.5">
                              {record.nutrients && Object.entries(record.nutrients).map(([key, val]: any) => (
                                <div key={key} className="bg-slate-900 border border-slate-850 p-2 rounded-xl flex justify-between items-center text-[9px]">
                                  <span className="text-slate-400 capitalize">{key}</span>
                                  <span className="text-emerald-400 font-bold">{val}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Fertilizer Suggestions</span>
                            <ul className="flex flex-col gap-1.5 pl-1.5">
                              {record.fertilizers?.map((f, i) => (
                                <li key={i} className="text-[10px] text-slate-350 leading-normal flex gap-1.5">
                                  <span className="text-emerald-500">•</span>
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Soil improvements</span>
                            <ul className="flex flex-col gap-1.5 pl-1.5">
                              {record.improvements?.map((imp, idx) => (
                                <li key={idx} className="text-[10px] text-slate-350 leading-normal flex gap-1.5">
                                  <span className="text-emerald-500">•</span>
                                  <span>{imp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <Disclaimer />
      </div>

      <Navigation />
    </div>
  );
}
