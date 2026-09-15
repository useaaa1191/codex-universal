/**
 * Optometry exam cards for packages/utils/lib/ottehr-config/examination
 * OD/OS columns follow Ottehr's left/right column pattern.
 */
type Option = { label: string; defaultValue: boolean; abnormal: boolean };

const NORMAL = new Set(["Normal", "Clear", "Quiet", "D&Q", "Full", "PERRL", "None", "Attached", "Pink", "Open"]);

function opt(label: string, defaultValue = false): Option {
  return { label, defaultValue, abnormal: !NORMAL.has(label) };
}

const OD_OS = [
  { key: "od", header: "OD", headerAbbreviation: "OD" },
  { key: "os", header: "OS", headerAbbreviation: "OS" },
];

export const NORMAL_LABELS = NORMAL;

export const OptometryExamComponentsConfig = {
  visualAcuity: {
    label: "Visual acuity",
    components: {
      comment: {
        "va-sc": { label: "sc DVA OD/OS/OU", type: "text" },
        "va-cc": { label: "cc DVA OD/OS/OU", type: "text" },
        "va-near": { label: "Near OD/OS/OU", type: "text" },
        "va-ph": { label: "Pinhole", type: "text" },
      },
    },
  },
  pupils: {
    label: "Pupils",
    components: {
      normal: {
        perrl: { label: "PERRL", defaultValue: true, type: "checkbox" },
        "no-apd": { label: "No APD", defaultValue: true, type: "checkbox" },
      },
      abnormal: {
        "apd-od": { label: "APD OD", defaultValue: false, type: "checkbox" },
        "apd-os": { label: "APD OS", defaultValue: false, type: "checkbox" },
        "sluggish": { label: "Sluggish", defaultValue: false, type: "checkbox" },
        "irregular": { label: "Irregular", defaultValue: false, type: "checkbox" },
      },
      comment: { "pupils-comment": { label: "Pupils comment", type: "text" } },
    },
  },
  motility: {
    label: "EOMs / alignment",
    components: {
      normal: {
        full: { label: "Full", defaultValue: true, type: "checkbox" },
        ortho: { label: "Ortho D/N", defaultValue: true, type: "checkbox" },
      },
      abnormal: {
        restriction: { label: "Restriction", defaultValue: false, type: "checkbox" },
        pain: { label: "Pain with motility", defaultValue: false, type: "checkbox" },
        diplopia: { label: "Diplopia", defaultValue: false, type: "checkbox" },
        tropia: { label: "Tropia", defaultValue: false, type: "checkbox" },
      },
      comment: { "motility-comment": { label: "Motility comment", type: "text" } },
    },
  },
  fields: {
    label: "Confrontation fields",
    components: {
      normal: { ftfc: { label: "FTFC", defaultValue: true, type: "checkbox" } },
      abnormal: { defect: { label: "Defect", defaultValue: false, type: "checkbox" } },
      comment: { "cvf-comment": { label: "Field comment", type: "text" } },
    },
  },
  iop: {
    label: "IOP",
    components: {
      comment: {
        method: { label: "Method (NCT/GAT/iCare)", type: "text" },
        "iop-od": { label: "OD mmHg", type: "text" },
        "iop-os": { label: "OS mmHg", type: "text" },
        time: { label: "Time", type: "text" },
      },
    },
  },
  anteriorSegment: {
    label: "Anterior segment",
    columns: OD_OS,
    components: {
      normal: {
        lids: { label: "Lids/lashes clear", defaultValue: true, type: "checkbox" },
        conjunctiva: { label: "Conjunctiva quiet", defaultValue: true, type: "checkbox" },
        cornea: { label: "Cornea clear", defaultValue: true, type: "checkbox" },
        ac: { label: "AC D&Q", defaultValue: true, type: "checkbox" },
        iris: { label: "Iris WNL", defaultValue: true, type: "checkbox" },
        lens: { label: "Lens clear", defaultValue: true, type: "checkbox" },
      },
      abnormal: {
        injection: { label: "Injection", defaultValue: false, type: "checkbox" },
        spk: { label: "SPK / staining", defaultValue: false, type: "checkbox" },
        cell: { label: "AC cell/flare", defaultValue: false, type: "checkbox" },
        ns: { label: "NS cataract", defaultValue: false, type: "checkbox" },
        mgd: { label: "MGD / blepharitis", defaultValue: false, type: "checkbox" },
      },
      comment: { "anterior-comment": { label: "Slit-lamp comment", type: "text" } },
    },
  },
  posteriorSegment: {
    label: "Posterior segment",
    columns: OD_OS,
    components: {
      normal: {
        vitreous: { label: "Vitreous clear", defaultValue: true, type: "checkbox" },
        onh: { label: "ONH pink/sharp", defaultValue: true, type: "checkbox" },
        macula: { label: "Macula flat/dry", defaultValue: true, type: "checkbox" },
        vessels: { label: "Vessels WNL", defaultValue: true, type: "checkbox" },
        periphery: { label: "Periphery attached", defaultValue: true, type: "checkbox" },
      },
      abnormal: {
        pvd: { label: "PVD", defaultValue: false, type: "checkbox" },
        hemorrhage: { label: "Hemorrhage", defaultValue: false, type: "checkbox" },
        drusen: { label: "Drusen", defaultValue: false, type: "checkbox" },
        cupping: { label: "Increased cupping", defaultValue: false, type: "checkbox" },
        hole: { label: "Hole / tear / lattice", defaultValue: false, type: "checkbox" },
      },
      comment: {
        dilation: { label: "Dilation drops/time", type: "text" },
        "cd-ratio": { label: "C/D OD/OS", type: "text" },
        "posterior-comment": { label: "Fundus comment", type: "text" },
      },
    },
  },
};

export { opt };
