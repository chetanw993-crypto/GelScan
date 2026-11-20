import React from 'react';
import {
  Gauge,
  Info,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { EstimationResult } from '../utils/calibrationEngine';

interface PHEstimateCardProps {
  estimation: EstimationResult | null;
  estimationMode: 'interpolated' | 'nearest';
  setEstimationMode: (mode: 'interpolated' | 'nearest') => void;
}

export const PHEstimateCard: React.FC<PHEstimateCardProps> = ({
  estimation,
  estimationMode,
  setEstimationMode,
}) => {
  if (!estimation) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-xs">
        <Gauge className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-xs text-slate-500 font-medium">
          Sample a film to compute estimated pH against calibrated reference buffers...
        </p>
      </div>
    );
  }

  const {
    estimatedPH,
    nearestPoint,
    deltaE,
    confidenceScore,
    qualityRating,
    secondNearestPoint,
  } = estimation;

  // Determine wound healing context based on pH
  let woundContext = 'Strong Acid (Chemical / Hydrogel artifact)';
  let contextBg = 'bg-red-50 text-red-800 border-red-200';

  if (estimatedPH >= 4.0 && estimatedPH < 5.5) {
    woundContext = 'Healthy Intact Skin pH Range (4.5 - 5.5)';
    contextBg = 'bg-rose-50 text-rose-800 border-rose-200';
  } else if (estimatedPH >= 5.5 && estimatedPH < 7.2) {
    woundContext = 'Acute Healing Wound Exudate (5.5 - 7.0)';
    contextBg = 'bg-purple-50 text-purple-800 border-purple-200';
  } else if (estimatedPH >= 7.2 && estimatedPH < 8.2) {
    woundContext = 'Neutral to Mild Alkaline (Delayed Healing)';
    contextBg = 'bg-blue-50 text-blue-800 border-blue-200';
  } else if (estimatedPH >= 8.2) {
    woundContext = 'Alkaline Exudate / Potential Bacterial Biofilm (>8.0)';
    contextBg = 'bg-teal-50 text-teal-800 border-teal-200';
  }

  // Calculate percentage along pH 1 to 12 scale
  const scalePercent = Math.min(100, Math.max(0, ((estimatedPH - 1) / (12 - 1)) * 100));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      {/* Title & Algorithm Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Gauge className="w-4 h-4 text-teal-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Estimated Film pH
          </span>
        </div>

        {/* Algorithm switch */}
        <div className="bg-slate-100 p-0.5 rounded-lg flex items-center text-[11px] font-semibold">
          <button
            onClick={() => setEstimationMode('interpolated')}
            className={`px-2 py-1 rounded-md transition-all ${
              estimationMode === 'interpolated'
                ? 'bg-white text-teal-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Piecewise interpolation for continuous fractional pH"
          >
            Interpolated
          </button>
          <button
            onClick={() => setEstimationMode('nearest')}
            className={`px-2 py-1 rounded-md transition-all ${
              estimationMode === 'nearest'
                ? 'bg-white text-teal-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Exact match to nearest calibrated reference buffer"
          >
            Nearest Reference
          </button>
        </div>
      </div>

      {/* Main Estimated pH Display */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-5 shadow-md flex items-center justify-between relative overflow-hidden">
        {/* Glow backdrop */}
        <div
          className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: nearestPoint.hex }}
        />

        <div>
          <span className="text-[11px] uppercase tracking-wider text-teal-300 font-semibold block">
            Colorimetric Estimate
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white">
              {estimatedPH.toFixed(2)}
            </span>
            <span className="text-sm font-semibold text-slate-300">pH units</span>
          </div>

          <div className="flex items-center gap-2 mt-2 text-xs">
            <span
              className="w-3 h-3 rounded-full border border-white/40"
              style={{ backgroundColor: nearestPoint.hex }}
            />
            <span className="text-slate-300 text-[11px]">
              Nearest: <strong className="text-white">pH {nearestPoint.pH}</strong> ({nearestPoint.bufferName})
            </span>
          </div>
        </div>

        {/* Confidence & Delta E Badge */}
        <div className="text-right space-y-1.5 shrink-0">
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/10 text-center">
            <div className="text-[10px] text-teal-200 uppercase font-semibold">Match Quality</div>
            <div className="text-base font-extrabold text-white mt-0.5">{qualityRating}</div>
            <div className="text-[11px] text-slate-300 font-mono mt-0.5">
              &Delta;E: <span className="font-bold text-white">{deltaE}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual pH 1 to 12 Spectrum Bar */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-[10px] font-bold text-slate-400">
          <span>pH 1.0 (Acid)</span>
          <span>pH 7.0 (Neutral)</span>
          <span>pH 12.0 (Base)</span>
        </div>

        <div className="relative h-3 rounded-full overflow-hidden shadow-inner bg-gradient-to-r from-red-500 via-purple-500 via-blue-500 via-teal-500 to-amber-500">
          {/* Active indicator needle */}
          <div
            className="absolute top-0 bottom-0 w-2 bg-white rounded-full shadow-md border border-slate-900 transform -translate-x-1/2 transition-all duration-300"
            style={{ left: `${scalePercent}%` }}
          />
        </div>
      </div>

      {/* Physiological / Wound Exudate Context Tag */}
      <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${contextBg}`}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span className="font-medium">{woundContext}</span>
        </div>
      </div>

      {/* Second Nearest Point (if interpolated) */}
      {estimationMode === 'interpolated' && secondNearestPoint && (
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
          <span>Interpolation Anchors:</span>
          <div className="flex items-center gap-2 font-mono">
            <span className="flex items-center gap-1 font-semibold text-slate-800">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: nearestPoint.hex }} />
              pH {nearestPoint.pH}
            </span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="flex items-center gap-1 font-semibold text-slate-800">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: secondNearestPoint.hex }} />
              pH {secondNearestPoint.pH}
            </span>
          </div>
        </div>
      )}

      {/* Academic & Non-Diagnostic Disclaimer */}
      <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-snug">
          <strong className="font-semibold block mb-0.5">Academic Prototype Disclaimer:</strong>
          GelScan provides experimental optical pH estimation calibrated against known laboratory buffer references. Not a validated in-vivo medical diagnostic instrument.
        </div>
      </div>
    </div>
  );
};
