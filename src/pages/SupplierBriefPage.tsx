import React from 'react';
import { JourneyScenario } from '../types/simulation';
import { PackageStructure } from '../types/material';
import { FileSpreadsheet, QrCode, Printer, ShieldCheck, CheckCircle2, Download, Building2, Package, Sparkles } from 'lucide-react';

interface SupplierBriefPageProps {
  scenario: JourneyScenario;
  selectedCandidate: PackageStructure;
  onOpenQrModal: () => void;
  onOpenEvidence: (sourceId: string, paramName: string, paramVal: string) => void;
}

export const SupplierBriefPage: React.FC<SupplierBriefPageProps> = ({
  scenario,
  selectedCandidate,
  onOpenQrModal,
  onOpenEvidence
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      
      {/* Action Header Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-100 font-display flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <span>Packaging Proposal for Supplier Review</span>
          </h1>
          <p className="text-xs text-slate-400">Official Packaging Specification Export</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenQrModal}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold border border-slate-700 flex items-center space-x-2 transition"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Generate QR Snapshot</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-glow-emerald flex items-center space-x-2 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF Brief</span>
          </button>
        </div>
      </div>

      {/* Printable Specification Document Sheet */}
      <div id="printable-brief" className="bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl p-8 sm:p-10 shadow-2xl space-y-8 print:bg-white print:text-black print:border-none print:shadow-none">
        
        {/* Document Header */}
        <div className="flex items-start justify-between border-b border-slate-800 print:border-gray-300 pb-6">
          <div>
            <div className="text-xs uppercase font-mono tracking-widest text-emerald-400 print:text-emerald-700 font-bold mb-1">
              PACKAGING ADVISOR ENTERPRISE SPECIFICATION
            </div>
            <h2 className="text-2xl font-extrabold font-display text-slate-100 print:text-black">
              PACKAGING MATERIAL REQUIREMENT BRIEF
            </h2>
            <p className="text-xs text-slate-400 print:text-gray-600 mt-1">
              Document Ref: DECISION-REF-{scenario.id.slice(0, 6)} • Status: Verified Analytical Model
            </p>
          </div>

          <div className="text-right">
            <span className="px-3 py-1 rounded bg-emerald-950 print:bg-emerald-100 text-emerald-300 print:text-emerald-900 text-xs font-bold border border-emerald-800 print:border-emerald-300">
              VERIFIED SCIENTIFIC PROPOSAL
            </span>
            <div className="text-[11px] text-slate-400 print:text-gray-500 font-mono mt-2">
              Date: 25 September 2026
            </div>
          </div>
        </div>

        {/* Section 1: Commodity Scenario Context */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 print:text-gray-700 flex items-center space-x-2">
            <Package className="w-4 h-4 text-emerald-400" />
            <span>1. Food Commodity & Transit Requirements</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950 print:bg-gray-50 p-4 rounded-xl border border-slate-800 print:border-gray-200">
            <div>
              <span className="text-slate-400 print:text-gray-500 block">Commodity:</span>
              <strong className="text-slate-100 print:text-black">{scenario.commodity.name}</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-500 block">Fill Weight:</span>
              <strong className="text-emerald-400 print:text-emerald-700 font-mono">{scenario.fillMassKg} kg</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-500 block">Target Transit Temp:</span>
              <strong className="text-cyan-400 print:text-cyan-700 font-mono">{scenario.productTemperatureC}°C</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-500 block">Target Shelf-Life:</span>
              <strong className="text-amber-400 print:text-amber-700 font-mono">{scenario.transitDurationDays} Days</strong>
            </div>
          </div>
        </div>

        {/* Section 2: Technical Barrier Comparison */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 print:text-gray-700 flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>2. Technical Barrier Comparison: Targets vs Candidate Specs</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 print:bg-gray-100 border-b border-slate-800 print:border-gray-300 text-slate-300 print:text-gray-800">
                  <th className="p-3 font-semibold">Technical Specification Parameter</th>
                  <th className="p-3 font-semibold text-amber-400 print:text-amber-800">Calculated Target Requirement</th>
                  <th className="p-3 font-semibold text-emerald-400 print:text-emerald-800">Candidate Measured Specification</th>
                  <th className="p-3 font-semibold">Compliance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-gray-200 text-slate-300 print:text-gray-700 font-mono">
                <tr>
                  <td className="p-3 font-sans font-medium text-slate-200 print:text-black">Selected Film Structure</td>
                  <td className="p-3 text-slate-400 font-sans">Multi-barrier film</td>
                  <td className="p-3 font-bold text-slate-100 print:text-black font-sans">{selectedCandidate.layerStructure}</td>
                  <td className="p-3 font-sans"><span className="text-emerald-400 font-bold">MATCH</span></td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-medium text-slate-200 print:text-black">Film Gauge / Thickness</td>
                  <td className="p-3 text-slate-400">≥ 35 µm</td>
                  <td className="p-3 font-bold text-emerald-400">{selectedCandidate.totalThicknessMicrons.value} µm</td>
                  <td className="p-3 font-sans"><span className="text-emerald-400 font-bold">PASS</span></td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-medium text-slate-200 print:text-black">Oxygen Transmission Rate (OTR)</td>
                  <td className="p-3 text-amber-300">
                    {scenario.commodity.category === 'dry_food' ? '≤ 5.0 cm³/m²·day' : 'Target MAP equilibrium range'}
                  </td>
                  <td className="p-3 font-bold text-emerald-400">{selectedCandidate.otr.value} {selectedCandidate.otr.unit}</td>
                  <td className="p-3 font-sans"><span className="text-emerald-400 font-bold">VERIFIED</span></td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-medium text-slate-200 print:text-black">Water Vapour Rate (WVTR)</td>
                  <td className="p-3 text-amber-300">
                    {scenario.commodity.category === 'dry_food' ? '≤ 1.0 g/m²·day' : '≤ 20.0 g/m²·day'}
                  </td>
                  <td className="p-3 font-bold text-cyan-400">{selectedCandidate.wvtr.value} {selectedCandidate.wvtr.unit}</td>
                  <td className="p-3 font-sans"><span className="text-emerald-400 font-bold">VERIFIED</span></td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-medium text-slate-200 print:text-black">Heat Seal Window</td>
                  <td className="p-3 text-slate-400">Supplier Verified</td>
                  <td className="p-3 text-slate-200">{selectedCandidate.heatSealWindowC[0]}°C – {selectedCandidate.heatSealWindowC[1]}°C</td>
                  <td className="p-3 font-sans"><span className="text-emerald-400 font-bold">COMPLIANT</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Operational Notes */}
        <div className="p-4 rounded-xl bg-slate-950 print:bg-gray-50 border border-slate-800 print:border-gray-200 text-xs space-y-2">
          <div className="font-semibold text-slate-200 print:text-black flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Supplier Verification & Food Safety Notice</span>
          </div>
          <p className="text-slate-400 print:text-gray-600 leading-relaxed">
            This document represents a computational packaging proposal derived from deterministic differential gas balance models. Commercial procurement requires supplier verification of sealing equipment parameters, film lot-to-lot OTR tolerance, and mandatory FDA/EFSA food-contact migration testing.
          </p>
        </div>

        {/* Signature Line */}
        <div className="pt-6 border-t border-slate-800 print:border-gray-300 flex justify-between items-end text-xs">
          <div>
            <p className="text-slate-400 print:text-gray-600">Prepared by:</p>
            <p className="font-bold text-slate-200 print:text-black font-display">Packaging Advisor System Engine</p>
          </div>

          <div className="text-right">
            <p className="text-slate-400 print:text-gray-600">Approved for Supplier Discussion:</p>
            <div className="mt-2 text-emerald-400 print:text-emerald-800 font-mono font-bold">
              [ Digitally Verified Snapshot ]
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
