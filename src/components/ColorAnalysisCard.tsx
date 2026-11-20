import React, { useState } from 'react';
import { Copy, Check, Eye, HelpCircle } from 'lucide-react';
import { ColorData } from '../types/gelscan';

interface ColorAnalysisCardProps {
  color: ColorData | null;
}

export const ColorAnalysisCard: React.FC<ColorAnalysisCardProps> = ({ color }) => {
  const [copied, setCopied] = useState(false);

  if (!color) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-xs">
        <Eye className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-xs text-slate-500 font-medium">
          Awaiting film color sample from camera or uploaded image...
        </p>
      </div>
    );
  }

  const { rgb, hsv, lab, hex, colorName, isNormalized } = color;

  const copyHex = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Colorimetric Extraction
          </span>
          {isNormalized && (
            <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full border border-amber-200">
              White-Balanced
            </span>
          )}
        </div>

        <button
          onClick={copyHex}
          className="flex items-center gap-1 text-[11px] font-mono text-slate-600 hover:text-slate-900 bg-slate-100 px-2 py-1 rounded transition-colors"
          title="Copy HEX to clipboard"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          <span>{hex}</span>
        </button>
      </div>

      {/* Swatch & Anthocyanin Classification */}
      <div className="flex items-center gap-4">
        {/* Large Swatch Box */}
        <div className="relative shrink-0">
          <div
            className="w-16 h-16 rounded-xl shadow-md border-2 border-white ring-1 ring-slate-200 transition-colors"
            style={{ backgroundColor: hex }}
          />
        </div>

        {/* Classification name */}
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
            Anthocyanin State
          </span>
          <h3 className="text-sm font-bold text-slate-800 leading-tight truncate">
            {colorName}
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            RGB: {rgb.r}, {rgb.g}, {rgb.b}
          </p>
        </div>
      </div>

      {/* RGB Breakdown */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
        <div className="bg-red-50/60 rounded-xl p-2.5 border border-red-100 text-center">
          <div className="text-[10px] font-bold text-red-600 uppercase">Red (R)</div>
          <div className="text-sm font-extrabold text-red-900 font-mono mt-0.5">{rgb.r}</div>
          <div className="w-full bg-red-200 h-1 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-red-500 h-full rounded-full"
              style={{ width: `${(rgb.r / 255) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-emerald-50/60 rounded-xl p-2.5 border border-emerald-100 text-center">
          <div className="text-[10px] font-bold text-emerald-600 uppercase">Green (G)</div>
          <div className="text-sm font-extrabold text-emerald-900 font-mono mt-0.5">{rgb.g}</div>
          <div className="w-full bg-emerald-200 h-1 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${(rgb.g / 255) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-blue-50/60 rounded-xl p-2.5 border border-blue-100 text-center">
          <div className="text-[10px] font-bold text-blue-600 uppercase">Blue (B)</div>
          <div className="text-sm font-extrabold text-blue-900 font-mono mt-0.5">{rgb.b}</div>
          <div className="w-full bg-blue-200 h-1 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full"
              style={{ width: `${(rgb.b / 255) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* HSV & CIELAB Coordinates */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div className="font-semibold text-slate-700 text-[11px] mb-1 flex items-center justify-between">
            <span>HSV Analysis</span>
            <span className="text-[10px] text-slate-400 font-mono">H/S/V</span>
          </div>
          <div className="space-y-1 font-mono text-[11px] text-slate-600">
            <div className="flex justify-between">
              <span>Hue:</span>
              <span className="font-bold text-slate-800">{hsv.h}&deg;</span>
            </div>
            <div className="flex justify-between">
              <span>Saturation:</span>
              <span className="font-bold text-slate-800">{hsv.s}%</span>
            </div>
            <div className="flex justify-between">
              <span>Value (Brightness):</span>
              <span className="font-bold text-slate-800">{hsv.v}%</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div className="font-semibold text-slate-700 text-[11px] mb-1 flex items-center justify-between">
            <span>CIELAB Space</span>
            <span className="text-[10px] text-slate-400 font-mono">L*a*b*</span>
          </div>
          <div className="space-y-1 font-mono text-[11px] text-slate-600">
            <div className="flex justify-between">
              <span>Lightness (L*):</span>
              <span className="font-bold text-slate-800">{lab.l}</span>
            </div>
            <div className="flex justify-between">
              <span>Green-Red (a*):</span>
              <span className="font-bold text-slate-800">{lab.a}</span>
            </div>
            <div className="flex justify-between">
              <span>Blue-Yellow (b*):</span>
              <span className="font-bold text-slate-800">{lab.b}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
