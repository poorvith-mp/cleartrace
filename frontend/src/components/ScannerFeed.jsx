import React, { useRef } from 'react';
import { Database, CheckCircle2 } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { BROKER_SITES } from '../data/mockData';

export default function ScannerFeed({ isScanning, scanProgress }) {
  const containerRef = useRef(null);

  useGSAP(() => {
    if (isScanning) {
      gsap.fromTo(
        ".connector-row",
        { opacity: 0.4, x: -5 },
        { opacity: 1, x: 0, stagger: 0.15, duration: 0.4, ease: "power1.out" }
      );
    }
  }, { dependencies: [isScanning], scope: containerRef });

  return (
    <div ref={containerRef} className="data-card p-5 mb-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#1a2436] mb-4">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">Live Data Broker Connectors</h3>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="text-slate-400">Total Connectors: <strong className="text-white">5 Active</strong></span>
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#070a10] text-slate-300 border border-[#1a2436]">
            {isScanning ? `Scan in Progress (${scanProgress}%)` : "Connectors Idle / Ready"}
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        {BROKER_SITES.map((broker, idx) => {
          const isDone = !isScanning || (scanProgress >= (idx + 1) * 20);
          return (
            <div
              key={broker.id}
              className="connector-row p-3 rounded bg-[#04060a] border border-[#161e2e] flex flex-col md:flex-row md:items-center justify-between text-xs gap-2"
            >
              <div className="flex items-center space-x-3">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin flex-shrink-0" />
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-white">{broker.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">({broker.domain})</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0d131f] text-slate-300 border border-[#1a2436]">
                      {broker.format}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Route: <span className="text-slate-300">{broker.optOutRoute}</span> | Legal Mechanism: <span className="text-slate-300">{broker.legalRoute}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="hidden lg:block text-right">
                  <div className="text-[10px] text-slate-500 font-mono">Evidence Snapshot Hash</div>
                  <div className="text-[10px] text-blue-400 font-mono truncate max-w-[180px]">
                    SHA256: {idx === 0 ? "e3b0c442..." : idx === 1 ? "8f434346..." : idx === 2 ? "3f79bb7b..." : idx === 3 ? "d7a8fbb3..." : "9f86d081..."}
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                    broker.id === 'broker-3'
                      ? 'bg-amber-950/40 text-amber-300 border border-amber-800/40'
                      : 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                  }`}>
                    SLA: {broker.slaHours}h
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
