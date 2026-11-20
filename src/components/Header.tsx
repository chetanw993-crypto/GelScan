import React from 'react';
import {
  Activity,
  Sliders,
  BarChart3,
  CheckCircle2,
  History,
  BookOpen,
  Wifi,
  Settings,
  Sparkles,
  Layers,
  HeartPulse,
  Home,
} from 'lucide-react';
import { LabSettings } from '../utils/storage';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sampleCount: number;
  labSettings: LabSettings;
  onOpenSettings: () => void;
  onOpenCollegeConnect: () => void;
  onOpenComparison: () => void;
  selectedCompareCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  sampleCount,
  labSettings,
  onOpenSettings,
  onOpenCollegeConnect,
  onOpenComparison,
  selectedCompareCount,
}) => {
  const navTabs = [
    { id: 'home', label: 'Overview & Team', icon: Home },
    { id: 'scanner', label: 'Scanner & Analysis', icon: Activity },
    { id: 'woundCare', label: 'Wound Care & Recovery', icon: HeartPulse },
    { id: 'calibration', label: 'Calibration Matrix', icon: Sliders },
    { id: 'visualize', label: 'Research Analytics', icon: BarChart3 },
    { id: 'validation', label: 'Lab Validation', icon: CheckCircle2 },
    { id: 'history', label: `Sample Log (${sampleCount})`, icon: History },
    { id: 'research', label: 'B.Pharm Hub & Patent', icon: BookOpen },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Academic & College Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-cyan-900 to-slate-900 text-white px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-teal-500/30 text-teal-200 px-2 py-0.5 rounded font-mono font-semibold tracking-wider text-[11px] border border-teal-400/30">
              B.PHARM FINAL YEAR
            </span>
            <span className="font-medium text-slate-200 truncate max-w-md">
              {labSettings.collegeName} &bull; {labSettings.department}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCollegeConnect}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-1 rounded text-xs font-semibold shadow-xs transition-all animate-pulse"
              title="Connect mobile phones on college WiFi"
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>College Lab Mobile Connect</span>
            </button>

            {selectedCompareCount >= 2 && (
              <button
                onClick={onOpenComparison}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded text-xs font-medium"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Compare ({selectedCompareCount})</span>
              </button>
            )}

            <button
              onClick={onOpenSettings}
              className="text-slate-300 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
              title="Lab Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Title & Nav Tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-3 pb-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  GelScan
                </h1>
                <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-200">
                  v2.0 PRO
                </span>
                <span className="hidden sm:inline-block text-xs text-slate-500 font-medium">
                  Smart Gelatin/Alginate pH Analyzer
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Sinhgad Institute of Pharmaceutical Sciences, Lonavala
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            {navTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 border border-teal-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
