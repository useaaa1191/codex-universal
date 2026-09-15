export interface CodeRow {
  code: string;
  description: string;
  notes?: string;
}

export const CPT_CODES: CodeRow[] = [
  { code: "92004", description: "Comprehensive eye exam, new patient" },
  { code: "92014", description: "Comprehensive eye exam, established" },
  { code: "92002", description: "Intermediate exam, new" },
  { code: "92012", description: "Intermediate exam, established" },
  { code: "92015", description: "Determination of refractive state" },
  { code: "92020", description: "Gonioscopy" },
  { code: "92025", description: "Corneal topography" },
  { code: "92083", description: "Visual field, extended (e.g. 24-2)" },
  { code: "92132", description: "OCT anterior segment" },
  { code: "92133", description: "OCT optic nerve" },
  { code: "92134", description: "OCT retina" },
  { code: "92250", description: "Fundus photography" },
  { code: "92285", description: "External ocular photography" },
  { code: "76514", description: "Corneal pachymetry" },
  { code: "92310", description: "Contact lens fit, corneal, both eyes" },
  { code: "92311", description: "CL fit, corneal, aphakia one eye" },
  { code: "92072", description: "Fitting of CL for keratoconus" },
  { code: "68761", description: "Closure of lacrimal punctum by plug" },
  { code: "65222", description: "Corneal FB removal with slit lamp" },
  { code: "65205", description: "Removal of FB, conjunctiva, superficial" },
  { code: "99213", description: "Office E/M established, low MDM" },
  { code: "99214", description: "Office E/M established, moderate MDM" },
  { code: "99203", description: "Office E/M new, low MDM" },
  { code: "99204", description: "Office E/M new, moderate MDM" },
];

export const ICD10_CODES: CodeRow[] = [
  { code: "H52.13", description: "Myopia, bilateral" },
  { code: "H52.03", description: "Hyperopia, bilateral" },
  { code: "H52.223", description: "Regular astigmatism, bilateral" },
  { code: "H52.4", description: "Presbyopia" },
  { code: "H52.31", description: "Anisometropia" },
  { code: "H04.123", description: "Dry eye syndrome, bilateral" },
  { code: "H01.00A", description: "Unspecified blepharitis, unspecified eye, upper and lower lids" },
  { code: "H10.45", description: "Other chronic allergic conjunctivitis" },
  { code: "H10.013", description: "Acute follicular conjunctivitis, bilateral" },
  { code: "H25.13", description: "Age-related nuclear cataract, bilateral" },
  { code: "H40.013", description: "Open-angle glaucoma suspect, bilateral" },
  { code: "H40.113*", description: "Primary open-angle glaucoma (stage 7th character)" },
  { code: "E11.9", description: "Type 2 diabetes without complications" },
  { code: "E11.319", description: "T2DM with unspecified NPDR without DME" },
  { code: "E11.329", description: "T2DM with mild NPDR without DME" },
  { code: "E11.339", description: "T2DM with moderate NPDR without DME" },
  { code: "E11.351*", description: "T2DM with PDR with DME (laterality 7th)" },
  { code: "H35.313*", description: "Nonaexudative AMD (stage)" },
  { code: "H35.323*", description: "Exudative AMD" },
  { code: "H43.813", description: "Vitreous degeneration, bilateral" },
  { code: "H53.2", description: "Diplopia" },
  { code: "H50.00", description: "Unspecified esotropia" },
  { code: "H53.021", description: "Refractive amblyopia, right eye" },
  { code: "H11.001", description: "Unspecified pterygium, right eye" },
  { code: "S05.00XA", description: "Injury of conjunctiva / corneal abrasion without FB, unspecified eye, initial" },
];

export const LOINC_HINTS: CodeRow[] = [
  { code: "79880-9", description: "Visual acuity, left eye" },
  { code: "79881-7", description: "Visual acuity, right eye" },
  { code: "79882-5", description: "Intraocular pressure, left eye" },
  { code: "79883-3", description: "Intraocular pressure, right eye" },
  { code: "65897-0", description: "Refraction of eye" },
  { code: "59284-0", description: "Consent document" },
  { code: "64292-6", description: "Privacy policy" },
];
