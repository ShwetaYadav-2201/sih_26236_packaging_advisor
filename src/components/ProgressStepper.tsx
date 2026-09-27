import React from 'react';
import { Package, ShieldCheck, Activity, Layers, FileSpreadsheet, Check } from 'lucide-react';

interface ProgressStepperProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ activeTab, setActiveTab }) => {
  const steps = [
    { id: 'config', label: '1. Commodity & Journey', icon: Package },
    { id: 'recommendations', label: '2. Candidates', icon: ShieldCheck },
    { id: 'stresstest', label: '3. Stress Test', icon: Activity },
    { id: 'mixedload', label: '4. Mixed Load', icon: Layers },
    { id: 'supplierbrief', label: '5. Spec Brief', icon: FileSpreadsheet },
  ];

  const getStepIndex = (id: string) => steps.findIndex(s => s.id === id);
  const currentIndex = getStepIndex(activeTab);

  return (
    <div className="w-full bg-slate-950/60 border-b border-slate-800/80 py-3 mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-1">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setActiveTab(step.id)}
                  className={`flex items-center space-x-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-emerald scale-[1.02]'
                      : isCompleted
                      ? 'text-slate-300 hover:text-white bg-slate-900/40'
                      : 'text-slate-500 hover:text-slate-400 bg-transparent'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-mono transition-all ${
                    isCurrent
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : isCompleted
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}>
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <span>{step.label}</span>
                </button>

                {idx < steps.length - 1 && (
                  <div className={`hidden sm:block flex-1 h-[2px] mx-2 transition-all ${
                    idx < currentIndex ? 'bg-emerald-500/40' : 'bg-slate-800'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
