import React, { useState } from 'react';
import {
  History,
  Search,
  Download,
  FileSpreadsheet,
  FileText,
  Trash2,
  CheckCircle2,
  Layers,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { CalibrationPoint, SampleRecord } from '../types/gelscan';
import { exportSamplesToCSV, generateSamplePDFReport } from '../utils/exportUtils';
import { LabSettings } from '../utils/storage';

interface SampleHistoryTableProps {
  samples: SampleRecord[];
  onDeleteSample: (id: string) => void;
  onSelectForValidation: (id: string) => void;
  selectedCompareIds: string[];
  onToggleCompare: (id: string) => void;
  labSettings: LabSettings;
  calibrationSet: CalibrationPoint[];
}

export const SampleHistoryTable: React.FC<SampleHistoryTableProps> = ({
  samples,
  onDeleteSample,
  onSelectForValidation,
  selectedCompareIds,
  onToggleCompare,
  labSettings,
  calibrationSet,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBatch, setFilterBatch] = useState('all');

  const batches = Array.from(new Set(samples.map(s => s.batchNumber)));

  const filteredSamples = samples.filter(s => {
    const matchSearch =
      s.sampleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.notes && s.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchBatch = filterBatch === 'all' || s.batchNumber === filterBatch;

    return matchSearch && matchBatch;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Experimental Sample Log & Data Export
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Review recorded colorimetric evaluations, export comprehensive research spreadsheets (CSV), or generate publication-ready PDF reports with faculty verification lines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportSamplesToCSV(samples)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV Dataset</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search sample ID, batch, notes..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 font-medium">Batch:</span>
            <select
              value={filterBatch}
              onChange={e => setFilterBatch(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
            >
              <option value="all">All Batches</option>
              {batches.map(b => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <span className="text-slate-400 text-xs font-mono">
            Showing {filteredSamples.length} of {samples.length} records
          </span>
        </div>
      </div>

      {/* Samples Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredSamples.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs space-y-2">
            <History className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-600">No Sample Records Found</p>
            <p>Use the Scanner or Gallery tab to evaluate and save film samples.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3 text-center">Compare</th>
                  <th className="py-3 px-4">Sample ID & Batch</th>
                  <th className="py-3 px-4">Film Swatch</th>
                  <th className="py-3 px-4">Estimated pH</th>
                  <th className="py-3 px-4">Nearest Reference</th>
                  <th className="py-3 px-4">Time Point</th>
                  <th className="py-3 px-4">Lab Validated</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {filteredSamples.map(sample => {
                  const isSelected = selectedCompareIds.includes(sample.id);

                  return (
                    <tr
                      key={sample.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      {/* Compare Checkbox */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleCompare(sample.id)}
                          className="rounded text-indigo-600 accent-indigo-600 w-4 h-4 cursor-pointer"
                        />
                      </td>

                      {/* Sample ID & Batch */}
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-slate-900 text-xs">
                          {sample.sampleId}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Batch: {sample.batchNumber}
                        </div>
                      </td>

                      {/* Swatch & Color info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-md border border-slate-300 shadow-xs shrink-0"
                            style={{ backgroundColor: sample.color.hex }}
                          />
                          <div className="text-[10px] font-mono text-slate-700">
                            {sample.color.hex}
                          </div>
                        </div>
                      </td>

                      {/* Estimated pH */}
                      <td className="py-3 px-4">
                        <div className="font-mono font-extrabold text-teal-800 text-sm">
                          pH {sample.estimatedPH.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {sample.estimationMethod} (&Delta;E {sample.deltaE.toFixed(1)})
                        </div>
                      </td>

                      {/* Nearest Reference */}
                      <td className="py-3 px-4 text-[11px] text-slate-700">
                        <span className="font-bold">pH {sample.nearestReferencePH.toFixed(1)}</span>
                        <div className="text-[10px] text-slate-400 truncate max-w-[130px]">
                          {sample.nearestReferenceBuffer}
                        </div>
                      </td>

                      {/* Time point */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-800">
                        {sample.timePoint}
                      </td>

                      {/* Lab Validated */}
                      <td className="py-3 px-4">
                        {sample.actualLabPH !== undefined ? (
                          <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>pH {sample.actualLabPH.toFixed(2)}</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => onSelectForValidation(sample.id)}
                            className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold underline"
                          >
                            Add Lab pH
                          </button>
                        )}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3 px-4 text-[10px] text-slate-400 font-mono">
                        {new Date(sample.timestamp).toLocaleDateString()}
                        <div className="text-[9px]">
                          {new Date(sample.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => generateSamplePDFReport(sample, labSettings, calibrationSet)}
                            className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                            title="Download PDF Scientific Lab Report"
                          >
                            <FileText className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Delete sample ${sample.sampleId}?`)) {
                                onDeleteSample(sample.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete sample record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
