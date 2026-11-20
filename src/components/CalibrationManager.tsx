import React, { useState } from 'react';
import {
  Sliders,
  Plus,
  Trash2,
  RotateCcw,
  Download,
  Upload,
  Check,
  AlertCircle,
  Pipette,
  BookOpen,
} from 'lucide-react';
import { CalibrationPoint, ColorData } from '../types/gelscan';
import { hexToRgb, rgbToHex, rgbToHsv } from '../utils/colorMath';

interface CalibrationManagerProps {
  calibrationPoints: CalibrationPoint[];
  onUpdateCalibrationPoints: (points: CalibrationPoint[]) => void;
  onResetToDefault: () => void;
  currentColor: ColorData | null;
}

export const CalibrationManager: React.FC<CalibrationManagerProps> = ({
  calibrationPoints,
  onUpdateCalibrationPoints,
  onResetToDefault,
  currentColor,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPH, setNewPH] = useState<string>('7.0');
  const [newHex, setNewHex] = useState<string>('#4455A0');
  const [newBufferName, setNewBufferName] = useState<string>('Phosphate Buffer (pH 7.0)');
  const [newDescription, setNewDescription] = useState<string>('');

  // Use current sampled color as new reference
  const handleUseCurrentColor = () => {
    if (currentColor) {
      setNewHex(currentColor.hex);
    }
  };

  // Add calibration point
  const handleAddPoint = (e: React.FormEvent) => {
    e.preventDefault();
    const phVal = parseFloat(newPH);
    if (isNaN(phVal) || phVal < 0 || phVal > 14) {
      alert('Please enter a valid pH value between 0 and 14');
      return;
    }

    const rgb = hexToRgb(newHex);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

    const newPoint: CalibrationPoint = {
      id: `cal-${Date.now()}`,
      pH: phVal,
      rgb,
      hsv,
      hex: newHex.toUpperCase(),
      bufferName: newBufferName.trim() || `Buffer pH ${phVal}`,
      description: newDescription.trim() || undefined,
      isDefault: false,
      updatedAt: new Date().toISOString(),
    };

    // Keep points sorted by pH
    const updated = [...calibrationPoints, newPoint].sort((a, b) => a.pH - b.pH);
    onUpdateCalibrationPoints(updated);
    setShowAddModal(false);

    // Reset form
    setNewPH('7.0');
    setNewBufferName('');
    setNewDescription('');
  };

  // Delete a calibration point
  const handleDeletePoint = (id: string) => {
    if (calibrationPoints.length <= 2) {
      alert('You must have at least 2 calibration points for pH estimation.');
      return;
    }
    if (confirm('Are you sure you want to delete this calibration reference point?')) {
      const updated = calibrationPoints.filter(p => p.id !== id);
      onUpdateCalibrationPoints(updated);
    }
  };

  // Export calibration profile as JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(calibrationPoints, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `GelScan_Calibration_Matrix_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import calibration profile from JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length >= 2) {
            onUpdateCalibrationPoints(parsed.sort((a, b) => a.pH - b.pH));
            alert(`Successfully imported ${parsed.length} calibration reference points.`);
          } else {
            alert('Invalid calibration file format. Must contain an array of reference points.');
          }
        } catch {
          alert('Error parsing JSON calibration file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sliders className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900">
              pH Calibration Matrix & Reference Buffers
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Calibrate the digital camera analysis by matching gelatin/alginate film colors against known standard laboratory buffer solutions (USP/IP buffers).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              if (currentColor) {
                setNewHex(currentColor.hex);
              }
              setShowAddModal(true);
            }}
            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Reference Point</span>
          </button>

          <button
            onClick={onResetToDefault}
            className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Reset to default Anthocyanin literature curve"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs transition-colors"
            title="Export Calibration Profile (JSON)"
          >
            <Download className="w-4 h-4" />
          </button>

          <label
            className="p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs cursor-pointer transition-colors"
            title="Import Calibration Profile (JSON)"
          >
            <Upload className="w-4 h-4" />
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>
        </div>
      </div>

      {/* Visual Color Spectrum Strip */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Calibrated Indicator Ladder ({calibrationPoints.length} Points)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
          {calibrationPoints.map(pt => (
            <div
              key={pt.id}
              className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center flex flex-col items-center justify-between"
            >
              <div
                className="w-10 h-10 rounded-lg shadow-sm border border-slate-300 mb-2 transition-transform hover:scale-105"
                style={{ backgroundColor: pt.hex }}
              />
              <div className="text-xs font-black font-mono text-slate-800">
                pH {pt.pH.toFixed(1)}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                {pt.hex}
              </div>
              <div className="text-[10px] text-slate-600 line-clamp-1 mt-1 font-medium">
                {pt.bufferName}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calibration Points Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Reference Buffer Database
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Sorted by pH (Low to High)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Color Swatch</th>
                <th className="py-3 px-4">Reference pH</th>
                <th className="py-3 px-4">Buffer Name & Standard</th>
                <th className="py-3 px-4">RGB Vector</th>
                <th className="py-3 px-4">HSV Values</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {calibrationPoints.map(pt => (
                <tr key={pt.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-md border border-slate-300 shadow-xs"
                        style={{ backgroundColor: pt.hex }}
                      />
                      <span className="font-mono text-[11px] font-medium text-slate-700">
                        {pt.hex}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 text-sm">
                    {pt.pH.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {pt.bufferName}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    {pt.rgb.r}, {pt.rgb.g}, {pt.rgb.b}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    {pt.hsv.h}&deg;, {pt.hsv.s}%, {pt.hsv.v}%
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px] max-w-xs truncate">
                    {pt.description || '—'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDeletePoint(pt.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete reference point"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Reference Point */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-teal-600" />
              Add Reference Calibration Point
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter the exact buffer pH and reference color captured from a calibrated indicator film.
            </p>

            <form onSubmit={handleAddPoint} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Buffer Standard pH Value * (0 - 14)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="14"
                  required
                  value={newPH}
                  onChange={e => setNewPH(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-900 focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. 7.0"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-700">
                    Reference Color (Hex / Color Picker) *
                  </label>
                  {currentColor && (
                    <button
                      type="button"
                      onClick={handleUseCurrentColor}
                      className="text-[11px] text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1"
                    >
                      <Pipette className="w-3 h-3" />
                      Use Currently Sampled Color ({currentColor.hex})
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={newHex}
                    onChange={e => setNewHex(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                  />
                  <input
                    type="text"
                    required
                    value={newHex}
                    onChange={e => setNewHex(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs uppercase"
                    placeholder="#RRGGBB"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Buffer Solution Name *
                </label>
                <input
                  type="text"
                  required
                  value={newBufferName}
                  onChange={e => setNewBufferName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  placeholder="e.g. Phosphate Buffer 0.1M pH 7.0"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Chemical Notes / Species
                </label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  placeholder="e.g. Neutral quinoidal species transition"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg text-xs shadow-xs"
                >
                  Save Point to Matrix
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
