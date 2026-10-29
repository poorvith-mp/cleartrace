import React from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';

export default function InteractiveTour({
  currentStep,
  onNextStep,
  onResetTour,
  isActive
}) {
  if (!isActive) return null;

  const tourSteps = [
    {
      title: "Step 1: Select Target Identity Profile",
      desc: "Load a pre-configured Indian persona (e.g. Pooja Sharma, Bengaluru) to observe how transliterated names, phone prefixes, and addresses are audited."
    },
    {
      title: "Step 2: Execute Multi-Broker Scan",
      desc: "Observe the 5 connectors query distinct data formats (HTML tables, JSON REST, raw divs, phone grids, and workplace profiles) capturing SHA-256 evidence snapshots."
    },
    {
      title: "Step 3: Inspect Solution B Semantic Advancements",
      desc: "Open the Explainability Vector on Match Cards to see how dense sentence embeddings catch colloquial address differences that Solution A rule-based fuzzy matching drops."
    },
    {
      title: "Step 4: Exercise DPDP Act Section 12 Consent",
      desc: "Confirm that zero automated removals can occur without explicit user consent. Review and authorize the formal DPDP Section 12 Erasure Notice."
    },
    {
      title: "Step 5: Verify Removal via Re-Scan Diff",
      desc: "Inspect the Before vs After diff inspector confirming complete delisting and test the Re-appearance simulation to verify drift detection."
    }
  ];

  const step = tourSteps[currentStep] || tourSteps[0];

  return (
    <div className="bg-[#0d131f] border border-blue-500/40 rounded-lg p-4 mb-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start space-x-3">
        <div className="w-7 h-7 rounded bg-blue-600 text-white flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 mt-0.5">
          {currentStep + 1}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Guided Evaluation Mode ({currentStep + 1}/5)
            </span>
            <span className="text-xs font-bold text-blue-400">— {step.title}</span>
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
            {step.desc}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 flex-shrink-0">
        <button
          onClick={onResetTour}
          className="text-xs px-2.5 py-1.5 rounded border border-[#1a2436] bg-[#070a10] text-slate-400 hover:text-white transition flex items-center space-x-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Exit Tour</span>
        </button>

        <button
          onClick={onNextStep}
          className="text-xs px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium transition flex items-center space-x-1"
        >
          <span>{currentStep === 4 ? "Complete Tour" : "Next Evaluation Step"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
