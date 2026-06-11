'use client';

import React, { useEffect, useRef } from 'react';
import { X, MapPin } from 'lucide-react';

interface MapPickerProps {
  onSelect: (address: string, lat: number, lng: number) => void;
  onClose: () => void;
}

export default function MapPicker({ onSelect, onClose }: MapPickerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Listen for location selected postMessage from iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'MAP_LOCATION_SELECTED') {
        onSelect(event.data.address, event.data.lat, event.data.lng);
        onClose();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSelect, onClose]);

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col"
      style={{ maxWidth: '448px', margin: '0 auto' }}
    >
      {/* Modal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-white">Select Farm Location</p>
            <p className="text-[9px] text-slate-400 leading-none mt-0.5">
              Tap on map · Drag marker · Search by name
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Map iframe */}
      <div className="flex-1 relative overflow-hidden">
        <iframe
          ref={iframeRef}
          src="/map.html"
          className="w-full h-full border-none"
          title="Location Selector Map"
          allow="geolocation"
        />
      </div>

      {/* Footer hint */}
      <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 shrink-0">
        <p className="text-[9px] text-slate-500 text-center leading-normal">
          Powered by OpenStreetMap · Tap anywhere to drop a marker · Press <span className="text-emerald-400 font-bold">Confirm Selection</span> to save
        </p>
      </div>
    </div>
  );
}
