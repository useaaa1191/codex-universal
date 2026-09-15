// ---------------------------------------------------------------------------
// Official-outline-mapped NBEO content structure.
// Used by both the seed script and the syllabus / dashboard UI.
// ---------------------------------------------------------------------------

export type PartSlug = "PART_1" | "PART_2" | "PART_3";

export interface TopicDef {
  name: string;
  slug: string;
}

export interface SubjectDef {
  name: string;
  slug: string;
  weight: number; // approximate % of exam content
  blueprint: string;
  topics: TopicDef[];
}

export interface PartDef {
  slug: PartSlug;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  blockCount: number;
  itemsPerBlock: number;
  minutesPerBlock: number;
  subjects: SubjectDef[];
}

const t = (name: string): TopicDef => ({
  name,
  slug: name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, ""),
});

export const PARTS: PartDef[] = [
  {
    slug: "PART_1",
    number: 1,
    title: "Part 1 — Applied Basic Sciences",
    subtitle: "ABS",
    description:
      "The foundational science exam covering anatomy, physiology, optics, pharmacology, pathology, and the basic sciences that underpin clinical optometry. Delivered as multiple-choice blocks.",
    color: "sky",
    blockCount: 7,
    itemsPerBlock: 50,
    minutesPerBlock: 55,
    subjects: [
      {
        name: "Ocular Anatomy & Physiology",
        slug: "ocular-anatomy-physiology",
        weight: 14,
        blueprint:
          "Gross and microscopic anatomy of the globe, adnexa, orbit, and visual pathway, with the physiology of each structure.",
        topics: [
          t("Cornea and Tear Film"),
          t("Crystalline Lens and Accommodation"),
          t("Retina and Photoreceptors"),
          t("Uvea and Aqueous Dynamics"),
          t("Extraocular Muscles and Orbit"),
          t("Visual Pathway and Cortex"),
          t("Eyelids, Lacrimal, and Adnexa"),
        ],
      },
      {
        name: "Geometric & Physical Optics",
        slug: "geometric-physical-optics",
        weight: 13,
        blueprint:
          "Vergence, thin and thick lenses, prisms, mirrors, interference, diffraction, polarization, and wave optics.",
        topics: [
          t("Vergence and Thin Lenses"),
          t("Prisms and Prentice's Rule"),
          t("Mirrors and Reflection"),
          t("Interference and Diffraction"),
          t("Polarization"),
          t("Thick Lenses and Systems"),
        ],
      },
      {
        name: "Physiological & Ophthalmic Optics",
        slug: "physiological-ophthalmic-optics",
        weight: 12,
        blueprint:
          "Schematic eyes, ametropia, spectacle and contact lens optics, magnification, and aberrations.",
        topics: [
          t("Schematic Eye and Ametropia"),
          t("Spectacle Lens Design"),
          t("Vertex Distance and Effectivity"),
          t("Magnification and Telescopes"),
          t("Aberrations"),
          t("Lens Transposition"),
        ],
      },
      {
        name: "Ocular & Systemic Pharmacology",
        slug: "ocular-systemic-pharmacology",
        weight: 12,
        blueprint:
          "Autonomic agents, anti-glaucoma drugs, anti-infectives, anti-inflammatories, and systemic drugs with ocular effects.",
        topics: [
          t("Autonomic Pharmacology"),
          t("Glaucoma Medications"),
          t("Anti-infectives"),
          t("Anti-inflammatory Agents"),
          t("Mydriatics and Cycloplegics"),
          t("Systemic Drug Ocular Effects"),
        ],
      },
      {
        name: "Biochemistry & Molecular Biology",
        slug: "biochemistry-molecular-biology",
        weight: 8,
        blueprint:
          "Metabolism, enzymes, phototransduction biochemistry, and molecular genetics relevant to vision.",
        topics: [
          t("Phototransduction Cascade"),
          t("Lens and Corneal Metabolism"),
          t("Enzymes and Cofactors"),
          t("Nucleic Acids and Protein Synthesis"),
        ],
      },
      {
        name: "General & Ocular Pathology",
        slug: "general-ocular-pathology",
        weight: 10,
        blueprint:
          "Cellular injury, inflammation, neoplasia, and the pathology of ocular disease.",
        topics: [
          t("Cellular Injury and Death"),
          t("Acute and Chronic Inflammation"),
          t("Neoplasia"),
          t("Ocular Tissue Pathology"),
        ],
      },
      {
        name: "Microbiology & Immunology",
        slug: "microbiology-immunology",
        weight: 8,
        blueprint:
          "Bacteria, viruses, fungi, parasites, and innate and adaptive immunity of the eye.",
        topics: [
          t("Bacteriology"),
          t("Virology"),
          t("Mycology and Parasitology"),
          t("Innate and Adaptive Immunity"),
          t("Ocular Immune Privilege"),
        ],
      },
      {
        name: "Neuroscience of Vision",
        slug: "neuroscience-of-vision",
        weight: 7,
        blueprint:
          "Sensory and perceptual neuroscience, receptive fields, color and motion processing.",
        topics: [
          t("Receptive Fields"),
          t("Color Vision Processing"),
          t("Motion and Depth"),
          t("Visual Cortex Organization"),
        ],
      },
      {
        name: "General Anatomy & Physiology",
        slug: "general-anatomy-physiology",
        weight: 6,
        blueprint:
          "Systemic anatomy and physiology relevant to primary eye care.",
        topics: [
          t("Cardiovascular System"),
          t("Endocrine System"),
          t("Central Nervous System"),
          t("Renal and Respiratory Systems"),
        ],
      },
      {
        name: "Biostatistics & Epidemiology",
        slug: "biostatistics-epidemiology",
        weight: 6,
        blueprint:
          "Study design, diagnostic testing metrics, and descriptive and inferential statistics.",
        topics: [
          t("Diagnostic Test Metrics"),
          t("Study Design"),
          t("Descriptive Statistics"),
          t("Hypothesis Testing"),
        ],
      },
      {
        name: "Genetics",
        slug: "genetics",
        weight: 4,
        blueprint: "Inheritance patterns and hereditary ocular disease.",
        topics: [
          t("Inheritance Patterns"),
          t("Hereditary Retinal Disease"),
          t("Chromosomal Disorders"),
        ],
      },
    ],
  },
  {
    slug: "PART_2",
    number: 2,
    title: "Part 2 — Patient Assessment & Management",
    subtitle: "PAM",
    description:
      "The clinical knowledge exam (PAM) assessing diagnosis and management across ocular and systemic disease, refraction, contact lenses, binocular vision, and practice management.",
    color: "violet",
    blockCount: 7,
    itemsPerBlock: 50,
    minutesPerBlock: 55,
    subjects: [
      {
        name: "Anterior Segment Disease",
        slug: "anterior-segment-disease",
        weight: 12,
        blueprint:
          "Cornea, conjunctiva, lids, and lacrimal disease diagnosis and management.",
        topics: [
          t("Corneal Dystrophies and Degenerations"),
          t("Keratitis and Corneal Ulcers"),
          t("Conjunctivitis and Allergy"),
          t("Dry Eye Disease"),
          t("Lid and Lash Disorders"),
          t("Episcleritis and Scleritis"),
        ],
      },
      {
        name: "Glaucoma",
        slug: "glaucoma",
        weight: 11,
        blueprint:
          "Open-angle, angle-closure, and secondary glaucomas: diagnosis, imaging, and therapeutics.",
        topics: [
          t("Primary Open-Angle Glaucoma"),
          t("Angle-Closure Glaucoma"),
          t("Secondary Glaucomas"),
          t("Optic Nerve and OCT Interpretation"),
          t("Visual Fields in Glaucoma"),
          t("Glaucoma Therapeutics"),
        ],
      },
      {
        name: "Posterior Segment Disease",
        slug: "posterior-segment-disease",
        weight: 12,
        blueprint:
          "Retina, macula, vitreous, and choroid disease diagnosis and management.",
        topics: [
          t("Age-Related Macular Degeneration"),
          t("Diabetic Retinopathy"),
          t("Retinal Vascular Occlusions"),
          t("Retinal Detachment and Tears"),
          t("Hereditary Retinal Dystrophies"),
          t("Vitreous and Vitreoretinal Interface"),
        ],
      },
      {
        name: "Neuro-Optometry",
        slug: "neuro-optometry",
        weight: 9,
        blueprint:
          "Afferent and efferent neuro-ophthalmic disease, pupils, and visual pathway lesions.",
        topics: [
          t("Optic Neuropathies"),
          t("Pupillary Abnormalities"),
          t("Cranial Nerve Palsies"),
          t("Visual Field Defects and Localization"),
          t("Nystagmus and Ocular Motility"),
        ],
      },
      {
        name: "Systemic Disease & Ocular Manifestations",
        slug: "systemic-disease",
        weight: 10,
        blueprint:
          "Diabetes, hypertension, thyroid, autoimmune, and infectious systemic disease affecting the eye.",
        topics: [
          t("Diabetes Mellitus"),
          t("Hypertension"),
          t("Thyroid Eye Disease"),
          t("Autoimmune and Inflammatory Disease"),
          t("Infectious Systemic Disease"),
        ],
      },
      {
        name: "Binocular Vision & Pediatrics",
        slug: "binocular-vision-pediatrics",
        weight: 9,
        blueprint:
          "Strabismus, amblyopia, accommodative and vergence dysfunction, and pediatric development.",
        topics: [
          t("Strabismus"),
          t("Amblyopia"),
          t("Accommodative Dysfunction"),
          t("Vergence Dysfunction"),
          t("Pediatric Development and Screening"),
        ],
      },
      {
        name: "Contact Lenses",
        slug: "contact-lenses",
        weight: 9,
        blueprint:
          "Soft and rigid lens fitting, specialty lenses, and complications.",
        topics: [
          t("Soft Lens Fitting"),
          t("Rigid Gas Permeable Fitting"),
          t("Specialty and Scleral Lenses"),
          t("Contact Lens Complications"),
          t("Orthokeratology and Myopia Control"),
        ],
      },
      {
        name: "Refraction & Dispensing",
        slug: "refraction-dispensing",
        weight: 8,
        blueprint:
          "Refractive error management, prescribing, and ophthalmic dispensing.",
        topics: [
          t("Refractive Error and Prescribing"),
          t("Presbyopia and Multifocals"),
          t("Prism Prescribing"),
          t("Lens Materials and Coatings"),
        ],
      },
      {
        name: "Ocular Pharmacology & Therapeutics",
        slug: "ocular-therapeutics",
        weight: 8,
        blueprint:
          "Applied therapeutic management with topical and oral agents.",
        topics: [
          t("Anti-infective Therapy"),
          t("Anti-inflammatory Therapy"),
          t("Glaucoma Therapy"),
          t("Ocular Emergencies Pharmacology"),
        ],
      },
      {
        name: "Low Vision & Rehabilitation",
        slug: "low-vision",
        weight: 5,
        blueprint:
          "Low-vision assessment, magnification devices, and rehabilitation.",
        topics: [
          t("Low Vision Assessment"),
          t("Magnification Devices"),
          t("Rehabilitation and Referral"),
        ],
      },
      {
        name: "Public Health, Ethics & Practice Management",
        slug: "public-health-practice",
        weight: 7,
        blueprint:
          "Epidemiology of eye disease, ethics, coding, and practice management.",
        topics: [
          t("Epidemiology of Eye Disease"),
          t("Ethics and Informed Consent"),
          t("Coding and Documentation"),
          t("Quality and Safety"),
        ],
      },
    ],
  },
  {
    slug: "PART_3",
    number: 3,
    title: "Part 3 — Clinical Skills",
    subtitle: "CSE",
    description:
      "The hands-on Clinical Skills Examination. Candidates are graded on standardized procedural stations. OptiPrep pairs each station with video demonstrations, step-by-step checklists, and self-assessment rubrics.",
    color: "emerald",
    blockCount: 1,
    itemsPerBlock: 20,
    minutesPerBlock: 60,
    subjects: [
      {
        name: "Anterior Segment Skills",
        slug: "anterior-segment-skills",
        weight: 22,
        blueprint:
          "Slit lamp biomicroscopy sequences and anterior segment evaluation techniques.",
        topics: [
          t("Slit Lamp Biomicroscopy"),
          t("Van Herick Angle Estimation"),
          t("Sodium Fluorescein Evaluation"),
          t("Keratometry"),
        ],
      },
      {
        name: "Posterior Segment Skills",
        slug: "posterior-segment-skills",
        weight: 22,
        blueprint:
          "Ophthalmoscopy and fundus evaluation techniques including BIO and 90D.",
        topics: [
          t("Binocular Indirect Ophthalmoscopy"),
          t("90D Fundus Biomicroscopy"),
          t("Direct Ophthalmoscopy"),
          t("Scleral Indentation"),
        ],
      },
      {
        name: "Glaucoma & IOP Skills",
        slug: "glaucoma-iop-skills",
        weight: 16,
        blueprint:
          "Goldmann applanation tonometry and gonioscopy technique.",
        topics: [
          t("Goldmann Applanation Tonometry"),
          t("Gonioscopy"),
        ],
      },
      {
        name: "Refractive Skills",
        slug: "refractive-skills",
        weight: 22,
        blueprint:
          "Retinoscopy and subjective refraction technique and sequence.",
        topics: [
          t("Static Retinoscopy"),
          t("Subjective Refraction"),
          t("Binocular Balance"),
          t("Near Add Determination"),
        ],
      },
      {
        name: "Sensorimotor & Neuro Skills",
        slug: "sensorimotor-neuro-skills",
        weight: 18,
        blueprint:
          "Pupils, motility, cover test, confrontation fields, and case anchoring.",
        topics: [
          t("Pupillary Testing and APD"),
          t("Extraocular Motility"),
          t("Cover Test"),
          t("Confrontation Visual Fields"),
          t("Case History and Anchoring"),
        ],
      },
    ],
  },
];

export const PART_BY_SLUG: Record<PartSlug, PartDef> = Object.fromEntries(
  PARTS.map((p) => [p.slug, p]),
) as Record<PartSlug, PartDef>;

export function partColorClasses(color: string): {
  bg: string;
  text: string;
  ring: string;
  gradient: string;
} {
  switch (color) {
    case "violet":
      return {
        bg: "bg-violet-500",
        text: "text-violet-500",
        ring: "ring-violet-500/30",
        gradient: "from-violet-500 to-purple-600",
      };
    case "emerald":
      return {
        bg: "bg-emerald-500",
        text: "text-emerald-500",
        ring: "ring-emerald-500/30",
        gradient: "from-emerald-500 to-teal-600",
      };
    case "sky":
    default:
      return {
        bg: "bg-sky-500",
        text: "text-sky-500",
        ring: "ring-sky-500/30",
        gradient: "from-sky-500 to-blue-600",
      };
  }
}
