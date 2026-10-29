import React from 'react';
import { Clock, Send, CheckCircle2, AlertOctagon } from 'lucide-react';

export default function RemovalBoard({ findings, onUpdateState }) {
  const lanes = [
    { key: 'Found', title: 'Found (Pending Consent)', color: 'text-amber-400', border: 'border-amber-800/40' },
    { key: 'Authorised', title: 'Authorised by User', color: 'text-blue-400', border: 'border-blue-800/40' },
    { key: 'Requested', title: 'Legal Notice Dispatched', color: 'text-purple-400', border: 'border-purple-800/40' },
    { key: 'Removed', title: 'Verified Removed', color: 'text-emerald-400', border: 'border-emerald-800/40' }
  ];

  const reAppearedFindings = findings.filter(f => f.state === 'Re-appeared');

  return (
    <div className="data-card rounded-lg p-5 mb-6">
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Removal Lifecycle Tracker (State Machine)</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Formal audit trail complying with DPDP Section 12 removal deadlines.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Total Tracked:</span>
          <span className="font-mono text-white font-semibold">{findings.length} records</span>
        </div>
      </div>

      {reAppearedFindings.length > 0 && (
        <div className="mb-4 p-3 rounded bg-red-950/40 border border-red-700 text-xs text-red-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertOctagon className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>
              <strong>Re-Appearance Alert:</strong> {reAppearedFindings.length} record(s) previously removed have resurfaced on broker sites.
            </span>
          </div>
          <button
            onClick={() => reAppearedFindings.forEach(f => onUpdateState(f.id, 'Requested'))}
            className="px-2.5 py-1 rounded bg-red-700 hover:bg-red-600 text-white font-mono text-[11px]"
          >
            Re-Dispatch Urgent Notice
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {lanes.map((lane) => {
          const items = findings.filter(f => f.state === lane.key);
          return (
            <div key={lane.key} className="p-3 rounded bg-[#080c14] border border-border-subtle flex flex-col min-h-[160px]">
              <div className="flex items-center justify-between pb-2 border-b border-border-subtle mb-2">
                <span className={`text-xs font-semibold ${lane.color}`}>{lane.title}</span>
                <span className="font-mono text-xs px-1.5 py-0.2 rounded bg-surface text-slate-300">
                  {items.length}
                </span>
              </div>

              <div className="space-y-2 flex-grow">
                {items.length === 0 ? (
                  <div className="text-[11px] text-slate-600 italic py-4 text-center">No records in this state</div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="p-2.5 rounded bg-surface border border-border-subtle text-xs">
                      <div className="font-medium text-white flex items-center justify-between">
                        <span>{item.brokerName}</span>
                        <span className="text-[10px] font-mono text-blue-400">{item.matchDetails.solutionBScore}%</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-1">{item.exposedAddress}</div>

                      {lane.key === 'Requested' && (
                        <div className="mt-2 pt-2 border-t border-border-subtle flex items-center justify-between text-[10px]">
                          <span className="text-amber-400 flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>SLA Active</span>
                          </span>
                          <button
                            onClick={() => onUpdateState(item.id, 'Removed')}
                            className="text-emerald-400 hover:underline"
                          >
                            Mark Delisted
                          </button>
                        </div>
                      )}

                      {lane.key === 'Removed' && (
                        <div className="mt-1 text-[10px] text-emerald-400 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Scrub Verified</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
