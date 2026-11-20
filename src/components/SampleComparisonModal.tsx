import React from 'react';
import { X, Layers, ArrowRight, Eye, Check } from 'lucide-react';
import { SampleRecord } from '../types/gelscan';
import { calculateDeltaE } from '../utils/colorMath';

interface SampleComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSamples: SampleRecord[];
}

export const SampleComparisonModal: React.FC<SampleComparisonModalProps> = ({
  isOpen,
  onClose,
  selectedSamples,
}) => {
  if (!isOpen) return null;

  const baseSample = selectedSamples[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold tracking-tight">
              Multi-Sample Side-by-Side Comparison ({selectedSamples.length} Samples)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectedSamples.map((sample, idx) => {
              const dEFromBase = idx > 0 && baseSample
                ? calculateDeltaE(baseSample.color.lab, sample.color.lab)
                : 0;

              return (
                <div
                  key={sample.id}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col space-y-3"
                >
                  {/* Swatch & Tag */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      Sample #{idx + 1}
                    </span>
                    {idx === 0 && (
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                        Reference Baseline
                      </span>
                    )}
                  </div>

                  <div
                    className="w-full h-20 rounded-xl shadow-inner border border-slate-300"
                    style={{ backgroundColor: sample.color.hex }}
                  />

                  {/* ID & pH */}
                  <div>
                    <h4 className="font-mono font-bold text-slate-900 text-sm">
                      {sample.sampleId}
                    </h4>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Batch: {sample.batchNumber} &bull; {sample.timePoint}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">
                      Estimated pH
                    </div>
                    <div className="text-2xl font-black font-mono text-teal-700">
                      pH {sample.estimatedPH.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Nearest: pH {sample.nearestReferencePH.toFixed(1)}
                    </div>
                  </div>

                  {/* Delta E difference from Sample 1 */}
                  {idx > 0 && (
                    <div className="bg-indigo-50 border border-indigo-100 p-2 rounded-xl text-center">
                      <span className="text-[10px] font-bold text-indigo-700 block">
                        &Delta;E Difference from #{1}
                      </span>
                      <span className="text-sm font-black font-mono text-indigo-900">
                        {dEFromBase.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* RGB Breakdown */}
                  <div className="text-[11px] font-mono space-y-1 bg-white p-2.5 rounded-xl border border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-500">HEX:</span>
                      <span className="font-bold text-slate-800">{sample.color.hex}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">RGB:</span>
                      <span className="text-slate-800">
                        {sample.color.rgb.r}, {sample.color.rgb.g}, {sample.color.rgb.b}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Hue:</span>
                      <span className="text-slate-800">{sample.color.hsv.h}&deg;</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Lab:</span>
                      <span className="text-slate-800">
                        {sample.color.lab.l}, {sample.color.lab.a}, {sample.color.lab.b}
                      </span>
                    </div>
                  </div>

                  {/* Classification */}
                  <div className="text-[10px] text-slate-600 font-medium">
                    {sample.color.colorName}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
