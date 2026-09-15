/**
 * Drop-in replacement for packages/utils/lib/ottehr-config/forms/index.ts
 * Copy into a forked Ottehr repo, then point Plan-tab form links at these public URLs
 * or host the PDFs generated from this pack.
 */
export const FORMS_CONFIG = Object.freeze({
  forms: [
    { title: "Spectacle prescription", link: "/forms/spectacle-rx" },
    { title: "Contact lens prescription", link: "/forms/contact-lens-rx" },
    { title: "Work / school excuse", link: "/forms/work-school-excuse" },
    { title: "DMV / driver vision report", link: "/forms/dmv-vision" },
    { title: "School vision screening", link: "/forms/school-vision-screening" },
    { title: "Authorization to release records", link: "/forms/release-of-records" },
    { title: "Ophthalmology referral", link: "/forms/ophthalmology-referral" },
    { title: "Diabetic exam report to PCP", link: "/forms/pcp-diabetes-letter" },
    { title: "FTC contact lens Rx release", link: "/forms/cl-rx-release" },
  ],
});
