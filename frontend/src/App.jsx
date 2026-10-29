import React, { useState } from 'react';
import Header from './components/Header';
import SearchSection from './components/SearchSection';
import ScannerFeed from './components/ScannerFeed';
import MatchCard from './components/MatchCard';
import ConsentModal from './components/ConsentModal';
import RemovalBoard from './components/RemovalBoard';
import RescanDiff from './components/RescanDiff';
import BenchmarkModal from './components/BenchmarkModal';
import InteractiveTour from './components/InteractiveTour';
import { DEMO_PERSONAS, INITIAL_FINDINGS, DISTRACTOR_RECORDS } from './data/mockData';
import { Activity } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [selectedPersona, setSelectedPersona] = useState(DEMO_PERSONAS[0]);
  const [profile, setProfile] = useState({
    name: DEMO_PERSONAS[0].name,
    phone: DEMO_PERSONAS[0].phone,
    address: DEMO_PERSONAS[0].address,
    workplace: DEMO_PERSONAS[0].workplace
  });

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);
  const [findings, setFindings] = useState(INITIAL_FINDINGS);
  const [selectedConsentFinding, setSelectedConsentFinding] = useState(null);
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [activeTab, setActiveTab] = useState('findings'); // 'findings' | 'tracker' | 'rescan'

  const handleSelectPersona = (persona) => {
    setSelectedPersona(persona);
    setProfile({
      name: persona.name,
      phone: persona.phone,
      address: persona.address,
      workplace: persona.workplace
    });
  };

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const handleOpenConsentModal = (finding) => {
    setSelectedConsentFinding(finding);
  };

  const handleConfirmConsent = (findingId) => {
    setFindings(prev => prev.map(f => {
      if (f.id === findingId) {
        return { ...f, state: 'Authorised', isAuthorized: true };
      }
      return f;
    }));
    setSelectedConsentFinding(null);
  };

  const handleDirectAction = (findingId, nextState) => {
    setFindings(prev => prev.map(f => {
      if (f.id === findingId) {
        if (nextState === 'Removed') {
          confetti({
            particleCount: 40,
            spread: 50,
            origin: { y: 0.7 }
          });
        }
        return { ...f, state: nextState };
      }
      return f;
    }));
  };

  const handleTriggerRescan = () => {
    const hasRemoved = findings.some(f => f.state === 'Removed');
    if (!hasRemoved) {
      alert("No records are currently in the 'Removed' state. Authorize a removal first to observe before/after diff verification.");
      return;
    }
    alert("Verification Re-Scan Complete: 0 matching PII records found on inspected data broker sites. All Section 12 erasure requests verified.");
  };

  const handleSimulateReappearance = () => {
    const removedItem = findings.find(f => f.state === 'Removed');
    if (removedItem) {
      setFindings(prev => prev.map(f => {
        if (f.id === removedItem.id) {
          return { ...f, state: 'Re-appeared' };
        }
        return f;
      }));
    } else {
      setFindings(prev => prev.map((f, i) => i === 0 ? { ...f, state: 'Re-appeared' } : f));
    }
  };

  const handleNextTourStep = () => {
    if (tourStep < 4) {
      setTourStep(prev => prev + 1);
      if (tourStep === 0) handleStartScan();
      if (tourStep === 1) setActiveTab('findings');
      if (tourStep === 2) {
        setSelectedConsentFinding(findings[0]);
      }
      if (tourStep === 3) {
        handleConfirmConsent(findings[0].id);
        handleDirectAction(findings[0].id, 'Requested');
        handleDirectAction(findings[0].id, 'Removed');
        setActiveTab('rescan');
      }
    } else {
      setIsTourActive(false);
      setTourStep(0);
    }
  };

  const activeExposures = findings.filter(f => f.state !== 'Removed').length;
  const verifiedRemoved = findings.filter(f => f.state === 'Removed').length;

  return (
    <div className="min-h-screen bg-[#070a10] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Header
        onOpenBenchmark={() => setIsBenchmarkOpen(true)}
        onStartTour={() => {
          setIsTourActive(true);
          setTourStep(0);
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        <InteractiveTour
          isActive={isTourActive}
          currentStep={tourStep}
          onNextStep={handleNextTourStep}
          onResetTour={() => setIsTourActive(false)}
        />

        {/* 60-30-10 System Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="data-card p-4">
            <div className="text-xs text-slate-400 font-medium">Inspected Broker Sites</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">5</div>
            <div className="text-[11px] text-blue-400 mt-0.5">Tables, APIs, Grids & Divs</div>
          </div>

          <div className="data-card p-4">
            <div className="text-xs text-slate-400 font-medium">Active PII Exposures</div>
            <div className={`text-2xl font-bold font-mono mt-1 ${activeExposures > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
              {activeExposures}
            </div>
            <div className="text-[11px] text-amber-500/80 mt-0.5">Pending Erasure</div>
          </div>

          <div className="data-card p-4">
            <div className="text-xs text-slate-400 font-medium">Verified Removed (Scrubbed)</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{verifiedRemoved}</div>
            <div className="text-[11px] text-emerald-500/80 mt-0.5">DPDP Sec 12 Proof</div>
          </div>

          <div className="data-card p-4">
            <div className="text-xs text-slate-400 font-medium">Matching Engine Accuracy</div>
            <div className="text-2xl font-bold font-mono text-blue-400 mt-1">96.4%</div>
            <div className="text-[11px] text-blue-400/80 mt-0.5">Solution B (Embeddings)</div>
          </div>
        </div>

        {/* Target Profile Input */}
        <SearchSection
          selectedPersona={selectedPersona}
          onSelectPersona={handleSelectPersona}
          profile={profile}
          onProfileChange={handleProfileChange}
          isScanning={isScanning}
          onStartScan={handleStartScan}
        />

        {/* Broker Scanner Status */}
        <ScannerFeed
          isScanning={isScanning}
          scanProgress={scanProgress}
        />

        {/* View Switcher Tabs */}
        <div className="flex items-center space-x-2 border-b border-[#1a2436] mb-6 text-xs">
          <button
            onClick={() => setActiveTab('findings')}
            className={`pb-3 px-3 font-medium transition border-b-2 ${
              activeTab === 'findings'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Match Findings & Confidence Cards ({findings.length})
          </button>

          <button
            onClick={() => setActiveTab('tracker')}
            className={`pb-3 px-3 font-medium transition border-b-2 ${
              activeTab === 'tracker'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Removal Lifecycle Tracker
          </button>

          <button
            onClick={() => setActiveTab('rescan')}
            className={`pb-3 px-3 font-medium transition border-b-2 ${
              activeTab === 'rescan'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Re-Scan Verification & Proof Diff
          </button>
        </div>

        {/* Tab 1: Match Findings */}
        {activeTab === 'findings' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs text-slate-400">
                Displaying <strong className="text-white">{findings.length} findings</strong> scored with Solution B Hybrid Model (RapidFuzz + Sentence Transformers).
              </div>
              <button
                onClick={() => setIsBenchmarkOpen(true)}
                className="text-xs text-blue-400 hover:underline flex items-center space-x-1"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Why did Solution B catch what Solution A missed?</span>
              </button>
            </div>

            <div className="space-y-4">
              {findings.map((finding) => (
                <MatchCard
                  key={finding.id}
                  finding={finding}
                  onOpenConsentModal={handleOpenConsentModal}
                  onDirectAction={handleDirectAction}
                />
              ))}
            </div>

            {/* Same-name strangers rejection proof */}
            <div className="mt-8 p-4 rounded bg-[#0d131f] border border-[#1a2436]">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Verification Proof: False Positive Rejection (Same-Name Strangers)
              </h4>
              <p className="text-xs text-slate-400 mb-3">
                The engine filtered out candidate records with identical names but discordant address/phone vectors:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {DISTRACTOR_RECORDS.map((d) => (
                  <div key={d.id} className="p-3 rounded bg-[#04060a] border border-[#161e2e] font-mono text-[11px] text-slate-400">
                    <div>Broker: <span className="text-slate-200">{d.brokerName}</span></div>
                    <div>Exposed: <span className="text-slate-300">{d.exposedName}</span> ({d.exposedAddress})</div>
                    <div>Score: <span className="text-red-400 font-semibold">{d.score}%</span> — <span className="text-emerald-400">{d.status}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Removal Tracker Kanban */}
        {activeTab === 'tracker' && (
          <RemovalBoard
            findings={findings}
            onUpdateState={handleDirectAction}
          />
        )}

        {/* Tab 3: Re-Scan Verification Diff */}
        {activeTab === 'rescan' && (
          <RescanDiff
            findings={findings}
            onTriggerRescan={handleTriggerRescan}
            onSimulateReappearance={handleSimulateReappearance}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1a2436] py-6 bg-[#070a10] text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <div>
            ClearTrace — Automated Consent-Governed Personal Data Removal Platform
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            DPDP Act 2023 Sec 12 & 13 | Team SyntaxSyndicate
          </div>
        </div>
      </footer>

      {/* DPDP Section 12 Consent Modal */}
      <ConsentModal
        finding={selectedConsentFinding}
        onClose={() => setSelectedConsentFinding(null)}
        onConfirmConsent={handleConfirmConsent}
      />

      {/* Benchmark Modal */}
      <BenchmarkModal
        isOpen={isBenchmarkOpen}
        onClose={() => setIsBenchmarkOpen(false)}
      />
    </div>
  );
}
