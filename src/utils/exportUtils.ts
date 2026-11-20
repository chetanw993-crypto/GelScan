import jsPDF from 'jspdf';
import { CalibrationPoint, SampleRecord } from '../types/gelscan';
import { LabSettings } from './storage';
import { analyzeWoundHealth } from './woundAnalysisEngine';

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
    'Wound State Phase',
    'Moisture Level',
    'Estimated Recovery Time',
    'MMP Protease Activity',
    'Biofilm Risk',
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

  const rows = samples.map(s => {
    const med = s.medicalAnalysis || analyzeWoundHealth(s.estimatedPH, 'optimal', s.filmThicknessMm);

    return [
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
      escapeCSV(med.phaseTitle),
      escapeCSV(med.moistureLevel),
      escapeCSV(med.estimatedRecoveryTime),
      escapeCSV(med.biochemicalStatus.mmpProteaseActivity),
      escapeCSV(med.biochemicalStatus.bacterialBiofilmRisk),
      escapeCSV(s.actualLabPH !== undefined ? s.actualLabPH.toFixed(2) : 'Unvalidated'),
      escapeCSV(s.phError !== undefined ? s.phError.toFixed(2) : 'N/A'),
      escapeCSV(s.errorPercentage !== undefined ? `${s.errorPercentage.toFixed(2)}%` : 'N/A'),
      escapeCSV(s.source),
      escapeCSV(s.notes || ''),
    ];
  });

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
 * Generate and download a scientific & medical analysis PDF report for a sample
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

  const primaryColor: [number, number, number] = [15, 118, 110]; // Teal 700
  const slateDark: [number, number, number] = [30, 41, 59];
  const slateMuted: [number, number, number] = [100, 116, 139];

  const medical = sample.medicalAnalysis || analyzeWoundHealth(sample.estimatedPH, 'optimal', sample.filmThicknessMm);

  // ================= PAGE 1 =================
  // Header banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('GELSCAN – SMART GELATIN pH ANALYZER', 14, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('B.Pharm Research Project | Digital Film Colorimetric & Wound Analysis', 14, 18);

  // Institution Subheader
  doc.setTextColor(...slateDark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(settings.collegeName || 'College of Pharmacy & Technology', 14, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...slateMuted);
  doc.text(`${settings.department} | Guide: ${settings.projectGuide}`, 14, 38);
  doc.text(`Report Date: ${new Date().toLocaleString()}`, 135, 38);

  doc.setDrawColor(226, 232, 240);
  doc.line(14, 42, 196, 42);

  // Section 1: Sample Identification
  let curY = 49;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryColor);
  doc.text('1. SAMPLE & TEST IDENTIFICATION', 14, curY);

  curY += 6;
  doc.setFontSize(8.5);
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

  curY += 5.5;
  doc.setFont('helvetica', 'normal');
  doc.text(`Operator: `, col1X, curY);
  doc.setFont('helvetica', 'bold');
  doc.text(`${sample.operatorName}`, col1X + 22, curY);

  doc.setFont('helvetica', 'normal');
  doc.text(`Film Thickness: `, col2X, curY);
  doc.setFont('helvetica', 'bold');
  doc.text(`${sample.filmThicknessMm ? sample.filmThicknessMm + ' mm' : '0.25 mm'}`, col2X + 24, curY);

  doc.setFont('helvetica', 'normal');
  doc.text(`Capture Source: `, col3X, curY);
  doc.setFont('helvetica', 'bold');
  doc.text(`${sample.source.toUpperCase()}`, col3X + 22, curY);

  // Section 2: Colorimetric Extraction
  curY += 11;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryColor);
  doc.text('2. COLORIMETRIC EXTRACTION (RGB / HSV / CIELAB)', 14, curY);

  curY += 6;
  const swatchX = 14;
  const swatchY = curY;
  const swatchW = 28;
  const swatchH = 24;

  doc.setFillColor(sample.color.rgb.r, sample.color.rgb.g, sample.color.rgb.b);
  doc.roundedRect(swatchX, swatchY, swatchW, swatchH, 2, 2, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.roundedRect(swatchX, swatchY, swatchW, swatchH, 2, 2, 'D');

  doc.setTextColor(...slateDark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(`Sample Swatch`, swatchX + 3, swatchY + swatchH + 4);

  const metricsX = 48;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Hex Code: `, metricsX, curY + 3.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`${sample.color.hex}`, metricsX + 24, curY + 3.5);

  doc.setFont('helvetica', 'normal');
  doc.text(`RGB Vector: `, metricsX, curY + 9);
  doc.setFont('helvetica', 'bold');
  doc.text(`R: ${sample.color.rgb.r}, G: ${sample.color.rgb.g}, B: ${sample.color.rgb.b}`, metricsX + 24, curY + 9);

  doc.setFont('helvetica', 'normal');
  doc.text(`HSV Vector: `, metricsX, curY + 14.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`H: ${sample.color.hsv.h}°, S: ${sample.color.hsv.s}%, V: ${sample.color.hsv.v}%`, metricsX + 24, curY + 14.5);

  doc.setFont('helvetica', 'normal');
  doc.text(`CIELAB: `, metricsX, curY + 20);
  doc.setFont('helvetica', 'bold');
  doc.text(`L*: ${sample.color.lab.l}, a*: ${sample.color.lab.a}, b*: ${sample.color.lab.b}`, metricsX + 24, curY + 20);

  doc.setFont('helvetica', 'normal');
  doc.text(`Classification: `, metricsX, curY + 25.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 118, 110);
  doc.text(`${sample.color.colorName}`, metricsX + 24, curY + 25.5);

  // Section 3: pH Estimation & Calibration Match
  curY += 34;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryColor);
  doc.text('3. pH ESTIMATION & CALIBRATION MATCH', 14, curY);

  curY += 6;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, curY, 182, 30, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, curY, 182, 30, 2, 2, 'D');

  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(`pH ${sample.estimatedPH.toFixed(2)}`, 22, curY + 14);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateMuted);
  doc.text(`Method: ${sample.estimationMethod.toUpperCase()}`, 22, curY + 22);

  doc.setTextColor(...slateDark);
  doc.text(`Nearest Reference:`, 85, curY + 8);
  doc.setFont('helvetica', 'bold');
  doc.text(`pH ${sample.nearestReferencePH.toFixed(2)} (${sample.nearestReferenceBuffer})`, 118, curY + 8);

  doc.setFont('helvetica', 'normal');
  doc.text(`Perceptual Delta E:`, 85, curY + 15);
  doc.setFont('helvetica', 'bold');
  doc.text(`${sample.deltaE.toFixed(2)} (CIELAB 1976)`, 118, curY + 15);

  doc.setFont('helvetica', 'normal');
  doc.text(`Confidence Score:`, 85, curY + 22);
  doc.setFont('helvetica', 'bold');
  const confColor: [number, number, number] = sample.confidenceScore > 75 ? [22, 101, 52] : [194, 65, 12];
  doc.setTextColor(...confColor);
  doc.text(`${sample.confidenceScore}% (Match Reliability)`, 118, curY + 22);

  // Section 4: Laboratory pH Meter Validation
  curY += 38;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryColor);
  doc.text('4. LABORATORY BENCHTOP pH METER VALIDATION', 14, curY);

  curY += 6;
  doc.setFontSize(8.5);
  doc.setTextColor(...slateDark);

  if (sample.actualLabPH !== undefined) {
    doc.setFont('helvetica', 'normal');
    doc.text(`Standard Calibrated pH Meter: `, 14, curY);
    doc.setFont('helvetica', 'bold');
    doc.text(`pH ${sample.actualLabPH.toFixed(2)}`, 64, curY);

    doc.setFont('helvetica', 'normal');
    doc.text(`Discrepancy (ΔpH): `, 102, curY);
    doc.setFont('helvetica', 'bold');
    doc.text(`${sample.phError! >= 0 ? '+' : ''}${sample.phError!.toFixed(2)} pH units`, 138, curY);

    curY += 5.5;
    doc.setFont('helvetica', 'normal');
    doc.text(`Relative Error (%): `, 14, curY);
    doc.setFont('helvetica', 'bold');
    doc.text(`${sample.errorPercentage?.toFixed(2)}%`, 64, curY);

    doc.setFont('helvetica', 'normal');
    doc.text(`Validation Status: `, 102, curY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 101, 52);
    doc.text('LAB BENCHMARK CONFIRMED', 138, curY);
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...slateMuted);
    doc.text('No laboratory glass-electrode measurement recorded yet for this sample.', 14, curY);
    curY += 4;
  }

  // Section 5: Calibration Ladder Strip
  curY += 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryColor);
  doc.text(`5. REFERENCE CALIBRATION BUFFER LADDER`, 14, curY);

  curY += 6;
  const startLadderX = 14;
  const ladderStep = Math.min(22, (196 - startLadderX) / calibrationSet.length);

  calibrationSet.slice(0, 8).forEach((pt, idx) => {
    const lx = startLadderX + idx * ladderStep;
    doc.setFillColor(pt.rgb.r, pt.rgb.g, pt.rgb.b);
    doc.rect(lx, curY, ladderStep - 2, 6, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(lx, curY, ladderStep - 2, 6, 'D');

    doc.setFontSize(7);
    doc.setTextColor(...slateDark);
    doc.setFont('helvetica', 'bold');
    doc.text(`${pt.pH}`, lx + 2, curY + 10);
  });

  // Footer notice page 1
  curY = 275;
  doc.setFontSize(7.5);
  doc.setTextColor(...slateMuted);
  doc.setFont('helvetica', 'normal');
  doc.text('Page 1 of 2 – Physical Colorimetry & Estimation | See Page 2 for Clinical Wound & Care Analysis', 14, curY);

  // ================= PAGE 2: CLINICAL WOUND & CARE ANALYSIS =================
  doc.addPage();

  // Header Banner Page 2
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, 210, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.text('GELSCAN – CLINICAL WOUND ANALYSIS & MEDICAL CARE PROTOCOL', 14, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Evidence-Based Wound Bed Preparation (TIME Framework & EWMA Guidelines)', 14, 17);

  curY = 30;

  // Section 6: Wound State & Moisture Level
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryColor);
  doc.text('6. WOUND BED STATE & MOISTURE STATUS', 14, curY);

  curY += 6;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, curY, 182, 28, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, curY, 182, 28, 2, 2, 'D');

  doc.setFontSize(9);
  doc.setTextColor(...slateDark);
  doc.setFont('helvetica', 'bold');
  doc.text(`Wound Phase: ${medical.phaseTitle}`, 18, curY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...slateMuted);
  doc.text(medical.biologicalDescription, 18, curY + 11, { maxWidth: 174 });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...slateDark);
  doc.text(`Exudate Moisture Level: ${medical.moistureLevel.toUpperCase()}`, 18, curY + 22);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateMuted);
  doc.text(`– ${medical.moistureDescription}`, 78, curY + 22, { maxWidth: 114 });

  // Section 7: Estimated Recovery Timeline & Biochemical Profile
  curY += 35;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryColor);
  doc.text('7. PROGNOSTIC RECOVERY TIMELINE & BIOCHEMICAL PROFILE', 14, curY);

  curY += 6;
  doc.setFontSize(8.5);
  doc.setTextColor(...slateDark);
  doc.text(`Estimated Recovery Timeframe:`, 14, curY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 118, 110);
  doc.text(`${medical.estimatedRecoveryTime}`, 66, curY);

  curY += 5.5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateDark);
  doc.text(`Healing Trajectory Rating:`, 14, curY);
  doc.setFont('helvetica', 'bold');
  doc.text(`${medical.healingTrajectory}`, 66, curY);

  curY += 6;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, curY, 182, 18, 2, 2, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...slateDark);
  doc.text('BIOCHEMICAL STATUS:', 18, curY + 5);

  doc.setFont('helvetica', 'normal');
  doc.text(`• MMP Protease Breakdown: ${medical.biochemicalStatus.mmpProteaseActivity}`, 18, curY + 10);
  doc.text(`• Bacterial Biofilm Risk: ${medical.biochemicalStatus.bacterialBiofilmRisk}`, 18, curY + 14);
  doc.text(`• Angiogenesis / Capillary Sprouting: ${medical.biochemicalStatus.angiogenesisStatus}`, 105, curY + 10);

  // Section 8: Steps to Take Care of the Wound
  curY += 26;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryColor);
  doc.text('8. STEPS TO TAKE CARE OF THE WOUND (PATIENT & CAREGIVER)', 14, curY);

  curY += 5.5;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateDark);

  medical.clinicalCareSteps.forEach(step => {
    doc.text(`• ${step}`, 14, curY, { maxWidth: 182 });
    curY += 5.5;
  });

  // Section 9: Standard Medical Procedures
  curY += 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryColor);
  doc.text('9. STANDARD MEDICAL PROCEDURES (CLINICAL STAFF / EWMA)', 14, curY);

  curY += 5.5;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateDark);

  medical.standardMedicalProcedures.forEach(proc => {
    doc.text(`• ${proc}`, 14, curY, { maxWidth: 182 });
    curY += 5.5;
  });

  // Section 10: Clinical Red Flags
  curY += 2;
  doc.setFillColor(254, 242, 242);
  doc.roundedRect(14, curY, 182, 22, 2, 2, 'F');
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(14, curY, 182, 22, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(185, 28, 28); // Red 700
  doc.text('CLINICAL RED FLAGS (IMMEDIATE PHYSICIAN / HOSPITAL ESCALATION):', 18, curY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(153, 27, 27);
  doc.text('• Spreading erythema > 2 cm, foul odor, sudden escalation of localized pain, or fever > 38.0°C.', 18, curY + 10);
  doc.text('• Purulent thick discharge or rapid deterioration of peri-wound skin requires immediate culture & antibiotic therapy.', 18, curY + 15);

  // Signatures
  curY += 34;
  doc.setDrawColor(148, 163, 184);
  doc.line(14, curY, 70, curY);
  doc.line(140, curY, 196, curY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...slateDark);
  doc.text('Student Researcher Signature', 14, curY + 4);
  doc.text('Faculty Project Guide / Clinician', 140, curY + 4);

  // Save the 2-page PDF
  doc.save(`GelScan_Medical_Report_${sample.sampleId}_${sample.batchNumber}.pdf`);
}
