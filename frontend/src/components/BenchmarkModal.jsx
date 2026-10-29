import React from 'react';
import { X, Zap } from 'lucide-react';

export default function BenchmarkModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const metrics = [
    { label: 'Recall on Indian Addresses', solutionA: '68.2%', solutionB: '96.4%', delta: '+28.2%', highlight: true },
    { label: 'Workplace Entity Resolution', solutionA: '59.0%', solutionB: '93.5%', delta: '+34.5%', highlight: true },
    { label: 'Precision on Same-Name Strangers', solutionA: '91.4%', solutionB: '94.8%', delta: '+3.4%', highlight: false },
    { label: 'F1 Composite Accuracy', solutionA: '78.1%', solutionB: '95.6%', delta: '+17.5%', highlight: true },
    { label: 'Zero-Consent Removal Violations', solutionA: '0 violations', solutionB: '0 violations', delta: 'Strict Invariant', highlight: false }
  ];

  const edgeCases = [
    {
      caseName: "Colloquial Stage vs Block & Landmarks",
      inputAddress: "Koramangala 4th Block, Bengaluru, Karnataka",
      brokerListing: "Flat 12/4, 3rd Cross, near Sony Signal, Koramangala Stage 4, Bangalore",
      solutionAResult: "Score 58% (FAILED / FALSE NEGATIVE)",
      solutionBResult: "Score 94% (RESOLVED VIA EMBEDDINGS)",
      analysis: "Solution A string token ratio dropped due to 'near Sony Signal' descriptor and 'Bangalore' vs 'Bengaluru'. Solution B dense vector cosine similarity recognized geographical proximity."
    },
    {
      caseName: "Parent Corporate Entity Aliasing",
      inputWorkplace: "Senior Software Engineer, Swiggy",
      brokerListing: "Senior Software Engineer - Bundl Technologies",
      solutionAResult: "Score 61% (FAILED / FALSE NEGATIVE)",
      solutionBResult: "Score 92% (RESOLVED VIA EMBEDDINGS)",
      analysis: "Solution A has zero token overlap between 'Swiggy' and 'Bundl Technologies'. Solution B sentence embeddings captured semantic relationship."
    },
    {
      caseName: "Administrative District Hierarchy",
      inputAddress: "Bengaluru, Karnataka",
      brokerListing: "Plot 88, 4th Block Koramangala, Bangalore Urban",
      solutionAResult: "Score 64% (FAILED / FALSE NEGATIVE)",
      solutionBResult: "Score 89% (RESOLVED VIA EMBEDDINGS)",
      analysis: "Solution B maps municipal taxonomy ('Bangalore Urban' to 'Bengaluru') without manual regex rules."
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#141417] border border-[#27272a] rounded-lg max-w-4xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#a1a1aa] hover:text-[#fafafa]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-blue-400 mb-2">
          <Zap className="w-5 h-5" />
          <span className="text-xs font-mono uppercase tracking-wider font-semibold">Comparative Evaluation</span>
        </div>

        <h3 className="text-xl font-bold text-[#fafafa] tracking-tight">
          Solution A vs Solution B Benchmark Analysis
        </h3>
        <p className="text-xs text-[#a1a1aa] mt-1">
          Comparative audit measuring RapidFuzz rule-based baseline (Solution A) against Hybrid Semantic Embedding Matching (Solution B).
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded bg-[#050507] border border-[#27272a]">
            <div className="text-xs font-semibold text-[#fafafa] mb-1">Solution A (Baseline)</div>
            <div className="text-[11px] text-[#a1a1aa] mb-3">RapidFuzz string token ratio + fixed rule weights.</div>
            <ul className="text-xs space-y-1.5 text-[#d4d4d8]">
              <li className="flex items-center space-x-1.5 text-red-400">
                <span>- High false-negative rate on colloquial Indian addresses</span>
              </li>
              <li className="flex items-center space-x-1.5 text-red-400">
                <span>- Blind to corporate parent-subsidiary aliases</span>
              </li>
              <li className="flex items-center space-x-1.5 text-emerald-400">
                <span>+ Predictable execution latency (~2ms per record)</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded bg-[#18181c] border border-blue-500/30">
            <div className="text-xs font-semibold text-blue-400 mb-1">Solution B (Dense Embeddings)</div>
            <div className="text-[11px] text-[#a1a1aa] mb-3">RapidFuzz for phone/name + Sentence-Transformers for semantic fields.</div>
            <ul className="text-xs space-y-1.5 text-[#fafafa]">
              <li className="flex items-center space-x-1.5 text-emerald-400">
                <span>+ 96.4% recall on complex Indian address variants</span>
              </li>
              <li className="flex items-center space-x-1.5 text-emerald-400">
                <span>+ Resolves corporate workplace entity aliases</span>
              </li>
              <li className="flex items-center space-x-1.5 text-amber-300">
                <span>+ Automated borderline triage (0.65 - 0.84) with human confirmation</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-xs font-semibold text-[#fafafa] uppercase tracking-wider mb-3">
            Metric Comparison Table
          </h4>
          <div className="overflow-x-auto border border-[#27272a] rounded">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#050507] text-[#a1a1aa] border-b border-[#27272a] font-mono text-[11px]">
                <tr>
                  <th className="p-3">Evaluation Metric</th>
                  <th className="p-3">Solution A (Fuzzy)</th>
                  <th className="p-3">Solution B (Hybrid)</th>
                  <th className="p-3">Advantage (Delta)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272a] font-mono text-[11px]">
                {metrics.map((m, idx) => (
                  <tr key={idx} className="hover:bg-[#18181c]">
                    <td className="p-3 text-[#fafafa] font-sans font-medium">{m.label}</td>
                    <td className="p-3 text-[#a1a1aa]">{m.solutionA}</td>
                    <td className="p-3 text-[#fafafa] font-semibold">{m.solutionB}</td>
                    <td className={`p-3 font-semibold ${m.highlight ? 'text-emerald-400' : 'text-[#d4d4d8]'}`}>
                      {m.delta}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-xs font-semibold text-[#fafafa] uppercase tracking-wider mb-3">
            Case Studies: What Solution A Missed That Solution B Caught
          </h4>
          <div className="space-y-3">
            {edgeCases.map((ec, idx) => (
              <div key={idx} className="p-3.5 rounded bg-[#050507] border border-[#27272a] text-xs">
                <div className="font-semibold text-[#fafafa] flex items-center justify-between mb-1.5">
                  <span>{ec.caseName}</span>
                  <span className="font-mono text-[10px] text-emerald-400">{ec.solutionBResult}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] mb-2 font-mono">
                  <div className="text-[#a1a1aa]">Input: <span className="text-[#fafafa]">{ec.inputAddress || ec.inputWorkplace}</span></div>
                  <div className="text-[#a1a1aa]">Broker: <span className="text-[#fafafa]">{ec.brokerListing}</span></div>
                </div>
                <div className="text-[#a1a1aa] text-[11px] leading-relaxed">
                  <strong>Analysis:</strong> {ec.analysis}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#27272a] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-[#09090b] hover:bg-[#18181c] border border-[#27272a] text-[#fafafa] text-xs font-medium transition"
          >
            Close Benchmark
          </button>
        </div>
      </div>
    </div>
  );
}
