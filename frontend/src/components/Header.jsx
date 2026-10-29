import React from 'react';
import { Shield, Lock, Activity } from 'lucide-react';

export default function Header({ onOpenBenchmark, onStartTour }) {
  return (
    <header className="border-b border-[#27272a] bg-[#09090b]/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded border border-[#27272a] bg-[#141417] flex items-center justify-center text-blue-500">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold tracking-tight text-[#fafafa] text-base">ClearTrace</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#18181c] border border-[#27272a] text-blue-400 font-medium">
                Solution B Engine
              </span>
            </div>
            <p className="text-xs text-[#a1a1aa] font-normal">Consent-Based Personal Data Removal</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded border border-[#27272a] bg-[#141417] text-xs text-[#d4d4d8]">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-[11px]">DPDP Act 2023 Sec 12 & 13 Compliant</span>
          </div>

          <button
            onClick={onStartTour}
            className="text-xs px-3.5 py-1.5 rounded border border-[#27272a] bg-[#141417] hover:bg-[#1c1c21] hover:border-[#3f3f46] text-[#fafafa] transition font-medium"
          >
            Guided Evaluation Tour
          </button>

          <button
            onClick={onOpenBenchmark}
            className="text-xs px-3.5 py-1.5 rounded border border-[#27272a] bg-[#141417] hover:bg-[#1c1c21] hover:border-[#3f3f46] text-[#d4d4d8] transition flex items-center space-x-1.5 font-medium"
          >
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span>Solution A vs B Benchmark</span>
          </button>
        </div>
      </div>
    </header>
  );
}
