import React from 'react';
import { X, QrCode, Copy, Check, ShieldCheck, Download, Share2 } from 'lucide-react';
import { JourneyScenario } from '../types/simulation';
import { PackageStructure } from '../types/material';

interface QrModalProps {
  scenario: JourneyScenario;
  material: PackageStructure;
  onClose: () => void;
}

export const QrModal: React.FC<QrModalProps> = ({ scenario, material, onClose }) => {
  const [copied, setCopied] = React.useState(false);
  const shareToken = `decision-${scenario.id.slice(0, 8)}-${material.id}`;
  const shareUrl = `${window.location.origin}/#snapshot=${shareToken}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-display">Supplier Decision Snapshot QR</h3>
              <p className="text-[11px] text-slate-400">Immutable Record Token</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-center space-y-5">
          
          {/* SVG QR Code Simulation */}
          <div className="inline-block p-4 bg-white rounded-xl shadow-lg border-4 border-emerald-500/20">
            <svg className="w-44 h-44" viewBox="0 0 100 100" fill="none">
              <rect width="100" height="100" fill="white" />
              {/* Corner markers */}
              <rect x="5" y="5" width="25" height="25" fill="#0f172a" />
              <rect x="9" y="9" width="17" height="17" fill="white" />
              <rect x="13" y="13" width="9" height="9" fill="#10b981" />

              <rect x="70" y="5" width="25" height="25" fill="#0f172a" />
              <rect x="74" y="9" width="17" height="17" fill="white" />
              <rect x="78" y="13" width="9" height="9" fill="#10b981" />

              <rect x="5" y="70" width="25" height="25" fill="#0f172a" />
              <rect x="9" y="74" width="17" height="17" fill="white" />
              <rect x="13" y="78" width="9" height="9" fill="#10b981" />

              {/* Data Matrix Modules */}
              <rect x="35" y="10" width="5" height="5" fill="#0f172a" />
              <rect x="45" y="10" width="10" height="5" fill="#0f172a" />
              <rect x="60" y="10" width="5" height="5" fill="#0f172a" />

              <rect x="35" y="20" width="10" height="5" fill="#10b981" />
              <rect x="50" y="20" width="5" height="5" fill="#0f172a" />

              <rect x="10" y="35" width="5" height="10" fill="#0f172a" />
              <rect x="20" y="35" width="10" height="5" fill="#0f172a" />
              <rect x="35" y="35" width="15" height="15" fill="#0f172a" />
              <rect x="55" y="35" width="10" height="5" fill="#10b981" />
              <rect x="70" y="35" width="10" height="10" fill="#0f172a" />
              <rect x="85" y="35" width="5" height="15" fill="#0f172a" />

              <rect x="10" y="50" width="15" height="5" fill="#10b981" />
              <rect x="30" y="55" width="10" height="10" fill="#0f172a" />
              <rect x="45" y="55" width="20" height="5" fill="#0f172a" />
              <rect x="70" y="50" width="15" height="10" fill="#0f172a" />

              <rect x="35" y="70" width="10" height="10" fill="#0f172a" />
              <rect x="50" y="75" width="15" height="5" fill="#10b981" />
              <rect x="70" y="70" width="25" height="5" fill="#0f172a" />
              <rect x="80" y="80" width="15" height="15" fill="#0f172a" />
              <rect x="35" y="85" width="30" height="10" fill="#0f172a" />
            </svg>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-left">
            <span className="text-slate-400 block mb-1">Decision Brief Target:</span>
            <p className="font-semibold text-slate-100">{scenario.commodity.name} ({scenario.fillMassKg}kg)</p>
            <p className="text-emerald-400 font-mono text-[11px] mt-0.5">{material.name}</p>
          </div>

          {/* Copy Link Input */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1 shrink-0 transition"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">Share with packaging converters</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
