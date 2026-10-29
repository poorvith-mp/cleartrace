import React from 'react';
import { Search, UserCheck, RefreshCw, AlertTriangle } from 'lucide-react';
import { DEMO_PERSONAS } from '../data/mockData';

export default function SearchSection({
  selectedPersona,
  onSelectPersona,
  profile,
  onProfileChange,
  isScanning,
  onStartScan
}) {
  return (
    <section className="data-card p-5 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#27272a] mb-4 gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[#fafafa] tracking-tight">Target Identity Verification Profile</h2>
          <p className="text-xs text-[#a1a1aa] mt-0.5">
            Audit exposed listings across data brokers using Indian name, phone, address, and workplace embeddings.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-[#a1a1aa] font-medium">Pre-Seeded Persona:</span>
          {DEMO_PERSONAS.map((persona) => (
            <button
              key={persona.id}
              onClick={() => onSelectPersona(persona)}
              className={`text-xs px-2.5 py-1 rounded transition border font-medium ${
                selectedPersona?.id === persona.id
                  ? 'border-blue-500 bg-[#18181c] text-blue-400'
                  : 'border-[#27272a] bg-[#09090b] text-[#d4d4d8] hover:border-[#3f3f46]'
              }`}
            >
              {persona.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#a1a1aa] mb-1">Full Legal Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => onProfileChange('name', e.target.value)}
            className="w-full bg-[#050507] border border-[#27272a] rounded px-3 py-2 text-sm text-[#fafafa] focus:outline-none focus:border-blue-500 font-mono"
            placeholder="e.g. Pooja Sharma"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#a1a1aa] mb-1">Phone Number (+91 / 0)</label>
          <input
            type="text"
            value={profile.phone}
            onChange={(e) => onProfileChange('phone', e.target.value)}
            className="w-full bg-[#050507] border border-[#27272a] rounded px-3 py-2 text-sm text-[#fafafa] focus:outline-none focus:border-blue-500 font-mono"
            placeholder="e.g. +91 98450 12345"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#a1a1aa] mb-1">Residential Address / City</label>
          <input
            type="text"
            value={profile.address}
            onChange={(e) => onProfileChange('address', e.target.value)}
            className="w-full bg-[#050507] border border-[#27272a] rounded px-3 py-2 text-sm text-[#fafafa] focus:outline-none focus:border-blue-500 text-xs"
            placeholder="e.g. Koramangala 4th Block, Bengaluru"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#a1a1aa] mb-1">Workplace / Organization</label>
          <input
            type="text"
            value={profile.workplace}
            onChange={(e) => onProfileChange('workplace', e.target.value)}
            className="w-full bg-[#050507] border border-[#27272a] rounded px-3 py-2 text-sm text-[#fafafa] focus:outline-none focus:border-blue-500 text-xs"
            placeholder="e.g. Senior SDE, Swiggy"
          />
        </div>
      </div>

      {selectedPersona?.threatContext && (
        <div className="mt-4 p-3 rounded bg-amber-950/20 border border-amber-900/40 flex items-start space-x-2 text-xs text-amber-300">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
          <span>
            <strong className="text-amber-200">Threat Profile:</strong> {selectedPersona.threatContext}
          </span>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between pt-4 border-t border-[#27272a]">
        <div className="text-xs text-[#a1a1aa] flex items-center space-x-2">
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>Verification Status: <span className="font-mono text-[#fafafa]">CT-SEC12-AUTH-VERIFIED</span></span>
        </div>

        <button
          onClick={onStartScan}
          disabled={isScanning}
          className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition flex items-center space-x-2 disabled:opacity-50"
        >
          {isScanning ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Scanning 5 Broker Connectors...</span>
            </>
          ) : (
            <>
              <Search className="w-3.5 h-3.5" />
              <span>Execute Deep Broker Audit</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}
