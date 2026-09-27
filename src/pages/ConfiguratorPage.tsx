import React from 'react';
import { CommodityProfile } from '../types/commodity';
import { JourneyScenario } from '../types/simulation';
import { COMMODITY_PROFILES } from '../data/commodities';
import { Sparkles, ArrowRight, Thermometer, Calendar, Weight, Layers, ShieldAlert, Info, HelpCircle, Zap, ShieldCheck } from 'lucide-react';

interface ConfiguratorPageProps {
  scenario: JourneyScenario;
  onUpdateScenario: (updated: JourneyScenario) => void;
  onProceedToRecommendations: () => void;
  onOpenAiAssistant: () => void;
  onOpenEvidence: (sourceId: string, paramName: string, paramVal: string) => void;
}

export const ConfiguratorPage: React.FC<ConfiguratorPageProps> = ({
  scenario,
  onUpdateScenario,
  onProceedToRecommendations,
  onOpenAiAssistant,
  onOpenEvidence
}) => {
  const selectedComm = scenario.commodity;

  const handleCommoditySelect = (comm: CommodityProfile) => {
    onUpdateScenario({
      ...scenario,
      commodity: comm,
      fillMassKg: comm.defaultPackWeightKg,
      transitDurationDays: comm.defaultDesiredShelfLifeDays,
      productTemperatureC: comm.optimumTempRangeC[0]
    });
  };

  const applyPreset = (commId: string, temp: number, days: number, weight: number) => {
    const comm = COMMODITY_PROFILES.find(c => c.id === commId) || COMMODITY_PROFILES[0];
    onUpdateScenario({
      ...scenario,
      commodity: comm,
      productTemperatureC: temp,
      transitDurationDays: days,
      fillMassKg: weight
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Hero Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 relative overflow-hidden gradient-border-emerald">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
            <span>Interactive Scenario Configurator</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 font-display tracking-tight leading-tight">
            Describe Food Commodity & Journey Environment
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Select your target commodity, pouch net weight, transit temperature, and duration. The scientific engine instantly computes dynamic gas dynamics ($O_2/CO_2$) and moisture sorption targets ($WVTR$).
          </p>

          {/* Quick Presets & AI Button */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenAiAssistant}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-semibold hover:border-emerald-400 transition flex items-center space-x-2 shadow-glow-emerald"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Use AI Prompt Assistant</span>
            </button>

            <span className="text-slate-500 text-xs px-1">or quick presets:</span>

            <button
              onClick={() => applyPreset('strawberry_fresh', 4.0, 10, 0.25)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition flex items-center space-x-1"
            >
              <span>🍓 Fresh Strawberries (4°C)</span>
            </button>
            <button
              onClick={() => applyPreset('tomato_vine_ripe', 14.0, 14, 0.5)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition flex items-center space-x-1"
            >
              <span>🍅 Vine Tomatoes (14°C)</span>
            </button>
            <button
              onClick={() => applyPreset('potato_chips', 22.0, 180, 0.15)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition flex items-center space-x-1"
            >
              <span>🥔 Potato Chips (Dry Pack)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step 1: Select Commodity Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100 font-display flex items-center space-x-2">
            <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold border border-emerald-500/30">1</span>
            <span>Select Commodity Profile</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">8 Reviewed Scientific Profiles</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COMMODITY_PROFILES.map((comm) => {
            const isSelected = selectedComm.id === comm.id;
            return (
              <div
                key={comm.id}
                onClick={() => handleCommoditySelect(comm)}
                className={`group p-4 rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden ${
                  isSelected
                    ? 'bg-slate-900 border-2 border-emerald-500 shadow-glow-emerald scale-[1.02]'
                    : 'glass-panel-interactive hover:border-slate-700'
                }`}
              >
                <div className="relative h-28 w-full rounded-xl overflow-hidden mb-3 border border-slate-800">
                  <img
                    src={comm.image}
                    alt={comm.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <span className={`absolute bottom-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded-md capitalize font-semibold backdrop-blur-md ${
                    comm.category === 'dry_food' ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60' : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                  }`}>
                    {comm.category.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-100 font-display group-hover:text-emerald-300 transition">{comm.name}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {comm.description}
                </p>

                {/* Parameters overview */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Optimum Temp:</span>
                    <span className="font-semibold text-slate-200 font-mono">{comm.optimumTempRangeC[0]}–{comm.optimumTempRangeC[1]}°C</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Ethylene:</span>
                    <span className="font-semibold text-cyan-400 capitalize">{comm.ethyleneProductionRate}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Journey & Package Form */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <h2 className="text-lg font-bold text-slate-100 font-display flex items-center space-x-2 border-b border-slate-800 pb-4">
          <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold border border-emerald-500/30">2</span>
          <span>Configure Pack Geometry & Environmental Logistics</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pack Weight */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Weight className="w-4 h-4 text-emerald-400" />
                <span>Fill Mass per Pack (kg)</span>
              </span>
            </label>
            <input
              type="number"
              step="0.05"
              min="0.05"
              max="25.0"
              value={scenario.fillMassKg}
              onChange={(e) => onUpdateScenario({ ...scenario, fillMassKg: parseFloat(e.target.value) || 0.5 })}
              className="glass-input w-full p-3.5 rounded-xl font-mono text-sm"
            />
            <span className="text-[11px] text-slate-400 block">Default pack size: {selectedComm.defaultPackWeightKg} kg</span>
          </div>

          {/* Transit Temperature */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Thermometer className="w-4 h-4 text-cyan-400" />
                <span>Cargo Product Temp (°C)</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Opt: {selectedComm.optimumTempRangeC[0]}-{selectedComm.optimumTempRangeC[1]}°C</span>
            </label>
            <input
              type="number"
              step="0.5"
              min="-2"
              max="40"
              value={scenario.productTemperatureC}
              onChange={(e) => onUpdateScenario({ ...scenario, productTemperatureC: parseFloat(e.target.value) || 12 })}
              className="glass-input w-full p-3.5 rounded-xl font-mono text-sm"
            />
            {selectedComm.chillingInjuryThresholdC && scenario.productTemperatureC < selectedComm.chillingInjuryThresholdC && (
              <span className="text-[11px] text-rose-400 block font-medium flex items-center space-x-1">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>Sub-threshold chilling injury risk ({selectedComm.chillingInjuryThresholdC}°C)</span>
              </span>
            )}
          </div>

          {/* Transit Duration */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Target Transit Duration (Days)</span>
              </span>
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={scenario.transitDurationDays}
              onChange={(e) => onUpdateScenario({ ...scenario, transitDurationDays: parseInt(e.target.value) || 14 })}
              className="glass-input w-full p-3.5 rounded-xl font-mono text-sm"
            />
          </div>

          {/* Package Area */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Active Surface Area (m²)
            </label>
            <input
              type="number"
              step="0.005"
              min="0.01"
              max="2.0"
              value={scenario.packageAreaM2}
              onChange={(e) => onUpdateScenario({ ...scenario, packageAreaM2: parseFloat(e.target.value) || 0.08 })}
              className="glass-input w-full p-3.5 rounded-xl font-mono text-sm"
            />
          </div>

          {/* Headspace Volume */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Headspace Volume (L)
            </label>
            <input
              type="number"
              step="0.05"
              min="0.05"
              max="10.0"
              value={scenario.headspaceVolumeL}
              onChange={(e) => onUpdateScenario({ ...scenario, headspaceVolumeL: parseFloat(e.target.value) || 0.4 })}
              className="glass-input w-full p-3.5 rounded-xl font-mono text-sm"
            />
          </div>

          {/* Ambient RH */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Ambient RH (%)
            </label>
            <input
              type="number"
              min="10"
              max="100"
              value={scenario.ambientRHPercent}
              onChange={(e) => onUpdateScenario({ ...scenario, ambientRHPercent: parseInt(e.target.value) || 75 })}
              className="glass-input w-full p-3.5 rounded-xl font-mono text-sm"
            />
          </div>

        </div>

        {/* Selected Commodity Respiration Badge Bar */}
        <div className="pt-4 border-t border-slate-800 bg-slate-950/60 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300">
              Respiration Rate (20°C): <strong>{selectedComm.respirationRate20C?.value ?? 'N/A'} {selectedComm.respirationRate20C?.unit}</strong>
            </span>
          </div>

          {selectedComm.respirationRate20C?.sourceId && (
            <button
              onClick={() => onOpenEvidence(
                selectedComm.respirationRate20C!.sourceId,
                `${selectedComm.name} Respiration Rate`,
                `${selectedComm.respirationRate20C!.value} ${selectedComm.respirationRate20C!.unit}`
              )}
              className="text-emerald-400 hover:text-emerald-300 font-mono text-[11px] underline flex items-center space-x-1"
            >
              <span>Inspect Source Citation</span>
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <button
            onClick={onProceedToRecommendations}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-glow-emerald flex items-center space-x-2 transition transform hover:scale-[1.02]"
          >
            <span>Screen Packaging Candidates</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>

    </div>
  );
};
