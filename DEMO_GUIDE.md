# GelScan – Live Demonstration & Viva Presentation Guide

This guide details everything required to execute an impressive **live research demonstration** for B.Pharm final-year evaluations, faculty reviews, and external examiners.

---

## 🔬 1. Physical Laboratory Bench Setup

To demonstrate the system live, arrange the following on your presentation table:

### A. The 4 Demo Film Samples (Petri Dishes)
Prepare 4 labeled petri dishes with indicator film pieces exposed to known buffers:

| Dish Label | Target pH | Solution Used | Anthocyanin Color | Biological / Clinical Context |
| :--- | :---: | :--- | :--- | :--- |
| **Sample A** | **pH ~3.0 – 4.0** | 0.1M Citrate or Dilute HCl | **Cherry Red / Deep Rose** | Acidic reference / Flavylium cation form |
| **Sample B** | **pH ~5.5** | 0.1M Acetate Buffer | **Pinkish Violet** | Healthy intact stratum corneum skin pH |
| **Sample C** | **pH ~6.5** | 0.1M Phosphate Buffer | **Purple / Violet** | Normal acute healing wound exudate |
| **Sample D** | **pH ~8.5** | 0.1M Tris-HCl or Dilute NaHCO₃ | **Teal / Blue-Green** | Alkaline chronic wound / bacterial biofilm exudate |

> **Backup Strategy:** If real films are unavailable on the day of the viva, GelScan has built-in **"Laboratory Demo Samples"** inside the **Gallery Upload** tab (*Acidic Film, Skin Exudate, Infected Wound*) that generate realistic color responses instantly.

### B. Analytical Benchmark Equipment
- **Benchtop pH Meter or Digital pH Pen:** Calibrated with standard pH 4.0 and 7.0 buffer solutions. This allows you to measure the buffer solution live in front of the examiners to prove the accuracy of GelScan.
- **Dropper Bottles:** 10 mL dropper bottles containing the buffer solutions.
- **Printed QR Labels:** Use the GelScan **QR Manager** tab to generate and print petri dish labels for Samples A, B, C, and D.
- **White Balance Card:** A clean white index card (or clean white paper) placed in the dish zone to calibrate room lighting.

### C. Standardized Illumination
- Use a small portable USB LED desk lamp (4000K neutral white) or your smartphone's built-in torch (toggleable directly from the GelScan camera interface) to maintain consistent lux.

---

## 💻 2. Digital & Software Setup

### Display Screen
- **Laptop (Presenter Screen):** Connect laptop to an external monitor or projector if available, running GelScan on [http://localhost:5173/](http://localhost:5173/).
- **Examiner's Smartphone (Interactive Experience):** 
  - Turn on mobile hotspot or connect both devices to college Wi-Fi.
  - Click **"College Lab Mobile Connect"** in GelScan.
  - Ask the examiner: *"Sir/Ma'am, please scan this QR code with your phone camera."*
  - The examiner opens GelScan directly on their phone and can test samples themselves!

---

## ⏱️ 3. Five-Minute Live Demonstration Script (Step-by-Step)

### Minute 1: The Clinical Problem & Formulation
> *"Good morning respected examiners. My project is GelScan – a smart, responsive wound dressing film combined with camera-based digital colorimetry. In chronic wounds (such as diabetic foot ulcers), bacterial proliferation and alkaline proteases elevate wound pH to 7.3 – 8.9, while healthy healing skin remains acidic at pH 5.5. We immobilized natural red cabbage anthocyanins into a biocompatible gelatin-sodium alginate biopolymer film. The film changes color in response to wound exudate pH without requiring invasive electrode contact."*

### Minute 2: Sample QR Identification & Live Scanning
> *"To begin, each petri dish carries an encrypted QR code. I click 'Scan Petri Dish QR' to automatically retrieve the batch number and film thickness. Next, I activate the live camera. You can see the circular target reticle averaging pixel values over a defined region of interest to reject sensor noise."*

### Minute 3: Color Extraction & Continuous Interpolation
> *"Notice the real-time extraction: the RGB vector, HSV angle, and CIELAB coordinates appear instantly. When I freeze the frame on Sample C, the app calculates an estimated pH of 6.48. Notice our piecewise interpolation algorithm: instead of merely snapping to discrete integers, it weights the distance in CIELAB color space between adjacent reference buffers, computing realistic fractional pH values with a calculated confidence rating."*

### Minute 4: Live Laboratory Validation
> *"GelScan is built on scientific rigor. I will now immerse this calibrated glass electrode pH meter into the same buffer. The digital meter reads pH 6.52. I click 'Lab Validation', record 6.52, and the system immediately calculates a negligible error of -0.04 pH units, updating our statistical validation curve with Mean Absolute Error (MAE) and RMSE."*

### Minute 5: Analytics & One-Click PDF Report
> *"Finally, in the 'Research Analytics' tab, we can observe the hypsochromic and bathochromic spectral shifts in the pH vs Hue curve, as well as kinetic time-course degradation. With a single click on 'Download PDF Report', GelScan produces a publication-ready scientific summary document featuring our college header, colorimetric metrics, validation benchmark, and faculty supervisor signature blocks."*

---

## ❓ 4. Frequently Asked Questions by Examiners (Viva Cheat Sheet)

1. **Q: Why combine Gelatin with Sodium Alginate?**  
   *A:* Gelatin provides protein matrix biocompatibility and cell adhesion; sodium alginate provides high fluid/exudate absorption capacity and ionic crosslinking with calcium ions, preventing film dissolution.

2. **Q: How do you handle variations in room lighting (fluorescent vs yellow sunlight)?**  
   *A:* GelScan includes an optical white-balance normalization module. Aiming the reticle at a standard white card under current room lighting establishes scaling factors ($255/R_w, 255/G_w, 255/B_w$), normalizing subsequent sample readings against the standard CIE D65 illuminant.

3. **Q: Why use CIELAB color space instead of standard RGB?**  
   *A:* RGB is device-dependent and non-perceptually uniform. CIELAB ($L^*, a^*, b^*$) models human visual perception, where Euclidean distance $\Delta E$ directly reflects perceptual color difference.

4. **Q: Is this considered a medical diagnostic device?**  
   *A:* No, sir/ma'am. In accordance with Indian CDSCO and FDA investigational guidelines, GelScan is strictly designated as an experimental optical evaluation prototype for B.Pharm formulation research. We do not make clinical in-vivo diagnostic claims without multi-center clinical trials.
