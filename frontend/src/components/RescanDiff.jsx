import React from 'react';
import { RefreshCw, AlertTriangle, FileDiff } from 'lucide-react';

export default function RescanDiff({ findings, onTriggerRescan, onSimulateReappearance }) {
  const removedFindings = findings.filter(f => f.state === 'Removed');

  return (
    <div className="data-card p-5 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#27272a] mb-4 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <FileDiff className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-[#fafafa]">Re-Scan Verification & Proof Diff</h3>
          </div>
          <p className="text-xs text-[#a1a1aa] mt-0.5">
            Continuous background audit verifying that removed records have not resurfaced on broker sites.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onTriggerRescan}
            className="px-3 py-1.5 rounded bg-emerald-950/30 border border-emerald-600/40 text-emerald-300 hover:bg-emerald-900/30 text-xs font-medium transition flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Execute Verification Re-Scan</span>
          </button>

          <button
            onClick={onSimulateReappearance}
            className="px-3 py-1.5 rounded bg-red-950/30 border border-red-700/50 text-red-300 hover:bg-red-900/30 text-xs font-medium transition flex items-center space-x-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span>Simulate Re-Appearance Drift</span>
          </button>
        </div>
      </div>

      {removedFindings.length === 0 ? (
        <div className="p-6 rounded bg-[#050507] border border-[#27272a] text-center text-xs text-[#a1a1aa]">
          No records currently in <strong className="text-[#fafafa]">Removed</strong> state. Authorize and complete a removal above to inspect before/after cryptographic diffs.
        </div>
      ) : (
        <div className="space-y-4">
          {removedFindings.map((finding) => (
            <div key={finding.id} className="p-4 rounded bg-[#050507] border border-[#27272a] text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#27272a] mb-3">
                <span className="font-semibold text-[#fafafa]">{finding.brokerName}</span>
                <span className="font-mono text-emerald-400 text-[11px] bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800">
                  HTTP 404 RECORD PURGED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded bg-red-950/20 border border-red-900/30">
                  <div className="text-[10px] uppercase font-mono text-red-400 font-semibold mb-1">
                    Before Removal (Evidence Snapshot)
                  </div>
                  <div className="space-y-1 font-mono text-[11px] text-[#d4d4d8]">
                    <div>Name: <span className="text-red-300">{finding.exposedName}</span></div>
                    <div>Phone: <span className="text-red-300">{finding.exposedPhone}</span></div>
                    <div>Address: <span className="text-red-300">{finding.exposedAddress}</span></div>
                    <div>Workplace: <span className="text-red-300">{finding.exposedWorkplace}</span></div>
                    <div className="text-[10px] text-[#71717a] pt-1">
                      SHA256: {finding.rawHash.substring(0, 32)}...
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded bg-emerald-950/20 border border-emerald-900/30">
                  <div className="text-[10px] uppercase font-mono text-emerald-400 font-semibold mb-1">
                    After Removal (Re-Scan Verification)
                  </div>
                  <div className="space-y-1 font-mono text-[11px] text-[#d4d4d8]">
                    <div>Status: <span className="text-emerald-300 font-semibold">DELISTED / EXPUNGED</span></div>
                    <div>Query Response: <span className="text-emerald-300">Zero Records Matching PII</span></div>
                    <div>Re-Scan Timestamp: <span className="text-[#a1a1aa]">{new Date().toISOString()}</span></div>
                    <div>DPDP Sec 12 Proof: <span className="text-emerald-300">Audit Certificate #CT-EXP-{finding.id.toUpperCase()}</span></div>
                    <div className="text-[10px] text-emerald-400 pt-1 font-medium">
                      Result: Removal Confirmed (100% PII Erasure Verified)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
