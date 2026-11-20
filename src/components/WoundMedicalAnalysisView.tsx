import React, { useState } from 'react';
import {
  HeartPulse,
  Droplets,
  Clock,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  Sparkles,
  ClipboardList,
  AlertTriangle,
  ChevronRight,
  Info,
  Layers,
  Thermometer,
  Printer,
  Copy,
  Check,
} from 'lucide-react';
import { MoistureLevel, WoundMedicalAnalysis } from '../types/gelscan';
import { analyzeWoundHealth } from '../utils/woundAnalysisEngine';

interface WoundMedicalAnalysisViewProps {
  currentPH: number | null;
  filmThicknessMm?: number;
}

export const WoundMedicalAnalysisView: React.FC<WoundMedicalAnalysisViewProps> = ({
  currentPH,
  filmThicknessMm = 0.25,
}) => {
  const [selectedMoisture, setSelectedMoisture] = useState<MoistureLevel>('optimal');
  const [copied, setCopied] = useState(false);

  // If no sample has been measured yet, default to healthy baseline pH 6.0
  const effectivePH = currentPH !== null && currentPH !== undefined ? currentPH : 6.0;

  const analysis: WoundMedicalAnalysis = analyzeWoundHealth(
    effectivePH,
    selectedMoisture,
    filmThicknessMm
  );

  const {
    phaseTitle,
    biologicalDescription,
    moistureDescription,
    estimatedRecoveryTime,
    healingTrajectory,
    biochemicalStatus,
    clinicalCareSteps,
    standardMedicalProcedures,
    redFlagWarnings,
  } = analysis;

  // Badge colors based on healing trajectory
  let trajectoryBadge = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  if (healingTrajectory === 'Mildly Delayed') {
    trajectoryBadge = 'bg-amber-100 text-amber-800 border-amber-300';
  } else if (healingTrajectory === 'Stalled / Chronic' || healingTrajectory === 'Severe / Biofilm Risk') {
    trajectoryBadge = 'bg-rose-100 text-rose-800 border-rose-300';
  }

  // Copy care protocol to clipboard
  const handleCopyCarePlan = () => {
    const text = `
GELSCAN WOUND MEDICAL ANALYSIS REPORT
Estimated pH: ${effectivePH.toFixed(2)}
Wound State: ${phaseTitle}
Moisture Status: ${selectedMoisture.toUpperCase()} - ${moistureDescription}
Estimated Recovery Time: ${estimatedRecoveryTime}
Healing Trajectory: ${healingTrajectory}

BIOCHEMICAL PROFILE:
- MMP Protease Activity: ${biochemicalStatus.mmpProteaseActivity}
- Bacterial Biofilm Risk: ${biochemicalStatus.bacterialBiofilmRisk}
- Angiogenesis Status: ${biochemicalStatus.angiogenesisStatus}

PATIENT CARE STEPS:
${clinicalCareSteps.join('\n')}

STANDARD MEDICAL PROCEDURES:
${standardMedicalProcedures.join('\n')}

RED FLAG WARNINGS:
${redFlagWarnings.join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <HeartPulse className="w-5 h-5 text-rose-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Comprehensive Wound Diagnostics & Medical Care Analysis
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Biochemical wound bed evaluation based on gelatin film pH sensing, exudate moisture dynamics (TIME Framework), healing trajectory prediction, and standard clinical care protocols.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCarePlan}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Plan Copied!' : 'Copy Care Plan'}</span>
          </button>
        </div>
      </div>

      {/* Main Status & Recovery Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Wound State & Moisture Assessment (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Wound Phase Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-teal-600" />
                Current Wound Bed State
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-extrabold text-teal-900 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                  pH {effectivePH.toFixed(2)}
                </span>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${trajectoryBadge}`}>
                  {healingTrajectory}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                {phaseTitle}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {biologicalDescription}
              </p>
            </div>

            {/* Interactive Moisture & Exudate Balance */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-cyan-600" />
                  Wound Exudate & Moisture Level:
                </label>
                <span className="text-[11px] text-slate-400">Select clinical presentation</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMoisture('dry')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedMoisture === 'dry'
                      ? 'bg-amber-50 border-amber-400 shadow-xs ring-1 ring-amber-400 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-sm block mb-0.5">🌵</span>
                  <strong className="text-xs font-bold block">Dry / Low</strong>
                  <span className="text-[10px] text-slate-500 block">Desiccated Bed</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMoisture('optimal')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedMoisture === 'optimal'
                      ? 'bg-emerald-50 border-emerald-400 shadow-xs ring-1 ring-emerald-400 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-sm block mb-0.5">💧</span>
                  <strong className="text-xs font-bold block">Moist / Optimal</strong>
                  <span className="text-[10px] text-slate-500 block">Physiological Balance</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMoisture('maceration_risk')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedMoisture === 'maceration_risk'
                      ? 'bg-rose-50 border-rose-400 shadow-xs ring-1 ring-rose-400 text-rose-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-sm block mb-0.5">🌊</span>
                  <strong className="text-xs font-bold block">Wet / Heavy</strong>
                  <span className="text-[10px] text-slate-500 block">Maceration Risk</span>
                </button>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2">
                <Info className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-snug">{moistureDescription}</span>
              </div>
            </div>
          </div>

          {/* Biochemical Microenvironment Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Biochemical Microenvironment (Proteases & Biofilm)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* MMP Activity */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  MMP-2 / MMP-9 Proteases
                </span>
                <span
                  className={`text-xs font-bold mt-1 block ${
                    biochemicalStatus.mmpProteaseActivity.includes('Low') ||
                    biochemicalStatus.mmpProteaseActivity.includes('Normal')
                      ? 'text-emerald-700'
                      : 'text-rose-700'
                  }`}
                >
                  {biochemicalStatus.mmpProteaseActivity}
                </span>
                <span className="text-[9px] text-slate-500 mt-0.5 block">
                  Collagen degradation rate
                </span>
              </div>

              {/* Biofilm Risk */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Bacterial Biofilm Risk
                </span>
                <span
                  className={`text-xs font-bold mt-1 block ${
                    biochemicalStatus.bacterialBiofilmRisk.includes('Minimal') ||
                    biochemicalStatus.bacterialBiofilmRisk.includes('Low')
                      ? 'text-emerald-700'
                      : 'text-rose-700'
                  }`}
                >
                  {biochemicalStatus.bacterialBiofilmRisk}
                </span>
                <span className="text-[9px] text-slate-500 mt-0.5 block">
                  P. aeruginosa / S. aureus
                </span>
              </div>

              {/* Angiogenesis */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Angiogenesis Status
                </span>
                <span
                  className={`text-xs font-bold mt-1 block ${
                    biochemicalStatus.angiogenesisStatus.includes('Active') ||
                    biochemicalStatus.angiogenesisStatus.includes('Steady')
                      ? 'text-emerald-700'
                      : 'text-amber-700'
                  }`}
                >
                  {biochemicalStatus.angiogenesisStatus}
                </span>
                <span className="text-[9px] text-slate-500 mt-0.5 block">
                  Capillary vascular sprouting
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recovery Timeline & Urgent Warning (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recovery Time Estimate Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-400" />
              <span className="text-xs uppercase font-bold tracking-wider text-teal-300">
                Prognostic Recovery Timeline
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-black text-white font-mono">
                {estimatedRecoveryTime}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                Based on standardized linear epithelial migration rates (~0.5 – 1.0 mm/week) under moist wound healing conditions.
              </p>
            </div>

            <div className="p-3 bg-white/10 backdrop-blur-xs rounded-xl border border-white/10 text-xs text-slate-200 space-y-1">
              <strong className="text-teal-200 block font-semibold">Prognostic Factors:</strong>
              <div className="text-[11px] text-slate-300">
                Maintaining acidic wound pH (5.5 - 6.5) accelerates re-epithelialization by up to 40% compared to alkaline stalled wounds.
              </div>
            </div>
          </div>

          {/* Red Flag Warning Box */}
          <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-rose-800">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Clinical Red Flags (Seek Immediate Physician Attention)
              </h4>
            </div>

            <ul className="space-y-1.5 text-xs text-rose-900 list-disc list-inside leading-snug">
              {redFlagWarnings.map((flag, idx) => (
                <li key={idx} className="text-[11px]">
                  {flag}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Protocols & Procedures Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step-by-Step Patient Care Guide */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ClipboardList className="w-5 h-5 text-teal-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Steps to Take Care of the Wound
              </h3>
              <p className="text-[11px] text-slate-500">
                Evidence-based dressing application & home wound hygiene protocol
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
            {clinicalCareSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span className="text-[11px]">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Standard Medical Procedures (Clinician / Hospital Protocol) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Stethoscope className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Standard Medical Procedures (EWMA & TIME Framework)
              </h3>
              <p className="text-[11px] text-slate-500">
                Clinical wound bed preparation guidelines for pharmacy & nursing practice
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
            {standardMedicalProcedures.map((proc, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100/60">
                <ChevronRight className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span className="text-[11px]">{proc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
