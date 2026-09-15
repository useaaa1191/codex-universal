/**
 * Seed content for Ottehr Global Templates (progress-note dropdown).
 * Paste each object into EHR Admin → Templates, or POST as DocumentReference
 * tagged global-templates per issue #6566.
 */
export const GLOBAL_TEMPLATES = [
  {
    name: "Comprehensive adult exam — normal",
    hpi: "Patient presents for comprehensive eye examination. No acute vision loss, flashes, or curtain. Glasses/contact lens history as charted.",
    ros: "- [ ] Denies sudden vision loss\n- [x] Denies flashes/curtain\n- [ ] Reports distance or near blur as in HPI",
    exam: "See optometry exam cards. Default normals: PERRL no APD, EOMs full, CVF FTFC, IOP symmetric, anterior segment quiet, fundus attached with healthy nerves and maculae.",
    mdm: "Routine comprehensive examination. Refraction updated. Dilated fundus examination completed (or imaging + limited view as consented).",
    diagnoses: [
      { code: "H52.13", display: "Myopia, bilateral" },
      { code: "H52.4", display: "Presbyopia" },
    ],
    cpt: [
      { code: "92014", display: "Comprehensive established" },
      { code: "92015", display: "Refraction" },
    ],
    em: { code: "", display: "" },
    instructions:
      "Wear the prescription as discussed. Return in 12 months or sooner for pain, sudden vision change, flashes with a curtain, or a red contact-lens eye.",
  },
  {
    name: "Diabetic dilated exam — no DR",
    hpi: "Annual diabetic eye examination. Last A1c as documented. No new distortion or vision drop.",
    ros: "- [x] Denies metamorphopsia\n- [x] Denies sudden vision loss",
    exam: "Dilated fundus examination. No hemorrhages, exudates, CWS, or DME. C/D stable.",
    mdm: "Type 2 DM without retinopathy today. Continue systemic control with PCP. Repeat dilated exam in 12 months or sooner if vision changes.",
    diagnoses: [{ code: "E11.9", display: "Type 2 diabetes mellitus without complications" }],
    cpt: [
      { code: "92014", display: "Comprehensive established" },
      { code: "92250", display: "Fundus photography" },
    ],
    instructions: "Keep A1c and blood pressure at targets from your PCP. Return in 1 year, or immediately for sudden blur or a shower of floaters.",
  },
  {
    name: "Glaucoma suspect follow-up",
    hpi: "Interval glaucoma-suspect follow-up. Drop list and adherence as charted. No new field complaints.",
    exam: "IOP compared with target. Angles, nerves, OCT RNFL, and HVF reviewed.",
    mdm: "Glaucoma suspect. Target IOP as charted. Continue current therapy vs observe. Next OCT/HVF as ordered.",
    diagnoses: [{ code: "H40.013", display: "Open-angle with borderline findings, bilateral" }],
    cpt: [
      { code: "92012", display: "Intermediate established" },
      { code: "92133", display: "OCT optic nerve" },
    ],
    instructions: "Use drops every day even when the eye feels fine. Bring bottles to each visit. Return as scheduled for pressure and nerve testing.",
  },
  {
    name: "Red eye — CL overwear",
    hpi: "Painful red eye in a contact lens wearer. Overnight wear as documented. Photophobia / discharge as charted.",
    exam: "VA, pupils, IOP, slit lamp with NaFl. Seidel negative unless noted. No infiltrate vs infiltrate as charted.",
    mdm: "Contact-lens related keratitis vs abrasion. Lenses discontinued. Antibiotic coverage. Same-day or 24-hour follow-up. Refer cornea if infiltrate, hypopyon, or worsening.",
    diagnoses: [{ code: "H16.8", display: "Other keratitis" }],
    cpt: [{ code: "99213", display: "E/M established low" }],
    instructions: "No contact lenses. Use drops as written. Return tomorrow or go to emergency care for worsening pain, light sensitivity, or a white spot on the eye.",
  },
  {
    name: "Dry eye / MGD",
    hpi: "Gritty, burning, fluctuating vision worse with screens.",
    exam: "TBUT, staining, MG expression as charted.",
    mdm: "Evaporative dry eye / MGD. Step therapy: heat, lids, PF tears, then prescription anti-inflammatories or in-office procedures.",
    diagnoses: [{ code: "H04.123", display: "Dry eye syndrome of bilateral lacrimal glands" }],
    cpt: [{ code: "92012", display: "Intermediate established" }],
    instructions: "Warm compresses 8–10 minutes twice daily. Preservative-free tears. 20-20-20 blinks. Follow-up as planned.",
  },
  {
    name: "Pediatric comprehensive",
    hpi: "Well-child vision / parental concern as charted. Birth history and school performance reviewed.",
    exam: "Age-appropriate acuity, alignment, stereo, cyclo retinoscopy, anterior and posterior segment.",
    mdm: "Refractive error and binocular status as assessed. Amblyopia risk discussed if present.",
    diagnoses: [{ code: "Z01.00", display: "Encounter for exam of eyes and vision without abnormal findings" }],
    cpt: [{ code: "92004", display: "Comprehensive new" }],
    instructions: "Polycarbonate lenses if glasses prescribed. Return interval as discussed. Call for an eye turn, squinting, or school vision complaints.",
  },
];
