import React from 'react';
import { Shield, Lock, FileText, Activity } from 'lucide-react';

export default function Header({ onOpenBenchmark, onStartTour }) {
  return (
    <header className="border-b border-border-subtle bg-[#080c14]/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded border border-blue-500/30 bg-blue-950/40 flex items-center justify-center text-blue-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold tracking-tight text-white text-base">ClearTrace</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-950/80 border border-blue-500/30 text-blue-300">
                Solution B Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">Consent-Based Personal Data Removal</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded border border-border-subtle bg-surface text-xs text-slate-300">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>DPDP Act 2023 Sec 12 & 13 Compliant</span>
          </div>

          <button
            onClick={onStartTour}
            className="text-xs px-3 py-1.5 rounded border border-blue-500/40 bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 hover:border-blue-400 transition"
          >
            Guided Evaluation Tour
          </button>

          <button
            onClick={onOpenBenchmark}
            className="text-xs px-3 py-1.5 rounded border border-border-subtle bg-surface-muted hover:bg-surface-hover text-slate-200 transition flex items-center space-x-1.5"
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>Solution A vs B Benchmark</span>
          </button>
        </div>
      </div>
    </header>
  );
}
