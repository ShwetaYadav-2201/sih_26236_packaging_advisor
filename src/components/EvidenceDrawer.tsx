import React from 'react';
import { X, ExternalLink, ShieldCheck, Database, FileText, CheckCircle } from 'lucide-react';
import { EVIDENCE_SOURCES } from '../data/evidenceSources';

interface EvidenceDrawerProps {
  sourceId: string | null;
  parameterName: string | null;
  parameterValue: string | null;
  onClose: () => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({
  sourceId,
  parameterName,
  parameterValue,
  onClose
}) => {
  if (!sourceId) return null;

  const source = EVIDENCE_SOURCES[sourceId];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-md flex justify-end animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 shadow-2xl h-full overflow-y-auto flex flex-col justify-between">
        
        {/* Header */}
        <div>
          <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-950/60">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                  Evidence Provenance Trail
                </span>
                <h3 className="text-lg font-bold text-slate-100 font-display mt-1">
                  {parameterName || 'Scientific Value Details'}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Parameter Highlight Card */}
          <div className="p-6 space-y-6">
            <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium">Selected Value / Parameter</span>
                <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">
                  {parameterValue || 'N/A'}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-medium">Evidence Class</span>
                <div className="text-xs font-semibold text-cyan-300 capitalize mt-0.5">
                  {source?.evidenceClass || 'measured'}
                </div>
              </div>
            </div>

            {/* Source Details */}
            {source ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Source Publication Title</h4>
                  <p className="text-sm font-medium text-slate-100 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                    {source.title}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400">Authors / Publisher</span>
                    <p className="font-semibold text-slate-200 mt-1">{source.authorsOrOrg}</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400">Year of Publication</span>
                    <p className="font-semibold text-slate-200 mt-1">{source.year}</p>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs">
                  <span className="text-slate-400">Document Locator / Table Reference</span>
                  <p className="font-semibold text-amber-300 mt-1">{source.locator}</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs">
                  <span className="text-slate-400">Peer Review & Audit Status</span>
                  <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold mt-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Verified ({source.reviewStatus})</span>
                  </div>
                </div>

                {source.notes && (
                  <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-800/40 text-xs text-emerald-200/90 leading-relaxed">
                    <strong>Scientific Context:</strong> {source.notes}
                  </div>
                )}

                {/* DOI Link Button */}
                <a
                  href={source.urlOrDoi}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center space-x-2 transition"
                >
                  <ExternalLink className="w-4 h-4 text-cyan-400" />
                  <span>Inspect Original Publication / DOI Source</span>
                </a>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No detailed source citation linked for this parameter.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/60">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close Evidence Drawer
          </button>
        </div>

      </div>
    </div>
  );
};
