export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSV {
  h: number; // 0 - 360
  s: number; // 0 - 100%
  v: number; // 0 - 100%
}

export interface CIELAB {
  l: number; // 0 - 100
  a: number; // -128 to 127
  b: number; // -128 to 127
}

export interface ColorData {
  rgb: RGB;
  hsv: HSV;
  lab: CIELAB;
  hex: string;
  colorName: string;
  isNormalized?: boolean;
}

export interface CalibrationPoint {
  id: string;
  pH: number;
  rgb: RGB;
  hsv: HSV;
  hex: string;
  bufferName: string;
  description?: string;
  isDefault?: boolean;
  updatedAt: string;
}

export type MoistureLevel = 'dry' | 'optimal' | 'maceration_risk';

export type WoundStatePhase =
  | 'acidic_remodeling'
  | 'active_granulation'
  | 'inflammatory_transition'
  | 'chronic_stalled'
  | 'alkaline_biofilm_risk';

export interface WoundMedicalAnalysis {
  phase: WoundStatePhase;
  phaseTitle: string;
  biologicalDescription: string;
  moistureLevel: MoistureLevel;
  moistureDescription: string;
  estimatedRecoveryTime: string; // e.g. "7 - 14 Days (Optimal Acute Healing)"
  healingTrajectory: 'Optimal' | 'Favorable' | 'Mildly Delayed' | 'Stalled / Chronic' | 'Severe / Biofilm Risk';
  biochemicalStatus: {
    mmpProteaseActivity: 'Low (Favorable)' | 'Normal' | 'Elevated (Tissue Degrading)' | 'Severe Matrix Breakdown';
    bacterialBiofilmRisk: 'Minimal' | 'Low' | 'Moderate' | 'High / Pathogenic Colonization';
    angiogenesisStatus: 'Active & Favorable' | 'Steady' | 'Impaired' | 'Inhibited';
  };
  clinicalCareSteps: string[];
  standardMedicalProcedures: string[];
  redFlagWarnings: string[];
}

export interface SampleRecord {
  id: string;
  sampleId: string;
  batchNumber: string;
  timestamp: string;
  timePoint: string; // e.g. "0 min", "15 min", "30 min", "1 hr", "2 hr"
  filmThicknessMm?: number;
  operatorName: string;
  estimatedPH: number;
  estimationMethod: 'nearest' | 'interpolated';
  nearestReferencePH: number;
  nearestReferenceBuffer: string;
  deltaE: number; // CIELAB deltaE distance
  confidenceScore: number; // 0 - 100%
  color: ColorData;
  source: 'camera' | 'gallery' | 'whatsapp';
  actualLabPH?: number; // Validated lab glass electrode pH
  phError?: number; // estimatedPH - actualLabPH
  errorPercentage?: number; // (|phError| / actualLabPH) * 100
  notes?: string;
  imageDataUrl?: string; // thumbnail / snapshot
  medicalAnalysis?: WoundMedicalAnalysis;
}

export interface WhiteReference {
  r: number;
  g: number;
  b: number;
  isActive: boolean;
  calibratedAt?: string;
}

export interface ValidationSummary {
  totalCount: number;
  mae: number; // Mean Absolute Error
  rmse: number; // Root Mean Square Error
  meanPercentageError: number;
  rSquared?: number;
  maxError: number;
}
