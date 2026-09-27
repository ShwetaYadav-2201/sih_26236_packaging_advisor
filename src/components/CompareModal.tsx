import React from 'react';
import { X, CheckCircle2, XCircle, HelpCircle, ShieldCheck, Download, Layers } from 'lucide-react';
import { PackageStructure } from '../types/material';
import { PACKAGE_MATERIALS } from '../data/materials';

interface CompareModalProps {
  onClose: () => void;
  onOpenEvidence: (sourceId: string, paramName: string, paramVal: string) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({ onClose, onOpenEvidence }) => {
  const materials = PACKAGE_MATERIALS;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 font-display">Side-by-Side Technical Comparison Matrix</h3>
              <p className="text-xs text-slate-400">Comparing barrier metrics, thickness gauge, seal windows, and commercial attributes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Matrix Table */}
        <div className="p-6 overflow-x-auto flex-1">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-300">
                <th className="p-3 font-semibold w-48 sticky left-0 bg-slate-950 z-10">Technical Parameter</th>
                {materials.map(mat => (
                  <th key={mat.id} className="p-3 font-semibold min-w-[200px]">
                    <div className="text-slate-100 font-bold font-display text-sm">{mat.name}</div>
                    <div className="text-[11px] text-emerald-400 font-mono font-normal">{mat.tradeName}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              
              {/* Category */}
              <tr>
                <td className="p-3 font-medium text-slate-400 sticky left-0 bg-slate-900 z-10">Material Category</td>
                {materials.map(mat => (
                  <td key={mat.id} className="p-3 capitalize font-mono text-slate-200">
                    {mat.category.replace('_', ' ')}
                  </td>
                ))}
              </tr>

              {/* Layer Structure */}
              <tr>
                <td className="p-3 font-medium text-slate-400 sticky left-0 bg-slate-900 z-10">Layer Cross-Section</td>
                {materials.map(mat => (
                  <td key={mat.id} className="p-3 font-mono text-[11px] text-slate-300 bg-slate-950/40 rounded">
                    {mat.layerStructure}
                  </td>
                ))}
              </tr>

              {/* Gauge */}
              <tr>
                <td className="p-3 font-medium text-slate-400 sticky left-0 bg-slate-900 z-10">Thickness Gauge</td>
                {materials.map(mat => (
                  <td key={mat.id} className="p-3 font-mono font-bold text-slate-100">
                    {mat.totalThicknessMicrons.value} µm
                  </td>
                ))}
              </tr>

              {/* OTR */}
              <tr>
                <td className="p-3 font-medium text-slate-400 sticky left-0 bg-slate-900 z-10">OTR Permeance</td>
                {materials.map(mat => (
                  <td key={mat.id} className="p-3 font-mono font-bold text-emerald-400">
                    <button
                      onClick={() => onOpenEvidence(mat.otr.sourceId, 'Oxygen Permeance (OTR)', `${mat.otr.value} ${mat.otr.unit}`)}
                      className="hover:underline flex items-center space-x-1"
                    >
                      <span>{mat.otr.value}</span>
                      <HelpCircle className="w-3 h-3 text-slate-500" />
                    </button>
                    <span className="text-[10px] text-slate-500 block font-normal">cm³/m²·24h·atm</span>
                  </td>
                ))}
              </tr>

              {/* WVTR */}
              <tr>
                <td className="p-3 font-medium text-slate-400 sticky left-0 bg-slate-900 z-10">WVTR Water Barrier</td>
                {materials.map(mat => (
                  <td key={mat.id} className="p-3 font-mono font-bold text-cyan-400">
                    <button
                      onClick={() => onOpenEvidence(mat.wvtr.sourceId, 'Water Vapour Permeance (WVTR)', `${mat.wvtr.value} ${mat.wvtr.unit}`)}
                      className="hover:underline flex items-center space-x-1"
                    >
                      <span>{mat.wvtr.value}</span>
                      <HelpCircle className="w-3 h-3 text-slate-500" />
                    </button>
                    <span className="text-[10px] text-slate-500 block font-normal">g/m²·24h</span>
                  </td>
                ))}
              </tr>

              {/* Heat Seal Window */}
              <tr>
                <td className="p-3 font-medium text-slate-400 sticky left-0 bg-slate-900 z-10">Heat Seal Range</td>
                {materials.map(mat => (
                  <td key={mat.id} className="p-3 font-mono text-slate-200">
                    {mat.heatSealWindowC[0]}°C – {mat.heatSealWindowC[1]}°C
                  </td>
                ))}
              </tr>

              {/* Recyclability */}
              <tr>
                <td className="p-3 font-medium text-slate-400 sticky left-0 bg-slate-900 z-10">Recyclability Rating</td>
                {materials.map(mat => (
                  <td key={mat.id} className="p-3">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                      mat.recyclabilityRating.startsWith('A') ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      mat.recyclabilityRating === 'B' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      Grade {mat.recyclabilityRating}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Indicative Cost */}
              <tr>
                <td className="p-3 font-medium text-slate-400 sticky left-0 bg-slate-900 z-10">Indicative Cost / 1k Packs</td>
                {materials.map(mat => (
                  <td key={mat.id} className="p-3 font-mono font-extrabold text-amber-300 text-sm">
                    ${mat.indicativeCostPer1kPacksUSD.toFixed(2)}
                  </td>
                ))}
              </tr>

              {/* Supplier */}
              <tr>
                <td className="p-3 font-medium text-slate-400 sticky left-0 bg-slate-900 z-10">Documented Supplier</td>
                {materials.map(mat => (
                  <td key={mat.id} className="p-3 text-slate-300 text-[11px]">
                    {mat.supplier}
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close Comparison Matrix
          </button>
        </div>

      </div>
    </div>
  );
};
