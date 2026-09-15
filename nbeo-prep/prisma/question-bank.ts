// ---------------------------------------------------------------------------
// Question generation for the OptiPrep seed.
//
// Two sources feed the bank:
//   1. Curated concept facts (hand-authored, clinically meaningful MCQs).
//   2. Parametric generators that COMPUTE genuinely-correct answers for
//      optics, refraction, statistics, and pharmacology math. These give the
//      volume (3,000+) while every key is verifiably correct.
// ---------------------------------------------------------------------------

import { CONCEPT_FACTS } from "./concept-facts";

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface GenOption {
  text: string;
  isCorrect: boolean;
}

export interface GenQuestion {
  partSlug: "PART_1" | "PART_2" | "PART_3";
  subjectSlug: string;
  topicSlug?: string;
  stem: string;
  options: GenOption[];
  explanation: string;
  reference: string;
  difficulty: Difficulty;
}

// Deterministic PRNG (mulberry32) so seeds are reproducible.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(20260914);
const rand = () => rng();
const randInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
const round = (n: number, dp = 2) => {
  const f = Math.pow(10, dp);
  return Math.round(n * f) / f;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build a 4-option MCQ from a correct answer + distractor pool (numeric-safe).
function mc(correct: string, distractors: string[]): GenOption[] {
  const uniq = Array.from(new Set(distractors.filter((d) => d !== correct)));
  const chosen = shuffle(uniq).slice(0, 3);
  while (chosen.length < 3) chosen.push(`${chosen.length + 1} (none of the above)`);
  return shuffle([
    { text: correct, isCorrect: true },
    ...chosen.map((d) => ({ text: d, isCorrect: false })),
  ]);
}

const D = (n: number) => `${n >= 0 ? "+" : ""}${round(n, 2).toFixed(2)} D`;
const CM = (n: number) => `${round(n, 1).toFixed(1)} cm`;

// ---------------------------------------------------------------------------
// Parametric generators
// ---------------------------------------------------------------------------

function genVergence(count: number): GenQuestion[] {
  const out: GenQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const objCm = randInt(20, 100);
    const F = pick([2, 3, 4, 5, 6, 8, 10, -4, -5, -6]);
    const l = -objCm / 100; // object to the left (m)
    const U = 1 / l; // object vergence (D)
    const V = U + F; // image vergence
    const v = 1 / V; // image distance (m)
    const vCm = v * 100;
    const correct = CM(vCm);
    const distractors = [
      CM(-vCm),
      CM(100 / F),
      CM(100 / (U - F)),
      CM(vCm + 10),
      CM(vCm - 15),
    ];
    out.push({
      partSlug: "PART_1",
      subjectSlug: "geometric-physical-optics",
      topicSlug: "vergence-and-thin-lenses",
      stem: `An object is placed ${objCm} cm in front of a thin lens of power ${D(
        F,
      )}. Using the sign convention that light travels left to right, where is the image formed relative to the lens? (positive = right of lens)`,
      options: mc(correct, distractors),
      explanation: `Object vergence U = 1/l = 1/(${round(l, 3)} m) = ${round(
        U,
        2,
      )} D. Image vergence V = U + F = ${round(U, 2)} + ${round(F, 2)} = ${round(
        V,
        2,
      )} D. Image distance v = 1/V = ${round(v, 3)} m = ${round(vCm, 1)} cm. A ${
        vCm >= 0 ? "positive" : "negative"
      } value means the image is ${vCm >= 0 ? "real, to the right" : "virtual, to the left"} of the lens.`,
      reference: "Optics: vergence equation V = U + F",
      difficulty: "MEDIUM",
    });
  }
  return out;
}

function genPrentice(count: number): GenQuestion[] {
  const out: GenQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const power = pick([1, 2, 2.5, 3, 4, 5, 6, 8, -3, -4, -5, -6]);
    const decMm = randInt(2, 9);
    const prism = Math.abs((decMm / 10) * power);
    const correct = `${round(prism, 2)}Δ`;
    const distractors = [
      `${round(prism * 10, 2)}Δ`,
      `${round((decMm * power) / 100, 2)}Δ`,
      `${round(prism / 2, 2)}Δ`,
      `${round(prism + 1, 2)}Δ`,
      `${round(Math.abs(decMm * power), 2)}Δ`,
    ];
    out.push({
      partSlug: "PART_1",
      subjectSlug: "geometric-physical-optics",
      topicSlug: "prisms-and-prentice-s-rule",
      stem: `A patient looks through a point ${decMm} mm from the optical center of a ${D(
        power,
      )} lens. How much prismatic effect is induced? (Prentice's rule)`,
      options: mc(correct, distractors),
      explanation: `Prentice's rule: prism (Δ) = decentration (cm) × lens power (D) = ${round(
        decMm / 10,
        1,
      )} cm × ${Math.abs(power)} D = ${round(prism, 2)}Δ. Convert millimeters to centimeters before multiplying.`,
      reference: "Ophthalmic optics: Prentice's rule",
      difficulty: "EASY",
    });
  }
  return out;
}

function genTransposition(count: number): GenQuestion[] {
  const out: GenQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const sph = pick([-4, -3, -2, -1, 0.5, 1, 2, 3]);
    const cyl = pick([1, 1.5, 2, 2.5, 3]); // start in plus cyl
    const axis = pick([5, 20, 45, 75, 90, 110, 135, 160, 180]);
    const newSph = sph + cyl;
    const newCyl = -cyl;
    const newAxis = axis <= 90 ? axis + 90 : axis - 90;
    const fmt = (s: number, c: number, a: number) =>
      `${D(s)} ${D(c)} × ${a.toString().padStart(3, "0")}`;
    const correct = fmt(newSph, newCyl, newAxis);
    const distractors = [
      fmt(sph, -cyl, newAxis),
      fmt(newSph, newCyl, axis),
      fmt(newSph, cyl, newAxis),
      fmt(sph - cyl, -cyl, newAxis),
    ];
    out.push({
      partSlug: "PART_1",
      subjectSlug: "physiological-ophthalmic-optics",
      topicSlug: "lens-transposition",
      stem: `Transpose the following prescription to minus-cylinder form: ${fmt(
        sph,
        cyl,
        axis,
      )}.`,
      options: mc(correct, distractors),
      explanation: `To transpose: (1) new sphere = sphere + cylinder = ${D(
        sph,
      )} + ${D(cyl)} = ${D(newSph)}; (2) flip the cylinder sign → ${D(
        newCyl,
      )}; (3) rotate axis by 90° → ${newAxis
        .toString()
        .padStart(3, "0")}. Result: ${correct}.`,
      reference: "Ophthalmic optics: cylinder transposition",
      difficulty: "EASY",
    });
  }
  return out;
}

function genSphericalEquivalent(count: number): GenQuestion[] {
  const out: GenQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const sph = pick([-6, -5, -4, -3, -2, -1, 1, 2, 3]);
    const cyl = pick([-3, -2.5, -2, -1.5, -1, -0.75, -0.5]);
    const se = sph + cyl / 2;
    const correct = D(se);
    const distractors = [D(sph + cyl), D(sph - cyl / 2), D(sph), D(se + 0.5), D(se - 0.5)];
    out.push({
      partSlug: "PART_2",
      subjectSlug: "refraction-dispensing",
      topicSlug: "refractive-error-and-prescribing",
      stem: `What is the spherical equivalent of ${D(sph)} ${D(cyl)} × 180?`,
      options: mc(correct, distractors),
      explanation: `Spherical equivalent = sphere + (cylinder ÷ 2) = ${D(
        sph,
      )} + (${D(cyl)} ÷ 2) = ${D(se)}.`,
      reference: "Refraction: spherical equivalent",
      difficulty: "EASY",
    });
  }
  return out;
}

function genVertex(count: number): GenQuestion[] {
  const out: GenQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const F = pick([-14, -12, -11, -10, 10, 11, 12, 14]);
    const dmm = pick([10, 12, 13, 14]);
    const d = dmm / 1000;
    const Fc = F / (1 - d * F);
    const correct = D(round(Fc, 2));
    const distractors = [
      D(round(F / (1 + d * F), 2)),
      D(F),
      D(round(Fc + 0.5, 2)),
      D(round(Fc - 0.5, 2)),
      D(round(F * (1 - d * F), 2)),
    ];
    out.push({
      partSlug: "PART_2",
      subjectSlug: "contact-lenses",
      topicSlug: "soft-lens-fitting",
      stem: `A spectacle prescription of ${D(
        F,
      )} is worn at a vertex distance of ${dmm} mm. What is the equivalent power at the corneal plane (contact lens power)?`,
      options: mc(correct, distractors),
      explanation: `Effective power Fc = F / (1 − d·F), with d in meters. Fc = ${round(
        F,
        2,
      )} / (1 − ${d} × ${round(F, 2)}) = ${round(
        Fc,
        2,
      )} D. Minus lenses require less power at the cornea; plus lenses require more.`,
      reference: "Ophthalmic optics: vertex distance / effective power",
      difficulty: "MEDIUM",
    });
  }
  return out;
}

function genAmplitude(count: number): GenQuestion[] {
  const out: GenQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const nearCm = pick([10, 12.5, 14, 16.7, 20, 25, 33.3, 50]);
    const amp = 100 / nearCm;
    const correct = D(round(amp, 2));
    const distractors = [D(round(nearCm / 10, 2)), D(round(amp * 2, 2)), D(round(amp / 2, 2)), D(round(amp + 1, 2))];
    out.push({
      partSlug: "PART_1",
      subjectSlug: "physiological-ophthalmic-optics",
      topicSlug: "schematic-eye-and-ametropia",
      stem: `A patient's nearest point of clear vision is ${nearCm} cm. What is the amplitude of accommodation?`,
      options: mc(correct, distractors),
      explanation: `Amplitude of accommodation = 1 / near point (in meters) = 1 / ${round(
        nearCm / 100,
        3,
      )} m = ${round(amp, 2)} D.`,
      reference: "Physiological optics: amplitude of accommodation",
      difficulty: "EASY",
    });
  }
  return out;
}

function genMagnifier(count: number): GenQuestion[] {
  const out: GenQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const F = pick([8, 10, 12, 16, 20, 24, 28, 32]);
    const m = F / 4;
    const correct = `${round(m, 1)}×`;
    const distractors = [`${round(F, 1)}×`, `${round(F / 2, 1)}×`, `${round(m + 1, 1)}×`, `${round(F / 4 + 1, 1)}×`];
    out.push({
      partSlug: "PART_2",
      subjectSlug: "low-vision",
      topicSlug: "magnification-devices",
      stem: `A low-vision patient is given a ${F} D hand magnifier. Using the conventional (D/4) reference, what is its rated magnification?`,
      options: mc(correct, distractors),
      explanation: `Conventional magnification of a simple magnifier = F / 4 = ${F} / 4 = ${round(
        m,
        1,
      )}×. This uses the standard 25 cm reference distance.`,
      reference: "Low vision: magnifier rating (D/4)",
      difficulty: "MEDIUM",
    });
  }
  return out;
}

function genSnellenLogmar(count: number): GenQuestion[] {
  const out: GenQuestion[] = [];
  const pairs: [string, number][] = [
    ["20/20", 0.0],
    ["20/25", 0.1],
    ["20/30", 0.18],
    ["20/40", 0.3],
    ["20/50", 0.4],
    ["20/60", 0.48],
    ["20/80", 0.6],
    ["20/100", 0.7],
    ["20/200", 1.0],
    ["20/400", 1.3],
  ];
  for (let i = 0; i < count; i++) {
    const [snellen, logmar] = pick(pairs);
    const correct = logmar.toFixed(2);
    const distractors = pairs.map(([, v]) => v.toFixed(2)).concat([(logmar + 0.2).toFixed(2)]);
    out.push({
      partSlug: "PART_1",
      subjectSlug: "biostatistics-epidemiology",
      topicSlug: "descriptive-statistics",
      stem: `A Snellen acuity of ${snellen} corresponds to approximately what logMAR value?`,
      options: mc(correct, distractors),
      explanation: `logMAR = log₁₀(minimum angle of resolution) = log₁₀(denominator/numerator). For ${snellen}, logMAR ≈ ${logmar.toFixed(
        2,
      )}. Note 20/20 = 0.00 logMAR and 20/200 = 1.00 logMAR.`,
      reference: "Clinical measurement: Snellen ↔ logMAR",
      difficulty: "MEDIUM",
    });
  }
  return out;
}

function genDiagnostics(count: number): GenQuestion[] {
  const out: GenQuestion[] = [];
  const metrics: ["sensitivity" | "specificity" | "ppv" | "npv", string][] = [
    ["sensitivity", "sensitivity"],
    ["specificity", "specificity"],
    ["ppv", "positive predictive value"],
    ["npv", "negative predictive value"],
  ];
  for (let i = 0; i < count; i++) {
    const tp = randInt(30, 90);
    const fn = randInt(5, 30);
    const tn = randInt(40, 95);
    const fp = randInt(5, 30);
    const [metric, label] = pick(metrics);
    let value = 0;
    let formula = "";
    switch (metric) {
      case "sensitivity":
        value = tp / (tp + fn);
        formula = `TP/(TP+FN) = ${tp}/(${tp}+${fn})`;
        break;
      case "specificity":
        value = tn / (tn + fp);
        formula = `TN/(TN+FP) = ${tn}/(${tn}+${fp})`;
        break;
      case "ppv":
        value = tp / (tp + fp);
        formula = `TP/(TP+FP) = ${tp}/(${tp}+${fp})`;
        break;
      case "npv":
        value = tn / (tn + fn);
        formula = `TN/(TN+FN) = ${tn}/(${tn}+${fn})`;
        break;
    }
    const pct = round(value * 100, 1);
    const correct = `${pct}%`;
    const distractors = [
      `${round((tp / (tp + fp)) * 100, 1)}%`,
      `${round((tn / (tn + fp)) * 100, 1)}%`,
      `${round((tp / (tp + fn)) * 100, 1)}%`,
      `${round(pct + 6, 1)}%`,
      `${round(pct - 8, 1)}%`,
    ];
    out.push({
      partSlug: "PART_1",
      subjectSlug: "biostatistics-epidemiology",
      topicSlug: "diagnostic-test-metrics",
      stem: `A screening test yields: true positives = ${tp}, false negatives = ${fn}, true negatives = ${tn}, false positives = ${fp}. What is the ${label} of the test?`,
      options: mc(correct, distractors),
      explanation: `${label[0].toUpperCase() + label.slice(1)} = ${formula} = ${pct}%. Sensitivity and specificity are intrinsic to the test; predictive values depend on disease prevalence in the tested population.`,
      reference: "Epidemiology: diagnostic test 2×2 metrics",
      difficulty: "MEDIUM",
    });
  }
  return out;
}

function genDilution(count: number): GenQuestion[] {
  const out: GenQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const c1 = pick([5, 10]);
    const c2 = pick([1, 2, 2.5]);
    const v2 = pick([10, 20, 50]);
    const v1 = (c2 * v2) / c1;
    const correct = `${round(v1, 2)} mL`;
    const distractors = [
      `${round((c1 * v2) / c2, 2)} mL`,
      `${round(v1 * 2, 2)} mL`,
      `${round(v2 - v1, 2)} mL`,
      `${round(v1 + 2, 2)} mL`,
    ];
    out.push({
      partSlug: "PART_1",
      subjectSlug: "ocular-systemic-pharmacology",
      topicSlug: "autonomic-pharmacology",
      stem: `You need to prepare ${v2} mL of a ${c2}% solution from a ${c1}% stock. How much stock solution is required? (C₁V₁ = C₂V₂)`,
      options: mc(correct, distractors),
      explanation: `Using C₁V₁ = C₂V₂: V₁ = (C₂ × V₂) / C₁ = (${c2} × ${v2}) / ${c1} = ${round(
        v1,
        2,
      )} mL. Dilute this volume up to ${v2} mL with diluent.`,
      reference: "Pharmacology: dilution (C₁V₁ = C₂V₂)",
      difficulty: "MEDIUM",
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Part 3 clinical-skills generators (variable, computed keys)
// ---------------------------------------------------------------------------

function genRetinoscopyWD(count: number): GenQuestion[] {
  const out: GenQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const wdCm = pick([40, 50, 57, 66, 67, 100]);
    const comp = 100 / wdCm;
    const correct = D(round(comp, 2));
    const distractors = [D(round(wdCm / 10, 2)), D(round(comp * 2, 2)), D(round(comp - 0.5, 2)), D(round(comp + 0.5, 2))];
    out.push({
      partSlug: "PART_3",
      subjectSlug: "refractive-skills",
      topicSlug: "static-retinoscopy",
      stem: `You perform static retinoscopy at a ${wdCm} cm working distance. What dioptric value must be subtracted from the gross finding to compensate for the working distance?`,
      options: mc(correct, distractors),
      explanation: `Working-distance compensation = 1 / working distance (m) = 1 / ${round(
        wdCm / 100,
        3,
      )} m = ${round(comp, 2)} D. Subtract this from the gross retinoscopy result.`,
      reference: "Clinical skills: retinoscopy working distance",
      difficulty: "MEDIUM",
    });
  }
  return out;
}

function genTonometry(count: number): GenQuestion[] {
  const out: GenQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const dial = pick([1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4, 2.8, 3.2, 1.0]);
    const iop = dial * 10;
    const correct = `${round(iop, 0)} mmHg`;
    const distractors = [`${round(dial, 1)} mmHg`, `${round(iop / 2, 0)} mmHg`, `${round(iop + 4, 0)} mmHg`, `${round(iop - 3, 0)} mmHg`];
    out.push({
      partSlug: "PART_3",
      subjectSlug: "glaucoma-iop-skills",
      topicSlug: "goldmann-applanation-tonometry",
      stem: `At the correct Goldmann endpoint the measuring drum reads ${dial.toFixed(
        1,
      )}. What is the intraocular pressure?`,
      options: mc(correct, distractors),
      explanation: `Goldmann IOP (mmHg) = drum reading × 10 = ${dial.toFixed(
        1,
      )} × 10 = ${round(iop, 0)} mmHg.`,
      reference: "Clinical skills: Goldmann drum conversion",
      difficulty: "EASY",
    });
  }
  return out;
}

function genCoverTest(count: number): GenQuestion[] {
  const out: GenQuestion[] = [];
  const cases: [string, string, string[], string][] = [
    [
      "the uncovered eye moves inward (nasally) to take up fixation",
      "Exodeviation (exophoria/tropia)",
      ["Esodeviation", "Hyperdeviation", "Orthophoria"],
      "An inward (nasal) refixation means the eye was previously turned out → exodeviation.",
    ],
    [
      "the uncovered eye moves outward (temporally) to take up fixation",
      "Esodeviation (esophoria/tropia)",
      ["Exodeviation", "Hypodeviation", "Orthophoria"],
      "An outward (temporal) refixation means the eye was previously turned in → esodeviation.",
    ],
    [
      "the uncovered eye moves downward to take up fixation",
      "Hyperdeviation",
      ["Hypodeviation", "Exodeviation", "Esodeviation"],
      "A downward refixation means the eye was previously deviated upward → hyperdeviation.",
    ],
    [
      "no movement of either eye is observed on cover/uncover",
      "Orthophoria",
      ["Exophoria", "Esophoria", "Hyperphoria"],
      "No refixation movement on cover/uncover indicates orthophoria (no manifest or latent deviation detected).",
    ],
  ];
  for (let i = 0; i < count; i++) {
    const [desc, ans, dis, exp] = pick(cases);
    out.push({
      partSlug: "PART_3",
      subjectSlug: "sensorimotor-neuro-skills",
      topicSlug: "cover-test",
      stem: `During the cover test, ${desc}. What deviation is present?`,
      options: mc(ans, dis),
      explanation: exp,
      reference: "Clinical skills: cover test interpretation",
      difficulty: "MEDIUM",
    });
  }
  return out;
}

function genVanHerick(count: number): GenQuestion[] {
  const out: GenQuestion[] = [];
  const cases: [string, string][] = [
    ["greater than or equal to the corneal section thickness", "Grade 4 (wide open, closure improbable)"],
    ["about 1/2 of the corneal section thickness", "Grade 3 (open, closure improbable)"],
    ["about 1/4 of the corneal section thickness", "Grade 2 (narrow, closure possible)"],
    ["less than 1/4 of the corneal section thickness", "Grade 1 (very narrow, closure likely)"],
  ];
  const allGrades = cases.map((c) => c[1]);
  for (let i = 0; i < count; i++) {
    const [desc, ans] = pick(cases);
    out.push({
      partSlug: "PART_3",
      subjectSlug: "anterior-segment-skills",
      topicSlug: "van-herick-angle-estimation",
      stem: `On Van Herick estimation, the peripheral anterior chamber depth appears ${desc}. What is the grade?`,
      options: mc(ans, allGrades),
      explanation: `Van Herick grading compares the peripheral anterior chamber depth to the adjacent corneal section thickness: ≥1 = Grade 4, 1/2 = Grade 3, 1/4 = Grade 2, <1/4 = Grade 1.`,
      reference: "Clinical skills: Van Herick grading",
      difficulty: "MEDIUM",
    });
  }
  return out;
}

function genShaffer(count: number): GenQuestion[] {
  const out: GenQuestion[] = [];
  const cases: [string, string][] = [
    ["the ciliary body band is easily visible (~35-45°)", "Grade 4"],
    ["the scleral spur is visible (~20-35°)", "Grade 3"],
    ["only the trabecular meshwork is visible (~20°)", "Grade 2"],
    ["only Schwalbe's line / anterior TM is visible (~10°)", "Grade 1"],
    ["no angle structures are visible (iridocorneal contact)", "Grade 0 (closed)"],
  ];
  const grades = cases.map((c) => c[1]);
  for (let i = 0; i < count; i++) {
    const [desc, ans] = pick(cases);
    out.push({
      partSlug: "PART_3",
      subjectSlug: "glaucoma-iop-skills",
      topicSlug: "gonioscopy",
      stem: `On gonioscopy ${desc}. Using the Shaffer system, what is the angle grade?`,
      options: mc(ans, grades),
      explanation: `Shaffer grading by deepest visible structure: ciliary body = Grade 4, scleral spur = Grade 3, trabecular meshwork = Grade 2, Schwalbe's line = Grade 1, none = Grade 0 (closed).`,
      reference: "Clinical skills: Shaffer gonioscopy grading",
      difficulty: "MEDIUM",
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Curated concept facts
// ---------------------------------------------------------------------------

interface Fact {
  part: "PART_1" | "PART_2" | "PART_3";
  subject: string;
  topic?: string;
  q: string;
  a: string;
  d: string[];
  e: string;
  ref: string;
  diff?: Difficulty;
  free?: boolean;
}

function factToQuestion(f: Fact): GenQuestion & { free?: boolean } {
  return {
    partSlug: f.part,
    subjectSlug: f.subject,
    topicSlug: f.topic,
    stem: f.q,
    options: mc(f.a, f.d),
    explanation: f.e,
    reference: f.ref,
    difficulty: f.diff ?? "MEDIUM",
    free: f.free,
  };
}

// ---------------------------------------------------------------------------
// Public builder
// ---------------------------------------------------------------------------

export function buildQuestionBank(): (GenQuestion & { free?: boolean })[] {
  const curated = CONCEPT_FACTS.map(factToQuestion);

  // Part 1 — Applied Basic Sciences (optics/stats/pharmacology math).
  const part1: GenQuestion[] = [
    ...genVergence(420),
    ...genPrentice(300),
    ...genTransposition(240),
    ...genAmplitude(220),
    ...genSnellenLogmar(200),
    ...genDiagnostics(320),
    ...genDilution(220),
  ];

  // Part 2 — Patient Assessment & Management (refraction/CL/low-vision math).
  const part2: GenQuestion[] = [
    ...genSphericalEquivalent(320),
    ...genVertex(300),
    ...genMagnifier(200),
  ];

  // Part 3 — Clinical Skills (station knowledge, computed keys).
  const part3: GenQuestion[] = [
    ...genRetinoscopyWD(120),
    ...genTonometry(110),
    ...genCoverTest(120),
    ...genVanHerick(90),
    ...genShaffer(100),
  ];

  return [...curated, ...part1, ...part2, ...part3];
}
