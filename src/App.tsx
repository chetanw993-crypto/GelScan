import React, { useState, useMemo, useCallback } from 'react';
import {
  Camera,
  Image as ImageIcon,
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { CalibrationPoint, ColorData, SampleRecord, WhiteReference } from './types/gelscan';
import {
  estimatePHInterpolated,
  estimatePHNearest,
  EstimationResult,
} from './utils/calibrationEngine';
import {
  addSampleRecord,
  deleteSampleRecord,
  loadCalibrationPoints,
  loadLabSettings,
  loadSamples,
  loadWhiteReference,
  resetCalibrationToDefault,
  saveCalibrationPoints,
  saveLabSettings,
  saveWhiteReference,
  updateSampleLabValidation,
  LabSettings,
} from './utils/storage';
import { analyzeWoundHealth } from './utils/woundAnalysisEngine';

import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { CameraScanner } from './components/CameraScanner';
import { GalleryUploader } from './components/GalleryUploader';
import { ColorAnalysisCard } from './components/ColorAnalysisCard';
import { PHEstimateCard } from './components/PHEstimateCard';
import { SampleMetaForm } from './components/SampleMetaForm';
import { CalibrationManager } from './components/CalibrationManager';
import { DataVisualizer } from './components/DataVisualizer';
import { LabValidationModal } from './components/LabValidationModal';
import { SampleHistoryTable } from './components/SampleHistoryTable';
import { QRManagerModal } from './components/QRManagerModal';
import { CollegeConnectModal } from './components/CollegeConnectModal';
import { SampleComparisonModal } from './components/SampleComparisonModal';
import { ResearchProtocolsModal } from './components/ResearchProtocolsModal';
import { LabSettingsModal } from './components/LabSettingsModal';
import { WoundMedicalAnalysisView } from './components/WoundMedicalAnalysisView';

export function App() {
  // Navigation & Modals: default to 'home' landing page so visitors and examiners see the full project showcase first!
  const [activeTab, setActiveTab] = useState<string>('home');
  const [scannerSource, setScannerSource] = useState<'camera' | 'gallery'>('camera');
  const [isCollegeConnectOpen, setIsCollegeConnectOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState<boolean>(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState<boolean>(false);

  // Persistence State
  const [samples, setSamples] = useState<SampleRecord[]>(() => loadSamples());
  const [calibrationPoints, setCalibrationPoints] = useState<CalibrationPoint[]>(() =>
    loadCalibrationPoints()
  );
  const [whiteRef, setWhiteRef] = useState<WhiteReference | null>(() => loadWhiteReference());
  const [labSettings, setLabSettings] = useState<LabSettings>(() => loadLabSettings());

  // Current Live Sample & Analysis
  const [currentColor, setCurrentColor] = useState<ColorData | null>(null);
  const [currentSnapshot, setCurrentSnapshot] = useState<string | undefined>(undefined);
  const [estimationMode, setEstimationMode] = useState<'interpolated' | 'nearest'>(
    labSettings.estimationMode || 'interpolated'
  );
  const [isWhiteCalibrationMode, setIsWhiteCalibrationMode] = useState<boolean>(false);

  // Multi-Sample Selection for Comparison
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);

  // Calculate pH Estimation based on current color & calibration points
  const estimation: EstimationResult | null = useMemo(() => {
    if (!currentColor || calibrationPoints.length === 0) return null;
    try {
      if (estimationMode === 'nearest') {
        return estimatePHNearest(currentColor, calibrationPoints);
      }
      return estimatePHInterpolated(currentColor, calibrationPoints);
    } catch (err) {
      console.warn('Estimation calculation error', err);
      return null;
    }
  }, [currentColor, calibrationPoints, estimationMode]);

  // Color Sampled Handler
  const handleColorSampled = useCallback((color: ColorData, snapshot?: string) => {
    setCurrentColor(color);
    if (snapshot) {
      setCurrentSnapshot(snapshot);
    }
  }, []);

  // Set / Clear White Reference
  const handleSetWhiteRef = (ref: WhiteReference | null) => {
    setWhiteRef(ref);
    saveWhiteReference(ref);
  };

  // Save new sample
  const handleSaveSample = (newSample: SampleRecord) => {
    const medAnalysis = analyzeWoundHealth(
      newSample.estimatedPH,
      'optimal',
      newSample.filmThicknessMm || 0.25
    );
    const sampleWithMedical = {
      ...newSample,
      medicalAnalysis: medAnalysis,
    };

    const updated = addSampleRecord(sampleWithMedical);
    setSamples(updated);

    // Confetti effect when sample is recorded!
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#0d9488', '#0284c7', '#6366f1'],
    });
  };

  // Delete sample
  const handleDeleteSample = (id: string) => {
    const updated = deleteSampleRecord(id);
    setSamples(updated);
    setSelectedCompareIds(prev => prev.filter(item => item !== id));
  };

  // Update Lab Validation
  const handleUpdateValidation = (sampleId: string, actualLabPH: number) => {
    const updated = updateSampleLabValidation(sampleId, actualLabPH);
    setSamples(updated);
    alert('Laboratory glass-electrode pH measurement benchmarked successfully!');
  };

  // Update Calibration Points
  const handleUpdateCalibrationPoints = (points: CalibrationPoint[]) => {
    setCalibrationPoints(points);
    saveCalibrationPoints(points);
  };

  // Reset Calibration to literature default
  const handleResetCalibration = () => {
    if (confirm('Reset calibration matrix back to literature default Anthocyanin pH references (pH 2 - 11)?')) {
      const def = resetCalibrationToDefault();
      setCalibrationPoints(def);
    }
  };

  // Save Lab Settings
  const handleSaveSettings = (settings: LabSettings) => {
    setLabSettings(settings);
    setEstimationMode(settings.estimationMode);
    saveLabSettings(settings);
  };

  // Toggle sample comparison
  const handleToggleCompare = (id: string) => {
    setSelectedCompareIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= 4) {
        alert('You can compare a maximum of 4 samples side-by-side.');
        return prev;
      }
      return [...prev, id];
    });
  };

  // Selected comparison objects
  const comparedSamples = samples.filter(s => selectedCompareIds.includes(s.id));

  // QR Decoded Handler
  const handleQRDecoded = (sampleData: {
    sampleId?: string;
    batchNumber?: string;
    filmThicknessMm?: number;
    notes?: string;
  }) => {
    alert(
      `Petri Dish QR Detected!\nSample: ${sampleData.sampleId || 'N/A'}\nBatch: ${sampleData.batchNumber || 'N/A'}`
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sampleCount={samples.length}
        labSettings={labSettings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenCollegeConnect={() => setIsCollegeConnectOpen(true)}
        onOpenComparison={() => setIsComparisonModalOpen(true)}
        selectedCompareCount={selectedCompareIds.length}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* TAB 0: LANDING PAGE & TEAM SHOWCASE */}
        {activeTab === 'home' && (
          <LandingPage
            onLaunchApp={tab => setActiveTab(tab || 'scanner')}
            onOpenCollegeConnect={() => setIsCollegeConnectOpen(true)}
          />
        )}

        {/* TAB 1: SCANNER & ANALYSIS */}
        {activeTab === 'scanner' && (
          <div className="space-y-6">
            {/* Source Switcher: Live Camera vs Gallery/WhatsApp */}
            <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setScannerSource('camera')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    scannerSource === 'camera'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>Live Camera Feed</span>
                </button>

                <button
                  onClick={() => setScannerSource('gallery')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    scannerSource === 'gallery'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Gallery & WhatsApp Upload</span>
                </button>
              </div>

              {/* White Reference Status Pill */}
              <div className="hidden sm:flex items-center gap-2 pr-2">
                {whiteRef && whiteRef.isActive ? (
                  <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    White Reference Active
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    Standard D65 Illuminant
                  </span>
                )}
              </div>
            </div>

            {/* Top Grid: Scanner on Left, Analysis Cards on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Visual Capture */}
              <div className="lg:col-span-7 space-y-6">
                {scannerSource === 'camera' ? (
                  <CameraScanner
                    onColorSampled={handleColorSampled}
                    whiteRef={whiteRef}
                    onSetWhiteRef={handleSetWhiteRef}
                    isWhiteCalibrationMode={isWhiteCalibrationMode}
                    setIsWhiteCalibrationMode={setIsWhiteCalibrationMode}
                  />
                ) : (
                  <GalleryUploader
                    onColorSampled={handleColorSampled}
                    whiteRef={whiteRef}
                  />
                )}

                {/* Sample Identification & Metadata Form */}
                <SampleMetaForm
                  color={currentColor}
                  estimation={estimation}
                  estimationMode={estimationMode}
                  source={scannerSource === 'camera' ? 'camera' : 'gallery'}
                  snapshotDataUrl={currentSnapshot}
                  onSaveSample={handleSaveSample}
                  onOpenQRScanner={() => setIsQRModalOpen(true)}
                  labSettings={labSettings}
                />
              </div>

              {/* Right Column: Real-time Chemical & pH Analysis */}
              <div className="lg:col-span-5 space-y-6">
                {/* pH Estimation Card */}
                <PHEstimateCard
                  estimation={estimation}
                  estimationMode={estimationMode}
                  setEstimationMode={setEstimationMode}
                  onViewWoundCare={() => setActiveTab('woundCare')}
                />

                {/* Colorimetric RGB/HSV/CIELAB Breakdown Card */}
                <ColorAnalysisCard color={currentColor} />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WOUND CARE & MEDICAL RECOVERY */}
        {activeTab === 'woundCare' && (
          <WoundMedicalAnalysisView
            currentPH={estimation?.estimatedPH ?? null}
            filmThicknessMm={0.25}
          />
        )}

        {/* TAB 3: CALIBRATION MATRIX */}
        {activeTab === 'calibration' && (
          <CalibrationManager
            calibrationPoints={calibrationPoints}
            onUpdateCalibrationPoints={handleUpdateCalibrationPoints}
            onResetToDefault={handleResetCalibration}
            currentColor={currentColor}
          />
        )}

        {/* TAB 4: DATA VISUALIZER & CURVES */}
        {activeTab === 'visualize' && (
          <DataVisualizer
            calibrationPoints={calibrationPoints}
            samples={samples}
          />
        )}

        {/* TAB 5: LAB VALIDATION BENCHMARK */}
        {activeTab === 'validation' && (
          <LabValidationModal
            samples={samples}
            onUpdateValidation={handleUpdateValidation}
          />
        )}

        {/* TAB 6: SAMPLE HISTORY & EXPORT */}
        {activeTab === 'history' && (
          <SampleHistoryTable
            samples={samples}
            onDeleteSample={handleDeleteSample}
            onSelectForValidation={() => {
              setActiveTab('validation');
            }}
            selectedCompareIds={selectedCompareIds}
            onToggleCompare={handleToggleCompare}
            labSettings={labSettings}
            calibrationSet={calibrationPoints}
          />
        )}

        {/* TAB 7: B.PHARM RESEARCH HUB & PATENT GUIDE */}
        {activeTab === 'research' && <ResearchProtocolsModal />}
      </main>

      {/* MODALS */}
      <QRManagerModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        onQRDecoded={handleQRDecoded}
      />

      <CollegeConnectModal
        isOpen={isCollegeConnectOpen}
        onClose={() => setIsCollegeConnectOpen(false)}
      />

      <SampleComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        selectedSamples={comparedSamples}
      />

      <LabSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={labSettings}
        onSaveSettings={handleSaveSettings}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left space-y-0.5">
            <span className="font-bold text-slate-800 block">
              GelScan v2.0 PRO &bull; Smart Gelatin/Alginate pH Analyzer
            </span>
            <span className="text-[11px] text-slate-500 block">
              Sinhgad Institute of Pharmaceutical Sciences (SIPS), Lonavala &bull; B.Pharm Final Year Capstone Project
            </span>
          </div>

          <div className="text-right text-[11px] text-slate-400">
            Founded by Chetan Wankhede, Tejas Kedar, Bhushan Phate, Athrava Ghursade, Dipak Sangle
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
