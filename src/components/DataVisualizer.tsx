import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Sliders,
  Filter,
  Sparkles,
  Info,
} from 'lucide-react';
import { CalibrationPoint, SampleRecord } from '../types/gelscan';

interface DataVisualizerProps {
  calibrationPoints: CalibrationPoint[];
  samples: SampleRecord[];
}

export const DataVisualizer: React.FC<DataVisualizerProps> = ({
  calibrationPoints,
  samples,
}) => {
  const [activeView, setActiveView] = useState<'calibration' | 'timecourse' | 'rgb'>('calibration');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');

  // Unique batches in sample history
  const batches = Array.from(new Set(samples.map(s => s.batchNumber)));

  // Filtered samples for time-course
  const filteredSamples = selectedBatch === 'all'
    ? samples
    : samples.filter(s => s.batchNumber === selectedBatch);

  // Parse time point string to approximate minutes for sorting/plotting
  const parseTimeMinutes = (timeStr: string): number => {
    const s = timeStr.toLowerCase().trim();
    if (s.includes('min')) {
      const num = parseFloat(s);
      return isNaN(num) ? 0 : num;
    }
    if (s.includes('hr') || s.includes('hour')) {
      const num = parseFloat(s);
      return isNaN(num) ? 60 : num * 60;
    }
    if (s.includes('day')) {
      const num = parseFloat(s);
      return isNaN(num) ? 1440 : num * 1440;
    }
    return 0;
  };

  // Sort time-course samples
  const timeCourseData = [...filteredSamples]
    .map(s => ({
      ...s,
      minutes: parseTimeMinutes(s.timePoint),
    }))
    .sort((a, b) => a.minutes - b.minutes);

  // SVG Chart Dimensions
  const svgWidth = 720;
  const svgHeight = 320;
  const padding = { top: 30, right: 40, bottom: 50, left: 60 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  // Calibration curve mapping
  // X: pH (2 to 12)
  const minPH = 2;
  const maxPH = 12;
  const getX_pH = (ph: number) =>
    padding.left + ((ph - minPH) / (maxPH - minPH)) * plotWidth;

  // Y: Hue (0 to 360)
  const getY_Hue = (hue: number) =>
    padding.top + plotHeight - (hue / 360) * plotHeight;

  // Y: Intensity (0 to 255)
  const getY_Intensity = (val: number) =>
    padding.top + plotHeight - (val / 255) * plotHeight;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Research Data Analytics & Scientific Curves
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Visualise colorimetric calibration curves, RGB intensity trends, and kinetic time-course pH transitions of the gelatin/alginate wound dressing films.
          </p>
        </div>

        {/* View switcher */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
          <button
            onClick={() => setActiveView('calibration')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeView === 'calibration'
                ? 'bg-white text-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            pH vs Hue Curve
          </button>
          <button
            onClick={() => setActiveView('rgb')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeView === 'rgb'
                ? 'bg-white text-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            RGB Channels
          </button>
          <button
            onClick={() => setActiveView('timecourse')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeView === 'timecourse'
                ? 'bg-white text-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Time-Course Kinetic
          </button>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        {/* Subheader info & filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              {activeView === 'calibration' && 'Anthocyanin Colorimetric Response: pH vs Hue Angle (θ°)'}
              {activeView === 'rgb' && 'Optical Transmittance Channels: pH vs RGB Channel Intensity'}
              {activeView === 'timecourse' && 'Kinetic Response: Film pH Evolution Over Time'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeView === 'calibration' && 'Demonstrates hypsochromic and bathochromic shifts across acidic to alkaline forms'}
              {activeView === 'rgb' && 'Individual red, green, and blue photometric components (0 - 255)'}
              {activeView === 'timecourse' && 'Tracks response time and exudate buffering stability of film batches'}
            </p>
          </div>

          {activeView === 'timecourse' && batches.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-600 font-medium">Filter Batch:</span>
              <select
                value={selectedBatch}
                onChange={e => setSelectedBatch(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-800"
              >
                <option value="all">All Batches ({samples.length})</option>
                {batches.map(b => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* SVG Plot */}
        <div className="w-full overflow-x-auto flex justify-center">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full max-w-3xl h-auto select-none font-sans"
          >
            {/* Background Grid */}
            <rect
              x={padding.left}
              y={padding.top}
              width={plotWidth}
              height={plotHeight}
              fill="#f8fafc"
              rx={8}
            />

            {/* Horizontal Grid lines */}
            {[0.25, 0.5, 0.75, 1.0].map(ratio => {
              const y = padding.top + plotHeight * (1 - ratio);
              return (
                <g key={ratio}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={padding.left + plotWidth}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[10px] fill-slate-400 font-mono"
                  >
                    {activeView === 'calibration' && `${Math.round(ratio * 360)}°`}
                    {activeView === 'rgb' && `${Math.round(ratio * 255)}`}
                    {activeView === 'timecourse' && `pH ${(2 + ratio * 10).toFixed(1)}`}
                  </text>
                </g>
              );
            })}

            {/* Vertical Grid lines for pH */}
            {activeView !== 'timecourse' &&
              [2, 4, 6, 8, 10, 12].map(ph => {
                const x = getX_pH(ph);
                return (
                  <g key={ph}>
                    <line
                      x1={x}
                      y1={padding.top}
                      x2={x}
                      y2={padding.top + plotHeight}
                      stroke="#e2e8f0"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={x}
                      y={padding.top + plotHeight + 16}
                      textAnchor="middle"
                      className="text-[11px] font-mono font-semibold fill-slate-500"
                    >
                      pH {ph}
                    </text>
                  </g>
                );
              })}

            {/* VIEW 1: pH vs Hue Curve */}
            {activeView === 'calibration' && (
              <>
                {/* Connecting Polyline */}
                <polyline
                  fill="none"
                  stroke="#0f766e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={calibrationPoints
                    .map(pt => `${getX_pH(pt.pH)},${getY_Hue(pt.hsv.h)}`)
                    .join(' ')}
                />

                {/* Calibration Point Nodes with Swatches */}
                {calibrationPoints.map(pt => {
                  const cx = getX_pH(pt.pH);
                  const cy = getY_Hue(pt.hsv.h);
                  return (
                    <g key={pt.id} className="cursor-pointer group">
                      <circle
                        cx={cx}
                        cy={cy}
                        r="6"
                        fill={pt.hex}
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="transition-transform group-hover:scale-125"
                      />
                      <text
                        x={cx}
                        y={cy - 10}
                        textAnchor="middle"
                        className="text-[10px] font-bold font-mono fill-slate-800 pointer-events-none"
                      >
                        {pt.hsv.h}°
                      </text>
                    </g>
                  );
                })}
              </>
            )}

            {/* VIEW 2: RGB Channel Intensity Curves */}
            {activeView === 'rgb' && (
              <>
                {/* Red Channel */}
                <polyline
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  points={calibrationPoints
                    .map(pt => `${getX_pH(pt.pH)},${getY_Intensity(pt.rgb.r)}`)
                    .join(' ')}
                />
                {/* Green Channel */}
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  points={calibrationPoints
                    .map(pt => `${getX_pH(pt.pH)},${getY_Intensity(pt.rgb.g)}`)
                    .join(' ')}
                />
                {/* Blue Channel */}
                <polyline
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  points={calibrationPoints
                    .map(pt => `${getX_pH(pt.pH)},${getY_Intensity(pt.rgb.b)}`)
                    .join(' ')}
                />

                {/* Nodes */}
                {calibrationPoints.map(pt => {
                  const x = getX_pH(pt.pH);
                  return (
                    <g key={pt.id}>
                      <circle cx={x} cy={getY_Intensity(pt.rgb.r)} r="3.5" fill="#ef4444" />
                      <circle cx={x} cy={getY_Intensity(pt.rgb.g)} r="3.5" fill="#10b981" />
                      <circle cx={x} cy={getY_Intensity(pt.rgb.b)} r="3.5" fill="#3b82f6" />
                    </g>
                  );
                })}
              </>
            )}

            {/* VIEW 3: Time-Course Tracking */}
            {activeView === 'timecourse' && (
              <>
                {timeCourseData.length === 0 ? (
                  <text
                    x={svgWidth / 2}
                    y={svgHeight / 2}
                    textAnchor="middle"
                    className="text-xs fill-slate-400 font-medium"
                  >
                    No sample history recorded yet for time tracking.
                  </text>
                ) : (
                  <>
                    {/* Timecourse polyline */}
                    {timeCourseData.length > 1 && (
                      <polyline
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="2.5"
                        strokeDasharray="2 2"
                        points={timeCourseData
                          .map((s, idx) => {
                            const x =
                              padding.left +
                              (idx / (timeCourseData.length - 1 || 1)) * plotWidth;
                            const y =
                              padding.top +
                              plotHeight -
                              ((s.estimatedPH - 2) / 10) * plotHeight;
                            return `${x},${y}`;
                          })
                          .join(' ')}
                      />
                    )}

                    {timeCourseData.map((s, idx) => {
                      const x =
                        padding.left +
                        (idx / (timeCourseData.length - 1 || 1)) * plotWidth;
                      const y =
                        padding.top +
                        plotHeight -
                        ((s.estimatedPH - 2) / 10) * plotHeight;
                      return (
                        <g key={s.id}>
                          <circle
                            cx={x}
                            cy={y}
                            r="5"
                            fill={s.color.hex}
                            stroke="#ffffff"
                            strokeWidth="2"
                          />
                          <text
                            x={x}
                            y={y - 8}
                            textAnchor="middle"
                            className="text-[10px] font-bold font-mono fill-slate-800"
                          >
                            pH {s.estimatedPH.toFixed(2)}
                          </text>
                          <text
                            x={x}
                            y={padding.top + plotHeight + 16}
                            textAnchor="middle"
                            className="text-[10px] font-medium fill-slate-500"
                          >
                            {s.timePoint}
                          </text>
                        </g>
                      );
                    })}
                  </>
                )}
              </>
            )}

            {/* Axes Labels */}
            <text
              x={padding.left + plotWidth / 2}
              y={svgHeight - 12}
              textAnchor="middle"
              className="text-xs font-bold fill-slate-600"
            >
              {activeView !== 'timecourse' ? 'Standard Reference Buffer pH' : 'Incubation / Exposure Time'}
            </text>

            <text
              transform={`rotate(-90)`}
              x={-(padding.top + plotHeight / 2)}
              y={18}
              textAnchor="middle"
              className="text-xs font-bold fill-slate-600"
            >
              {activeView === 'calibration' && 'Hue Angle (Degrees 0 - 360°)'}
              {activeView === 'rgb' && 'RGB Digital Value (0 - 255)'}
              {activeView === 'timecourse' && 'Estimated Film pH'}
            </text>
          </svg>
        </div>

        {/* Legend for RGB */}
        {activeView === 'rgb' && (
          <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-slate-100 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              Red Channel
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              Green Channel
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              Blue Channel
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
