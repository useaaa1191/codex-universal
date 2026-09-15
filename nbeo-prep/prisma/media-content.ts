// Seed content for videos, Part-3 checklists, study resources, and blog posts.

export interface VideoSeed {
  partSlug?: "PART_1" | "PART_2" | "PART_3";
  subjectSlug?: string;
  title: string;
  description: string;
  youtubeId: string;
  durationSec: number;
  category: string;
  isFree?: boolean;
}

export const VIDEOS: VideoSeed[] = [
  {
    partSlug: "PART_3",
    subjectSlug: "glaucoma-iop-skills",
    title: "Goldmann Applanation Tonometry — Full Technique",
    description:
      "Step-by-step demonstration of Goldmann applanation tonometry: prism setup, fluorescein instillation, mire alignment, and reading the endpoint.",
    youtubeId: "n2sqNvW3s0k",
    durationSec: 512,
    category: "Clinical Skills",
    isFree: true,
  },
  {
    partSlug: "PART_3",
    subjectSlug: "posterior-segment-skills",
    title: "Binocular Indirect Ophthalmoscopy Demonstration",
    description:
      "Proper BIO setup, patient positioning, lens handling, and systematic peripheral retinal evaluation with scleral indentation.",
    youtubeId: "y6120QOlsfU",
    durationSec: 640,
    category: "Clinical Skills",
    isFree: true,
  },
  {
    partSlug: "PART_3",
    subjectSlug: "refractive-skills",
    title: "Static Retinoscopy Made Simple",
    description:
      "Neutralizing with and against motion, working distance compensation, and finding the reflex efficiently.",
    youtubeId: "aircAruvnKk",
    durationSec: 700,
    category: "Clinical Skills",
    isFree: true,
  },
  {
    partSlug: "PART_3",
    subjectSlug: "anterior-segment-skills",
    title: "Slit Lamp Biomicroscopy Illumination Techniques",
    description:
      "Diffuse, direct, specular reflection, retro-illumination, and sclerotic scatter — when to use each.",
    youtubeId: "5MgBikgcWnY",
    durationSec: 560,
    category: "Clinical Skills",
  },
  {
    partSlug: "PART_1",
    subjectSlug: "geometric-physical-optics",
    title: "Vergence and the Fundamental Optics Equation",
    description:
      "Building intuition for V = U + F, sign conventions, and solving image location problems fast.",
    youtubeId: "Iuv6hY6zsd0",
    durationSec: 480,
    category: "Lesson",
    isFree: true,
  },
  {
    partSlug: "PART_2",
    subjectSlug: "glaucoma",
    title: "Interpreting OCT RNFL and Ganglion Cell Analysis",
    description:
      "A structured approach to reading glaucoma OCT printouts, red/green disease, and artifacts.",
    youtubeId: "WvhYuDvH17I",
    durationSec: 720,
    category: "Lesson",
  },
  {
    partSlug: "PART_2",
    subjectSlug: "posterior-segment-disease",
    title: "Diabetic Retinopathy Staging Walkthrough",
    description:
      "From mild NPDR to PDR — recognizing the features that change management and referral urgency.",
    youtubeId: "8jLOx1hD3_o",
    durationSec: 600,
    category: "Lesson",
  },
];

export interface ChecklistSeed {
  partSlug: "PART_3";
  subjectSlug: string;
  title: string;
  technique: string;
  description: string;
  steps: { text: string; critical?: boolean }[];
}

export const CHECKLISTS: ChecklistSeed[] = [
  {
    partSlug: "PART_3",
    subjectSlug: "glaucoma-iop-skills",
    title: "Goldmann Applanation Tonometry",
    technique: "Tonometry",
    description:
      "Standardized procedural checklist for Goldmann applanation tonometry as graded on the NBEO Clinical Skills Examination.",
    steps: [
      { text: "Explain the procedure and obtain patient cooperation.", critical: true },
      { text: "Instill topical anesthetic and sodium fluorescein.", critical: true },
      { text: "Disinfect and mount the tonometer prism; set graduation to 1.", critical: true },
      { text: "Set the cobalt-blue filter and appropriate illumination angle (~60°)." },
      { text: "Seat the patient with forehead against the headrest and chin in the chinrest.", critical: true },
      { text: "Instruct the patient to look straight ahead and keep both eyes open." },
      { text: "Advance the prism until it just contacts the corneal apex.", critical: true },
      { text: "Adjust the dial until the inner edges of the mires just touch.", critical: true },
      { text: "Read the IOP (dial value × 10) at the pulsation midpoint.", critical: true },
      { text: "Withdraw the prism, disinfect it, and record the pressure with time of day." },
    ],
  },
  {
    partSlug: "PART_3",
    subjectSlug: "posterior-segment-skills",
    title: "Binocular Indirect Ophthalmoscopy",
    technique: "Ophthalmoscopy",
    description:
      "Checklist for performing BIO with a condensing lens and systematic peripheral evaluation.",
    steps: [
      { text: "Dilate the pupil and dim the room lights.", critical: true },
      { text: "Adjust the headset for pupillary distance and mirror alignment.", critical: true },
      { text: "Set illumination to a comfortable, safe level." },
      { text: "Position at arm's length; hold the condensing lens correctly oriented.", critical: true },
      { text: "Align examiner eye, condensing lens, and patient pupil coaxially.", critical: true },
      { text: "Instruct the patient to look in the direction of the field being examined." },
      { text: "Examine all quadrants systematically, including the far periphery.", critical: true },
      { text: "Perform scleral indentation to view the ora serrata where indicated." },
      { text: "Mentally invert and reverse findings when charting.", critical: true },
      { text: "Record findings on a fundus diagram with correct orientation." },
    ],
  },
  {
    partSlug: "PART_3",
    subjectSlug: "refractive-skills",
    title: "Static Retinoscopy",
    technique: "Retinoscopy",
    description:
      "Checklist for objective refraction using static retinoscopy at a defined working distance.",
    steps: [
      { text: "Seat the patient and set the target for fixation at distance.", critical: true },
      { text: "Establish and maintain a consistent working distance (e.g., 66 cm).", critical: true },
      { text: "Align the retinoscope with the patient's visual axis, avoiding the fixation target." },
      { text: "Sweep the reflex and identify with vs. against motion.", critical: true },
      { text: "Neutralize each principal meridian with spheres and cylinders.", critical: true },
      { text: "Confirm neutrality by observing the fill/flash of the reflex." },
      { text: "Subtract the working-distance lens (e.g., +1.50 D) from the gross finding.", critical: true },
      { text: "Record the net retinoscopy result for each eye." },
    ],
  },
  {
    partSlug: "PART_3",
    subjectSlug: "sensorimotor-neuro-skills",
    title: "Pupillary Testing (including APD)",
    technique: "Pupils",
    description:
      "Checklist for pupil evaluation including the swinging flashlight test for a relative afferent pupillary defect.",
    steps: [
      { text: "Dim room lights and use a bright, focal transilluminator.", critical: true },
      { text: "Have the patient fixate a distant target to relax accommodation." },
      { text: "Assess pupil size, shape, and symmetry in dim and bright light.", critical: true },
      { text: "Test direct and consensual light responses in each eye.", critical: true },
      { text: "Perform the swinging flashlight test with even timing/intensity.", critical: true },
      { text: "Identify any relative afferent pupillary defect (paradoxical dilation).", critical: true },
      { text: "Assess the near response if anisocoria or light-near dissociation is suspected." },
      { text: "Record findings including size in mm and presence/grade of any APD." },
    ],
  },
  {
    partSlug: "PART_3",
    subjectSlug: "sensorimotor-neuro-skills",
    title: "Case History & Anchoring",
    technique: "Case History",
    description:
      "Checklist for a structured, patient-centered case history and clinical anchoring of the chief complaint.",
    steps: [
      { text: "Introduce yourself and confirm the patient's identity.", critical: true },
      { text: "Elicit the chief complaint in the patient's own words.", critical: true },
      { text: "Characterize the complaint (onset, location, duration, severity, timing).", critical: true },
      { text: "Review ocular history, systemic history, medications, and allergies.", critical: true },
      { text: "Ask about family ocular and systemic history." },
      { text: "Review social history and visual demands/occupation." },
      { text: "Summarize and confirm understanding with the patient." },
      { text: "Anchor the working diagnosis to guide the examination sequence.", critical: true },
    ],
  },
  {
    partSlug: "PART_3",
    subjectSlug: "glaucoma-iop-skills",
    title: "Gonioscopy",
    technique: "Gonioscopy",
    description:
      "Checklist for performing gonioscopy to evaluate the anterior chamber angle.",
    steps: [
      { text: "Instill topical anesthetic and explain the procedure.", critical: true },
      { text: "Apply cushioning solution to the goniolens as appropriate." },
      { text: "Insert the goniolens with proper technique and minimal pressure.", critical: true },
      { text: "Use a thin, bright slit beam offset from the mirror being viewed." },
      { text: "Identify angle structures: Schwalbe's line, TM, scleral spur, ciliary body.", critical: true },
      { text: "Grade the angle in all four quadrants (e.g., Shaffer).", critical: true },
      { text: "Avoid inadvertent pressure that would artificially open the angle." },
      { text: "Record the grade, pigmentation, and any abnormal findings per quadrant." },
    ],
  },
];

export interface ResourceSeed {
  kind: "STUDY_GUIDE" | "HIGH_YIELD" | "MNEMONIC" | "FORMULA";
  partSlug?: "PART_1" | "PART_2" | "PART_3";
  subjectSlug?: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  tags?: string[];
}

export const RESOURCES: ResourceSeed[] = [
  {
    kind: "STUDY_GUIDE",
    partSlug: "PART_1",
    subjectSlug: "geometric-physical-optics",
    title: "Optics Survival Guide for Part 1",
    slug: "optics-survival-guide-part-1",
    summary:
      "A condensed walkthrough of the optics you must own for the ABS exam: vergence, prisms, magnification, and lens systems.",
    body: `## The one equation that runs everything\n\n**V = U + F.** Every thin-lens problem reduces to this. Keep vergence in diopters and distances in meters.\n\n### Sign convention\n- Light travels left → right.\n- Distances measured *against* the light are negative.\n- Real objects sit to the left (negative distance ⇒ negative vergence).\n\n### Prentice's rule\nPrism (Δ) = decentration (cm) × lens power (D). Convert mm to cm first.\n\n### Spherical equivalent\nSE = sphere + cyl/2. Used for soft CL selection and quick refraction checks.\n\n### Vertex compensation\nFc = F / (1 − d·F), d in meters. Minus lenses need *less* power at the cornea.\n\n### Simple magnifier\nM ≈ F/4 (25 cm reference).\n\n> Drill the parametric question sets until the arithmetic is automatic. Speed here buys you time on reasoning items.`,
    tags: ["optics", "part 1", "high-yield"],
  },
  {
    kind: "HIGH_YIELD",
    partSlug: "PART_2",
    subjectSlug: "glaucoma",
    title: "Glaucoma High-Yield Sheet",
    slug: "glaucoma-high-yield",
    summary: "The 20 facts that account for most glaucoma questions on PAM.",
    body: `## Must-know glaucoma facts\n\n1. **IOP** is the only modifiable risk factor.\n2. **Prostaglandins**: first-line, ↑ uveoscleral outflow, once daily at night.\n3. **Beta-blockers**: ↓ aqueous production; avoid in asthma/COPD/bradycardia.\n4. **Alpha-2 agonists** (brimonidine): avoid in infants (CNS depression).\n5. **CAIs**: sulfa cross-reactivity caution.\n6. **Acute angle closure** → definitive Rx is **LPI**.\n7. **Pigment dispersion**: Krukenberg spindle, mid-peripheral iris transillumination.\n8. **Pseudoexfoliation**: flaky material on lens capsule, high spike risk.\n9. **Normal-tension glaucoma**: check for disc heme, migraine, nocturnal hypotension.\n10. **OCT**: RNFL thinning inferior/superior first (ISNT rule for rim).\n\n... and 10 more in the full download.`,
    tags: ["glaucoma", "part 2"],
  },
  {
    kind: "HIGH_YIELD",
    partSlug: "PART_2",
    subjectSlug: "posterior-segment-disease",
    title: "Retina Emergencies vs. Watch-and-Wait",
    slug: "retina-emergencies-high-yield",
    summary: "Triage the posterior segment: what goes to the retina specialist today.",
    body: `## Refer today\n- **CRAO** (cherry-red spot, pale retina) — stroke workup.\n- **Rhegmatogenous RD** with macula-on.\n- **Wet AMD** with new metamorphopsia/hemorrhage.\n- **PDR** with vitreous hemorrhage or NVI.\n\n## Monitor / routine\n- Dry AMD with small drusen.\n- Asymptomatic PVD without tear.\n- Mild NPDR without CSME.`,
    tags: ["retina", "triage", "part 2"],
  },
  {
    kind: "MNEMONIC",
    partSlug: "PART_2",
    subjectSlug: "neuro-optometry",
    title: "Cranial Nerve & Pupil Mnemonics",
    slug: "cn-pupil-mnemonics",
    summary: "Fast recall hooks for neuro-optometry.",
    body: `## Mnemonics\n\n- **"Down and out, blown pupil = CN III compression."** Pupil-involving third nerve palsy → image the brain (PComm aneurysm).\n- **LR6 SO4 (3)** — Lateral Rectus = CN6, Superior Oblique = CN4, the rest = CN3.\n- **"My Aunt Ran Circles"** — miosis pathway: retina → pretectal → Edinger-Westphal → ciliary.\n- **RAPD = "Marcus Gunn"** — swinging light, affected eye dilates.\n- **Horner's: PAM** — Ptosis, Anhidrosis, Miosis.`,
    tags: ["neuro", "mnemonics"],
  },
  {
    kind: "MNEMONIC",
    partSlug: "PART_1",
    subjectSlug: "ocular-systemic-pharmacology",
    title: "Autonomic Drugs Mnemonics",
    slug: "autonomic-mnemonics",
    summary: "Keep cholinergics and adrenergics straight.",
    body: `## Hooks\n\n- **Muscarinic agonists constrict** ("pilo pins the pupil").\n- **Sympathetic = dilate + drain**: phenylephrine dilates (no cycloplegia).\n- **Atropine = "a-trip-ine"** — long trip (days-weeks of cycloplegia).\n- **Beta-blockers "-olol" lower production.**`,
    tags: ["pharmacology", "mnemonics"],
  },
  {
    kind: "FORMULA",
    partSlug: "PART_1",
    subjectSlug: "geometric-physical-optics",
    title: "Optics Formula Reference",
    slug: "optics-formula-reference",
    summary: "The formula card for ophthalmic and geometric optics.",
    body: `## Formula card\n\n| Concept | Formula |\n|---|---|\n| Vergence | V = U + F |\n| Prentice's rule | Δ = c(cm) × F(D) |\n| Spherical equivalent | SE = sph + cyl/2 |\n| Vertex compensation | Fc = F / (1 − dF) |\n| Amplitude of accommodation | A = 1 / near point (m) |\n| Simple magnifier | M = F/4 |\n| Telescope magnification | M = −Fe/Fo |\n| Snellen → logMAR | logMAR = log₁₀(denom/num) |\n| Lensmaker (thin) | F = (n−1)(1/r₁ − 1/r₂) |`,
    tags: ["optics", "formula"],
  },
  {
    kind: "FORMULA",
    partSlug: "PART_1",
    subjectSlug: "biostatistics-epidemiology",
    title: "Biostatistics Formula Reference",
    slug: "biostatistics-formula-reference",
    summary: "Diagnostic testing and study metrics at a glance.",
    body: `## Diagnostic 2×2\n\n| Metric | Formula |\n|---|---|\n| Sensitivity | TP / (TP + FN) |\n| Specificity | TN / (TN + FP) |\n| PPV | TP / (TP + FP) |\n| NPV | TN / (TN + FN) |\n| Prevalence | (TP + FN) / total |\n| Relative risk | risk(exposed) / risk(unexposed) |\n| Odds ratio | (a·d) / (b·c) |\n\nSensitivity/specificity are test-intrinsic; predictive values depend on prevalence.`,
    tags: ["statistics", "formula"],
  },
  {
    kind: "STUDY_GUIDE",
    partSlug: "PART_3",
    subjectSlug: "refractive-skills",
    title: "Part 3 Clinical Skills Playbook",
    slug: "part-3-clinical-skills-playbook",
    summary: "How to rehearse and pass each graded station under time pressure.",
    body: `## Mindset\nThe CSE grades **procedure**, not just outcome. Verbalize, sequence, and hit every critical step.\n\n## Universal station flow\n1. Greet + explain + consent.\n2. Set up equipment correctly.\n3. Position the patient.\n4. Perform the technique in the standard sequence.\n5. State findings and record.\n\n## Rehearsal\nUse the checklists in this module. Score yourself with the rubric until you consistently hit all *critical* steps.`,
    tags: ["part 3", "clinical skills"],
  },
];

export interface BlogSeed {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage?: string;
  tags?: string[];
}

export const BLOG_POSTS: BlogSeed[] = [
  {
    slug: "how-to-pass-nbeo-part-1",
    title: "How to Pass NBEO Part 1 Without Burning Out",
    excerpt:
      "A realistic, evidence-based study plan for the Applied Basic Sciences exam — built around spaced repetition and question banks.",
    body: `Part 1 rewards breadth and stamina. The candidates who pass comfortably do three things: they map their study to the official content outline, they do questions early (not just at the end), and they let spaced repetition handle retention.\n\n## Start with questions, not reading\nDoing questions from week one surfaces your weak topics immediately. OptiPrep's analytics flag your lowest subjects so you never waste a session reviewing what you already know.\n\n## Let the algorithm remember for you\nEvery missed question becomes a spaced-repetition card. Ten minutes of reviews per day beats a weekend cram.\n\n## Simulate before you sit\nRun at least three full timed blocks at real pacing so the exam feels routine.`,
    coverImage:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&q=80",
    tags: ["part 1", "study tips"],
  },
  {
    slug: "spaced-repetition-for-boards",
    title: "Why Spaced Repetition Beats Rereading for Board Exams",
    excerpt:
      "The forgetting curve is real. Here's how an SM-2 style algorithm turns your mistakes into long-term memory.",
    body: `Rereading feels productive and mostly isn't. Active recall with expanding intervals is one of the most robust findings in learning science.\n\n## The SM-2 idea\nAfter you answer, you rate how well you knew it. Easy items get pushed far into the future; hard items come back tomorrow. Over weeks, your review load shrinks while retention climbs.\n\n## In OptiPrep\nMissed questions are auto-scheduled. Your daily quiz targets exactly the cards due today plus your weakest topics.`,
    coverImage:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80",
    tags: ["learning science", "spaced repetition"],
  },
  {
    slug: "clinical-skills-exam-checklist",
    title: "The Part 3 Clinical Skills Exam: A Station-by-Station Checklist",
    excerpt:
      "What graders actually look for at each CSE station — and how to rehearse the critical steps.",
    body: `The Clinical Skills Examination is choreography. You are graded on whether you hit the critical procedural steps in the correct sequence.\n\n## Rehearse with rubrics\nThe fastest way to improve is to score yourself against the same rubric the examiners use. Every station in OptiPrep's Part 3 module includes a critical-step checklist and a self-assessment rubric.\n\n## Verbalize everything\nSay what you are doing. It keeps your sequence honest and shows the grader your reasoning.`,
    coverImage:
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200&q=80",
    tags: ["part 3", "clinical skills"],
  },
];
