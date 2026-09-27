import React from 'react';
import { Package, ShieldCheck, Activity, Layers, FileSpreadsheet, Sparkles, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAiAssistant: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAiAssistant,
  theme,
  onToggleTheme
}) => {
  const navItems = [
    { id: 'config', label: '1. Commodity & Journey', icon: Package },
    { id: 'recommendations', label: '2. Package Candidates', icon: ShieldCheck },
    { id: 'stresstest', label: '3. Pack Stress Test', icon: Activity },
    { id: 'mixedload', label: '4. Mixed-Load Check', icon: Layers },
    { id: 'supplierbrief', label: '5. Supplier Spec & QR', icon: FileSpreadsheet },
  ];

  return (
    <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-colors ${
      theme === 'dark' ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-white/80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('config')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-accent-emerald to-accent-cyan p-0.5 shadow-glow-emerald flex items-center justify-center">
              <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${theme === 'dark' ? 'bg-slate-950' : 'bg-white'}`}>
                <Package className="w-5 h-5 text-accent-emerald animate-pulse-slow" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`font-display font-bold text-lg tracking-tight ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                  Packaging Advisor
                </span>
                <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  theme === 'dark' ? 'bg-slate-800 text-brand-400 border border-brand-500/30' : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                }`}>
                  PRO v1.0
                </span>
              </div>
              <p className={`text-[11px] font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Intelligent Food Packaging Material Recommendation System
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? theme === 'dark'
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-sm'
                      : theme === 'dark'
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons: Theme Toggle & AI Assistant */}
          <div className="flex items-center space-x-3">
            
            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className={`p-2 rounded-lg border transition ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAiAssistant}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30 hover:border-emerald-400 text-emerald-400 text-xs font-semibold shadow-glow-emerald transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-500 animate-spin-slow" />
              <span className="hidden sm:inline">AI Scenario Assistant</span>
            </button>

          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex overflow-x-auto py-2 space-x-2 border-t border-slate-800/80 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 bg-slate-900/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
