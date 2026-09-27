import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProgressStepper } from './components/ProgressStepper';
import { Footer } from './components/Footer';
import { EvidenceDrawer } from './components/EvidenceDrawer';
import { QrModal } from './components/QrModal';
import { AiPromptModal } from './components/AiPromptModal';
import { CompareModal } from './components/CompareModal';

import { ConfiguratorPage } from './pages/ConfiguratorPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { StressTestPage } from './pages/StressTestPage';
import { MixedLoadPage } from './pages/MixedLoadPage';
import { SupplierBriefPage } from './pages/SupplierBriefPage';

import { COMMODITY_PROFILES } from './data/commodities';
import { PACKAGE_MATERIALS } from './data/materials';
import { JourneyScenario } from './types/simulation';
import { PackageStructure } from './types/material';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('config');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Toggle body light-theme class when theme state changes
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Default Scenario State
  const [scenario, setScenario] = useState<JourneyScenario>({
    id: 'scen-001',
    commodity: COMMODITY_PROFILES[1], // Fresh Strawberry
    fillMassKg: 0.25,
    packageAreaM2: 0.08,
    headspaceVolumeL: 0.4,
    transitDurationDays: 10,
    productTemperatureC: 4.0,
    ambientRHPercent: 85,
    initialO2Percent: 20.9,
    initialCO2Percent: 0.04,
    storageType: 'reefer_cold_chain'
  });

  // Selected Material Candidate State
  const [selectedCandidate, setSelectedCandidate] = useState<PackageStructure>(PACKAGE_MATERIALS[0]);

  // Modal States
  const [evidenceDrawerState, setEvidenceDrawerState] = useState<{
    isOpen: boolean;
    sourceId: string | null;
    paramName: string | null;
    paramVal: string | null;
  }>({
    isOpen: false,
    sourceId: null,
    paramName: null,
    paramVal: null
  });

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const handleOpenEvidence = (sourceId: string, paramName: string, paramVal: string) => {
    setEvidenceDrawerState({
      isOpen: true,
      sourceId,
      paramName,
      paramVal
    });
  };

  const handleApplyAiScenario = (updates: Partial<JourneyScenario>) => {
    setScenario(prev => ({
      ...prev,
      ...updates
    }));
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950 transition-colors ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAiAssistant={() => setIsAiModalOpen(true)}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        <ProgressStepper
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'config' && (
            <ConfiguratorPage
              scenario={scenario}
              onUpdateScenario={setScenario}
              onProceedToRecommendations={() => setActiveTab('recommendations')}
              onOpenAiAssistant={() => setIsAiModalOpen(true)}
              onOpenEvidence={handleOpenEvidence}
            />
          )}

          {activeTab === 'recommendations' && (
            <RecommendationsPage
              scenario={scenario}
              onSelectCandidate={setSelectedCandidate}
              onProceedToStressTest={() => setActiveTab('stresstest')}
              onOpenEvidence={handleOpenEvidence}
              onOpenCompareModal={() => setIsCompareModalOpen(true)}
            />
          )}

          {activeTab === 'stresstest' && (
            <StressTestPage
              originalScenario={scenario}
              selectedCandidate={selectedCandidate}
              onSelectCandidate={setSelectedCandidate}
              onUpdateScenario={setScenario}
              onProceedToMixedLoad={() => setActiveTab('mixedload')}
            />
          )}

          {activeTab === 'mixedload' && (
            <MixedLoadPage
              onOpenEvidence={handleOpenEvidence}
              onProceedToBrief={() => setActiveTab('supplierbrief')}
            />
          )}

          {activeTab === 'supplierbrief' && (
            <SupplierBriefPage
              scenario={scenario}
              selectedCandidate={selectedCandidate}
              onOpenQrModal={() => setIsQrModalOpen(true)}
              onOpenEvidence={handleOpenEvidence}
            />
          )}
        </main>
      </div>

      <Footer />

      {/* Slide-out Evidence Drawer */}
      {evidenceDrawerState.isOpen && (
        <EvidenceDrawer
          sourceId={evidenceDrawerState.sourceId}
          parameterName={evidenceDrawerState.paramName}
          parameterValue={evidenceDrawerState.paramVal}
          onClose={() => setEvidenceDrawerState({ isOpen: false, sourceId: null, paramName: null, paramVal: null })}
        />
      )}

      {/* QR Code Snapshot Modal */}
      {isQrModalOpen && (
        <QrModal
          scenario={scenario}
          material={selectedCandidate}
          onClose={() => setIsQrModalOpen(false)}
        />
      )}

      {/* Grounded AI Assistant Modal */}
      {isAiModalOpen && (
        <AiPromptModal
          onApplyScenario={handleApplyAiScenario}
          onClose={() => setIsAiModalOpen(false)}
        />
      )}

      {/* Side-by-Side Candidate Compare Modal */}
      {isCompareModalOpen && (
        <CompareModal
          onClose={() => setIsCompareModalOpen(false)}
          onOpenEvidence={handleOpenEvidence}
        />
      )}

    </div>
  );
};
export default App;
