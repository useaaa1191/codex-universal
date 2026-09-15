# OtterEHR Optometry Pack

Fillable intake, consents, OD/OS exam templates, Rx pads, referral letters, and drop-in config so an optometry practice can run on [Ottehr](https://github.com/masslight/ottehr).

Ottehr ships as an urgent-care / general EHR. This pack supplies the missing eye-care paperwork and charting: dilation and Optomap consents, contact lens agreements, comprehensive 92004/92014 templates, diabetic and glaucoma follow-ups, FTC contact lens Rx release, and FHIR Questionnaires you can load as Ottehr paperwork.

## Run the forms app

```bash
cd otterehr-optometry
npm install
npm run dev      # http://localhost:3010
npm test
npm run typecheck
```

Drafts save in the browser. Print from any form. Export FHIR Questionnaire or QuestionnaireResponse from the form toolbar. Apply WNL on exam templates to stamp standard normals (20/20, PERRL, D&Q, attached periphery).

## What is included

| Category | Examples |
| --- | --- |
| Intake | Registration, medical/ocular history, insurance/AOB, pharmacy, communications |
| Consents | HIPAA, treat, dilation, retinal imaging, refraction notice, CL agreement, telehealth, minor |
| Procedures | FB removal, punctal plugs, amniotic membrane, IPL/MGD, Ortho-K, myopia management |
| Exams | Comprehensive, intermediate, E/M, CL fit/FU, pediatric, dry eye, glaucoma, DR, AMD, red eye, cataract, BV, low vision, trauma |
| Output | Spectacle/CL Rx, OMD referral, PCP diabetes letter, DMV, school screening, AVS, education |

Drop-in TypeScript for a forked Ottehr repo lives in `drop-in/`:

- `consent-forms.ts` → `packages/utils/lib/ottehr-config/consent-forms`
- `forms.ts` → Plan-tab form links
- `examination.ts` → optometry exam cards (OD/OS)
- `review-of-systems.ts` → expanded ocular ROS
- `medical-history.ts` → ocular + systemic quick picks
- `intake-paperwork.ts` → extra intake pages
- `procedures.ts` → CPT / body sites
- `global-templates.ts` → progress-note templates

Keep Ottehr's `hipaa-acknowledgement` and `consent-to-treat` IDs. The pack reuses them so existing paperwork checkboxes still bind.

## Ottehr wiring

1. Fork [masslight/ottehr](https://github.com/masslight/ottehr) and complete the Oystehr project setup in `deploy/README.md`.
2. Merge the files in `drop-in/` into `packages/utils/lib/ottehr-config/` (consent, forms, examination, ROS, medical history, intake).
3. Add optometry visit types (comprehensive, CL, medical, follow-up) in booking config.
4. Bump `IN_PERSON_INTAKE_PAPERWORK_VERSION` and regenerate questionnaires (`packages/zambdas` regen script in upstream docs).
5. Seed global templates from `drop-in/global-templates.ts` in EHR Admin.
6. Point consent `publicUrl` values at this app's `/forms/[slug]` routes or exported PDFs.

This app does not replace Oystehr hosting. It is the clinical content pack plus a working forms UI so staff can use the documents before the FHIR backend is wired.
