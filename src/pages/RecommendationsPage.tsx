import React from 'react';
import { JourneyScenario } from '../types/simulation';
import { PackageStructure, MaterialScreeningResult } from '../types/material';
import { PACKAGE_MATERIALS } from '../data/materials';
import { screenAndRankMaterials } from '../engine/recommender';
import { FilmLayerVisualizer } from '../components/FilmLayerVisualizer';
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, ArrowRight, HelpCircle, FileText, Layers, Award, Columns } from 'lucide-react';

interface RecommendationsPageProps {
  scenario: JourneyScenario;
  onSelectCandidate: (mat: PackageStructure) => void;
  onProceedToStressTest: () => void;
  onOpenEvidence: (sourceId: string, paramName: string, paramVal: string) => void;
  onOpenCompareModal: () => void;
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({
  scenario,
  onSelectCandidate,
  onProceedToStressTest,
  onOpenEvidence,
  onOpenCompareModal
}) => {
  const rankedResults = screenAndRankMaterials(scenario, PACKAGE_MATERIALS);
  const passedCandidates = rankedResults.filter(r => r.status === 'passes');
  const failedCandidates = rankedResults.filter(r => r.status === 'fails');

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Scientific Candidate Screening</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-display tracking-tight">
              Recommended Packaging Structures
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Evaluating candidate materials against target shelf-life ({scenario.transitDurationDays} days), OTR, WVTR, seal window, and food contact safety.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              onClick={onOpenCompareModal}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center space-x-2 transition shadow-sm"
            >
              <Columns className="w-4 h-4 text-emerald-400" />
              <span>Compare Candidates Side-by-Side</span>
            </button>

            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 font-mono">Scenario Target: {scenario.commodity.name} ({scenario.fillMassKg}kg • {scenario.productTemperatureC}°C)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Passed Candidates Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100 font-display flex items-center space-x-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span>Qualified Feasible Candidates ({passedCandidates.length})</span>
          </h2>
          <span className="text-xs text-slate-400">Ranked by Analytical Suitability Score</span>
        </div>

        {passedCandidates.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-rose-950/20 border border-rose-800/40 text-rose-300">
            <ShieldAlert className="w-10 h-10 text-rose-400 mx-auto mb-3 animate-pulse" />
            <h3 className="font-bold text-base font-display">No Feasible Candidate in Current Catalogue</h3>
            <p className="text-xs text-rose-300/80 max-w-md mx-auto mt-1">
              All tested materials breached gas or moisture threshold constraints before the requested {scenario.transitDurationDays} days transit target.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {passedCandidates.map((result, idx) => {
              const mat = result.material;
              const isBestChoice = idx === 0;

              return (
                <div
                  key={mat.id}
                  className={`p-6 rounded-2xl glass-panel border transition-all ${
                    isBestChoice ? 'border-emerald-500/60 bg-slate-900/90 shadow-glow-emerald' : 'border-slate-800'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    
                    {/* Candidate Info */}
                    <div className="space-y-4 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {isBestChoice && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider">
                            ★ Optimal Analytical Recommendation
                          </span>
                        )}
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-700 uppercase">
                          {mat.category.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">Supplier: {mat.supplier}</span>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-slate-100 font-display">{mat.name}</h3>
                        <p className="text-xs text-emerald-400 font-mono mt-0.5">{mat.tradeName}</p>
                      </div>

                      {/* Film Layer Cross Section Visualizer */}
                      <FilmLayerVisualizer material={mat} />

                      {/* Constraints Passed Badges */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] text-slate-400 font-semibold block">Passed Verification Criteria:</span>
                        <div className="flex flex-wrap gap-2">
                          {result.passedConstraints.map((c, i) => (
                            <span key={i} className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{c}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Scientific Barrier Metrics & Evidence Links */}
                    <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 shrink-0 lg:w-80 text-xs">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                        <span className="text-slate-400">Oxygen Permeance (OTR)</span>
                        <button
                          onClick={() => onOpenEvidence(mat.otr.sourceId, 'Oxygen Transmission Rate (OTR)', `${mat.otr.value} ${mat.otr.unit}`)}
                          className="font-mono font-bold text-emerald-400 hover:underline flex items-center space-x-1"
                        >
                          <span>{mat.otr.value}</span>
                          <HelpCircle className="w-3 h-3 text-slate-500" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                        <span className="text-slate-400">Water Vapour Rate (WVTR)</span>
                        <button
                          onClick={() => onOpenEvidence(mat.wvtr.sourceId, 'Water Vapour Transmission Rate (WVTR)', `${mat.wvtr.value} ${mat.wvtr.unit}`)}
                          className="font-mono font-bold text-cyan-400 hover:underline flex items-center space-x-1"
                        >
                          <span>{mat.wvtr.value}</span>
                          <HelpCircle className="w-3 h-3 text-slate-500" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                        <span className="text-slate-400">Heat Seal Window</span>
                        <span className="font-mono font-semibold text-slate-200">{mat.heatSealWindowC[0]}°C – {mat.heatSealWindowC[1]}°C</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Indicative Cost / 1k Packs</span>
                        <span className="font-mono font-extrabold text-amber-300">${mat.indicativeCostPer1kPacksUSD.toFixed(2)}</span>
                      </div>

                      {/* Select & Test Button */}
                      <button
                        onClick={() => {
                          onSelectCandidate(mat);
                          onProceedToStressTest();
                        }}
                        className="w-full mt-2 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow-emerald flex items-center justify-center space-x-2 transition"
                      >
                        <span>Select Candidate for Stress Test</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Rejected / Excluded Candidates View */}
      {failedCandidates.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <h2 className="text-base font-bold text-slate-300 font-display flex items-center space-x-2">
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>Excluded / Unsuitable Candidates ({failedCandidates.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {failedCandidates.map((result) => {
              const mat = result.material;
              return (
                <div key={mat.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-300">{mat.name}</h3>
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/40 text-[10px]">
                      Excluded
                    </span>
                  </div>

                  {result.failedConstraints.map((fail, i) => (
                    <div key={i} className="p-2.5 rounded bg-rose-950/30 border border-rose-900/50 text-rose-200 space-y-1">
                      <div className="font-semibold text-rose-300">Failure: {fail.constraint}</div>
                      <p className="text-[11px] leading-relaxed text-rose-200/90">{fail.reason}</p>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
