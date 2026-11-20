import React, { useState } from 'react';
import { Settings, Save, X, School, User, Layers, Info } from 'lucide-react';
import { DEFAULT_SETTINGS, LabSettings } from '../utils/storage';

interface LabSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: LabSettings;
  onSaveSettings: (settings: LabSettings) => void;
}

export const LabSettingsModal: React.FC<LabSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [collegeName, setCollegeName] = useState(settings.collegeName);
  const [department, setDepartment] = useState(settings.department);
  const [projectGuide, setProjectGuide] = useState(settings.projectGuide);
  const [defaultOperator, setDefaultOperator] = useState(settings.defaultOperator);
  const [defaultBatchPrefix, setDefaultBatchPrefix] = useState(settings.defaultBatchPrefix);
  const [estimationMode, setEstimationMode] = useState(settings.estimationMode);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      ...settings,
      collegeName: collegeName.trim() || DEFAULT_SETTINGS.collegeName,
      department: department.trim() || DEFAULT_SETTINGS.department,
      projectGuide: projectGuide.trim() || DEFAULT_SETTINGS.projectGuide,
      defaultOperator: defaultOperator.trim() || DEFAULT_SETTINGS.defaultOperator,
      defaultBatchPrefix: defaultBatchPrefix.trim() || DEFAULT_SETTINGS.defaultBatchPrefix,
      estimationMode,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm font-bold tracking-tight">
              College Laboratory & Research Profile Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-slate-400" />
              College / Institution Name *
            </label>
            <input
              type="text"
              required
              value={collegeName}
              onChange={e => setCollegeName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
              placeholder="e.g. Government College of Pharmacy"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Department / Laboratory
            </label>
            <input
              type="text"
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
              placeholder="e.g. Department of Pharmaceutics & Biomaterials"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Faculty Research Guide
              </label>
              <input
                type="text"
                value={projectGuide}
                onChange={e => setProjectGuide(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
                placeholder="Dr. / Prof. Guide Name"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Default Student Operator
              </label>
              <input
                type="text"
                value={defaultOperator}
                onChange={e => setDefaultOperator(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
                placeholder="Student Name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                Default Batch Prefix
              </label>
              <input
                type="text"
                value={defaultBatchPrefix}
                onChange={e => setDefaultBatchPrefix(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-medium text-slate-800"
                placeholder="GA-ANTH-"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Default pH Calculation
              </label>
              <select
                value={estimationMode}
                onChange={e => setEstimationMode(e.target.value as 'interpolated' | 'nearest')}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
              >
                <option value="interpolated">Piecewise Interpolation (Continuous)</option>
                <option value="nearest">Nearest Reference Buffer</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg text-xs shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Lab Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
