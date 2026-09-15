/**
 * Drop-in for packages/utils/lib/ottehr-config/consent-forms/index.ts
 * Keep HIPAA + consent-to-treat IDs stable so existing paperwork checkboxes still bind.
 */
const PRIVACY_POLICY_CODE = "64292-6";

export const CONSENT_FORMS_DATA = {
  forms: [
    {
      id: "hipaa-acknowledgement",
      formTitle: "HIPAA Acknowledgement",
      resourceTitle: "HIPAA forms",
      assetPath: "./assets/optometry-hipaa-npp.pdf",
      publicUrl: "/forms/hipaa-npp",
      type: {
        coding: [{ system: "http://loinc.org", code: PRIVACY_POLICY_CODE, display: "Privacy Policy" }],
        text: "HIPAA Acknowledgement forms",
      },
      createsConsentResource: false,
    },
    {
      id: "consent-to-treat",
      formTitle: "Consent to Examine, Treat & Guarantee of Payment",
      resourceTitle: "Consent forms",
      assetPath: "./assets/optometry-consent-to-treat.pdf",
      publicUrl: "/forms/consent-to-treat",
      type: {
        coding: [
          { system: "http://loinc.org", code: "59284-0", display: "Consent Documents" },
          {
            system: "https://fhir.ottehr.com/CodeSystem/consent-source",
            code: "patient-registration",
            display: "Patient Registration Consent",
          },
        ],
        text: "Consent forms",
      },
      createsConsentResource: true,
    },
    {
      id: "dilation-consent",
      formTitle: "Dilated Fundus Examination Consent",
      resourceTitle: "Dilation consent",
      assetPath: "./assets/optometry-dilation.pdf",
      publicUrl: "/forms/dilation-consent",
      type: {
        coding: [{ system: "http://loinc.org", code: "59284-0", display: "Consent Documents" }],
        text: "Dilation consent",
      },
      createsConsentResource: true,
    },
    {
      id: "retinal-imaging-consent",
      formTitle: "Retinal Imaging / Optomap Screening Consent",
      resourceTitle: "Retinal imaging consent",
      assetPath: "./assets/optometry-retinal-imaging.pdf",
      publicUrl: "/forms/retinal-imaging-consent",
      type: {
        coding: [{ system: "http://loinc.org", code: "59284-0", display: "Consent Documents" }],
        text: "Retinal imaging consent",
      },
      createsConsentResource: true,
    },
    {
      id: "contact-lens-agreement",
      formTitle: "Contact Lens Evaluation Agreement",
      resourceTitle: "Contact lens agreement",
      assetPath: "./assets/optometry-cl-agreement.pdf",
      publicUrl: "/forms/contact-lens-agreement",
      type: {
        coding: [{ system: "http://loinc.org", code: "59284-0", display: "Consent Documents" }],
        text: "Contact lens agreement",
      },
      createsConsentResource: true,
    },
    {
      id: "refraction-waiver",
      formTitle: "Refraction Non-Covered Service Notice",
      resourceTitle: "Refraction notice",
      assetPath: "./assets/optometry-refraction-notice.pdf",
      publicUrl: "/forms/refraction-waiver",
      type: {
        coding: [{ system: "http://loinc.org", code: "59284-0", display: "Consent Documents" }],
        text: "Refraction notice",
      },
      createsConsentResource: false,
    },
    {
      id: "telehealth-consent",
      formTitle: "Telehealth Consent",
      resourceTitle: "Telehealth consent",
      assetPath: "./assets/optometry-telehealth.pdf",
      publicUrl: "/forms/telehealth-consent",
      type: {
        coding: [{ system: "http://loinc.org", code: "59284-0", display: "Consent Documents" }],
        text: "Telehealth consent",
      },
      createsConsentResource: true,
    },
    {
      id: "pediatric-guardian",
      formTitle: "Pediatric / Minor Consent",
      resourceTitle: "Minor consent",
      assetPath: "./assets/optometry-minor-consent.pdf",
      publicUrl: "/forms/pediatric-guardian",
      type: {
        coding: [{ system: "http://loinc.org", code: "59284-0", display: "Consent Documents" }],
        text: "Minor consent",
      },
      createsConsentResource: true,
    },
  ],
};

export const CONSENT_FORMS_CONFIG = Object.freeze(CONSENT_FORMS_DATA);
