import { CalibrationPoint, ColorData, ValidationSummary } from '../types/gelscan';
import { calculateDeltaE, calculateRgbDistance, rgbToLab } from './colorMath';

export interface EstimationResult {
  estimatedPH: number;
  method: 'nearest' | 'interpolated';
  nearestPoint: CalibrationPoint;
  deltaE: number;
  confidenceScore: number;
  qualityRating: 'Excellent' | 'Good' | 'Moderate' | 'Low / Uncertain';
  secondNearestPoint?: CalibrationPoint;
}

/**
 * Estimate pH using nearest calibration point (CIELAB Delta E)
 */
export function estimatePHNearest(
  color: ColorData,
  calibrationSet: CalibrationPoint[]
): EstimationResult {
  if (!calibrationSet || calibrationSet.length === 0) {
    throw new Error('No calibration reference points available');
  }

  const sampleLab = color.lab || rgbToLab(color.rgb.r, color.rgb.g, color.rgb.b);

  let bestPoint = calibrationSet[0];
  let minDeltaE = calculateDeltaE(sampleLab, rgbToLab(bestPoint.rgb.r, bestPoint.rgb.g, bestPoint.rgb.b));

  for (let i = 1; i < calibrationSet.length; i++) {
    const pt = calibrationSet[i];
    const ptLab = rgbToLab(pt.rgb.r, pt.rgb.g, pt.rgb.b);
    const dE = calculateDeltaE(sampleLab, ptLab);
    if (dE < minDeltaE) {
      minDeltaE = dE;
      bestPoint = pt;
    }
  }

  // Calculate confidence score from Delta E
  // Delta E = 0 -> 100% confidence
  // Delta E = 15 -> ~50% confidence
  // Delta E >= 28 -> 0% confidence
  const confidenceScore = Math.max(0, Math.min(100, Math.round(100 - minDeltaE * 3.5)));

  let qualityRating: 'Excellent' | 'Good' | 'Moderate' | 'Low / Uncertain' = 'Excellent';
  if (minDeltaE > 15) {
    qualityRating = 'Low / Uncertain';
  } else if (minDeltaE > 8) {
    qualityRating = 'Moderate';
  } else if (minDeltaE > 3) {
    qualityRating = 'Good';
  }

  return {
    estimatedPH: bestPoint.pH,
    method: 'nearest',
    nearestPoint: bestPoint,
    deltaE: parseFloat(minDeltaE.toFixed(2)),
    confidenceScore,
    qualityRating,
  };
}

/**
 * Estimate pH using Inverse Distance Weighted Interpolation between the closest reference points
 */
export function estimatePHInterpolated(
  color: ColorData,
  calibrationSet: CalibrationPoint[]
): EstimationResult {
  if (!calibrationSet || calibrationSet.length === 0) {
    throw new Error('No calibration reference points available');
  }

  if (calibrationSet.length === 1) {
    return estimatePHNearest(color, calibrationSet);
  }

  const sampleLab = color.lab || rgbToLab(color.rgb.r, color.rgb.g, color.rgb.b);

  // Compute Delta E for all calibration points
  const scored = calibrationSet.map(pt => {
    const ptLab = rgbToLab(pt.rgb.r, pt.rgb.g, pt.rgb.b);
    const dE = calculateDeltaE(sampleLab, ptLab);
    const rgbDist = calculateRgbDistance(color.rgb, pt.rgb);
    return { pt, dE, rgbDist };
  });

  // Sort by smallest Delta E
  scored.sort((a, b) => a.dE - b.dE);

  const nearest = scored[0];
  const second = scored[1];

  // If very close to nearest point (dE < 1.0), return nearest directly
  if (nearest.dE < 0.8) {
    const confidenceScore = Math.max(0, Math.min(100, Math.round(100 - nearest.dE * 3.5)));
    return {
      estimatedPH: nearest.pt.pH,
      method: 'interpolated',
      nearestPoint: nearest.pt,
      deltaE: parseFloat(nearest.dE.toFixed(2)),
      confidenceScore,
      qualityRating: 'Excellent',
      secondNearestPoint: second.pt,
    };
  }

  // Weight using inverse square of perceptual Delta E
  const eps = 0.5;
  const w1 = 1 / Math.pow(nearest.dE + eps, 1.8);
  const w2 = 1 / Math.pow(second.dE + eps, 1.8);

  const weightedPH = (nearest.pt.pH * w1 + second.pt.pH * w2) / (w1 + w2);
  const roundedPH = parseFloat(weightedPH.toFixed(2));

  const confidenceScore = Math.max(0, Math.min(100, Math.round(100 - nearest.dE * 3.5)));
  let qualityRating: 'Excellent' | 'Good' | 'Moderate' | 'Low / Uncertain' = 'Excellent';
  if (nearest.dE > 15) {
    qualityRating = 'Low / Uncertain';
  } else if (nearest.dE > 8) {
    qualityRating = 'Moderate';
  } else if (nearest.dE > 3) {
    qualityRating = 'Good';
  }

  return {
    estimatedPH: roundedPH,
    method: 'interpolated',
    nearestPoint: nearest.pt,
    deltaE: parseFloat(nearest.dE.toFixed(2)),
    confidenceScore,
    qualityRating,
    secondNearestPoint: second.pt,
  };
}

/**
 * Calculate statistical validation metrics for lab comparisons
 */
export function computeValidationMetrics(
  pairs: { estimated: number; actual: number }[]
): ValidationSummary {
  if (!pairs || pairs.length === 0) {
    return {
      totalCount: 0,
      mae: 0,
      rmse: 0,
      meanPercentageError: 0,
      maxError: 0,
      rSquared: 0,
    };
  }

  const n = pairs.length;
  let totalAbsError = 0;
  let totalSqError = 0;
  let totalPctError = 0;
  let maxError = 0;

  let sumEst = 0;
  let sumAct = 0;

  pairs.forEach(p => {
    const err = Math.abs(p.estimated - p.actual);
    totalAbsError += err;
    totalSqError += err * err;
    const pct = p.actual !== 0 ? (err / Math.abs(p.actual)) * 100 : 0;
    totalPctError += pct;
    if (err > maxError) maxError = err;

    sumEst += p.estimated;
    sumAct += p.actual;
  });

  const mae = totalAbsError / n;
  const rmse = Math.sqrt(totalSqError / n);
  const meanPercentageError = totalPctError / n;

  // Pearson correlation coefficient (r) and R^2
  let rSquared = 0;
  if (n > 1) {
    const meanEst = sumEst / n;
    const meanAct = sumAct / n;

    let numerator = 0;
    let denomEst = 0;
    let denomAct = 0;

    pairs.forEach(p => {
      const dEst = p.estimated - meanEst;
      const dAct = p.actual - meanAct;
      numerator += dEst * dAct;
      denomEst += dEst * dEst;
      denomAct += dAct * dAct;
    });

    const denom = Math.sqrt(denomEst * denomAct);
    if (denom > 0) {
      const r = numerator / denom;
      rSquared = Math.max(0, Math.min(1, r * r));
    }
  }

  return {
    totalCount: n,
    mae: parseFloat(mae.toFixed(3)),
    rmse: parseFloat(rmse.toFixed(3)),
    meanPercentageError: parseFloat(meanPercentageError.toFixed(2)),
    maxError: parseFloat(maxError.toFixed(3)),
    rSquared: parseFloat(rSquared.toFixed(3)),
  };
}
