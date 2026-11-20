import { CalibrationPoint, SampleRecord, WhiteReference } from '../types/gelscan';
import { DEFAULT_CALIBRATION_POINTS } from './defaultCalibration';

const STORAGE_KEYS = {
  SAMPLES: 'gelscan_sample_history_v2',
  CALIBRATION: 'gelscan_calibration_set_v2',
  WHITE_REF: 'gelscan_white_reference_v2',
  SETTINGS: 'gelscan_lab_settings_v2',
};

export interface LabSettings {
  collegeName: string;
  department: string;
  projectGuide: string;
  defaultOperator: string;
  defaultBatchPrefix: string;
  estimationMode: 'interpolated' | 'nearest';
  enableWhiteCorrection: boolean;
}

export const DEFAULT_SETTINGS: LabSettings = {
  collegeName: 'Sinhgad Institute of Pharmaceutical Sciences, Lonavala',
  department: 'Department of Pharmaceutics & Biomaterials Research',
  projectGuide: 'Faculty Research Supervisor',
  defaultOperator: 'Chetan Bhagwat Wankhede',
  defaultBatchPrefix: 'GA-ANTH-',
  estimationMode: 'interpolated',
  enableWhiteCorrection: false,
};

export function loadSamples(): SampleRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAMPLES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load sample history from localStorage', err);
    return [];
  }
}

export function saveSamples(samples: SampleRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SAMPLES, JSON.stringify(samples));
  } catch (err) {
    console.error('Failed to save sample history to localStorage', err);
  }
}

export function addSampleRecord(sample: SampleRecord): SampleRecord[] {
  const current = loadSamples();
  const updated = [sample, ...current];
  saveSamples(updated);
  return updated;
}

export function deleteSampleRecord(id: string): SampleRecord[] {
  const current = loadSamples();
  const updated = current.filter(s => s.id !== id);
  saveSamples(updated);
  return updated;
}

export function updateSampleLabValidation(
  id: string,
  actualLabPH: number
): SampleRecord[] {
  const current = loadSamples();
  const updated = current.map(s => {
    if (s.id === id) {
      const phError = parseFloat((s.estimatedPH - actualLabPH).toFixed(2));
      const errorPercentage = actualLabPH !== 0
        ? parseFloat(((Math.abs(phError) / actualLabPH) * 100).toFixed(2))
        : 0;
      return {
        ...s,
        actualLabPH,
        phError,
        errorPercentage,
      };
    }
    return s;
  });
  saveSamples(updated);
  return updated;
}

export function loadCalibrationPoints(): CalibrationPoint[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CALIBRATION);
    if (!raw) {
      // First time initialization with default points
      saveCalibrationPoints(DEFAULT_CALIBRATION_POINTS);
      return DEFAULT_CALIBRATION_POINTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CALIBRATION_POINTS;
  } catch (err) {
    console.error('Failed to load calibration set', err);
    return DEFAULT_CALIBRATION_POINTS;
  }
}

export function saveCalibrationPoints(points: CalibrationPoint[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CALIBRATION, JSON.stringify(points));
  } catch (err) {
    console.error('Failed to save calibration set', err);
  }
}

export function resetCalibrationToDefault(): CalibrationPoint[] {
  saveCalibrationPoints(DEFAULT_CALIBRATION_POINTS);
  return DEFAULT_CALIBRATION_POINTS;
}

export function loadWhiteReference(): WhiteReference | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WHITE_REF);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveWhiteReference(ref: WhiteReference | null): void {
  try {
    if (ref) {
      localStorage.setItem(STORAGE_KEYS.WHITE_REF, JSON.stringify(ref));
    } else {
      localStorage.removeItem(STORAGE_KEYS.WHITE_REF);
    }
  } catch (err) {
    console.error('Failed to save white reference', err);
  }
}

export function loadLabSettings(): LabSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    // If collegeName was the old placeholder, upgrade it to Sinhgad Institute of Pharmaceutical Sciences, Lonavala
    if (parsed.collegeName === 'B.Pharm College of Pharmacy & Technology') {
      parsed.collegeName = DEFAULT_SETTINGS.collegeName;
    }
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveLabSettings(settings: LabSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save lab settings', err);
  }
}
