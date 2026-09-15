import {
  area,
  checks,
  clrx,
  date,
  heading,
  odos,
  rxField,
  section,
  select,
  sign,
  text,
  yesno,
} from "../fields";
import type { FormField, FormSection } from "../types";

export function visitHeader(extra: FormField[] = []): FormSection {
  return section("header", "Visit", [
    text("patient-name", "Patient", true, { span: 2 }),
    date("dob", "DOB", true),
    date("visit-date", "Visit date", true),
    text("provider", "Provider", true),
    text("technician", "Technician"),
    select("visit-type", "Visit type", [
      "Comprehensive new",
      "Comprehensive established",
      "Intermediate",
      "Medical / problem-focused",
      "Contact lens",
      "Follow-up",
      "Urgency",
    ]),
    ...extra,
  ]);
}

export function hpiSection(): FormSection {
  return section("hpi", "Chief complaint & HPI", [
    area("chief-complaint", "Chief complaint", true, 2),
    area(
      "hpi",
      "HPI (location, quality, severity, timing, context, modifying factors, associated signs)",
      false,
      4,
    ),
    checks("symptoms", "Associated symptoms", [
      "Distance blur",
      "Near blur",
      "Diplopia",
      "Pain",
      "Redness",
      "Photophobia",
      "Flashes",
      "Floaters",
      "Headache",
      "Dryness",
    ]),
  ]);
}

export function historyStrip(): FormSection {
  return section("hx", "History strip", [
    area("meds", "Medications / drops", false, 2),
    area("allergies", "Allergies", false, 2),
    area("pmh", "PMH / POH", false, 2),
    yesno("diabetic", "Diabetes?"),
    text("a1c", "A1c / last BS"),
    yesno("pregnant", "Pregnant / nursing?"),
  ]);
}

export function entranceSection(): FormSection {
  return section(
    "entrance",
    "Entrance testing",
    [
      heading("Visual acuity"),
      odos("va-sc-dist", "DVA sc", "20/"),
      odos("va-cc-dist", "DVA cc", "20/"),
      odos("va-ph", "Pinhole", "20/"),
      odos("va-near", "Near", "20/"),
      heading("Pupils / motility / fields"),
      odos("pupils", "Pupils"),
      text("apd", "APD", false, { placeholder: "None" }),
      odos("eoms", "EOMs"),
      odos("cvf", "Confrontation fields"),
      odos("cover", "Cover test (dist/near)"),
      odos("stereo", "Stereo / NPC / NPC recovery"),
      odos("color", "Color (Ishihara plates)"),
    ],
    "Record OD in the first box and OS in the second. OU can go in notes.",
  );
}

export function refractionSection(): FormSection {
  return section("refraction", "Refraction & keratometry", [
    heading("Keratometry / autorefraction"),
    odos("k-readings", "Ks (flat/steep @ axis)"),
    odos("auto-rx", "Auto-Rx"),
    heading("Manifest"),
    odos("manifest", "Manifest (sph cyl x axis)"),
    odos("manifest-add", "Add"),
    odos("manifest-va", "VA with manifest"),
    heading("Cycloplegic"),
    odos("cyclo", "Cyclo Rx"),
    odos("cyclo-va", "VA with cyclo"),
    text("balance", "Binocular balance / NRA-PRA / FCC"),
    area("rx-notes", "Refraction notes", false, 2),
  ]);
}

export function iopSection(): FormSection {
  return section("iop", "Intraocular pressure", [
    select("iop-method", "Method", ["NCT", "iCare", "Goldmann", "Tonopen", "Perkins", "Not performed"]),
    odos("iop", "IOP (mmHg)"),
    text("iop-time", "Time"),
    text("pachy-od", "Pachymetry OD (µm)"),
    text("pachy-os", "Pachymetry OS (µm)"),
    odos("cct-corrected-target", "Target / corrected notes"),
  ]);
}

export function anteriorSection(): FormSection {
  return section("anterior", "Anterior segment (slit lamp)", [
    odos("lids-lashes", "Lids / lashes"),
    odos("lacrimal", "Lacrimal / puncta"),
    odos("conjunctiva", "Conjunctiva / sclera"),
    odos("cornea", "Cornea"),
    odos("tear-film", "Tear film / TBUT / staining"),
    odos("ac", "Anterior chamber"),
    odos("iris", "Iris / angles (van Herick)"),
    odos("lens", "Lens"),
    odos("anterior-vitreous", "Anterior vitreous"),
    area("anterior-notes", "Anterior notes / gonioscopy", false, 2),
  ]);
}

export function posteriorSection(): FormSection {
  return section("posterior", "Posterior segment", [
    select("dilation", "Dilation", [
      "Dilated — tropicamide 1%",
      "Dilated — trop + PE 2.5%",
      "Not dilated",
      "Deferred",
      "Patient declined",
    ]),
    text("dilation-time", "Drops / time"),
    select("view-method", "View", ["90D", "78D", "BIO 20D", "BIO 28D", "Direct", "Optomap only", "Not viewed"]),
    odos("vitreous", "Vitreous"),
    odos("cd-ratio", "C/D"),
    odos("onh", "Optic nerve (color, rims, NFL, PPA)"),
    odos("macula", "Macula"),
    odos("vessels", "Vessels"),
    odos("post-pole", "Posterior pole"),
    odos("periphery", "Periphery"),
    area("posterior-notes", "Fundus notes / holes / lattice / nevus map", false, 3),
  ]);
}

export function testingSection(): FormSection {
  return section("testing", "Additional testing", [
    checks("tests-done", "Performed today", [
      "Fundus photos",
      "OCT ONH",
      "OCT macula",
      "OCT anterior",
      "HVF 24-2",
      "HVF 10-2",
      "FDT / screening field",
      "Topography",
      "Pachymetry",
      "Gonioscopy",
      "Amsler",
      "Meibography",
    ]),
    area("testing-results", "Results / interpretation", false, 3),
  ]);
}

export function assessmentPlanSection(diagnoses: string[]): FormSection {
  return section("ap", "Assessment & plan", [
    checks("diagnoses", "Diagnoses", diagnoses),
    area("assessment", "Assessment (MDM)", false, 4),
    area("plan", "Plan / orders / meds / referrals", true, 4),
    area("instructions", "Patient instructions", false, 3),
    select("follow-up", "Follow-up", [
      "PRN / 1 year",
      "6 months",
      "3 months",
      "4–6 weeks",
      "1–2 weeks",
      "1–2 days",
      "Tomorrow AM",
      "Return if worse",
      "Refer same day",
    ]),
    rxField("spectacle-rx", "Spectacle Rx"),
    clrx("contact-rx", "Contact lens Rx (if finalized)"),
    sign("provider-signature", "Provider signature"),
    date("sign-date", "Date"),
  ]);
}

export const COMMON_DIAGNOSES = [
  "Myopia",
  "Hyperopia",
  "Astigmatism",
  "Presbyopia",
  "Mixed astigmatism",
  "Dry eye disease",
  "Allergic conjunctivitis",
  "Cataract",
  "Glaucoma suspect",
  "POAG",
  "Diabetes without retinopathy",
  "NPDR",
  "PDR",
  "AMD (dry)",
  "AMD (wet / refer)",
  "Vitreous degeneration / floaters",
  "PVD",
  "Blepharitis / MGD",
  "Contact lens overwear",
  "Amblyopia",
];

export const EXAM_WNL: Record<string, string> = {
  "va-sc-dist": JSON.stringify({ od: "20/20", os: "20/20" }),
  "va-cc-dist": JSON.stringify({ od: "20/20", os: "20/20" }),
  "va-ph": JSON.stringify({ od: "NI", os: "NI" }),
  "va-near": JSON.stringify({ od: "20/20", os: "20/20" }),
  pupils: JSON.stringify({ od: "PERRL", os: "PERRL" }),
  apd: "None",
  eoms: JSON.stringify({ od: "Full, no pain", os: "Full, no pain" }),
  cvf: JSON.stringify({ od: "FTFC", os: "FTFC" }),
  cover: JSON.stringify({ od: "Ortho D/N", os: "Ortho D/N" }),
  iop: JSON.stringify({ od: "15", os: "15" }),
  "lids-lashes": JSON.stringify({ od: "Clear", os: "Clear" }),
  conjunctiva: JSON.stringify({ od: "Quiet, white", os: "Quiet, white" }),
  cornea: JSON.stringify({ od: "Clear", os: "Clear" }),
  ac: JSON.stringify({ od: "D&Q", os: "D&Q" }),
  iris: JSON.stringify({ od: "WNL, angles open", os: "WNL, angles open" }),
  lens: JSON.stringify({ od: "Clear", os: "Clear" }),
  vitreous: JSON.stringify({ od: "Clear", os: "Clear" }),
  "cd-ratio": JSON.stringify({ od: "0.3", os: "0.3" }),
  onh: JSON.stringify({ od: "Pink, sharp, intact rims", os: "Pink, sharp, intact rims" }),
  macula: JSON.stringify({ od: "Flat, dry, +FLR", os: "Flat, dry, +FLR" }),
  vessels: JSON.stringify({ od: "Normal caliber, ALR WNL", os: "Normal caliber, ALR WNL" }),
  periphery: JSON.stringify({ od: "Attached, no holes/tears", os: "Attached, no holes/tears" }),
};
