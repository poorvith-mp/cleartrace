import React, { useState } from 'react';
import { X, ShieldCheck, FileText, AlertCircle } from 'lucide-react';

export default function ConsentModal({ finding, onClose, onConfirmConsent }) {
  const [agreed, setAgreed] = useState(false);

  if (!finding) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-border-subtle rounded-lg max-w-2xl w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-blue-400 mb-2">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-xs font-mono uppercase tracking-wider">Consent Authorization Gate</span>
        </div>

        <h3 className="text-lg font-semibold text-white">
          Authorize Legal Erasure Notice under DPDP Act 2023
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Zero-Unauthorized-Removal Policy: A cryptographically logged authorization token is required before any removal dispatch is triggered.
        </p>

        <div className="mt-4 p-4 rounded bg-[#080c14] border border-border-subtle font-mono text-xs text-slate-300 space-y-2.5 max-h-64 overflow-y-auto">
          <div className="text-blue-300 font-semibold border-b border-border-subtle pb-1">
            FORMAL NOTICE OF ERASURE (SECTION 12, DPDP ACT 2023)
          </div>
          <div><strong>To Data Fiduciary / Broker:</strong> {finding.brokerName}</div>
          <div><strong>Target Listing Identifier:</strong> {finding.id}</div>
          <div><strong>Evidence Hash (SHA-256):</strong> {finding.rawHash}</div>
          <div className="pt-2 text-slate-400 leading-relaxed font-sans text-xs">
            "In accordance with Section 12(1) of the Digital Personal Data Protection Act, 2023, the Data Principal hereby exercises their statutory right to erasure of personal data, including exposed phone number ({finding.exposedPhone}) and residential address records ({finding.exposedAddress}). You are hereby required to erase and cease dissemination of all referenced personal data within your statutory SLA."
          </div>
        </div>

        <div className="mt-4 flex items-start space-x-2">
          <input
            type="checkbox"
            id="consent-check"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 rounded bg-surface border-border-subtle text-blue-600 focus:ring-0"
          />
          <label htmlFor="consent-check" className="text-xs text-slate-300 cursor-pointer">
            I hereby certify that I am the verified Data Principal or authorized representative, and I authorize ClearTrace to dispatch this Section 12 Erasure Notice to <strong>{finding.brokerName}</strong>.
          </label>
        </div>

        <div className="mt-6 flex items-center justify-end space-x-3 pt-4 border-t border-border-subtle">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-xs text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirmConsent(finding.id)}
            disabled={!agreed}
            className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-medium transition"
          >
            Sign & Authorize Removal
          </button>
        </div>
      </div>
    </div>
  );
}
