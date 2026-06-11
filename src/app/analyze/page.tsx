'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Disclaimer from '@/components/Disclaimer';
import {
  Camera, Image as ImageIcon, Sparkles, AlertTriangle, RefreshCw,
  CheckCircle2, FileWarning, ChevronDown, X, ChevronLeft
} from 'lucide-react';
import { AIAnalysisResult } from '@/lib/ai';

// All common crop types — user can still type any custom crop
const PRESET_CROPS = [
  'Tomato', 'Rice', 'Corn (Maize)', 'Wheat', 'Cotton', 'Sugarcane',
  'Potato', 'Onion', 'Brinjal (Eggplant)', 'Chilli', 'Groundnut',
  'Soybean', 'Sunflower', 'Banana', 'Mango', 'Apple', 'Grapes',
  'Watermelon', 'Cucumber', 'Cabbage', 'Cauliflower', 'Turmeric',
  'Ginger', 'Garlic', 'Mustard', 'Lentils (Dal)', 'Chickpea',
  'Peas', 'Spinach', 'Papaya', 'Coconut', 'Tea', 'Coffee',
];

// Pre-defined sample base64 strings or placeholders to let the user test instantly
const SAMPLES = [
  {
    name: "Tomato Leaf Blight",
    type: "disease",
    img: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='100%' height='100%' fill='%231b3a24'/><path d='M200 50 Q120 150 200 250 Q280 150 200 50' fill='%232e7d32'/><circle cx='180' cy='130' r='18' fill='%233e2723' opacity='0.85'/><circle cx='210' cy='180' r='14' fill='%233e2723' opacity='0.85'/><circle cx='190' cy='210' r='10' fill='%233e2723' opacity='0.85'/><text x='110' y='280' fill='white' font-family='sans-serif' font-size='12'>Sample: Tomato Late Blight leaf</text></svg>"
  },
  {
    name: "Aphids Colony",
    type: "pest",
    img: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='100%' height='100%' fill='%231b3a24'/><line x1='200' y1='30' x2='200' y2='270' stroke='%232e7d32' stroke-width='8'/><circle cx='195' cy='100' r='6' fill='%2381c784'/><circle cx='205' cy='115' r='5' fill='%2381c784'/><circle cx='190' cy='150' r='6' fill='%2381c784'/><circle cx='200' cy='170' r='5' fill='%2381c784'/><circle cx='192' cy='200' r='6' fill='%2381c784'/><text x='130' y='280' fill='white' font-family='sans-serif' font-size='12'>Sample: Aphids infestation</text></svg>"
  },
  {
    name: "Plastic Bottle",
    type: "waste",
    img: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='100%' height='100%' fill='%231e293b'/><rect x='170' y='80' width='60' height='130' rx='10' fill='%2338bdf8' opacity='0.7'/><rect x='185' y='60' width='30' height='20' rx='3' fill='%230284c7'/><text x='150' y='280' fill='white' font-family='sans-serif' font-size='12'>Sample: Plastic drink bottle</text></svg>"
  }
];

export default function Analyze() {
  const { t, language, apiKeys } = useApp();
  const router = useRouter();
  const [analysisType, setAnalysisType] = useState<'disease' | 'pest' | 'waste'>('disease');
  const [image, setImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cropHint, setCropHint] = useState('Auto Detect');
  const [isDragging, setIsDragging] = useState(false);

  // Combobox state
  const [cropSearch, setCropSearch] = useState('');
  const [showCropDropdown, setShowCropDropdown] = useState(false);
  const cropInputRef = useRef<HTMLInputElement>(null);
  const cropDropdownRef = useRef<HTMLDivElement>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filtered suggestions based on search text
  const filteredCrops = cropSearch.trim() === ''
    ? PRESET_CROPS
    : PRESET_CROPS.filter(c => c.toLowerCase().includes(cropSearch.toLowerCase()));

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        cropDropdownRef.current &&
        !cropDropdownRef.current.contains(e.target as Node) &&
        cropInputRef.current &&
        !cropInputRef.current.contains(e.target as Node)
      ) {
        setShowCropDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectCrop = (crop: string) => {
    setCropHint(crop);
    setCropSearch(crop === 'Auto Detect' ? '' : crop);
    setShowCropDropdown(false);
  };

  // Stop camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setErrorMsg(null);
    setResult(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access failed:", err);
      setErrorMsg("Camera access failed. Please upload an image from your gallery instead.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setResult(null);
    const file = e.target.files?.[0];
    if (file) {
      // Auto-detect crop from filename
      const filename = file.name.toLowerCase();
      const autoDetected = PRESET_CROPS.find(c =>
        filename.includes(c.toLowerCase().split(' ')[0])
      );
      if (autoDetected && cropHint === 'Auto Detect') {
        selectCrop(autoDetected);
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setErrorMsg(null);
    setResult(null);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      // Auto-detect crop from filename
      const filename = file.name.toLowerCase();
      const autoDetected = PRESET_CROPS.find(c =>
        filename.includes(c.toLowerCase().split(' ')[0])
      );
      if (autoDetected && cropHint === 'Auto Detect') {
        selectCrop(autoDetected);
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setErrorMsg("Please drop a valid image file (JPG, PNG, WEBP).");
    }
  };

  const selectSample = (sampleImg: string) => {
    setErrorMsg(null);
    setResult(null);
    setImage(sampleImg);
  };

  const handleAnalyze = async () => {
    if (!image) {
      setErrorMsg(t('invalidImage'));
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image,
          type: analysisType,
          lang: language,
          keys: apiKeys,
          cropHint: cropHint !== 'Auto Detect' ? cropHint : undefined
        })
      });

      if (!res.ok) {
        throw new Error("API responded with an error status.");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Analysis failed:", err);
      setErrorMsg("Failed to analyze image. Please check your network connection or API configurations.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

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
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span>{t('uploadTitle')}</span>
        </h2>

        {/* Mode Selectors */}
        <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl grid grid-cols-3 gap-1 shadow-inner">
          {(['disease', 'pest', 'waste'] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                setAnalysisType(type);
                setResult(null);
              }}
              className={`py-2 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all duration-300 ${
                analysisType === type
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {type === 'disease'
                ? t('analysisTypeDisease')
                : type === 'pest'
                  ? t('analysisTypePest')
                  : 'Waste'}
            </button>
          ))}
        </div>

        {/* Crop Selection — Searchable Combobox */}
        {analysisType === 'disease' && (
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex flex-col gap-2 shadow-md">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Select Crop Type (Optional)
            </label>

            {/* Selected crop pill */}
            {cropHint !== 'Auto Detect' && (
              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-emerald-500/10 border border-emerald-800/50 rounded-lg w-fit">
                <span className="text-[10px] font-bold text-emerald-400">🌿 {cropHint}</span>
                <button
                  type="button"
                  onClick={() => { setCropHint('Auto Detect'); setCropSearch(''); }}
                  className="text-slate-500 hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Search input */}
            <div className="relative">
              <input
                ref={cropInputRef}
                type="text"
                value={cropSearch}
                onChange={(e) => {
                  setCropSearch(e.target.value);
                  // Update cropHint to typed value in real-time (so AI uses it)
                  setCropHint(e.target.value.trim() || 'Auto Detect');
                  setShowCropDropdown(true);
                }}
                onFocus={() => setShowCropDropdown(true)}
                placeholder={
                  cropHint === 'Auto Detect'
                    ? 'Type or search crop… (e.g. Cotton, Chilli, Wheat)'
                    : `Currently: ${cropHint}`
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors pr-8 placeholder-slate-500"
              />
              <ChevronDown
                className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 transition-transform pointer-events-none ${showCropDropdown ? 'rotate-180' : ''}`}
              />
            </div>

            {/* Dropdown suggestions */}
            {showCropDropdown && (
              <div
                ref={cropDropdownRef}
                className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl max-h-48 overflow-y-auto"
              >
                {/* Auto Detect option */}
                <button
                  type="button"
                  className={`w-full text-left px-3 py-2 text-[10px] font-bold transition-colors ${
                    cropHint === 'Auto Detect'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                  onClick={() => selectCrop('Auto Detect')}
                >
                  🔍 Auto Detect (Let AI identify the crop)
                </button>

                {/* Matched preset crops */}
                {filteredCrops.map(crop => (
                  <button
                    key={crop}
                    type="button"
                    className={`w-full text-left px-3 py-1.5 text-[10px] transition-colors border-t border-slate-900 ${
                      cropHint === crop
                        ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-emerald-400'
                    }`}
                    onClick={() => selectCrop(crop)}
                  >
                    🌿 {crop}
                  </button>
                ))}

                {/* If user typed something not in preset list, show a "Use this" option */}
                {cropSearch.trim() !== '' &&
                  !PRESET_CROPS.some(c => c.toLowerCase() === cropSearch.trim().toLowerCase()) && (
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 text-[10px] text-amber-400 hover:bg-slate-900 border-t border-slate-800 transition-colors font-bold"
                    onClick={() => selectCrop(cropSearch.trim())}
                  >
                    ✏️ Use &quot;{cropSearch.trim()}&quot; as crop type
                  </button>
                )}

                {/* No results */}
                {filteredCrops.length === 0 && cropSearch.trim() !== '' && (
                  <p className="px-3 py-2 text-[10px] text-slate-500 italic">
                    No preset match — press &quot;Use&quot; above or clear to search again
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Camera/Upload Container */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`bg-slate-900 border rounded-2xl overflow-hidden shadow-md flex flex-col min-h-[220px] items-center justify-center relative transition-all duration-300 ${
            isDragging ? 'border-emerald-400 border-dashed bg-emerald-950/20' : 'border-slate-800'
          }`}
        >
          
          {isCameraActive ? (
            <div className="w-full relative flex flex-col items-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-56 object-cover bg-black"
              />
              <div className="absolute bottom-3 flex gap-3">
                <button
                  onClick={capturePhoto}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-full text-xs shadow-lg flex items-center gap-1 transition-all"
                >
                  <Camera className="w-4 h-4" />
                  Capture
                </button>
                <button
                  onClick={stopCamera}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-full text-xs transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : image ? (
            <div ref={containerRef} className="w-full relative group">
              <img
                src={image}
                alt="Upload preview"
                className="w-full max-h-60 object-contain bg-slate-950/40"
              />
              
              {/* Bounding box highlights on top of the preview image */}
              {result && result.boundingBoxes && result.boundingBoxes.map((box, idx) => (
                <div
                  key={idx}
                  className="absolute border-2 border-emerald-400 bg-emerald-400/15 pointer-events-none flex flex-col justify-start items-start"
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

              <button
                onClick={() => {
                  setImage(null);
                  setResult(null);
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/70 border border-slate-800 text-slate-300 hover:text-white transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 p-8 text-center">
              <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                  : 'border-slate-800 bg-slate-950 text-slate-400'
              }`}>
                {isDragging ? <ImageIcon className="w-6 h-6" /> : <Camera className="w-6 h-6" />}
              </div>
              <div className="px-4">
                <p className="text-xs font-semibold text-slate-300">
                  {isDragging ? "Drop your image here!" : t('uploadTitle')}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  {isDragging
                    ? "Release to upload"
                    : "Take a photo, choose a file, or drag and drop your image here."}
                </p>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={startCamera}
                  className="px-4 py-2 bg-slate-950 border border-slate-800 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-inner"
                >
                  <Camera className="w-4 h-4" />
                  {t('cameraUpload')}
                </button>

                <label className="px-4 py-2 bg-slate-950 border border-slate-800 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-inner">
                  <ImageIcon className="w-4 h-4" />
                  <span>{t('galleryUpload')}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Sample Selectors (Helpful for demo) */}
        {!image && !isCameraActive && (
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Or test with demo samples:</p>
            <div className="flex flex-wrap gap-2">
              {SAMPLES.filter(s => s.type === analysisType).map((sample) => (
                <button
                  key={sample.name}
                  onClick={() => selectSample(sample.img)}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-emerald-500 text-[10px] text-slate-300 rounded-lg hover:text-emerald-400 transition-all font-semibold"
                >
                  {sample.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Analyze button */}
        {image && !result && (
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/15 disabled:opacity-50 transition-all uppercase"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>{t('analyzingText')}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>
                  {t('analyzeBtn')}
                  {cropHint !== 'Auto Detect' ? ` — ${cropHint}` : ''}
                </span>
              </>
            )}
          </button>
        )}

        {/* Errors */}
        {errorMsg && (
          <div className="bg-red-950/20 border border-red-900/40 text-red-400 rounded-xl p-3 text-[10px] font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Result Dashboard */}
        {result && (
          <div className="flex flex-col gap-4 mt-2">
            {/* Main Result Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col gap-3 relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
              
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest leading-none">{t('detectedTitle')}</span>
                  <h3 className="text-sm font-extrabold text-white mt-1 leading-snug">{result.itemName}</h3>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-bold text-slate-400 uppercase leading-none">{t('confidenceTitle')}</span>
                  <span className="text-base font-black text-emerald-400 mt-1">{result.confidence}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950/40 border border-slate-800/60 p-2.5 rounded-xl">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase leading-none">{t('severityTitle')}</span>
                  <span className={`text-xs font-extrabold mt-1 inline-block ${
                    result.severity === 'High' ? 'text-red-400' : result.severity === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {result.severity}
                  </span>
                </div>
                <div className="bg-slate-950/40 border border-slate-800/60 p-2.5 rounded-xl">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase leading-none">Diagnostic Scope</span>
                  <span className="text-xs font-extrabold text-white mt-1">Image Vision AI</span>
                </div>
              </div>

              {/* Bounding Box Highlights Alert */}
              {result.boundingBoxes && result.boundingBoxes.length > 0 && (
                <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-2.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-[9px] text-emerald-200 font-semibold">{t('affectedAreasHighlight')}: {result.boundingBoxes.map(b => b.label).join(', ')}</span>
                </div>
              )}

              {/* Low confidence warnings */}
              {result.confidence < 75 && (
                <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-2.5 flex items-start gap-2 text-[9px] text-amber-200">
                  <FileWarning className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Warning: Low confidence analysis. The image might have poor lighting, low resolution, or excessive noise. Results are advisory only.</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Description</span>
                <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-950/30 p-3 border border-slate-800/60 rounded-xl">
                  {result.explanation}
                </p>
              </div>

              {/* Explainability Section */}
              <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl flex flex-col gap-2">
                <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest flex items-center gap-1 leading-none">
                  <Sparkles className="w-3.5 h-3.5" /> Explainable Logic
                </span>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-300">{t('explainabilityReasoning')}:</h4>
                  <p className="text-[10px] text-slate-400 leading-normal mt-0.5">{result.reasoning}</p>
                </div>
                <div className="border-t border-slate-800/80 pt-2 mt-1">
                  <h4 className="text-[10px] font-bold text-slate-300">{t('explainabilityObservations')}:</h4>
                  <p className="text-[10px] text-slate-400 leading-normal mt-0.5">{result.observations}</p>
                </div>
              </div>
            </div>

            {/* Treatment recommendations */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t('treatmentTitle')}</span>
              
              <ul className="flex flex-col gap-2">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex gap-2 text-[11px] text-slate-300 leading-relaxed">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">{i+1}</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>

              {/* Organic and Chemical solutions for Pests */}
              {analysisType === 'pest' && (result.organicSolutions || result.chemicalSolutions) && (
                <div className="grid grid-cols-1 gap-3 border-t border-slate-800 pt-3.5 mt-1.5">
                  {result.organicSolutions && (
                    <div className="flex flex-col gap-1.5">
                      <h4 className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">{t('organicSolutions')}</h4>
                      <ul className="flex flex-col gap-1.5">
                        {result.organicSolutions.map((o, idx) => (
                          <li key={idx} className="text-[10px] text-slate-300 pl-2 border-l border-emerald-500/40 leading-normal">{o}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.chemicalSolutions && (
                    <div className="flex flex-col gap-1.5 mt-2">
                      <h4 className="text-[10px] font-extrabold text-teal-400 uppercase tracking-wider">{t('chemicalSolutions')}</h4>
                      <ul className="flex flex-col gap-1.5">
                        {result.chemicalSolutions.map((c, idx) => (
                          <li key={idx} className="text-[10px] text-slate-300 pl-2 border-l border-teal-500/40 leading-normal">{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Prevention tips */}
              <div className="border-t border-slate-800 pt-3 mt-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">{t('preventionTitle')}</span>
                <ul className="flex flex-col gap-1.5">
                  {result.preventionTips.map((tip, idx) => (
                    <li key={idx} className="text-[10px] text-slate-300 flex items-start gap-1.5 leading-normal">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Safety & Limitations card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Scientific Disclosures</span>
              
              <div className="bg-slate-950/40 border border-slate-800/80 p-3 rounded-xl flex flex-col gap-2">
                <div>
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider leading-none">{t('limitationsTitle')}</h4>
                  <p className="text-[10px] text-slate-400 mt-1.5 leading-normal">{result.limitations}</p>
                </div>
                <div className="border-t border-slate-800/60 pt-2.5 mt-1 text-[10px]">
                  <h4 className="text-[10px] font-extrabold text-amber-500 uppercase tracking-wider leading-none">{t('expertWarningTitle')}</h4>
                  <p className="text-[10px] text-amber-200/80 mt-1.5 leading-normal">{result.expertWarning}</p>
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
