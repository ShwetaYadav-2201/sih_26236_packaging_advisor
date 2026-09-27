import React from 'react';
import { CommodityProfile } from '../types/commodity';
import { COMMODITY_PROFILES } from '../data/commodities';
import { evaluateMixedLoadPair } from '../data/compatibilityRules';
import { Layers, AlertTriangle, ShieldCheck, Thermometer, Flame, Info, HelpCircle, ArrowRight } from 'lucide-react';

interface MixedLoadPageProps {
  onOpenEvidence: (sourceId: string, paramName: string, paramVal: string) => void;
  onProceedToBrief: () => void;
}

export const MixedLoadPage: React.FC<MixedLoadPageProps> = ({ onOpenEvidence, onProceedToBrief }) => {
  const [commA, setCommA] = React.useState<CommodityProfile>(COMMODITY_PROFILES[2]); // Cavendish Banana
  const [commB, setCommB] = React.useState<CommodityProfile>(COMMODITY_PROFILES[3]); // Iceberg Lettuce
  const [sharedAir, setSharedAir] = React.useState<boolean>(true);

  const finding = evaluateMixedLoadPair(commA, commB, sharedAir);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-mono mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Second Showcase Feature — Bounded Mixed-Load Check</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-display tracking-tight">
              Co-Transport Compatibility Matrix
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Verify whether co-transported food commodities share air enclosure and check for ethylene exposure risks ($C_2H_4$) and thermal storage temperature conflicts.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-right shrink-0">
            <span className="text-[11px] text-slate-400 block font-medium">Checked Pair Status</span>
            <div className={`text-sm font-bold font-display ${
              finding.overallStatus === 'critical_hazard' ? 'text-rose-400' :
              finding.overallStatus === 'moderate_caution' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {finding.overallStatus.replace('_', ' ').toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Commodity Selection Grid */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <h2 className="text-base font-bold text-slate-100 font-display border-b border-slate-800 pb-3">
          Select Pairwise Commodities & Enclosure Configuration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Commodity A */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Commodity A (Primary Cargo)
            </label>
            <select
              value={commA.id}
              onChange={(e) => setCommA(COMMODITY_PROFILES.find(c => c.id === e.target.value) || commA)}
              className="glass-input w-full p-3 rounded-xl text-xs font-semibold"
            >
              {COMMODITY_PROFILES.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div className="text-slate-400">Optimum Temp: <strong className="text-slate-200">{commA.optimumTempRangeC[0]}-{commA.optimumTempRangeC[1]}°C</strong></div>
              <div className="text-slate-400">Ethylene Emission: <strong className="text-amber-400 uppercase">{commA.ethyleneProductionRate}</strong></div>
              <div className="text-slate-400">Ethylene Sensitivity: <strong className="text-cyan-400 uppercase">{commA.ethyleneSensitivity}</strong></div>
            </div>
          </div>

          {/* Shared Air Toggle */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-3">
            <span className="text-xs font-semibold text-slate-300 block">Air Enclosure Setup</span>
            <button
              onClick={() => setSharedAir(!sharedAir)}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
                sharedAir
                  ? 'bg-rose-950/80 border border-rose-600 text-rose-300 shadow-glow-amber'
                  : 'bg-emerald-950/80 border border-emerald-600 text-emerald-300'
              }`}
            >
              <span>{sharedAir ? 'Shared Enclosed Air (Same Compartment)' : 'Isolated Air Compartments'}</span>
            </button>
            <span className="text-[11px] text-slate-400 block">
              {sharedAir ? 'Gas molecules circulate freely between cargoes' : 'Independent HVAC airflow circuits'}
            </span>
          </div>

          {/* Commodity B */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Commodity B (Co-Transported Cargo)
            </label>
            <select
              value={commB.id}
              onChange={(e) => setCommB(COMMODITY_PROFILES.find(c => c.id === e.target.value) || commB)}
              className="glass-input w-full p-3 rounded-xl text-xs font-semibold"
            >
              {COMMODITY_PROFILES.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div className="text-slate-400">Optimum Temp: <strong className="text-slate-200">{commB.optimumTempRangeC[0]}-{commB.optimumTempRangeC[1]}°C</strong></div>
              <div className="text-slate-400">Ethylene Emission: <strong className="text-amber-400 uppercase">{commB.ethyleneProductionRate}</strong></div>
              <div className="text-slate-400">Ethylene Sensitivity: <strong className="text-cyan-400 uppercase">{commB.ethyleneSensitivity}</strong></div>
            </div>
          </div>

        </div>
      </div>

      {/* Findings Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Ethylene Conflict Assessment Card */}
        <div className={`p-6 rounded-2xl border glass-panel space-y-4 ${
          finding.ethyleneConflict.hasConflict ? 'border-rose-500/50 bg-slate-900/90' : 'border-emerald-500/30'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Flame className={`w-5 h-5 ${finding.ethyleneConflict.hasConflict ? 'text-rose-400' : 'text-emerald-400'}`} />
              <h3 className="font-bold text-slate-100 font-display text-sm">Ethylene (C₂H₄) Exposure Risk</h3>
            </div>
            <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
              finding.ethyleneConflict.severity === 'critical_hazard' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
              finding.ethyleneConflict.severity === 'moderate_caution' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
            }`}>
              {finding.ethyleneConflict.severity.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            {finding.ethyleneConflict.mechanism}
          </p>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
            <span className="font-semibold text-emerald-400 block">Recommended Mitigation Strategy:</span>
            <p className="text-slate-300 leading-relaxed">{finding.ethyleneConflict.mitigation}</p>
          </div>

          <button
            onClick={() => onOpenEvidence(finding.ethyleneConflict.sourceId, 'Ethylene Cross-Exposure Guideline', 'UC Davis Ethylene FAQ')}
            className="text-emerald-400 hover:text-emerald-300 text-xs font-mono underline flex items-center space-x-1"
          >
            <span>Inspect UC Davis Ethylene Citation</span>
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Temperature Storage Conflict Card */}
        <div className={`p-6 rounded-2xl border glass-panel space-y-4 ${
          finding.temperatureConflict.hasConflict ? 'border-amber-500/50 bg-slate-900/90' : 'border-emerald-500/30'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Thermometer className={`w-5 h-5 ${finding.temperatureConflict.hasConflict ? 'text-amber-400' : 'text-emerald-400'}`} />
              <h3 className="font-bold text-slate-100 font-display text-sm">Storage Temperature Range Conflict</h3>
            </div>
            <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
              finding.temperatureConflict.severity === 'critical_hazard' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
              finding.temperatureConflict.severity === 'moderate_caution' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
            }`}>
              {finding.temperatureConflict.severity.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            {finding.temperatureConflict.chillingRisk}
          </p>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
            <span className="font-semibold text-emerald-400 block">Thermostat Actionable Guidance:</span>
            <p className="text-slate-300 leading-relaxed">{finding.temperatureConflict.mitigation}</p>
          </div>

          <button
            onClick={() => onOpenEvidence(finding.temperatureConflict.sourceId, 'Chilling Injury Temperature Limits', 'UC Davis Postharvest Factsheet')}
            className="text-cyan-400 hover:text-cyan-300 text-xs font-mono underline flex items-center space-x-1"
          >
            <span>Inspect Chilling Injury Evidence Source</span>
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Next Step Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={onProceedToBrief}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-glow-emerald flex items-center space-x-2 transition"
        >
          <span>Generate Supplier Spec Sheet & QR Snapshot</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};
