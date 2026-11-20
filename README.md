# GelScan – Smart Gelatin pH Analyzer (v2.0 PRO)

A scientifically-validated, responsive web application combining camera-based digital colorimetry with pH-sensitive gelatin/alginate wound dressing films for **B.Pharm final-year research**.

---

## 🔬 1. Project Overview & Chemical Context

- **Academic Context:** B.Pharm Final-Year Research Project
- **Biopolymer Matrix:** Gelatin (4–6% w/v) + Sodium Alginate (1–2% w/v) + Glycerol (1.5% v/v)
- **Natural Indicator:** Anthocyanin extract (Red Cabbage, *Brassica oleracea var. capitata f. rubra*)
- **Sensor Functionality:**
  - **Acidic (pH 1.0 – 3.0):** Flavylium cation (Intense Crimson Red)
  - **Mildly Acidic (pH 4.0 – 5.5):** Carbinol pseudo-base (Pinkish Coral to Rose) — *Normal skin & exudate*
  - **Neutralizing (pH 6.0 – 7.0):** Purple to Violet — *Acute healing wound exudate*
  - **Physiological Neutral (pH 7.0 – 7.5):** Neutral quinoidal base (Deep Blue-Violet)
  - **Alkaline (pH 8.0 – 9.0):** Anionic quinoidal base (Teal to Emerald Green) — *Chronic/infected wound*
  - **Strong Alkaline (pH 10.0 – 12.0):** Degraded chalcone species (Amber Yellow)

---

## 🚀 2. Key Features

### 📸 Digital Image Analysis & Color Extraction
- **Live Camera Scanning:** Front and rear camera support (`facingMode: environment`) with mobile torch toggle.
- **Adjustable Target Reticle (ROI):** Dynamic circular region-of-interest with pixel averaging to suppress sensor noise.
- **Gallery & WhatsApp Upload:** Full support for images saved from WhatsApp or gallery, with interactive click-to-sample crosshairs.
- **White Balance Correction:** One-click room lighting normalization against a standard white reference card to cancel out warm yellow incandescent or dim fluorescent laboratory lamps.

### 🧪 Dual pH Estimation Engine
- **Continuous Piecewise Interpolation:** Inverse-distance weighted interpolation between adjacent reference buffers for precise fractional pH estimates (e.g., pH 6.85).
- **Nearest Buffer Reference:** Euclidean and CIELAB $\Delta E$ distance matching.
- **Reliability & Confidence Scoring:** CIELAB $\Delta E$ error estimation with match quality classification (Excellent, Good, Moderate, Uncertain).

### 🏷️ Sample Identification & QR Code System
- **Sample Metadata:** Auto-incrementing Sample ID, Formulation Batch Number, Time-point tracking (0 min, 15 min, 1 hr, 24 hr), film thickness, and operator notes.
- **QR Label Generator:** Generates printable QR codes for petri dishes and test tubes with a one-click print feature.
- **Camera QR Scanner:** Decodes petri dish labels in real-time to autofill metadata before scanning.

### 📊 Validation & Scientific Analytics
- **Glass-Electrode pH Meter Validation:** Direct benchmarking with benchtop laboratory pH meters to compute $\Delta\text{pH}$, Relative Error (%), Mean Absolute Error (MAE), RMSE, and Pearson $R^2$.
- **Research Data Visualisation:** Interactive SVG plots for pH vs Hue angle ($\theta^\circ$), RGB intensity channels (0–255), and time-course kinetic degradation curves.
- **Side-by-Side Comparison:** Compare up to 4 samples simultaneously to analyze batch uniformity and time-dependent color transitions.
- **Export Formats:** Full CSV dataset export and professional downloadable PDF scientific reports featuring institutional headers and faculty supervisor signature lines.

---

## 🏫 3. How to Access in College (Wi-Fi & Mobile Setup)

### Option A: College Campus / Department Wi-Fi
1. Ensure your Windows laptop and mobile smartphones are connected to the same college Wi-Fi.
2. Launch the application:
   ```bash
   npm run dev -- --host
   ```
   *(Or double-click `start-server.bat`)*
3. GelScan will display a **College Lab Mobile Connect** button in the header.
4. Click it to view your local IP and a live QR Code.
5. Point your phone camera at the screen to instantly launch GelScan on Android Chrome or Safari!

### Option B: Mobile Hotspot (No Internet Needed!)
1. Turn on the **Portable Hotspot** on your mobile phone or laptop.
2. Connect both devices to this hotspot.
3. Open `http://<laptop-ip>:5173` on your mobile browser.
4. All image processing, camera analysis, and storage run **100% locally on the device** without external server calls.

---

## 📜 4. Patent & Intellectual Property Notice

- **Prior Art Awareness:** Camera-based wound pH monitoring and color-changing dressings exist in published literature. Do not assume the general concept is novel.
- **Potential Patentable Aspects:**
  1. Specific gelatin/alginate/anthocyanin stoichiometry and cross-linking stability.
  2. Novel film drying protocols preventing anthocyanin thermal degradation.
  3. Integrated continuous interpolation algorithm coupled with white-card lighting normalization.
- **Non-Disclosure Rule:** Maintain experimental confidentiality and consult your college IPR/Patent cell before public presentation or publication.

---

## ⚖️ 5. Academic & Non-Diagnostic Disclaimer

> **IMPORTANT:** GelScan is an experimental research tool developed exclusively for pharmaceutical education and laboratory evaluation. Colorimetric estimations must not be used for direct clinical diagnosis or medical decision-making without formal multi-center clinical validation and regulatory clearance.
