import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldAlert, CheckCircle, ArrowRight, Info, AlertTriangle } from 'lucide-react';

export default function MatchCard({ finding, onOpenConsentModal, onDirectAction }) {
  const [showExplainability, setShowExplainability] = useState(false);
  const { matchDetails } = finding;

  return (
    <div className={`data-card rounded-lg p-5 mb-4 border transition ${
      finding.state === 'Removed'
        ? 'border-emerald-900/60 bg-emerald-950/10'
        : finding.state === 'Re-appeared'
        ? 'border-red-600 bg-red-950/20'
        : matchDetails.isBorderline
        ? 'border-amber-600/50 bg-amber-950/10'
        : 'border-border-subtle'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded flex items-center justify-center font-mono text-xs font-bold ${
            finding.state === 'Removed'
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
              : finding.state === 'Re-appeared'
              ? 'bg-red-950 text-red-400 border border-red-700'
              : 'bg-blue-950 text-blue-400 border border-blue-800'
          }`}>
            {matchDetails.solutionBScore}%
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-semibold text-white">{finding.brokerName}</h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-muted text-slate-400 border border-border-subtle">
                Evidence ID: {finding.id}
              </span>
              {matchDetails.isBorderline && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60">
                  Borderline Triage
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Snapshot Hash: <span className="font-mono text-slate-300 text-[11px]">{finding.rawHash.substring(0, 24)}...</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className={`text-xs px-2.5 py-1 rounded font-medium border ${
            finding.state === 'Found'
              ? 'bg-amber-950/40 text-amber-300 border-amber-800/40'
              : finding.state === 'Authorised'
              ? 'bg-blue-950/40 text-blue-300 border-blue-800/40'
              : finding.state === 'Requested'
              ? 'bg-purple-950/40 text-purple-300 border-purple-800/40'
              : finding.state === 'Removed'
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40'
              : 'bg-red-950/60 text-red-300 border-red-700'
          }`}>
            Status: {finding.state}
          </span>

          {finding.state === 'Found' && (
            <button
              onClick={() => onOpenConsentModal(finding)}
              className="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition flex items-center space-x-1.5"
            >
              <span>Authorise Removal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {finding.state === 'Authorised' && (
            <button
              onClick={() => onDirectAction(finding.id, 'Requested')}
              className="px-3.5 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition"
            >
              Dispatch Sec 12 Notice
            </button>
          )}

          {finding.state === 'Requested' && (
            <button
              onClick={() => onDirectAction(finding.id, 'Removed')}
              className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition"
            >
              Simulate Broker Delist
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 text-xs border-b border-border-subtle">
        <div className="space-y-1.5">
          <div>
            <span className="text-slate-400">Exposed Name:</span>{' '}
            <strong className="text-white font-mono">{finding.exposedName}</strong>
          </div>
          <div>
            <span className="text-slate-400">Exposed Phone:</span>{' '}
            <strong className="text-white font-mono">{finding.exposedPhone}</strong>
          </div>
        </div>

        <div className="space-y-1.5">
          <div>
            <span className="text-slate-400">Exposed Address:</span>{' '}
            <span className="text-slate-200">{finding.exposedAddress}</span>
          </div>
          <div>
            <span className="text-slate-400">Workplace Record:</span>{' '}
            <span className="text-slate-200">{finding.exposedWorkplace}</span>
          </div>
        </div>
      </div>

      {matchDetails.isSolutionADivergence && (
        <div className="mt-3 p-3 rounded bg-blue-950/20 border border-blue-900/40 text-xs text-blue-200 flex items-start space-x-2">
          <Info className="w-4 h-4 flex-shrink-0 text-blue-400 mt-0.5" />
          <div>
            <div className="font-semibold text-white">Solution B Advantage (Semantic Embedding):</div>
            <p className="mt-0.5 text-slate-300 leading-relaxed">{matchDetails.divergenceReason}</p>
            <div className="mt-1 font-mono text-[11px] text-blue-300">
              Solution A (Rule-Based Fuzzy): {matchDetails.solutionAScore}% | Solution B (Embeddings): {matchDetails.solutionBScore}%
            </div>
          </div>
        </div>
      )}

      <div className="mt-3">
        <button
          onClick={() => setShowExplainability(!showExplainability)}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1"
        >
          <span>{showExplainability ? 'Hide Confidence Explainability' : 'View Confidence Explainability Vector'}</span>
          {showExplainability ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showExplainability && (
          <div className="mt-3 pt-3 border-t border-border-subtle grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded bg-[#080c14] border border-border-subtle">
              <div className="text-slate-400 text-[11px]">RapidFuzz Name</div>
              <div className="font-mono font-semibold text-white text-sm mt-0.5">{matchDetails.nameScore}%</div>
              <div className="w-full bg-surface-muted h-1 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: `${matchDetails.nameScore}%` }} />
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#080c14] border border-border-subtle">
              <div className="text-slate-400 text-[11px]">Phone Normalization</div>
              <div className="font-mono font-semibold text-white text-sm mt-0.5">{matchDetails.phoneScore}%</div>
              <div className="w-full bg-surface-muted h-1 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: `${matchDetails.phoneScore}%` }} />
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#080c14] border border-border-subtle">
              <div className="text-slate-400 text-[11px]">Address Vector Embedding</div>
              <div className="font-mono font-semibold text-white text-sm mt-0.5">{matchDetails.addressSemanticScore}%</div>
              <div className="w-full bg-surface-muted h-1 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-purple-500 h-full" style={{ width: `${matchDetails.addressSemanticScore}%` }} />
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#080c14] border border-border-subtle">
              <div className="text-slate-400 text-[11px]">Workplace Semantic Vector</div>
              <div className="font-mono font-semibold text-white text-sm mt-0.5">{matchDetails.workplaceSemanticScore}%</div>
              <div className="w-full bg-surface-muted h-1 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-amber-500 h-full" style={{ width: `${matchDetails.workplaceSemanticScore}%` }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
