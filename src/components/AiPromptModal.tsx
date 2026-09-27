import React from 'react';
import { X, Sparkles, ArrowRight, CheckCircle2, Bot } from 'lucide-react';
import { COMMODITY_PROFILES } from '../data/commodities';
import { JourneyScenario } from '../types/simulation';

interface AiPromptModalProps {
  onApplyScenario: (scenarioUpdates: Partial<JourneyScenario>) => void;
  onClose: () => void;
}

export const AiPromptModal: React.FC<AiPromptModalProps> = ({ onApplyScenario, onClose }) => {
  const [promptText, setPromptText] = React.useState(
    'I want to transport 500g ripe strawberries at 8°C for 7 days in a reefer truck under 85% ambient humidity.'
  );
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [extractedData, setExtractedData] = React.useState<{
    commodityId?: string;
    commodityName?: string;
    fillMassKg?: number;
    productTemperatureC?: number;
    transitDurationDays?: number;
    ambientRHPercent?: number;
    storageType?: 'ambient_truck' | 'reefer_cold_chain' | 'controlled_atmosphere';
    explanation?: string;
  } | null>(null);

  const samplePrompts = [
    'I need a MAP bag for 500g vine-ripe tomatoes stored at 14°C for 14 days.',
    'Exporting 150g fried potato chips at 30°C in humid 90% RH transit for 180 days.',
    'Cold chain transport for 1.2kg Cavendish bananas at 13.5°C for 18 days.'
  ];

  const handleProcessPrompt = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const lower = promptText.toLowerCase();

      let comm = COMMODITY_PROFILES[1]; // Default Strawberry
      if (lower.includes('tomato')) comm = COMMODITY_PROFILES[0];
      else if (lower.includes('strawberry')) comm = COMMODITY_PROFILES[1];
      else if (lower.includes('banana')) comm = COMMODITY_PROFILES[2];
      else if (lower.includes('lettuce')) comm = COMMODITY_PROFILES[3];
      else if (lower.includes('chip') || lower.includes('potato')) comm = COMMODITY_PROFILES[4];
      else if (lower.includes('almond') || lower.includes('nut')) comm = COMMODITY_PROFILES[5];

      // Extract Mass
      let mass = comm.defaultPackWeightKg;
      const massMatch = lower.match(/(\d+(?:\.\d+)?)\s*(kg|g)/);
      if (massMatch) {
        const val = parseFloat(massMatch[1]);
        mass = massMatch[2] === 'g' ? val / 1000 : val;
      }

      // Extract Temp
      let temp = comm.optimumTempRangeC[0];
      const tempMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:°c|c|degree)/);
      if (tempMatch) {
        temp = parseFloat(tempMatch[1]);
      }

      // Extract Days
      let days = comm.defaultDesiredShelfLifeDays;
      const daysMatch = lower.match(/(\d+)\s*(?:day|days)/);
      if (daysMatch) {
        days = parseInt(daysMatch[1]);
      }

      // Extract RH
      let rh = 75;
      const rhMatch = lower.match(/(\d+)\s*%\s*(?:rh|humidity)?/);
      if (rhMatch) {
        rh = parseInt(rhMatch[1]);
      }

      setExtractedData({
        commodityId: comm.id,
        commodityName: comm.name,
        fillMassKg: mass,
        productTemperatureC: temp,
        transitDurationDays: days,
        ambientRHPercent: rh,
        storageType: temp < 15 ? 'reefer_cold_chain' : 'ambient_truck',
        explanation: `Grounded AI successfully parsed "${comm.name}" with ${mass}kg fill mass, ${temp}°C temperature profile, and ${days} days transit target.`
      });
      setIsProcessing(false);
    }, 600);
  };

  const handleApply = () => {
    if (!extractedData) return;
    const selectedComm = COMMODITY_PROFILES.find(c => c.id === extractedData.commodityId);
    if (!selectedComm) return;

    onApplyScenario({
      commodity: selectedComm,
      fillMassKg: extractedData.fillMassKg,
      productTemperatureC: extractedData.productTemperatureC,
      transitDurationDays: extractedData.transitDurationDays,
      ambientRHPercent: extractedData.ambientRHPercent,
      storageType: extractedData.storageType
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 shadow-glow-emerald">
              <Bot className="w-5 h-5 font-bold" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 font-display">Grounded AI Natural Language Parser</h3>
              <p className="text-xs text-slate-400">Describe your shipment scenario in plain language</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Natural Language Scenario Prompt
            </label>
            <textarea
              rows={3}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 transition leading-relaxed"
              placeholder="e.g. Transporting 500g tomatoes at 14°C for 10 days in ambient truck..."
            />
          </div>

          {/* Sample Prompts */}
          <div>
            <span className="text-[11px] text-slate-400 font-medium block mb-2">Or try a sample prompt:</span>
            <div className="space-y-1.5">
              {samplePrompts.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => setPromptText(sample)}
                  className="w-full text-left p-2 rounded-lg bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 text-[11px] text-slate-300 transition flex items-center justify-between"
                >
                  <span className="truncate">{sample}</span>
                  <Sparkles className="w-3 h-3 text-emerald-400 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleProcessPrompt}
            disabled={isProcessing}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-glow-emerald flex items-center justify-center space-x-2 transition disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Parsing Scientific Fields...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Extract Scenario Fields with AI</span>
              </span>
            )}
          </button>

          {/* Extracted Fields Preview */}
          {extractedData && (
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3 animate-fadeIn">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Extracted Grounded Parameters</span>
              </div>
              <p className="text-xs text-slate-300 italic bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                {extractedData.explanation}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Commodity</span>
                  <span className="font-semibold text-slate-200">{extractedData.commodityName}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Fill Mass</span>
                  <span className="font-semibold text-emerald-400">{extractedData.fillMassKg} kg</span>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Temperature</span>
                  <span className="font-semibold text-cyan-400">{extractedData.productTemperatureC}°C</span>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Target Transit</span>
                  <span className="font-semibold text-amber-400">{extractedData.transitDurationDays} Days</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!extractedData}
            className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition disabled:opacity-50"
          >
            <span>Apply to Configurator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
