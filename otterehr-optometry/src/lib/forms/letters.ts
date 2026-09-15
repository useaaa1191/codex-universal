import {
  area,
  box,
  checks,
  clrx,
  date,
  display,
  form,
  odos,
  rxField,
  section,
  select,
  sign,
  tel,
  text,
  yesno,
} from "../fields";
import type { PracticeForm } from "../types";

function patient() {
  return [
    text("patient-name", "Patient", true, { span: 2 }),
    date("dob", "DOB", true),
    date("exam-date", "Exam date", true),
    text("provider", "Provider", true, { span: 2 }),
    text("license", "License / NPI"),
  ];
}

export const letterForms: PracticeForm[] = [
  form({
    slug: "spectacle-rx",
    title: "Spectacle Prescription",
    shortTitle: "Glasses Rx",
    category: "rx",
    audience: "both",
    description: "Printable spectacle Rx pad with PD, prism, expiration, and polycarbonate recommendation.",
    ottehrSlot: "forms-list",
    cptHints: ["92015"],
    sections: [
      section("rx", "Prescription", [
        ...patient(),
        rxField("spectacle-rx", "Spectacle Rx"),
        text("pd-binocular", "PD binocular (mm)"),
        text("pd-od", "PD OD"),
        text("pd-os", "PD OS"),
        text("expiration", "Expires"),
        select("use", "Use", ["Full time", "Distance", "Near", "Computer", "Backup", "Safety"]),
        box("poly", "Polycarbonate / Trivex recommended"),
        area("notes", "Notes / AR / photochromic / occupational"),
        sign("provider-signature", "Provider signature"),
        date("sign-date", "Date", true),
      ]),
    ],
  }),

  form({
    slug: "contact-lens-rx",
    title: "Contact Lens Prescription",
    shortTitle: "CL Rx",
    category: "rx",
    audience: "both",
    description: "FTC-compliant contact lens prescription with brand, replacement, and expiration.",
    ottehrSlot: "forms-list",
    sections: [
      section("clrx", "Contact lens Rx", [
        ...patient(),
        clrx("contact-rx", "Parameters"),
        text("replacement", "Replacement schedule", true),
        text("quantity", "Quantity authorized"),
        text("expiration", "Expiration date", true),
        area("care", "Care system / notes"),
        box("copy-given", "Patient received a copy of this prescription.", true),
        sign("provider-signature", "Provider signature"),
        date("sign-date", "Date", true),
      ]),
    ],
  }),

  form({
    slug: "ophthalmology-referral",
    title: "Referral to Ophthalmology / Retina / Cornea / Glaucoma",
    shortTitle: "OD to OMD referral",
    category: "letter",
    audience: "clinician",
    description: "Structured referral letter with laterality, urgency, testing attached, and question for the specialist.",
    ottehrSlot: "patient-instruction",
    sections: [
      section("to", "To", [
        text("specialist", "Specialist / clinic", true, { span: 2 }),
        tel("fax", "Fax"),
        select("subspecialty", "Service", ["Comprehensive OMD", "Retina", "Cornea", "Glaucoma", "Oculoplastics", "Pediatrics / strabismus", "Neuro-oph"], true),
        select("urgency", "Urgency", ["Routine", "2–4 weeks", "This week", "Same day / emergency"], true),
      ]),
      section("letter", "Clinical", [
        ...patient(),
        select("laterality", "Eye", ["OD", "OS", "OU"], true),
        area("reason", "Reason for referral", true, 3),
        area("exam", "Pertinent findings / VA / IOP / OCT", true, 4),
        area("testing-attached", "Testing attached"),
        area("question", "Question for consultant", false, 2),
        sign("provider-signature", "Referring OD"),
        date("sign-date", "Date", true),
      ]),
    ],
  }),

  form({
    slug: "pcp-diabetes-letter",
    title: "Diabetic Eye Exam Report to PCP",
    shortTitle: "PCP diabetes letter",
    category: "letter",
    audience: "clinician",
    description: "HEDIS-friendly dilated exam report for primary care and endocrinology.",
    ottehrSlot: "patient-instruction",
    sections: [
      section("pcp", "Report", [
        text("pcp-name", "PCP / clinic", true, { span: 2 }),
        tel("pcp-fax", "Fax"),
        ...patient(),
        text("a1c", "A1c reported"),
        select("dilation", "Dilated?", ["Yes", "No — limited"], true),
        select("dr-od", "OD retinopathy", ["None", "Mild NPDR", "Moderate NPDR", "Severe NPDR", "PDR", "Ungradable"], true),
        select("dr-os", "OS retinopathy", ["None", "Mild NPDR", "Moderate NPDR", "Severe NPDR", "PDR", "Ungradable"], true),
        select("dme", "DME", ["None", "OD", "OS", "OU"], true),
        area("recommendations", "Recommendations / follow-up", true, 3),
        sign("provider-signature"),
        date("sign-date", "Date", true),
      ]),
    ],
  }),

  form({
    slug: "work-school-excuse",
    title: "Work / School Excuse",
    shortTitle: "Excuse note",
    category: "letter",
    audience: "clinician",
    description: "Ottehr-style excuse with return date, restrictions (no driving post-dilation, no CL).",
    ottehrSlot: "forms-list",
    sections: [
      section("excuse", "Excuse", [
        ...patient(),
        date("out-from", "Unable to attend from", true),
        date("out-to", "Through", true),
        checks("reason", "Reason", [
          "Eye examination / dilation — not safe to drive or do near work",
          "Ocular injury or infection",
          "Post-procedure",
          "Other (see restrictions)",
        ]),
        area("restrictions", "Restrictions"),
        date("return-date", "Return date"),
        sign("provider-signature"),
        date("sign-date", "Date", true),
      ]),
    ],
  }),

  form({
    slug: "dmv-vision",
    title: "Driver Licensing / DMV Vision Report",
    shortTitle: "DMV vision",
    category: "admin",
    audience: "clinician",
    description: "Best-corrected acuity, fields, and restriction recommendations. Attach state-specific PDF in Ottehr forms list.",
    ottehrSlot: "forms-list",
    sections: [
      section("dmv", "Vision for driving", [
        ...patient(),
        text("license-number", "License / ID number"),
        odos("bcva", "Best-corrected VA"),
        select("field", "Visual field", ["≥120° both eyes", "Restricted", "Does not meet standard"], true),
        yesno("progressive-lenses-ok", "Progressive / bifocal adapted?"),
        checks("restrictions", "Recommended restrictions", [
          "None",
          "Corrective lenses required",
          "Daylight only",
          "No interstate / commercial",
          "Does not meet standard — do not certify",
        ]),
        area("comments", "Comments"),
        sign("provider-signature"),
        date("sign-date", "Date", true),
      ]),
    ],
  }),

  form({
    slug: "after-visit-summary",
    title: "After-Visit Summary",
    shortTitle: "AVS",
    category: "letter",
    audience: "both",
    description: "Patient-facing summary: diagnoses in plain language, drops, glasses/CL, follow-up.",
    ottehrSlot: "patient-instruction",
    sections: [
      section("avs", "Today's visit", [
        ...patient(),
        area("plain-findings", "What we found (plain language)", true, 3),
        area("do-today", "What you should do", true, 3),
        area("drops", "Eye drops / medications"),
        area("glasses-cl", "Glasses / contact lenses"),
        text("follow-up", "Follow-up", true, { span: 2 }),
        text("when-to-call", "Call immediately for", false, {
          span: 3,
          defaultValue: "Sudden vision loss, flashes with a curtain, severe pain, chemical injury",
        }),
        sign("provider-signature"),
        date("sign-date", "Date", true),
      ]),
    ],
  }),

  form({
    slug: "school-vision-screening",
    title: "School Vision Screening Report",
    shortTitle: "School screening",
    category: "admin",
    audience: "clinician",
    description: "Pass/refer screening for school nurses and pediatricians.",
    ottehrSlot: "forms-list",
    sections: [
      section("school", "Screening", [
        ...patient(),
        text("school", "School / grade"),
        odos("bcva", "Best-corrected VA"),
        select("result", "Result", ["Pass", "Refer — acuity", "Refer — alignment", "Unable / incomplete"], true),
        area("notes", "Notes for parent"),
        sign("provider-signature"),
        date("sign-date", "Date", true),
      ]),
    ],
  }),

  form({
    slug: "patient-ed-dry-eye",
    title: "Patient Education: Dry Eye",
    shortTitle: "Ed — dry eye",
    category: "education",
    audience: "patient",
    description: "Home regimen: heat, lid hygiene, tears, environment, when to return.",
    ottehrSlot: "patient-instruction",
    sections: [
      section("ed", "Your dry-eye plan", [
        ...patient(),
        display(
          "dry-ed",
          "Dry eye is a chronic surface problem, not a one-drop cure. Twice-daily warm compresses (8–10 minutes) plus lid hygiene help oil glands. Use preservative-free tears when screens or AC flare symptoms. Point vents away from your face. 20-20-20 blinks. Stop sleeping in contact lenses. Return sooner for increasing redness, light sensitivity, or vision drop.",
        ),
        area("custom", "Your specific plan", false, 4),
        sign("provider-signature"),
        date("sign-date", "Date", true),
      ]),
    ],
  }),

  form({
    slug: "patient-ed-glaucoma",
    title: "Patient Education: Glaucoma",
    shortTitle: "Ed — glaucoma",
    category: "education",
    audience: "patient",
    description: "Silent disease, drop timing, skip-dose rules, OCT/field follow-up.",
    ottehrSlot: "patient-instruction",
    sections: [
      section("ed", "Glaucoma education", [
        ...patient(),
        display(
          "glc-ed",
          "Glaucoma damages the optic nerve, often without pain. Vision lost to glaucoma does not return. Daily drops only work if they reach the eye: one drop, close eyes 1 minute, wait 5 minutes between bottles. Do not stop drops because the eye 'feels fine.' Missed doses: take the next dose as scheduled unless your doctor said otherwise. Keep OCT and visual field appointments even when vision seems stable.",
        ),
        area("custom", "Your drop schedule", false, 4),
        sign("provider-signature"),
        date("sign-date", "Date", true),
      ]),
    ],
  }),

  form({
    slug: "patient-ed-amd",
    title: "Patient Education: Macular Degeneration",
    shortTitle: "Ed — AMD",
    category: "education",
    audience: "patient",
    description: "Amsler grid, AREDS2, smoking, conversion symptoms.",
    ottehrSlot: "patient-instruction",
    sections: [
      section("ed", "AMD education", [
        ...patient(),
        display(
          "amd-ed",
          "The macula is the central part of the retina used for reading and faces. Dry AMD is monitored; wet AMD needs urgent retina care. Check an Amsler grid daily with each eye covered. Call the same day for new distortion, a gray spot, or sudden central blur. AREDS2 vitamins help selected intermediate dry AMD — they are not candy for every patient. Stopping smoking is the highest-yield lifestyle change.",
        ),
        area("custom", "Your plan", false, 3),
        sign("provider-signature"),
        date("sign-date", "Date", true),
      ]),
    ],
  }),

  form({
    slug: "patient-ed-diabetes",
    title: "Patient Education: Diabetes and the Eyes",
    shortTitle: "Ed — diabetes",
    category: "education",
    audience: "patient",
    description: "Dilated exams yearly or more, A1c, DME warning signs.",
    ottehrSlot: "patient-instruction",
    sections: [
      section("ed", "Diabetes education", [
        ...patient(),
        display(
          "dm-ed",
          "Diabetes can damage retinal blood vessels before you notice a change in sight. A dilated exam (and often photos or OCT) is how we catch this. Keep A1c, blood pressure, and cholesterol at the targets your PCP set. Call promptly for sudden blur, a shower of floaters, or a curtain over vision. Yearly exams are the minimum; some patients need to return sooner.",
        ),
        area("custom", "Your follow-up", false, 3),
        sign("provider-signature"),
        date("sign-date", "Date", true),
      ]),
    ],
  }),

  form({
    slug: "patient-ed-cl-hygiene",
    title: "Patient Education: Contact Lens Hygiene",
    shortTitle: "Ed — CL hygiene",
    category: "education",
    audience: "patient",
    description: "No water, no topping off, replacement schedule, red-eye protocol.",
    ottehrSlot: "patient-instruction",
    sections: [
      section("ed", "Contact lens safety", [
        ...patient(),
        display(
          "cl-ed",
          "Wash and dry hands first. Daily disposables: wear once, then throw away. Reusable lenses: rub, rinse, and store in fresh solution; never top off. Replace the case every 3 months. No tap water, no showering or swimming in lenses. Do not sleep in lenses unless your doctor prescribed an approved overnight lens. Red, painful, light-sensitive eye: lenses out, call us the same day. A white spot on the cornea is an emergency.",
        ),
        area("custom", "Your replacement schedule / brand", false, 3),
        sign("provider-signature"),
        date("sign-date", "Date", true),
      ]),
    ],
  }),
];
