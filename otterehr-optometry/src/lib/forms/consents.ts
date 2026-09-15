import {
  RELATIONSHIPS,
  area,
  box,
  checks,
  date,
  display,
  form,
  radio,
  section,
  select,
  sign,
  text,
  yesno,
} from "../fields";
import type { PracticeForm } from "../types";

function patientHeader() {
  return [
    text("last-name", "Last name", true),
    text("first-name", "First name", true),
    date("dob", "Date of birth", true),
  ];
}

export const consentForms: PracticeForm[] = [
  form({
    slug: "dilation-consent",
    title: "Dilated Fundus Examination Consent",
    shortTitle: "Dilation",
    category: "consent",
    audience: "patient",
    description:
      "Informed consent for tropicamide/phenylephrine dilation: blurred near vision, photophobia, driving, and rare angle-closure risk.",
    ottehrSlot: "consent-forms",
    sections: [
      section("dfe", "Dilation", [
        ...patientHeader(),
        display(
          "dfe-body",
          "A dilated fundus examination lets the doctor view the retina, optic nerve, macula, and vitreous. Drops (typically tropicamide and/or phenylephrine) enlarge the pupil for 2–6 hours. Near vision will blur and lights will glare. You should not drive if you feel unsafe; sunglasses will be provided. Rarely, dilation can trigger an acute angle-closure attack in anatomically narrow angles (pain, nausea, rainbow halos, vision loss). Tell staff immediately if that occurs. Declining dilation limits the exam; some disease can be missed in the far periphery.",
        ),
        radio(
          "dfe-choice",
          "Today I choose",
          [
            "I consent to dilation",
            "I decline dilation and accept a limited internal exam",
            "Defer dilation; I will return for a dilated visit",
          ],
          true,
        ),
        yesno("driver-today", "Did you drive yourself today?"),
        sign("signature"),
        select("signer-relationship", "Relationship", RELATIONSHIPS, true),
        date("sign-date", "Date", true),
      ]),
    ],
  }),

  form({
    slug: "retinal-imaging-consent",
    title: "Retinal Imaging / Optomap Screening Consent",
    shortTitle: "Retinal imaging",
    category: "consent",
    audience: "patient",
    description:
      "Screening retinal photos vs dilation vs decline. Typical non-covered wellness imaging with a posted fee.",
    ottehrSlot: "consent-forms",
    sections: [
      section("img", "Retinal screening", [
        ...patientHeader(),
        display(
          "img-body",
          "Ultra-widefield or fundus photographs document the retina and can reveal diabetic retinopathy, macular degeneration, glaucoma suspects, moles, holes, and detachments. Screening images do not always replace a dilated exam, especially with flashes, floaters, high myopia, or diabetes. Vision and medical plans usually do not cover screening photos. The posted fee is due today unless the doctor orders photos as a medical procedure.",
        ),
        text("screening-fee", "Posted screening fee", false, { defaultValue: "$39" }),
        radio(
          "imaging-choice",
          "I choose",
          [
            "Retinal screening images today (I agree to the posted fee if not covered)",
            "Dilation instead of screening images",
            "Both dilation and images",
            "I decline both and understand the internal exam is limited",
          ],
          true,
        ),
        yesno("epilepsy", "History of photosensitive epilepsy?"),
        sign("signature"),
        date("sign-date", "Date", true),
      ]),
    ],
  }),

  form({
    slug: "refraction-waiver",
    title: "Refraction (CPT 92015) Non-Covered Service Notice",
    shortTitle: "Refraction notice",
    category: "consent",
    audience: "patient",
    description:
      "ABN-style notice that determining a glasses prescription is often not a medical-plan benefit.",
    ottehrSlot: "consent-forms",
    sections: [
      section("ref", "Refraction", [
        ...patientHeader(),
        display(
          "ref-body",
          "Refraction (CPT 92015) is the test that determines your glasses prescription. Many medical insurance plans consider it a vision benefit and will not pay it on a medical visit. Your vision plan may cover it as part of a routine exam. If refraction is not covered, the posted fee is your responsibility. You may decline refraction; we then cannot issue or update a spectacle prescription.",
        ),
        text("refraction-fee", "Posted refraction fee", false, { defaultValue: "$45" }),
        radio(
          "refraction-choice",
          "I choose",
          ["Perform refraction; I will pay if not covered", "Decline refraction; no glasses Rx today"],
          true,
        ),
        sign("signature"),
        date("sign-date", "Date", true),
      ]),
    ],
  }),

  form({
    slug: "contact-lens-agreement",
    title: "Contact Lens Evaluation, Fitting & Follow-up Agreement",
    shortTitle: "CL agreement",
    category: "consent",
    audience: "patient",
    description:
      "FDA/medical-device notice, fitting fees, required follow-up, Rx expiration, and sleeping-in-lenses warning.",
    ottehrSlot: "consent-forms",
    sections: [
      section("cl", "Contact lenses", [
        ...patientHeader(),
        display(
          "cl-body",
          "Contact lenses are FDA-regulated medical devices. A contact lens evaluation is separate from a comprehensive eye exam. The fitting fee covers diagnostic lenses and scheduled follow-up visits within the stated window. A prescription is released only after the doctor finds the fit acceptable. Sleeping in lenses (unless a specifically approved extended-wear lens) greatly increases the risk of infection and scarring. Overwear, tap water, and topping off solution are unsafe. State law controls Rx expiration and copy-release.",
        ),
        select(
          "cl-service",
          "Service today",
          [
            "New fit spherical",
            "New fit toric",
            "New fit multifocal",
            "RGP / scleral / specialty",
            "Annual refit same modality",
            "Medically necessary CL",
          ],
          true,
        ),
        text("cl-fee", "Quoted evaluation fee"),
        text("followup-window", "Follow-up included through", false, { defaultValue: "8 weeks / 2 visits" }),
        box("no-sleep", "I will not sleep in lenses unless my doctor prescribes approved extended wear.", true),
        box("followup-agree", "I will return for the required follow-up before a final Rx is released.", true),
        box("hygiene", "I will follow wash/rinse/rub or daily-disposable instructions and never use tap water on lenses or cases.", true),
        sign("signature"),
        date("sign-date", "Date", true),
      ]),
    ],
  }),

  form({
    slug: "cl-rx-release",
    title: "Contact Lens Prescription Release",
    shortTitle: "CL Rx release",
    category: "admin",
    audience: "both",
    description: "FTC Contact Lens Rule acknowledgement: copy of Rx provided, expiration, and quantity.",
    ottehrSlot: "forms-list",
    sections: [
      section("release", "Prescription copy", [
        ...patientHeader(),
        date("exam-date", "Exam date", true),
        text("rx-expiration", "Rx expiration date", true),
        area("parameters", "Final parameters (brand, BC, diam, power, add, cyl/axis, color)", true),
        box("copy-provided", "A copy of this contact lens prescription was provided to the patient at the completion of the fitting.", true),
        radio("method", "Provided by", ["Printed", "Portal / email", "Patient declined a copy (note required)"], true),
        sign("provider-signature", "Provider signature"),
        sign("patient-signature", "Patient acknowledgement"),
        date("sign-date", "Date", true),
      ]),
    ],
  }),

  form({
    slug: "oct-vf-consent",
    title: "OCT, Visual Field & Additional Testing Consent",
    shortTitle: "Advanced testing",
    category: "consent",
    audience: "patient",
    description: "Consent and benefit-check notice for OCT, HVF, topography, pachymetry, and gonioscopy.",
    ottehrSlot: "consent-forms",
    sections: [
      section("tests", "Testing", [
        ...patientHeader(),
        display(
          "test-body",
          "The doctor may recommend OCT of the retina or optic nerve, automated visual fields, corneal topography, pachymetry, fundus photography, or gonioscopy. When ordered for a medical diagnosis these tests are usually billed to medical insurance subject to deductible and copay. Screening versions may be self-pay. You may decline any test.",
        ),
        box("oct-onh", "OCT optic nerve"),
        box("oct-retina", "OCT macula / retina"),
        box("hvf", "Visual field"),
        box("topo", "Corneal topography / tomography"),
        box("pachy", "Pachymetry"),
        box("gonio", "Gonioscopy"),
        box("photos", "Fundus or anterior-segment photos"),
        box("agree-tests", "I consent to the tests checked above.", true),
        sign("signature"),
        date("sign-date", "Date", true),
      ]),
    ],
  }),

  form({
    slug: "foreign-body-consent",
    title: "Corneal / Conjunctival Foreign Body Removal Consent",
    shortTitle: "FB removal",
    category: "procedure",
    audience: "patient",
    description: "Consent for CPT 65222/65205: rust ring, perforation risk, and aftercare.",
    ottehrSlot: "procedure",
    cptHints: ["65222", "65205", "65220"],
    sections: [
      section("fb", "Procedure", [
        ...patientHeader(),
        select("laterality", "Eye", ["OD", "OS", "OU"], true),
        display(
          "fb-body",
          "Removal of a foreign body from the cornea or conjunctiva uses anesthetic drops, a slit lamp, and a needle, spud, or burr. A rust ring may need a second visit. Risks include pain, infection, scarring, irregular astigmatism, incomplete removal, perforation (rare), and need for specialist care. Aftercare typically includes an antibiotic drop, pain control, and no contact lenses until the doctor clears you.",
        ),
        box("fb-consent", "I consent to foreign-body removal and rust-ring debridement if needed.", true),
        sign("signature"),
        date("sign-date", "Date", true),
      ]),
    ],
  }),

  form({
    slug: "punctal-plug-consent",
    title: "Punctal Plug Insertion Consent",
    shortTitle: "Punctal plugs",
    category: "procedure",
    audience: "patient",
    description: "Collagen vs silicone plugs, epiphora, pyogenic granuloma, and migration.",
    ottehrSlot: "procedure",
    cptHints: ["68761"],
    sections: [
      section("plug", "Punctal occlusion", [
        ...patientHeader(),
        select("plug-type", "Plug type", ["Temporary collagen", "Extended dissolvable", "Permanent silicone"], true),
        select("sites", "Sites", ["Lower OD", "Lower OS", "Upper OD", "Upper OS", "Both lower", "All four"], true),
        display(
          "plug-body",
          "Punctal plugs slow tear drainage to treat dry eye. Temporary plugs dissolve. Silicone plugs remain until removed. Risks include watering, irritation, infection, plug loss or migration into the canaliculus, and rarely granuloma. I can request removal.",
        ),
        box("plug-consent", "I consent to punctal plug placement as planned.", true),
        sign("signature"),
        date("sign-date", "Date", true),
      ]),
    ],
  }),

  form({
    slug: "amniotic-membrane-consent",
    title: "Amniotic Membrane Placement Consent",
    shortTitle: "Amniotic membrane",
    category: "procedure",
    audience: "patient",
    description: "Prokera/bio-tissue bandage consent for keratitis, abrasion, or OSD.",
    ottehrSlot: "procedure",
    sections: [
      section("am", "Amniotic membrane", [
        ...patientHeader(),
        select("laterality", "Eye", ["OD", "OS"], true),
        area("indication", "Indication", true),
        display(
          "am-body",
          "A cryopreserved or dehydrated amniotic membrane is placed on the ocular surface to promote healing. Vision will be blurred while the ring or bandage is in place. Risks include discomfort, displacement, infection, and need for replacement. Follow-up is required.",
        ),
        box("am-consent", "I consent to amniotic membrane placement.", true),
        sign("signature"),
        date("sign-date", "Date", true),
      ]),
    ],
  }),

  form({
    slug: "ipl-dry-eye-consent",
    title: "IPL / Thermal Pulsation Dry Eye Procedure Consent",
    shortTitle: "IPL / MG treatment",
    category: "procedure",
    audience: "patient",
    description: "Consent for IPL, LipiFlow/iLux/TearCare: pigment cautions, multiple sessions, not a cure.",
    ottehrSlot: "procedure",
    sections: [
      section("ipl", "Office dry-eye procedure", [
        ...patientHeader(),
        select("modality", "Modality", ["IPL", "Thermal pulsation (LipiFlow / iLux / TearCare)", "BlephEx", "Combination"], true),
        display(
          "ipl-body",
          "These office procedures treat meibomian gland dysfunction. IPL uses light on the eyelids/face; it is not appropriate for all skin types and requires no recent sunburn, isotretinoin, or photosensitizing medications as screened by the doctor. Multiple sessions are typical. Improvement is not guaranteed. Risks include redness, swelling, pigment change, blistering (rare), and incomplete response.",
        ),
        box("ipl-consent", "I consent to the selected dry-eye procedure(s).", true),
        sign("signature"),
        date("sign-date", "Date", true),
      ]),
    ],
  }),

  form({
    slug: "ortho-k-consent",
    title: "Orthokeratology Informed Consent",
    shortTitle: "Ortho-K",
    category: "consent",
    audience: "patient",
    description: "Overnight GP reshaping: infection risk, not FDA-approved for all myopia-control claims, retainer wear.",
    ottehrSlot: "consent-forms",
    sections: [
      section("ok", "Ortho-K", [
        ...patientHeader(),
        display(
          "ok-body",
          "Orthokeratology lenses are worn overnight to flatten the cornea and temporarily reduce myopia. Vision during the day without glasses depends on consistent wear. Risks include microbial keratitis, which can cause permanent vision loss, lens binding, hypoxia, and residual refractive error. This is not a substitute for adult refractive surgery counseling. Myopia-control benefit, when discussed, is an off-label use of some designs and is not a guarantee against progression.",
        ),
        box("ok-consent", "I consent to an orthokeratology fit and understand overnight wear risks.", true),
        box("ok-hygiene", "I will follow cleaning, no-water, and unscheduled-visit instructions.", true),
        sign("signature"),
        date("sign-date", "Date", true),
      ]),
    ],
  }),

  form({
    slug: "myopia-management-consent",
    title: "Myopia Management Consent (Atropine / Soft MF / Outdoor Time)",
    shortTitle: "Myopia management",
    category: "consent",
    audience: "patient",
    description: "Off-label low-dose atropine, dual-focus soft lenses, and lifestyle counseling.",
    ottehrSlot: "consent-forms",
    sections: [
      section("mm", "Myopia management", [
        ...patientHeader(),
        text("child-age", "Patient age"),
        checks("plan", "Plan discussed", [
          "Low-dose atropine",
          "Soft dual-focus / MF myopia-control lens",
          "Ortho-K",
          "Outdoor time ≥2 hours/day",
          "Full-time distance correction",
          "Follow-up every 6 months",
        ]),
        display(
          "mm-body",
          "Myopia management aims to slow axial elongation. Options include low-dose atropine (often 0.01–0.05%, off-label), dual-focus or extended-depth soft lenses, orthokeratology, and increased outdoor time. None freeze myopia. Side effects of atropine can include light sensitivity, near blur, and allergic conjunctivitis. Regular axial-length or cycloplegic follow-up is required.",
        ),
        box("mm-consent", "I consent to the myopia-management plan discussed today.", true),
        sign("signature"),
        date("sign-date", "Date", true),
      ]),
    ],
  }),
];
