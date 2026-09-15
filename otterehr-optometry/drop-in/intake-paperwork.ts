/**
 * Additional FormFields to merge into IN_PERSON_INTAKE_PAPERWORK_CONFIG
 * after Ottehr contact-information and insurance pages.
 */
export const OPTOMETRY_INTAKE_SECTIONS = {
  ocularHistoryPage: {
    linkId: "ocular-history-page",
    title: "Eye history",
    reviewText: "Eye history",
    requiredFields: ["chief-complaint"],
    items: {
      lastEyeExam: { key: "last-eye-exam", label: "Last eye exam", type: "date" },
      lastDilation: { key: "last-dilation", label: "Last dilated exam", type: "date" },
      chiefComplaint: { key: "chief-complaint", label: "Main reason for today's visit", type: "string" },
      wearsGlasses: { key: "wears-glasses", label: "Do you wear glasses?", type: "boolean" },
      wearsCl: { key: "wears-cl", label: "Do you wear contact lenses?", type: "boolean" },
      clSleep: { key: "sleep-in-cls", label: "Do you ever sleep in contact lenses?", type: "boolean" },
      diabetic: { key: "diabetic", label: "Do you have diabetes?", type: "boolean" },
      a1c: {
        key: "a1c",
        label: "Last A1c",
        type: "string",
        triggers: [
          {
            targetQuestionLinkId: "ocular-history-page.diabetic",
            effect: ["enable", "require"],
            operator: "=",
            answerBoolean: true,
          },
        ],
      },
    },
  },
  retinalScreeningPage: {
    linkId: "retinal-screening-page",
    title: "Retinal imaging",
    reviewText: "Retinal imaging choice",
    requiredFields: ["imaging-choice"],
    items: {
      imagingChoice: {
        key: "imaging-choice",
        label: "Retinal screening today",
        type: "choice",
        options: [
          { label: "Yes, I want screening images (posted fee if not covered)", value: "images" },
          { label: "Dilate instead", value: "dilate" },
          { label: "Both images and dilation", value: "both" },
          { label: "Decline both — limited internal exam", value: "decline" },
        ],
      },
    },
  },
};
