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
