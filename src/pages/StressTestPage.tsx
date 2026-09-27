import React from 'react';
import { JourneyScenario } from '../types/simulation';
import { PackageStructure } from '../types/material';
import { PACKAGE_MATERIALS } from '../data/materials';
import { runPackStressTest } from '../engine/stressTester';
import { exportTrajectoriesToCSV } from '../utils/exportUtils';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ReferenceLine } from 'recharts';
import { Activity, Flame, Clock, Weight, AlertTriangle, CheckCircle, RefreshCw, ArrowRight, ShieldCheck, HelpCircle, Download, Play, Pause } from 'lucide-react';

interface StressTestPageProps {
  originalScenario: JourneyScenario;
  selectedCandidate: PackageStructure;
  onSelectCandidate: (mat: PackageStructure) => void;
  onUpdateScenario: (updated: JourneyScenario) => void;
  onProceedToMixedLoad: () => void;
}

export const StressTestPage: React.FC<StressTestPageProps> = ({
  originalScenario,
  selectedCandidate,
  onSelectCandidate,
  onUpdateScenario,
  onProceedToMixedLoad
}) => {
  const [tempOffset, setTempOffset] = React.useState(5);
  const [delayDays, setDelayDays] = React.useState(3);
  const [massOffset, setMassOffset] = React.useState(0);
  const [scrubDay, setScrubDay] = React.useState(0);

  const stressedScenario: JourneyScenario = {
    ...originalScenario,
    productTemperatureC: originalScenario.productTemperatureC + tempOffset,
    transitDurationDays: originalScenario.transitDurationDays + delayDays,
    fillMassKg: Math.max(0.1, Number((originalScenario.fillMassKg + massOffset).toFixed(2)))
  };

  const stressComparison = runPackStressTest(
    originalScenario,
    stressedScenario,
    selectedCandidate,
    PACKAGE_MATERIALS
  );

  const origResult = stressComparison.originalResult;
  const stressedResult = stressComparison.stressedResult;
  const comm = originalScenario.commodity;

  // Active scrubbed point
  const maxDayIndex = stressedResult.trajectories.length - 1;
  const clampedScrubIndex = Math.min(scrubDay, maxDayIndex);
  const scrubPoint = stressedResult.trajectories[clampedScrubIndex] || stressedResult.trajectories[maxDayIndex];

  // Prepare chart dataset
  const chartData = origResult.trajectories.map((origPt, idx) => {
    const strPt = stressedResult.trajectories[idx] || stressedResult.trajectories[stressedResult.trajectories.length - 1];
    return {
      day: `Day ${origPt.day}`,
      origO2: origPt.o2Percent,
      origCO2: origPt.co2Percent,
      origMoisture: origPt.moistureContentPercent,
      stressedO2: strPt?.o2Percent,
      stressedCO2: strPt?.co2Percent,
      stressedMoisture: strPt?.moistureContentPercent
    };
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>Interactive Pack Stress Test & ODE Solver</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-display tracking-tight">
              Real-Time Dynamic Journey Simulation
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Simulate route disruption, truck reefer failures, or fill weight changes. The scientific engine recalculates headspace gas ODE dynamics and moisture budgets instantly.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              onClick={() => exportTrajectoriesToCSV(stressedResult, stressedScenario, selectedCandidate)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center space-x-2 transition shadow-sm"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export Raw ODE Trajectory CSV</span>
            </button>

            <div className="bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-right">
              <span className="text-[10px] text-emerald-400 font-mono font-semibold">{selectedCandidate.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Stress Slider Controls */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <h2 className="text-base font-bold text-slate-100 font-display flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Modify Journey Environment Variables</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Temperature Spike Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-300 flex items-center space-x-1">
                <Flame className="w-4 h-4 text-rose-400" />
                <span>Temperature Rise (+°C)</span>
              </span>
              <span className="font-mono text-rose-400">+{tempOffset}°C ({stressedScenario.productTemperatureC}°C total)</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              value={tempOffset}
              onChange={(e) => setTempOffset(parseInt(e.target.value))}
              className="w-full accent-rose-500 bg-slate-950 rounded-lg cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 block">Simulates hot truck transit / reefer breakdown</span>
          </div>

          {/* Route Delay Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-300 flex items-center space-x-1">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Transit Delay (+Days)</span>
              </span>
              <span className="font-mono text-amber-400">+{delayDays} Days ({stressedScenario.transitDurationDays}d total)</span>
            </div>
            <input
              type="range"
              min="0"
              max="14"
              step="1"
              value={delayDays}
              onChange={(e) => setDelayDays(parseInt(e.target.value))}
              className="w-full accent-amber-500 bg-slate-950 rounded-lg cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 block">Simulates customs check or port delays</span>
          </div>

          {/* Mass Offset Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-300 flex items-center space-x-1">
                <Weight className="w-4 h-4 text-cyan-400" />
                <span>Fill Mass Offset (kg)</span>
              </span>
              <span className="font-mono text-cyan-400">{stressedScenario.fillMassKg} kg</span>
            </div>
            <input
              type="range"
              min="-0.2"
              max="0.5"
              step="0.05"
              value={massOffset}
              onChange={(e) => setMassOffset(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 bg-slate-950 rounded-lg cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 block">Adjust pouch fill density</span>
          </div>

        </div>
      </div>

      {/* Interactive Day Scrubber Readout Card */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Day-by-Day Timeline Inspector (Scrubbing Day {clampedScrubIndex})</span>
          </div>
          <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold capitalize ${
            scrubPoint?.qualityStatus === 'optimal' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
            scrubPoint?.qualityStatus === 'warning' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
          }`}>
            Physiological Status: {scrubPoint?.qualityStatus}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max={maxDayIndex}
          step="1"
          value={clampedScrubIndex}
          onChange={(e) => setScrubDay(parseInt(e.target.value))}
          className="w-full accent-emerald-400 bg-slate-900 rounded-lg cursor-pointer"
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
          <div className="bg-slate-900 p-2 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Day Index</span>
            <span className="font-mono font-bold text-slate-100">Day {clampedScrubIndex}</span>
          </div>
          {comm.category === 'dry_food' ? (
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Moisture Level</span>
              <span className="font-mono font-bold text-cyan-400">{scrubPoint?.moistureContentPercent}%</span>
            </div>
          ) : (
            <>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Headspace O₂</span>
                <span className="font-mono font-bold text-emerald-400">{scrubPoint?.o2Percent}%</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Headspace CO₂</span>
                <span className="font-mono font-bold text-amber-400">{scrubPoint?.co2Percent}%</span>
              </div>
            </>
          )}
          <div className="bg-slate-900 p-2 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Atmosphere Nitrogen</span>
            <span className="font-mono font-bold text-slate-300">{scrubPoint?.n2Percent}%</span>
          </div>
        </div>
      </div>

      {/* Trajectory Graph Comparison */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-100 font-display">
              {comm.category === 'dry_food' ? 'Moisture Ingress Sorption Trajectory' : 'Headspace Oxygen & Carbon Dioxide Trajectories'}
            </h2>
            <p className="text-xs text-slate-400">Comparing original baseline vs revised stressed environment over transit days</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-slate-950 px-3 py-1 rounded border border-slate-800">
            Engine Model: {origResult.modelType}
          </span>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} domain={[0, comm.category === 'dry_food' ? 5 : 22]} />
              <RechartsTooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

              {comm.category === 'dry_food' ? (
                <>
                  <Line type="monotone" dataKey="origMoisture" name="Baseline Moisture %" stroke="#10b981" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="stressedMoisture" name="Stressed Moisture %" stroke="#f43f5e" strokeWidth={2.5} strokeDasharray="5 5" />
                  <ReferenceLine y={comm.criticalMoisturePercent?.value ?? 2.5} label="Crispness Failure Limit" stroke="#f59e0b" strokeDasharray="3 3" />
                </>
              ) : (
                <>
                  <Line type="monotone" dataKey="origO2" name="Baseline O2 %" stroke="#10b981" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="stressedO2" name="Stressed O2 %" stroke="#f43f5e" strokeWidth={2.5} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="origCO2" name="Baseline CO2 %" stroke="#06b6d4" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="stressedCO2" name="Stressed CO2 %" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
                  <ReferenceLine y={comm.minO2Percent?.value ?? 2.5} label="Aerobic Limit (2.5% O2)" stroke="#ef4444" strokeDasharray="3 3" />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* "What Would Make This Feasible?" Automated Adjustments */}
      {stressComparison.feasibilityAdjustments && stressComparison.feasibilityAdjustments.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 to-slate-950 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400">
            <RefreshCw className="w-5 h-5 animate-spin-slow" />
            <h2 className="text-base font-bold font-display">What Would Make This Feasible?</h2>
          </div>
          <p className="text-xs text-slate-300">
            The scientific engine searched bounded operational adjustments to restore recommendation feasibility under the stressed journey conditions:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {stressComparison.feasibilityAdjustments.map((adj) => (
              <div key={adj.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between text-xs">
                <div>
                  <h3 className="font-bold text-slate-100">{adj.title}</h3>
                  <p className="text-slate-400 mt-1 leading-relaxed">{adj.description}</p>
                  <div className="mt-2 p-2 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 font-mono">
                    {adj.actionableChange}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Restores Shelf-Life:</span>
                  <span className="font-bold text-emerald-400">{adj.newEffectiveShelfLifeDays} Days</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Step Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={onProceedToMixedLoad}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-glow-emerald flex items-center space-x-2 transition"
        >
          <span>Proceed to Mixed-Load Compatibility Check</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};
