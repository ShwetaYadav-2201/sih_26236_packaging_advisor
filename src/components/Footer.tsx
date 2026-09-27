import React from 'react';
import { Shield, BookOpen, ExternalLink, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12 text-slate-400 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          <div>
            <div className="flex items-center space-x-2 text-slate-200 font-display font-semibold text-sm mb-3">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Packaging Advisor</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-4">
              AI-Based Intelligent Food Packaging Material Recommendation System for Food Commodities. Powered by scientific gas balance dynamics and moisture sorption modeling.
            </p>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Enterprise Release (v1.0)</span>
            </div>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold mb-3 flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Scientific Data Sources</span>
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>UC Davis Postharvest Technology Center</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>INRAE Packaging DSS Respiration Repositories</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>ASTM D3985 (OTR) & F1249 (WVTR) Standards</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>USDA FoodData Central Composition Baseline</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold mb-3">System Assurance & Transparency</h4>
            <p className="text-slate-400 leading-relaxed mb-3">
              All material recommendations and shelf-life calculations are generated via deterministic numerical models ($dn/dt$ differential gas balances and moisture budgets) anchored to reviewed evidence DOIs.
            </p>
            <div className="text-[11px] text-amber-400/90 bg-amber-950/30 border border-amber-800/40 p-2.5 rounded-lg">
              <strong>Disclaimer:</strong> Physical shelf-life and food-contact compliance require mandatory packaging validation trials before commercial deployment.
            </div>
          </div>

        </div>

        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-400">
          <p>© 2026 Packaging Advisor — Intelligent Packaging Recommendation System</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="hover:text-slate-300 cursor-pointer">Documentation</span>
            <span className="hover:text-slate-300 cursor-pointer">Evidence Register</span>
            <span className="hover:text-slate-300 cursor-pointer">Model Specifications</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
