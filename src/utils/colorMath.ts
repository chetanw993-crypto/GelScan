import { CIELAB, ColorData, HSV, RGB } from '../types/gelscan';

/**
 * Convert RGB (0-255) to Hex string (#RRGGBB)
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convert Hex string (#RRGGBB or RRGGBB) to RGB
 */
export function hexToRgb(hex: string): RGB {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return { r: 128, g: 128, b: 128 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Convert RGB (0-255) to HSV
 * h: 0 - 360 degrees
 * s: 0 - 100%
 * v: 0 - 100%
 */
export function rgbToHsv(r: number, g: number, b: number): HSV {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rNorm) {
      h = ((gNorm - bNorm) / delta) % 6;
    } else if (max === gNorm) {
      h = (bNorm - rNorm) / delta + 2;
    } else {
      h = (rNorm - gNorm) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : Math.round((delta / max) * 100);
  const v = Math.round(max * 100);

  return { h, s, v };
}

/**
 * Convert RGB (0-255) to CIE XYZ (Illuminant D65, 2° Standard Observer)
 */
export function rgbToXyz(r: number, g: number, b: number): { x: number; y: number; z: number } {
  // sRGB gamma expansion
  const pivot = (v: number) => {
    const norm = v / 255;
    return norm > 0.04045 ? Math.pow((norm + 0.055) / 1.055, 2.4) : norm / 12.92;
  };

  const rLinear = pivot(r);
  const gLinear = pivot(g);
  const bLinear = pivot(b);

  // Matrix transformation for sRGB -> XYZ (D65)
  const x = (rLinear * 0.4124564 + gLinear * 0.3575761 + bLinear * 0.1804375) * 100;
  const y = (rLinear * 0.2126729 + gLinear * 0.7151522 + bLinear * 0.0721750) * 100;
  const z = (rLinear * 0.0193339 + gLinear * 0.1191920 + bLinear * 0.9503041) * 100;

  return { x, y, z };
}

/**
 * Convert CIE XYZ to CIELAB
 * Reference white D65: Xn = 95.047, Yn = 100.000, Zn = 108.883
 */
export function xyzToLab(x: number, y: number, z: number): CIELAB {
  const Xn = 95.047;
  const Yn = 100.0;
  const Zn = 108.883;

  const f = (t: number) => {
    return t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
  };

  const fx = f(x / Xn);
  const fy = f(y / Yn);
  const fz = f(z / Zn);

  const l = Math.max(0, 116 * fy - 16);
  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);

  return {
    l: parseFloat(l.toFixed(2)),
    a: parseFloat(a.toFixed(2)),
    b: parseFloat(b.toFixed(2)),
  };
}

/**
 * Convert RGB directly to CIELAB
 */
export function rgbToLab(r: number, g: number, b: number): CIELAB {
  const xyz = rgbToXyz(r, g, b);
  return xyzToLab(xyz.x, xyz.y, xyz.z);
}

/**
 * Calculate CIELAB Delta E (CIE76 color difference)
 * Delta E < 2.0 is often considered imperceptible to untrained human eye
 */
export function calculateDeltaE(lab1: CIELAB, lab2: CIELAB): number {
  const dL = lab1.l - lab2.l;
  const da = lab1.a - lab2.a;
  const db = lab1.b - lab2.b;
  return parseFloat(Math.sqrt(dL * dL + da * da + db * db).toFixed(2));
}

/**
 * Euclidean distance in RGB color space
 */
export function calculateRgbDistance(rgb1: RGB, rgb2: RGB): number {
  const dr = rgb1.r - rgb2.r;
  const dg = rgb1.g - rgb2.g;
  const db = rgb1.b - rgb2.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * Classify color name with specific emphasis on Anthocyanin pH transitions
 */
export function classifyAnthocyaninColor(rgb: RGB, hsv: HSV): string {
  const { h, s, v } = hsv;

  if (v < 15) return 'Dark Charcoal / Shadow';
  if (s < 12 && v > 75) return 'Off-White / Neutral Matrix';

  // Anthocyanin characteristic pH color transitions
  if (h >= 345 || h < 15) {
    if (s > 50) return 'Bright Red (Acidic Flavylium cation, pH ~1-3)';
    return 'Rosy Pink (Mildly Acidic, pH ~3-4)';
  } else if (h >= 15 && h < 40) {
    return 'Coral / Salmon Pink (pH ~3.5-4.5)';
  } else if (h >= 40 && h < 70) {
    return 'Golden Yellow / Amber (Degraded Chalcone, High pH ~11-12)';
  } else if (h >= 70 && h < 155) {
    if (s > 40) return 'Emerald / Grass Green (Alkaline Quinoidal, pH ~9-10)';
    return 'Olive / Pale Green (pH ~8.5-9.5)';
  } else if (h >= 155 && h < 200) {
    return 'Teal / Blue-Green (pH ~8.0-8.5)';
  } else if (h >= 200 && h < 260) {
    if (v > 60) return 'Sky / Ocean Blue (Neutral Quinoidal, pH ~7.5-8.0)';
    return 'Deep Indigo Blue (pH ~7.0-7.5)';
  } else if (h >= 260 && h < 310) {
    return 'Violet / Purple (Neutral Transition, pH ~6.0-7.0)';
  } else if (h >= 310 && h < 345) {
    return 'Magenta / Red-Violet (pH ~4.5-5.5)';
  }

  return 'Undefined Transition Color';
}

/**
 * Apply white-balance normalization using reference white patch
 */
export function applyWhiteBalance(rgb: RGB, whiteRef: { r: number; g: number; b: number }): RGB {
  // Avoid division by zero or extreme low reference
  const wr = Math.max(30, whiteRef.r);
  const wg = Math.max(30, whiteRef.g);
  const wb = Math.max(30, whiteRef.b);

  const scaleR = 255 / wr;
  const scaleG = 255 / wg;
  const scaleB = 255 / wb;

  return {
    r: Math.min(255, Math.round(rgb.r * scaleR)),
    g: Math.min(255, Math.round(rgb.g * scaleG)),
    b: Math.min(255, Math.round(rgb.b * scaleB)),
  };
}

/**
 * Extract full ColorData object from RGB values
 */
export function extractColorData(rgb: RGB, isNormalized = false): ColorData {
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  const lab = rgbToLab(rgb.r, rgb.g, rgb.b);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  const colorName = classifyAnthocyaninColor(rgb, hsv);

  return {
    rgb,
    hsv,
    lab,
    hex,
    colorName,
    isNormalized,
  };
}

/**
 * Average RGB values across a Region of Interest (ROI) on a 2D Canvas context
 */
export function sampleCanvasROI(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number
): RGB {
  const startX = Math.max(0, Math.round(centerX - radius));
  const startY = Math.max(0, Math.round(centerY - radius));
  const width = Math.min(ctx.canvas.width - startX, radius * 2);
  const height = Math.min(ctx.canvas.height - startY, radius * 2);

  if (width <= 0 || height <= 0) return { r: 128, g: 128, b: 128 };

  const imgData = ctx.getImageData(startX, startY, width, height);
  const data = imgData.data;

  let totalR = 0;
  let totalG = 0;
  let totalB = 0;
  let pixelCount = 0;

  const rSquared = radius * radius;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = startX + x - centerX;
      const dy = startY + y - centerY;
      // Circular sampling mask
      if (dx * dx + dy * dy <= rSquared) {
        const idx = (y * width + x) * 4;
        totalR += data[idx];
        totalG += data[idx + 1];
        totalB += data[idx + 2];
        pixelCount++;
      }
    }
  }

  if (pixelCount === 0) {
    return { r: 128, g: 128, b: 128 };
  }

  return {
    r: Math.round(totalR / pixelCount),
    g: Math.round(totalG / pixelCount),
    b: Math.round(totalB / pixelCount),
  };
}
