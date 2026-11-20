import { MoistureLevel, WoundMedicalAnalysis, WoundStatePhase } from '../types/gelscan';

/**
 * Compute evidence-based clinical wound analysis from estimated pH and exudate moisture level
 * Grounded in European Wound Management Association (EWMA) and TIME Framework principles.
 */
export function analyzeWoundHealth(
  estimatedPH: number,
  moisture: MoistureLevel = 'optimal',
  filmThicknessMm: number = 0.25
): WoundMedicalAnalysis {
  let phase: WoundStatePhase = 'active_granulation';
  let phaseTitle = 'Active Granulation Phase (Healthy Healing)';
  let biologicalDescription =
    'Optimal microenvironment for fibroblast proliferation, physiological angiogenesis, and collagen matrix deposition.';
  let healingTrajectory: WoundMedicalAnalysis['healingTrajectory'] = 'Optimal';
  let estimatedRecoveryTime = '10 - 21 Days (Linear acute healing velocity ~0.8 mm/week)';

  const biochemicalStatus: WoundMedicalAnalysis['biochemicalStatus'] = {
    mmpProteaseActivity: 'Low (Favorable)',
    bacterialBiofilmRisk: 'Minimal',
    angiogenesisStatus: 'Active & Favorable',
  };

  const clinicalCareSteps: string[] = [];
  const standardMedicalProcedures: string[] = [];
  const redFlagWarnings: string[] = [];

  // 1. EVALUATE WOUND STATE BASED ON pH
  if (estimatedPH < 5.5) {
    phase = 'acidic_remodeling';
    phaseTitle = 'Acidic Epithelialization & Remodeling Phase';
    biologicalDescription =
      'Acidic surface pH restores normal skin acid mantle (pH 4.5 - 5.5), promoting keratinocyte migration and barrier stratum corneum restoration.';
    healingTrajectory = 'Optimal';
    estimatedRecoveryTime = '7 - 14 Days (Final re-epithelialization phase)';
    biochemicalStatus.mmpProteaseActivity = 'Low (Favorable)';
    biochemicalStatus.bacterialBiofilmRisk = 'Minimal';
    biochemicalStatus.angiogenesisStatus = 'Steady';
  } else if (estimatedPH >= 5.5 && estimatedPH <= 6.5) {
    phase = 'active_granulation';
    phaseTitle = 'Active Granulation Phase (Physiological Healing)';
    biologicalDescription =
      'Optimal physiological healing pH. Collagen cross-linking and capillary sprouting are maximized while tissue-degrading proteases remain suppressed.';
    healingTrajectory = 'Optimal';
    estimatedRecoveryTime = '10 - 21 Days (Acute wound trajectory)';
    biochemicalStatus.mmpProteaseActivity = 'Normal';
    biochemicalStatus.bacterialBiofilmRisk = 'Low';
    biochemicalStatus.angiogenesisStatus = 'Active & Favorable';
  } else if (estimatedPH > 6.5 && estimatedPH <= 7.3) {
    phase = 'inflammatory_transition';
    phaseTitle = 'Mildly Alkaline / Extended Inflammatory State';
    biologicalDescription =
      'Wound transitioning towards neutral/alkaline state. Matrix Metalloproteinases (MMPs) begin degrading extracellular matrix proteins, potentially delaying healing.';
    healingTrajectory = 'Mildly Delayed';
    estimatedRecoveryTime = '3 - 5 Weeks (Delayed inflammatory resolution)';
    biochemicalStatus.mmpProteaseActivity = 'Elevated (Tissue Degrading)';
    biochemicalStatus.bacterialBiofilmRisk = 'Moderate';
    biochemicalStatus.angiogenesisStatus = 'Impaired';
  } else if (estimatedPH > 7.3 && estimatedPH <= 8.4) {
    phase = 'chronic_stalled';
    phaseTitle = 'Chronic Stalled Wound / Protease Imbalance';
    biologicalDescription =
      'Alkaline wound bed (pH 7.4 - 8.4) hyper-activates MMP-2, MMP-8, and MMP-9, destroying cellular growth factors and extracellular collagen scaffolds faster than they can be synthesized.';
    healingTrajectory = 'Stalled / Chronic';
    estimatedRecoveryTime = '6 - 10+ Weeks (Requires clinical intervention / debridement)';
    biochemicalStatus.mmpProteaseActivity = 'Severe Matrix Breakdown';
    biochemicalStatus.bacterialBiofilmRisk = 'High / Pathogenic Colonization';
    biochemicalStatus.angiogenesisStatus = 'Inhibited';
  } else {
    // pH > 8.4
    phase = 'alkaline_biofilm_risk';
    phaseTitle = 'Severe Alkaline Environment / High Bacterial Biofilm Risk';
    biologicalDescription =
      'High alkalinity (pH > 8.5) strongly correlates with bacterial colonization (e.g. Pseudomonas aeruginosa, Staphylococcus aureus) generating alkaline ammonia metabolites and protective polysaccharide biofilms.';
    healingTrajectory = 'Severe / Biofilm Risk';
    estimatedRecoveryTime = 'Stalled Indefinitely without active antimicrobial debridement';
    biochemicalStatus.mmpProteaseActivity = 'Severe Matrix Breakdown';
    biochemicalStatus.bacterialBiofilmRisk = 'High / Pathogenic Colonization';
    biochemicalStatus.angiogenesisStatus = 'Inhibited';
  }

  // 2. MOISTURE DESCRIPTION & ADJUSTMENT
  let moistureDescription = 'Exudate is balanced; facilitates cell migration without skin maceration.';
  if (moisture === 'dry') {
    moistureDescription =
      'Wound bed is dry/desiccated. Slows epithelial cell migration and causes dressing adherence. Needs hydration.';
    if (healingTrajectory === 'Optimal') healingTrajectory = 'Favorable';
  } else if (moisture === 'maceration_risk') {
    moistureDescription =
      'Heavy exudate / excess moisture detected. High risk of peri-wound skin maceration and enzymatic breakdown.';
    if (healingTrajectory === 'Optimal') healingTrajectory = 'Mildly Delayed';
  }

  // 3. CLINICAL CARE STEPS (Patient & Caregiver)
  clinicalCareSteps.push(
    '1. Aseptic Preparation: Wash hands thoroughly with antimicrobial soap and wear sterile examination gloves.'
  );

  clinicalCareSteps.push(
    '2. Gentle Saline Cleansing: Irrigate wound gently with sterile 0.9% Normal Saline at body temperature (~37°C). Avoid cold water or aggressive mechanical scrubbing.'
  );

  if (moisture === 'dry') {
    clinicalCareSteps.push(
      '3. Hydration Support: Lightly moisten the gelatin/alginate film with sterile saline prior to placement to initiate hydrogel formation and prevent dry adherence.'
    );
  } else if (moisture === 'maceration_risk') {
    clinicalCareSteps.push(
      '3. Peri-Wound Barrier Protection: Apply a medical-grade barrier cream or film (e.g. Zinc Oxide or Cavilon film) to surrounding healthy skin to prevent moisture maceration.'
    );
  } else {
    clinicalCareSteps.push(
      '3. Film Application: Place the pH-responsive gelatin/alginate dressing directly over the wound bed, extending 1.5 cm onto intact peri-wound skin.'
    );
  }

  clinicalCareSteps.push(
    '4. Secondary Dressing: Cover with a breathable, non-occlusive sterile secondary gauze pad and secure with hypoallergenic medical paper tape.'
  );

  clinicalCareSteps.push(
    '5. Dressing Change Interval: Inspect the dressing every 24 hours. Replace every 24 - 48 hours or immediately if exudate strikes through the outer pad.'
  );

  // 4. STANDARD MEDICAL PROCEDURES (Clinician / Medical Staff Protocol)
  standardMedicalProcedures.push(
    'Wound Bed Cleansing (EWMA Protocol): Use sterile 0.9% NaCl irrigation under low pressure (4 - 15 psi). Avoid toxic chemical antiseptics (such as undiluted povidone-iodine or hydrogen peroxide) on healthy granulating tissue.'
  );

  if (estimatedPH >= 7.4) {
    standardMedicalProcedures.push(
      'pH-Modulating Therapy: Consider medical-grade Manuka honey dressing or 0.5% buffered acetic acid irrigation to shift wound pH back towards physiological acidity (pH 5.5 - 6.5).'
    );
    standardMedicalProcedures.push(
      'Biofilm & Debridement Assessment: Evaluate wound bed for non-viable slough or biofilm slime. Perform conservative sharp or autolytic debridement if indicated by clinical protocol.'
    );
  } else {
    standardMedicalProcedures.push(
      'Maintenance of Moist Wound Healing: Continue gelatin/alginate biopolymer hydrogel matrix application to foster cellular mitosis, growth factor retention, and autolytic debridement.'
    );
  }

  if (moisture === 'maceration_risk') {
    standardMedicalProcedures.push(
      'Exudate Management: Implement high-absorbency calcium alginate or polyurethane foam secondary dressing to absorb high volume exudate.'
    );
  }

  // 5. RED FLAG WARNINGS / HOSPITAL ESCALATION
  redFlagWarnings.push('Spreading erythema (redness) advancing > 2 cm from wound margins.');
  redFlagWarnings.push('Foul, pungent, or distinct sweet odor (often indicative of Pseudomonas infection).');
  redFlagWarnings.push('Sudden increase in localized heat, swelling, or throbbing pain.');
  redFlagWarnings.push('Systemic signs: Body temperature > 38.0°C (100.4°F), chills, or malaise.');
  redFlagWarnings.push('Purulent, thick yellowish-green exudate discharge.');

  return {
    phase,
    phaseTitle,
    biologicalDescription,
    moistureLevel: moisture,
    moistureDescription,
    estimatedRecoveryTime,
    healingTrajectory,
    biochemicalStatus,
    clinicalCareSteps,
    standardMedicalProcedures,
    redFlagWarnings,
  };
}
