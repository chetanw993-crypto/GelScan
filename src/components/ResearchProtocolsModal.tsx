import React from 'react';
import {
  BookOpen,
  Award,
  FlaskConical,
  ShieldAlert,
  Search,
  CheckCircle2,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';

export const ResearchProtocolsModal: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900">
              B.Pharm Final-Year Research Hub & Patent Guide
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Standard laboratory preparation protocols, experimental validation requirements, and Indian patent prior-art evaluation checklist for the GelScan project.
          </p>
        </div>

        <div className="bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-600" />
          <span>Academic Research Project</span>
        </div>
      </div>

      {/* Grid of Protocols */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Film Formulation Protocol */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <FlaskConical className="w-4 h-4 text-teal-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              1. Film Formulation & Preparation Protocol
            </h3>
          </div>

          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              <strong>Biopolymer Matrix:</strong> Pharmaceutical-grade Gelatin (Type B, 4-6% w/v) and Sodium Alginate (1-2% w/v) dissolved in deionized water at 55-60°C under continuous magnetic stirring.
            </p>
            <p>
              <strong>Plasticizer:</strong> Glycerol (1.5-2.0% v/v) added to impart mechanical flexibility, tensile strength, and skin conformability without brittleness.
            </p>
            <p>
              <strong>Natural Anthocyanin Extraction:</strong> Aqueous extraction from Red Cabbage (Brassica oleracea var. capitata f. rubra) acidified with 0.1% citric acid, filtered and concentrated.
            </p>
            <p>
              <strong>Film Casting:</strong> Degassed solution poured into polystyrene petri dishes (film thickness target: 0.20 – 0.35 mm) and dried at 37°C for 24 hours under controlled humidity.
            </p>
          </div>
        </div>

        {/* Section 2: Required Scientific Validation Experiments */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              2. Scientific Validation Experiments
            </h3>
          </div>

          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <ul className="space-y-1.5 list-disc list-inside">
              <li>
                <strong>Buffer Solution Calibration:</strong> Expose film patches to certified USP/IP buffers (pH 2.0 to 11.0) and record stabilized RGB values.
              </li>
              <li>
                <strong>Benchmarking with pH Meter:</strong> Correlate colorimetric pH estimates against calibrated glass-electrode benchtop pH meter to establish MAE & RMSE.
              </li>
              <li>
                <strong>Color Repeatability:</strong> Sample 5 independent films from the same batch to assess inter-sample coefficient of variation (CV &lt; 5%).
              </li>
              <li>
                <strong>Lighting & Lux Evaluation:</strong> Measure color response under daylight, 4000K LED, and warm incandescent light using the white-balance reference card.
              </li>
              <li>
                <strong>Swelling & Exudate Absorption:</strong> Measure fluid uptake and anthocyanin retention in simulated wound fluid (SWF).
              </li>
            </ul>
          </div>
        </div>

        {/* Section 3: Patent & Intellectual Property Goals */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Search className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              3. Patent & Prior Art Guidelines
            </h3>
          </div>

          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-900 font-medium">
              Important: Camera-based wound pH monitoring and colour-changing dressings are known areas of prior art. Do not assume the basic concept is novel without thorough patent searches!
            </p>
            <p>
              <strong>Potential Patentable Claims:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Specific gelatin-alginate-anthocyanin stoichiometry and cross-linking stability.</li>
              <li>Novel film preparation avoiding anthocyanin thermal degradation during drying.</li>
              <li>Integrated continuous piecewise interpolation algorithm coupled with white-card lighting correction.</li>
            </ul>
            <p>
              <strong>Indian Patent Office (IPO) & WIPO Search Terms:</strong>
              <code className="block bg-slate-100 p-1.5 rounded text-[11px] font-mono mt-1 text-slate-800">
                "gelatin alginate wound dressing" AND "anthocyanin pH sensor" AND "colorimetric camera calibration"
              </code>
            </p>
          </div>
        </div>

        {/* Section 4: Academic Integrity & Non-Diagnostic Rules */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              4. Important Development Rules & Disclaimers
            </h3>
          </div>

          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Preserve Existing Features:</strong> Keep live camera scanning, gallery image upload, and CSV export intact across all devices.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Do Not Invent Experimental Results:</strong> Default calibration points are based on published literature and must be verified in the college lab.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Distinguish Estimated vs Validated:</strong> Colorimetric predictions are labeled as "Estimated pH" until verified by glass-electrode benchmark.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>No Clinical Claims:</strong> Never state that this software diagnoses wound infections or replaces clinical microbiological testing.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
