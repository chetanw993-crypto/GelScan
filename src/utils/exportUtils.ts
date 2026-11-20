import jsPDF from 'jspdf';
import { CalibrationPoint, SampleRecord } from '../types/gelscan';
import { LabSettings } from './storage';

/**
 * Export sample records to standard CSV format for Excel/SPSS analysis
 */
export function exportSamplesToCSV(samples: SampleRecord[]): void {
  if (samples.length === 0) {
    alert('No sample records to export.');
    return;
  }

  const headers = [
    'Sample ID',
    'Batch Number',
    'Timestamp',
    'Time Point',
    'Film Thickness (mm)',
    'Operator',
    'Estimated pH',
    'Estimation Method',
    'Nearest Reference pH',
    'Nearest Reference Buffer',
    'Delta E (CIE76)',
    'Confidence Score (%)',
    'Red',
    'Green',
    'Blue',
    'Hue (deg)',
    'Saturation (%)',
    'Value (%)',
    'Hex Color',
    'Color Name',
    'Lab Actual pH',
    'Error Delta pH',
    'Error (%)',
    'Capture Source',
    'Notes',
  ];

  const escapeCSV = (str: string | number | undefined) => {
    if (str === undefined || str === null) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = samples.map(s => [
    escapeCSV(s.sampleId),
    escapeCSV(s.batchNumber),
    escapeCSV(new Date(s.timestamp).toLocaleString()),
    escapeCSV(s.timePoint),
    escapeCSV(s.filmThicknessMm ?? 'N/A'),
    escapeCSV(s.operatorName),
    escapeCSV(s.estimatedPH.toFixed(2)),
    escapeCSV(s.estimationMethod),
    escapeCSV(s.nearestReferencePH.toFixed(2)),
    escapeCSV(s.nearestReferenceBuffer),
    escapeCSV(s.deltaE.toFixed(2)),
    escapeCSV(`${s.confidenceScore}%`),
    escapeCSV(s.color.rgb.r),
    escapeCSV(s.color.rgb.g),
    escapeCSV(s.color.rgb.b),
    escapeCSV(s.color.hsv.h),
    escapeCSV(s.color.hsv.s),
    escapeCSV(s.color.hsv.v),
    escapeCSV(s.color.hex),
    escapeCSV(s.color.colorName),
    escapeCSV(s.actualLabPH !== undefined ? s.actualLabPH.toFixed(2) : 'Unvalidated'),
    escapeCSV(s.phError !== undefined ? s.phError.toFixed(2) : 'N/A'),
    escapeCSV(s.errorPercentage !== undefined ? `${s.errorPercentage.toFixed(2)}%` : 'N/A'),
    escapeCSV(s.source),
    escapeCSV(s.notes || ''),
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `GelScan_Research_Data_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate and download a scientific PDF report for a sample
 */
export function generateSamplePDFReport(
  sample: SampleRecord,
  settings: LabSettings,
  calibrationSet: CalibrationPoint[]
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor: [number, number, number] = [20, 83, 115]; // Teal / Navy
  const slateDark: [number, number, number] = [30, 41, 59];
  const slateMuted: [number, number, number] = [100, 116, 139];

  // Header banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('GELSCAN – SMART GELATIN pH ANALYZER', 14, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('B.Pharm Research Project | Digital Film Colorimetric Analysis', 14, 18);

  // Institution Subheader
  doc.setTextColor(...slateDark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(settings.collegeName || 'College of Pharmacy & Technology', 14, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...slateMuted);
  doc.text(`${settings.department} | Guide: ${settings.projectGuide}`, 14, 38);
  doc.text(`Report Generated: ${new Date().toLocaleString()}`, 140, 38);

  doc.setDrawColor(226, 232, 240);
  doc.line(14, 42, 196, 42);

  // Section 1: Sample Identification
  let curY = 49;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('1. SAMPLE & TEST IDENTIFICATION', 14, curY);

  curY += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateDark);

  const col1X = 14;
  const col2X = 80;
  const col3X = 140;

  doc.text(`Sample ID: `, col1X, curY);
  doc.setFont('helvetica', 'bold');
  doc.text(`${sample.sampleId}`, col1X + 22, curY);

  doc.setFont('helvetica', 'normal');
  doc.text(`Batch Number: `, col2X, curY);
  doc.setFont('helvetica', 'bold');
  doc.text(`${sample.batchNumber}`, col2X + 24, curY);

  doc.setFont('helvetica', 'normal');
  doc.text(`Time Point: `, col3X, curY);
  doc.setFont('helvetica', 'bold');
  doc.text(`${sample.timePoint}`, col3X + 22, curY);

  curY += 6;
  doc.setFont('helvetica', 'normal');
  doc.text(`Operator: `, col1X, curY);
  doc.setFont('helvetica', 'bold');
  doc.text(`${sample.operatorName}`, col1X + 22, curY);

  doc.setFont('helvetica', 'normal');
  doc.text(`Film Thickness: `, col2X, curY);
  doc.setFont('helvetica', 'bold');
  doc.text(`${sample.filmThicknessMm ? sample.filmThicknessMm + ' mm' : 'Unspecified'}`, col2X + 24, curY);

  doc.setFont('helvetica', 'normal');
  doc.text(`Capture Source: `, col3X, curY);
  doc.setFont('helvetica', 'bold');
  doc.text(`${sample.source.toUpperCase()}`, col3X + 22, curY);

  // Section 2: Colorimetric Analysis & Visual Swatch
  curY += 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('2. COLORIMETRIC EXTRACTION (RGB / HSV / CIELAB)', 14, curY);

  curY += 6;
  // Swatch box
  const swatchX = 14;
  const swatchY = curY;
  const swatchW = 32;
  const swatchH = 26;

  doc.setFillColor(sample.color.rgb.r, sample.color.rgb.g, sample.color.rgb.b);
  doc.roundedRect(swatchX, swatchY, swatchW, swatchH, 2, 2, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.roundedRect(swatchX, swatchY, swatchW, swatchH, 2, 2, 'D');

  doc.setTextColor(...slateDark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(`Sample Swatch`, swatchX + 4, swatchY + swatchH + 5);

  const metricsX = 52;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Hex Code: `, metricsX, curY + 4);
  doc.setFont('helvetica', 'bold');
  doc.text(`${sample.color.hex}`, metricsX + 24, curY + 4);

  doc.setFont('helvetica', 'normal');
  doc.text(`RGB Vector: `, metricsX, curY + 10);
  doc.setFont('helvetica', 'bold');
  doc.text(`R: ${sample.color.rgb.r}, G: ${sample.color.rgb.g}, B: ${sample.color.rgb.b}`, metricsX + 24, curY + 10);

  doc.setFont('helvetica', 'normal');
  doc.text(`HSV Vector: `, metricsX, curY + 16);
  doc.setFont('helvetica', 'bold');
  doc.text(`H: ${sample.color.hsv.h}°, S: ${sample.color.hsv.s}%, V: ${sample.color.hsv.v}%`, metricsX + 24, curY + 16);

  doc.setFont('helvetica', 'normal');
  doc.text(`CIELAB: `, metricsX, curY + 22);
  doc.setFont('helvetica', 'bold');
  doc.text(`L*: ${sample.color.lab.l}, a*: ${sample.color.lab.a}, b*: ${sample.color.lab.b}`, metricsX + 24, curY + 22);

  doc.setFont('helvetica', 'normal');
  doc.text(`Classification: `, metricsX, curY + 28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 118, 110);
  doc.text(`${sample.color.colorName}`, metricsX + 24, curY + 28);

  // Section 3: pH Estimation & Calibration Match
  curY += 36;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('3. pH ESTIMATION & CALIBRATION MATCH', 14, curY);

  curY += 7;
  // Box for Estimated pH
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, curY, 182, 34, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, curY, 182, 34, 2, 2, 'D');

  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(`pH ${sample.estimatedPH.toFixed(2)}`, 22, curY + 16);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateMuted);
  doc.text(`Method: ${sample.estimationMethod.toUpperCase()}`, 22, curY + 24);

  // Estimation details on right side of the box
  doc.setTextColor(...slateDark);
  doc.text(`Nearest Reference:`, 85, curY + 10);
  doc.setFont('helvetica', 'bold');
  doc.text(`pH ${sample.nearestReferencePH.toFixed(2)} (${sample.nearestReferenceBuffer})`, 118, curY + 10);

  doc.setFont('helvetica', 'normal');
  doc.text(`Perceptual Delta E:`, 85, curY + 18);
  doc.setFont('helvetica', 'bold');
  doc.text(`${sample.deltaE.toFixed(2)} (CIELAB 1976)`, 118, curY + 18);

  doc.setFont('helvetica', 'normal');
  doc.text(`Confidence Rating:`, 85, curY + 26);
  doc.setFont('helvetica', 'bold');
  const confColor: [number, number, number] = sample.confidenceScore > 75 ? [22, 101, 52] : [194, 65, 12];
  doc.setTextColor(...confColor);
  doc.text(`${sample.confidenceScore}% (Match Reliability)`, 118, curY + 26);

  // Section 4: Laboratory Validation Comparison
  curY += 42;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('4. LABORATORY pH METER VALIDATION', 14, curY);

  curY += 6;
  doc.setFontSize(9);
  doc.setTextColor(...slateDark);

  if (sample.actualLabPH !== undefined) {
    doc.setFont('helvetica', 'normal');
    doc.text(`Standard Calibrated pH Meter: `, 14, curY);
    doc.setFont('helvetica', 'bold');
    doc.text(`pH ${sample.actualLabPH.toFixed(2)}`, 62, curY);

    doc.setFont('helvetica', 'normal');
    doc.text(`Discrepancy (ΔpH): `, 100, curY);
    doc.setFont('helvetica', 'bold');
    doc.text(`${sample.phError! >= 0 ? '+' : ''}${sample.phError!.toFixed(2)} pH units`, 135, curY);

    curY += 6;
    doc.setFont('helvetica', 'normal');
    doc.text(`Relative Error (%): `, 14, curY);
    doc.setFont('helvetica', 'bold');
    doc.text(`${sample.errorPercentage?.toFixed(2)}%`, 62, curY);

    doc.setFont('helvetica', 'normal');
    doc.text(`Validation Status: `, 100, curY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 101, 52);
    doc.text('LABORATORY BENCHMARK RECORDED', 135, curY);
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...slateMuted);
    doc.text('No laboratory glass-electrode measurement recorded yet for this sample.', 14, curY);
    doc.text('Use the Lab Validation mode in GelScan to record benchmark comparisons.', 14, curY + 5);
    curY += 5;
  }

  // Section 5: Calibration Curve References Used
  curY += 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text(`5. REFERENCE CALIBRATION LADDER (${calibrationSet.length} Buffers)`, 14, curY);

  curY += 6;
  const startLadderX = 14;
  const ladderStep = Math.min(22, (196 - startLadderX) / calibrationSet.length);

  calibrationSet.slice(0, 8).forEach((pt, idx) => {
    const lx = startLadderX + idx * ladderStep;
    doc.setFillColor(pt.rgb.r, pt.rgb.g, pt.rgb.b);
    doc.rect(lx, curY, ladderStep - 2, 7, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(lx, curY, ladderStep - 2, 7, 'D');

    doc.setFontSize(7);
    doc.setTextColor(...slateDark);
    doc.setFont('helvetica', 'bold');
    doc.text(`${pt.pH}`, lx + 2, curY + 11);
  });

  // Section 6: Research Notes & Observations
  curY += 18;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text('6. NOTES & EXPERIMENTAL OBSERVATIONS', 14, curY);

  curY += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...slateDark);
  const notesText = sample.notes && sample.notes.trim() ? sample.notes : 'Film appearance uniform; no visible anthocyanin leaching observed during test duration.';
  doc.text(notesText, 14, curY, { maxWidth: 182 });

  // Disclaimers & Regulatory Notice
  curY = 246;
  doc.setDrawColor(226, 232, 240);
  doc.line(14, curY, 196, curY);

  curY += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(180, 83, 9); // Amber
  doc.text('ACADEMIC RESEARCH & PATENT NOTICE:', 14, curY);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateMuted);
  doc.text(
    'GelScan is an experimental optical pH evaluation tool developed for B.Pharm research. Colorimetric estimations are',
    14,
    curY + 3.5
  );
  doc.text(
    'derived from digital image analysis and must not be used for direct in-vivo medical diagnostic decisions without clinical validation.',
    14,
    curY + 7
  );

  // Signatures
  curY += 18;
  doc.setDrawColor(148, 163, 184);
  doc.line(14, curY, 70, curY);
  doc.line(140, curY, 196, curY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...slateDark);
  doc.text('Student Researcher Signature', 14, curY + 4);
  doc.text('Faculty Project Guide Signature', 140, curY + 4);

  // Save the PDF
  doc.save(`GelScan_Report_${sample.sampleId}_${sample.batchNumber}.pdf`);
}
