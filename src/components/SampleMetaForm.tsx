import React, { useState } from 'react';
import {
  Save,
  QrCode,
  Tag,
  Clock,
  Layers,
  User,
  FileText,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { ColorData, SampleRecord } from '../types/gelscan';
import { EstimationResult } from '../utils/calibrationEngine';
import { LabSettings } from '../utils/storage';

interface SampleMetaFormProps {
  color: ColorData | null;
  estimation: EstimationResult | null;
  estimationMode: 'interpolated' | 'nearest';
  source: 'camera' | 'gallery' | 'whatsapp';
  snapshotDataUrl?: string;
  onSaveSample: (sample: SampleRecord) => void;
  onOpenQRScanner: () => void;
  labSettings: LabSettings;
}

export const SampleMetaForm: React.FC<SampleMetaFormProps> = ({
  color,
  estimation,
  estimationMode,
  source,
  snapshotDataUrl,
  onSaveSample,
  onOpenQRScanner,
  labSettings,
}) => {
  const [sampleId, setSampleId] = useState(`GEL-${Date.now().toString().slice(-4)}`);
  const [batchNumber, setBatchNumber] = useState(`${labSettings.defaultBatchPrefix}01`);
  const [timePoint, setTimePoint] = useState('0 min');
  const [customTime, setCustomTime] = useState('');
  const [filmThickness, setFilmThickness] = useState<string>('0.25');
  const [operatorName, setOperatorName] = useState(labSettings.defaultOperator);
  const [notes, setNotes] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const commonTimePoints = ['0 min', '15 min', '30 min', '1 hr', '2 hr', '4 hr', '24 hr'];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!color || !estimation) {
      alert('Please sample a film first before saving.');
      return;
    }

    const effectiveTime = timePoint === 'Custom' ? customTime || '0 min' : timePoint;

    const newSample: SampleRecord = {
      id: `sample-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sampleId: sampleId.trim() || `GEL-${Date.now().toString().slice(-4)}`,
      batchNumber: batchNumber.trim() || 'GA-ANTH-01',
      timestamp: new Date().toISOString(),
      timePoint: effectiveTime,
      filmThicknessMm: filmThickness ? parseFloat(filmThickness) : undefined,
      operatorName: operatorName.trim() || 'Student Researcher',
      estimatedPH: estimation.estimatedPH,
      estimationMethod: estimationMode,
      nearestReferencePH: estimation.nearestPoint.pH,
      nearestReferenceBuffer: estimation.nearestPoint.bufferName,
      deltaE: estimation.deltaE,
      confidenceScore: estimation.confidenceScore,
      color,
      source,
      notes: notes.trim(),
      imageDataUrl: snapshotDataUrl,
    };

    onSaveSample(newSample);
    setSaveSuccess(true);

    // Auto-advance sample ID
    setSampleId(`GEL-${(Date.now() + 1).toString().slice(-4)}`);

    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-teal-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Sample Identification & Metadata
          </h3>
        </div>

        <button
          type="button"
          onClick={onOpenQRScanner}
          className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-lg transition-colors"
          title="Scan QR Code on petri dish to autofill sample details"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Scan Petri Dish QR</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        {/* Sample ID & Batch Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Sample ID / Tag *
            </label>
            <input
              type="text"
              required
              value={sampleId}
              onChange={e => setSampleId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              placeholder="e.g. GEL-101"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Formulation Batch No. *
            </label>
            <input
              type="text"
              required
              value={batchNumber}
              onChange={e => setBatchNumber(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              placeholder="e.g. GA-Anth-B1"
            />
          </div>
        </div>

        {/* Time-point tracking */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Incubation / Exposure Time Point:
            </span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {commonTimePoints.map(tp => (
              <button
                key={tp}
                type="button"
                onClick={() => setTimePoint(tp)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  timePoint === tp
                    ? 'bg-teal-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tp}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setTimePoint('Custom')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                timePoint === 'Custom'
                  ? 'bg-teal-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Other
            </button>
          </div>

          {timePoint === 'Custom' && (
            <input
              type="text"
              value={customTime}
              onChange={e => setCustomTime(e.target.value)}
              placeholder="Enter custom duration e.g. 48 hours"
              className="mt-2 w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
            />
          )}
        </div>

        {/* Thickness & Operator */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <Layers className="w-3 h-3 text-slate-400" />
              Film Thickness (mm)
            </label>
            <input
              type="number"
              step="0.01"
              value={filmThickness}
              onChange={e => setFilmThickness(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              placeholder="0.25"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <User className="w-3 h-3 text-slate-400" />
              Student / Operator Name
            </label>
            <input
              type="text"
              value={operatorName}
              onChange={e => setOperatorName(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              placeholder="Student Name"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
            <FileText className="w-3 h-3 text-slate-400" />
            Physical Film Appearance & Experimental Notes
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="e.g. Uniform film texture, slight swelling after buffer contact, good elasticity..."
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500 resize-none"
          />
        </div>

        {/* Save button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!color || !estimation}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
              color && estimation
                ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Saved to Local Research Log!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Sample to Research Log</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
