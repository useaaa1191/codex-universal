export interface DemoVisit {
  id: string;
  name: string;
  dob: string;
  sex: string;
  age: string;
  reason: string;
  status: "arrived" | "intake" | "ready" | "with-doctor" | "checkout";
  room: string;
  templateSlug: string;
  extraForms: string[];
  insurance: string;
}

export const DEMO_VISITS: DemoVisit[] = [
  {
    id: "ana-rivera",
    name: "Ana Rivera",
    dob: "1988-04-12",
    sex: "Female",
    age: "38",
    reason: "Annual exam + new glasses",
    status: "ready",
    room: "Lane 2",
    templateSlug: "comprehensive-exam",
    extraForms: ["dilation-consent", "retinal-imaging-consent", "refraction-waiver", "spectacle-rx"],
    insurance: "VSP + BCBS",
  },
  {
    id: "marcus-chen",
    name: "Marcus Chen",
    dob: "1964-11-03",
    sex: "Male",
    age: "61",
    reason: "Glaucoma suspect follow-up",
    status: "with-doctor",
    room: "Lane 1",
    templateSlug: "glaucoma-followup",
    extraForms: ["oct-vf-consent", "patient-ed-glaucoma"],
    insurance: "Medicare",
  },
  {
    id: "sofia-alvarez",
    name: "Sofia Alvarez",
    dob: "2018-06-21",
    sex: "Female",
    age: "8",
    reason: "School vision / possible eye turn",
    status: "intake",
    room: "Waiting",
    templateSlug: "pediatric-exam",
    extraForms: ["pediatric-guardian", "dilation-consent", "school-vision-screening"],
    insurance: "Medicaid",
  },
  {
    id: "james-okonkwo",
    name: "James Okonkwo",
    dob: "1971-02-08",
    sex: "Male",
    age: "55",
    reason: "Diabetic dilated exam",
    status: "arrived",
    room: "Check-in",
    templateSlug: "diabetic-exam",
    extraForms: ["dilation-consent", "pcp-diabetes-letter", "patient-ed-diabetes"],
    insurance: "Aetna medical",
  },
  {
    id: "priya-shah",
    name: "Priya Shah",
    dob: "1997-09-30",
    sex: "Female",
    age: "28",
    reason: "New toric contact lens fit",
    status: "checkout",
    room: "Optical",
    templateSlug: "contact-lens-new-fit",
    extraForms: ["contact-lens-agreement", "cl-rx-release", "patient-ed-cl-hygiene"],
    insurance: "EyeMed",
  },
];

export function getVisit(id: string): DemoVisit | undefined {
  return DEMO_VISITS.find((visit) => visit.id === id);
}

export function seedFromVisit(visit: DemoVisit): Record<string, string> {
  const [first, ...rest] = visit.name.split(" ");
  const last = rest.join(" ");
  return {
    "last-name": last,
    "first-name": first,
    "patient-name": visit.name,
    dob: visit.dob,
    "child-last": last,
    "child-first": first,
    "child-dob": visit.dob,
    "visit-date": new Date().toISOString().slice(0, 10),
    provider: "Jordan Hale, OD",
    "chief-complaint": visit.reason,
  };
}
