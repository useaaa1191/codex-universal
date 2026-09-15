import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ALL_FORMS, getForm } from "./catalog";
import { toQuestionnaire, toQuestionnaireResponse, questionnaireUrl } from "./fhir";
import { missingRequired } from "./storage";
import { FORM_CATEGORIES } from "./types";

describe("optometry form catalog", () => {
  it("has unique slugs and covers every category", () => {
    const slugs = ALL_FORMS.map((form) => form.slug);
    assert.equal(new Set(slugs).size, slugs.length);
    assert.ok(ALL_FORMS.length >= 40);
    for (const category of FORM_CATEGORIES) {
      assert.ok(
        ALL_FORMS.some((form) => form.category === category),
        `missing category ${category}`,
      );
    }
  });

  it("includes the core practice set", () => {
    const required = [
      "new-patient-registration",
      "medical-ocular-history",
      "insurance-assignment",
      "hipaa-npp",
      "consent-to-treat",
      "dilation-consent",
      "retinal-imaging-consent",
      "contact-lens-agreement",
      "comprehensive-exam",
      "diabetic-exam",
      "glaucoma-followup",
      "spectacle-rx",
      "contact-lens-rx",
      "ophthalmology-referral",
    ];
    for (const slug of required) {
      assert.ok(getForm(slug), slug);
    }
  });

  it("comprehensive exam has OD/OS clinical fields", () => {
    const exam = getForm("comprehensive-exam");
    assert.ok(exam);
    const keys = exam.sections.flatMap((section) => section.fields.map((field) => field.key));
    for (const key of ["va-cc-dist", "iop", "cornea", "macula", "cd-ratio"]) {
      assert.ok(keys.includes(key), key);
    }
    const odos = exam.sections.flatMap((section) => section.fields).filter((field) => field.type === "odos");
    assert.ok(odos.length >= 12);
  });

  it("generates FHIR questionnaires with groups and required items", () => {
    const intake = getForm("new-patient-registration");
    assert.ok(intake);
    const questionnaire = toQuestionnaire(intake);
    assert.equal(questionnaire.resourceType, "Questionnaire");
    assert.equal(questionnaire.url, questionnaireUrl(intake.slug));
    assert.ok(questionnaire.item.length >= 4);
    const contact = questionnaire.item.find((item) => item.linkId === "patient");
    assert.ok(contact?.item?.some((item) => item.required && item.linkId === "last-name"));
  });

  it("flags missing required values and serializes responses", () => {
    const hipaa = getForm("hipaa-npp");
    assert.ok(hipaa);
    const missing = missingRequired(hipaa, {});
    assert.ok(missing.includes("Last name"));
    const complete = missingRequired(hipaa, {
      "last-name": "Rivera",
      "first-name": "Ana",
      dob: "1988-04-12",
      "received-npp": true,
      signature: "Ana Rivera",
      "signer-relationship": "Self",
      "sign-date": "2026-09-15",
    });
    assert.deepEqual(complete, []);
    const response = toQuestionnaireResponse(hipaa, { "last-name": "Rivera" });
    assert.equal(response.resourceType, "QuestionnaireResponse");
    assert.ok(response.item[0]?.item?.some((item) => item.linkId === "last-name"));
  });
});
