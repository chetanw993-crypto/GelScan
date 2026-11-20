import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  Percent,
  Plus,
  Trash2,
  Sparkles,
  Info,
} from 'lucide-react';
import { SampleRecord, ValidationSummary } from '../types/gelscan';
import { computeValidationMetrics } from '../utils/calibrationEngine';

interface LabValidationModalProps {
  samples: SampleRecord[];
  onUpdateValidation: (sampleId: string, actualLabPH: number) => void;
}

export const LabValidationModal: React.FC<LabValidationModalProps> = ({
  samples,
  onUpdateValidation,
}) => {
  const [selectedSampleId, setSelectedSampleId] = useState<string>(
    samples[0]?.id || ''
  );
  const [actualLabPHInput, setActualLabPHInput] = useState<string>('7.0');

  // Filter samples that have validation readings
  const validatedSamples = samples.filter(s => s.actualLabPH !== undefined);

  // Compute metrics
  const validationPairs = validatedSamples.map(s => ({
    estimated: s.estimatedPH,
    actual: s.actualLabPH!,
  }));

  const metrics: ValidationSummary = computeValidationMetrics(validationPairs);

  const handleRecordValidation = (e: React.FormEvent) => {
    e.preventDefault();
    const act = parseFloat(actualLabPHInput);
    if (isNaN(act) || act < 0 || act > 14) {
      alert('Please enter a valid laboratory pH meter reading (0.00 to 14.00).');
      return;
    }
    if (!selectedSampleId) {
      alert('Please select a sample record to validate.');
      return;
    }

    onUpdateValidation(selectedSampleId, act);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Laboratory pH Meter Validation & Benchmarking
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Record actual benchtop glass-electrode pH meter readings against GelScan optical estimates to calculate experimental accuracy, MAE, and RMSE.
          </p>
        </div>

        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
          <FileCheck className="w-4 h-4 text-emerald-600" />
          <span>{validatedSamples.length} Samples Validated</span>
        </div>
      </div>

      {/* Statistical Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Mean Absolute Error (MAE)
          </span>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1">
            {metrics.totalCount > 0 ? `${metrics.mae.toFixed(3)}` : '—'}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">pH units</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            RMSE (Precision)
          </span>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1">
            {metrics.totalCount > 0 ? `${metrics.rmse.toFixed(3)}` : '—'}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Standard deviation</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Mean % Error
          </span>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1">
            {metrics.totalCount > 0 ? `${metrics.meanPercentageError.toFixed(2)}%` : '—'}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Relative bias</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Correlation (R&sup2;)
          </span>
          <div className="text-2xl font-black font-mono text-emerald-600 mt-1">
            {metrics.totalCount > 1 ? `${metrics.rSquared?.toFixed(3)}` : '—'}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Fit quality</span>
        </div>
      </div>

      {/* Record Validation Form & Scatter Plot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Input Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-emerald-600" />
            Record Lab Benchmark
          </h3>

          {samples.length === 0 ? (
            <p className="text-xs text-slate-500">
              No samples in history. Capture or upload a film sample first.
            </p>
          ) : (
            <form onSubmit={handleRecordValidation} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Select Recorded Sample *
                </label>
                <select
                  value={selectedSampleId}
                  onChange={e => setSelectedSampleId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-medium text-slate-800"
                >
                  {samples.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.sampleId} ({s.batchNumber}) — Est: pH {s.estimatedPH.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Calibrated Glass-Electrode pH Meter Value *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="14"
                    required
                    value={actualLabPHInput}
                    onChange={e => setActualLabPHInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. 7.04"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                    pH
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Validation Benchmark</span>
              </button>
            </form>
          )}
        </div>

        {/* Right: Validation Scatter Plot */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Parity Scatter Plot: App Estimated pH vs Actual Lab pH
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Ideal line: y = x
            </span>
          </div>

          <div className="w-full flex justify-center py-2">
            <svg viewBox="0 0 450 240" className="w-full max-w-lg h-auto select-none font-mono">
              {/* Background */}
              <rect x="40" y="20" width="380" height="180" fill="#f8fafc" rx="6" />

              {/* Grid lines */}
              {[4, 6, 8, 10, 12].map(val => {
                const x = 40 + ((val - 2) / 10) * 380;
                const y = 20 + 180 - ((val - 2) / 10) * 180;
                return (
                  <g key={val}>
                    <line x1={x} y1="20" x2={x} y2="200" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="40" y1={y} x2="420" y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
                    <text x={x} y="215" textAnchor="middle" className="text-[9px] fill-slate-400">
                      {val}
                    </text>
                    <text x="35" y={y + 3} textAnchor="end" className="text-[9px] fill-slate-400">
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Ideal Parity line (y = x) */}
              <line
                x1="40"
                y1="200"
                x2="420"
                y2="20"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Data points */}
              {validatedSamples.map(s => {
                const cx = 40 + ((s.actualLabPH! - 2) / 10) * 380;
                const cy = 20 + 180 - ((s.estimatedPH - 2) / 10) * 180;
                return (
                  <g key={s.id}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r="5"
                      fill={s.color.hex}
                      stroke="#0f172a"
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })}

              {/* Axis labels */}
              <text x="230" y="235" textAnchor="middle" className="text-[10px] font-bold fill-slate-600">
                Calibrated Lab pH Meter (Actual)
              </text>
              <text
                transform="rotate(-90)"
                x="-110"
                y="12"
                textAnchor="middle"
                className="text-[10px] font-bold fill-slate-600"
              >
                GelScan Estimated pH
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Validation Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Validation Benchmark Log ({validatedSamples.length} Records)
          </span>
        </div>

        {validatedSamples.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No validated samples recorded yet. Enter lab pH meter readings above to benchmark GelScan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                <tr>
                  <th className="py-3 px-4">Sample ID</th>
                  <th className="py-3 px-4">Batch</th>
                  <th className="py-3 px-4">Swatch</th>
                  <th className="py-3 px-4">GelScan Est. pH</th>
                  <th className="py-3 px-4">Actual Lab pH</th>
                  <th className="py-3 px-4">&Delta;pH Error</th>
                  <th className="py-3 px-4">Error %</th>
                  <th className="py-3 px-4">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {validatedSamples.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800">{s.sampleId}</td>
                    <td className="py-3 px-4 text-slate-600">{s.batchNumber}</td>
                    <td className="py-3 px-4">
                      <div
                        className="w-5 h-5 rounded-md border border-slate-300"
                        style={{ backgroundColor: s.color.hex }}
                      />
                    </td>
                    <td className="py-3 px-4 font-bold text-teal-700">
                      {s.estimatedPH.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-700">
                      {s.actualLabPH?.toFixed(2)}
                    </td>
                    <td
                      className={`py-3 px-4 font-bold ${
                        Math.abs(s.phError || 0) <= 0.25 ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {(s.phError || 0) >= 0 ? '+' : ''}
                      {s.phError?.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">{s.errorPercentage?.toFixed(2)}%</td>
                    <td className="py-3 px-4 text-slate-700">{s.confidenceScore}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
