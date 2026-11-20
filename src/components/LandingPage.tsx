import React from 'react';
import {
  Sparkles,
  Activity,
  HeartPulse,
  Sliders,
  BarChart3,
  CheckCircle2,
  FileText,
  QrCode,
  ShieldCheck,
  Award,
  Users,
  School,
  ArrowRight,
  Droplets,
  Layers,
  FlaskConical,
  Eye,
  Camera,
  Wifi,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface LandingPageProps {
  onLaunchApp: (tab?: string) => void;
  onOpenCollegeConnect: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchApp,
  onOpenCollegeConnect,
}) => {
  const teamMembers = [
    {
      name: 'Chetan Bhagwat Wankhede',
      role: 'Founder & Lead Project Researcher',
      badge: 'Founder',
      badgeColor: 'bg-teal-500/10 text-teal-700 border-teal-300',
      initials: 'CW',
      focus: 'Project Architecture, Camera Colorimetry Engine & Software Development',
    },
    {
      name: 'Tejas Sampat Kedar',
      role: 'Co-Founder & Formulation Specialist',
      badge: 'Co-Founder',
      badgeColor: 'bg-indigo-500/10 text-indigo-700 border-indigo-300',
      initials: 'TK',
      focus: 'Gelatin/Alginate Biopolymer Matrix Formulation & Crosslinking Optimization',
    },
    {
      name: 'Bhushan Vilas Phate',
      role: 'Project Member & Analytical Chemistry',
      badge: 'Member',
      badgeColor: 'bg-slate-500/10 text-slate-700 border-slate-300',
      initials: 'BP',
      focus: 'Natural Anthocyanin Extraction, Buffer Preparation & Standardization',
    },
    {
      name: 'Athrava Ajay Ghursade',
      role: 'Project Member & Validation Methodology',
      badge: 'Member',
      badgeColor: 'bg-slate-500/10 text-slate-700 border-slate-300',
      initials: 'AG',
      focus: 'Benchtop pH Meter Benchmarking, Repeatability Testing & Statistical Analysis',
    },
    {
      name: 'Dipak Babasaheb Sangle',
      role: 'Project Member & Clinical Documentation',
      badge: 'Member',
      badgeColor: 'bg-slate-500/10 text-slate-700 border-slate-300',
      initials: 'DS',
      focus: 'TIME Wound Framework, Exudate Moisture Dynamics & Regulatory Research',
    },
  ];

  const features = [
    {
      icon: Camera,
      title: 'Live Optical Colorimetry',
      desc: 'Real-time camera feed with adjustable circular target reticle (ROI) and pixel averaging to eliminate ambient camera sensor noise.',
      tab: 'scanner',
      color: 'text-teal-600 bg-teal-50 border-teal-200',
    },
    {
      icon: Sliders,
      title: 'Dual-Engine pH Estimation',
      desc: 'Continuous piecewise interpolation in CIELAB color space for exact fractional pH values (e.g., pH 6.85) plus nearest-reference buffer matching.',
      tab: 'calibration',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      icon: HeartPulse,
      title: 'Clinical Wound Diagnostics',
      desc: 'Biochemical wound state categorization, exudate moisture assessment (TIME framework), and prognostic recovery timeframe estimation.',
      tab: 'woundCare',
      color: 'text-rose-600 bg-rose-50 border-rose-200',
    },
    {
      icon: BarChart3,
      title: 'Scientific Data Analytics',
      desc: 'Interactive SVG curves displaying pH vs. Hue angle shifts, RGB transmittance channels (0–255), and time-course kinetic degradation.',
      tab: 'visualize',
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      icon: CheckCircle2,
      title: 'Lab pH Meter Benchmarking',
      desc: 'Compare optical estimates against calibrated glass-electrode benchtop pH meters to calculate $\\Delta\\text{pH}$, MAE, RMSE, and $R^2$.',
      tab: 'validation',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      icon: QrCode,
      title: 'Petri Dish QR Identification',
      desc: 'Printable QR code generator for sample petri dishes and test tubes, coupled with live camera QR scanning to auto-fill sample metadata.',
      tab: 'history',
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
  ];

  return (
    <div className="space-y-16 py-4">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-8 sm:p-14 shadow-2xl border border-teal-500/20">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Institutional Header Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-teal-200 font-medium">
            <School className="w-4 h-4 text-teal-300" />
            <span>Sinhgad Institute of Pharmaceutical Sciences, Lonavala</span>
            <span className="hidden sm:inline text-white/40">&bull;</span>
            <span className="hidden sm:inline text-slate-300">B.Pharm Final Year Capstone Project</span>
          </div>

          {/* Title */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              GelScan <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-200 to-indigo-300">v2.0 PRO</span>
            </h1>
            <p className="text-base sm:text-xl font-semibold text-teal-100 max-w-3xl mx-auto">
              Smart Gelatin/Alginate pH Analyzer for Colorimetric Wound Dressing Films
            </p>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            An affordable, scientifically-calibrated digital health platform that analyzes natural anthocyanin-loaded gelatin/alginate films via digital camera colorimetry, estimating wound bed pH, evaluating exudate moisture balance, and predicting clinical recovery timelines.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onLaunchApp('scanner')}
              className="px-6 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-teal-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Activity className="w-4 h-4" />
              <span>Launch Live Film Scanner</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onLaunchApp('woundCare')}
              className="px-5 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-xl text-xs sm:text-sm font-semibold backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <HeartPulse className="w-4 h-4 text-rose-400" />
              <span>Wound Care & Recovery</span>
            </button>

            <button
              onClick={onOpenCollegeConnect}
              className="px-5 py-3.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Wifi className="w-4 h-4 text-emerald-300" />
              <span>Connect Mobile (Campus Wi-Fi)</span>
            </button>
          </div>

          {/* Key Metrics Banner */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
              <span className="text-[10px] text-teal-300 uppercase font-mono block">pH Range</span>
              <strong className="text-base sm:text-lg font-bold text-white block mt-0.5">1.0 – 12.0</strong>
              <span className="text-[10px] text-slate-400">USP/IP Buffer Calibrated</span>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
              <span className="text-[10px] text-teal-300 uppercase font-mono block">Color Space</span>
              <strong className="text-base sm:text-lg font-bold text-white block mt-0.5">RGB / CIELAB</strong>
              <span className="text-[10px] text-slate-400">&Delta;E Perceptual Match</span>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
              <span className="text-[10px] text-teal-300 uppercase font-mono block">Indicator</span>
              <strong className="text-base sm:text-lg font-bold text-white block mt-0.5">Anthocyanin</strong>
              <span className="text-[10px] text-slate-400">Natural Red Cabbage</span>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
              <span className="text-[10px] text-teal-300 uppercase font-mono block">Clinical Standard</span>
              <strong className="text-base sm:text-lg font-bold text-white block mt-0.5">TIME / EWMA</strong>
              <span className="text-[10px] text-slate-400">Wound Bed Preparation</span>
            </div>
          </div>
        </div>
      </section>

      {/* SCIENTIFIC PRINCIPLE & WOUND BIOCHEMISTRY */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="max-w-3xl">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">
            Pharmaceutical Science & Chemistry
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            How the pH-Sensitive Gelatin/Alginate Film Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            In chronic wounds such as diabetic foot ulcers, alkaline proteases and bacterial proliferation shift the wound bed from physiological acidity (pH 5.5–6.5) to alkaline pH levels (7.3–8.9). GelScan pairs natural anthocyanin chromophores with digital image processing to detect these shifts without touching the sensitive wound bed.
          </p>
        </div>

        {/* Visual Chemical Ladder */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Acidic */}
          <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-800">Acidic Phase (pH 1.0 – 5.5)</span>
              <span className="w-4 h-4 rounded-full bg-red-600 shadow-xs" />
            </div>
            <strong className="text-sm font-bold text-red-950 block">
              Flavylium Cation (Bright Red / Pink)
            </strong>
            <p className="text-xs text-red-900 leading-relaxed">
              Normal skin acid mantle and acute healing granulation. Suppresses destructive MMP proteases and fosters cellular mitosis.
            </p>
          </div>

          {/* Neutral */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-800">Neutral Transition (pH 6.0 – 7.2)</span>
              <span className="w-4 h-4 rounded-full bg-purple-600 shadow-xs" />
            </div>
            <strong className="text-sm font-bold text-purple-950 block">
              Quinoidal Base (Purple / Violet)
            </strong>
            <p className="text-xs text-purple-900 leading-relaxed">
              Active healing wound exudate and angiogenesis. Balanced fibroblast proliferation and collagen scaffold deposition.
            </p>
          </div>

          {/* Alkaline */}
          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-800">Alkaline Stalled (pH 7.4 – 8.9+)</span>
              <span className="w-4 h-4 rounded-full bg-teal-600 shadow-xs" />
            </div>
            <strong className="text-sm font-bold text-teal-950 block">
              Anionic Species (Teal / Emerald Green)
            </strong>
            <p className="text-xs text-teal-900 leading-relaxed">
              Chronic stalled wound bed. Severe MMP-2/9 breakdown and elevated bacterial biofilm risk (P. aeruginosa / S. aureus).
            </p>
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block">
            System Capabilities
          </span>
          <h2 className="text-xl sm:text-3xl font-bold text-slate-900">
            End-to-End Digital Film Analysis Architecture
          </h2>
          <p className="text-xs text-slate-500">
            Engineered to meet rigorous scientific criteria for B.Pharm final-year evaluation and viva demonstration.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                onClick={() => onLaunchApp(feat.tab)}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${feat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-600 group-hover:text-teal-700">
                  <span>Open Module</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* RESEARCH TEAM & INSTITUTION SECTION */}
      <section className="bg-gradient-to-br from-slate-50 to-teal-50/40 rounded-3xl border border-teal-200/60 p-8 sm:p-12 shadow-sm space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold border border-teal-200">
            <Users className="w-3.5 h-3.5" />
            <span>Research Team & Authors</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Sinhgad Institute of Pharmaceutical Sciences, Lonavala
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Department of Pharmaceutics & Biomaterials &bull; B. Pharmacy Final Year Research Capstone
          </p>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-slate-800 text-white font-mono font-bold flex items-center justify-center text-sm shadow-xs">
                  {member.initials}
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${member.badgeColor}`}>
                  {member.badge}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {member.name}
                </h3>
                <span className="text-[11px] font-semibold text-teal-700 block mt-0.5">
                  {member.role}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                  Research Focus
                </span>
                <p className="text-xs text-slate-600 leading-snug">
                  {member.focus}
                </p>
              </div>
            </div>
          ))}

          {/* Academic Accreditation Box */}
          <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-300 uppercase tracking-wider mb-1">
                <Award className="w-4 h-4" />
                <span>Academic Affiliation</span>
              </div>
              <h3 className="text-sm font-bold text-white leading-tight">
                Sinhgad Institute of Pharmaceutical Sciences (SIPS)
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Gat No. 309/310, Kusgaon (Bk.), Off Mumbai-Pune Expressway, Lonavala, Maharashtra 410401
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 text-[11px] text-teal-200 font-mono">
              Final Year B.Pharm &bull; Academic Year 2025–2026
            </div>
          </div>
        </div>
      </section>

      {/* PATENTABILITY & INTELLECTUAL PROPERTY GOALS */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">
            Patent & Intellectual Property (IP) Status
          </h3>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
          Camera-based wound pH monitoring and color-changing dressings are recognized areas of prior art. GelScan focuses on patentable novelty in: 
          <strong> (1)</strong> specific stoichiometry and crosslinking of gelatin-alginate-anthocyanin to prevent dye leaching in wound fluid, 
          <strong> (2)</strong> non-thermal casting to prevent anthocyanin degradation, and 
          <strong> (3)</strong> an integrated continuous piecewise interpolation algorithm coupled with reference white-card lighting normalization.
        </p>

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
          <BookOpen className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <strong>Academic Integrity Notice:</strong> GelScan is an experimental optical research tool developed for B.Pharm pharmaceutical research. Colorimetric estimations are derived from digital image analysis and must not be used for direct clinical diagnosis without formal validation.
          </div>
        </div>
      </section>
    </div>
  );
};
