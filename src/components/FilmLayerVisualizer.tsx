import React from 'react';
import { PackageStructure } from '../types/material';
import { Layers, ShieldCheck, Sparkles } from 'lucide-react';

interface FilmLayerVisualizerProps {
  material: PackageStructure;
}

export const FilmLayerVisualizer: React.FC<FilmLayerVisualizerProps> = ({ material }) => {
  // Parse layer structure string e.g. "BOPP (15µm) / EVOH (5µm) / LLDPE (30µm)"
  const layers = material.layerStructure.split('/').map(l => l.trim());

  const getLayerColor = (layerName: string) => {
    const lower = layerName.toLowerCase();
    if (lower.includes('evoh') || lower.includes('met-pet')) {
      return 'bg-gradient-to-r from-cyan-900 via-cyan-800 to-cyan-900 border-cyan-500/50 text-cyan-200'; // High barrier core
    }
    if (lower.includes('bopp') || lower.includes('pet')) {
      return 'bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-slate-600 text-slate-200'; // Outer print substrate
    }
    if (lower.includes('pla') || lower.includes('pbat') || lower.includes('bio')) {
      return 'bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border-emerald-500/50 text-emerald-200'; // Compostable bio layer
    }
    return 'bg-gradient-to-r from-teal-950 via-teal-900 to-teal-950 border-teal-600/40 text-teal-200'; // PE Sealant
  };

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
        <span className="flex items-center space-x-1">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>Layer Cross-Section ({layers.length} Layers)</span>
        </span>
        <span className="text-slate-300 font-bold">{material.totalThicknessMicrons.value} µm Total Gauge</span>
      </div>

      <div className="space-y-1.5 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
        {layers.map((layer, idx) => {
          const style = getLayerColor(layer);
          return (
            <div
              key={idx}
              className={`p-2 rounded-lg border text-[11px] font-mono flex items-center justify-between shadow-sm transition hover:scale-[1.01] ${style}`}
            >
              <span className="font-semibold">{layer}</span>
              <span className="text-[10px] uppercase font-sans tracking-wider opacity-80">
                {idx === 0 ? 'Outer Print Layer' : idx === layers.length - 1 ? 'Inner Sealant Layer' : 'Barrier Core'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
