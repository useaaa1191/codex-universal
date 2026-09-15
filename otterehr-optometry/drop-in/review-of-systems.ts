/**
 * Drop-in ROS overlay for packages/utils/lib/ottehr-config/review-of-systems
 * Keep the 14-system medical ROS and expand Eyes for optometry.
 */
export const OptometryRosConfig = {
  constitutional: {
    label: "Constitutional",
    items: {
      "ros-constitutional-fever": { label: "Fever" },
      "ros-constitutional-fatigue": { label: "Fatigue" },
      "ros-constitutional-weight-change": { label: "Weight loss/gain" },
    },
  },
  eyes: {
    label: "Eyes",
    items: {
      "ros-eyes-distance-blur": { label: "Distance blur" },
      "ros-eyes-near-blur": { label: "Near blur" },
      "ros-eyes-fluctuating": { label: "Fluctuating vision" },
      "ros-eyes-diplopia": { label: "Diplopia" },
      "ros-eyes-pain": { label: "Eye pain" },
      "ros-eyes-redness": { label: "Redness" },
      "ros-eyes-itching": { label: "Itching" },
      "ros-eyes-burning": { label: "Burning / foreign-body sensation" },
      "ros-eyes-tearing": { label: "Tearing" },
      "ros-eyes-discharge": { label: "Discharge" },
      "ros-eyes-photophobia": { label: "Photophobia" },
      "ros-eyes-flashes": { label: "Photopsias / flashes" },
      "ros-eyes-floaters": { label: "Floaters" },
      "ros-eyes-curtain": { label: "Curtain / field cut" },
      "ros-eyes-halos": { label: "Halos" },
      "ros-eyes-metamorphopsia": { label: "Distortion / metamorphopsia" },
      "ros-eyes-headache": { label: "Asthenopia / headache" },
      "ros-eyes-dryness": { label: "Dryness" },
    },
  },
  neurologic: {
    label: "Neurologic",
    items: {
      "ros-neuro-headache": { label: "Headache" },
      "ros-neuro-dizziness": { label: "Dizziness" },
      "ros-neuro-weakness": { label: "Weakness" },
      "ros-neuro-numbness": { label: "Numbness" },
      "ros-neuro-speech": { label: "Speech change" },
    },
  },
  endocrine: {
    label: "Endocrine",
    items: {
      "ros-endo-polydipsia": { label: "Polydipsia" },
      "ros-endo-polyuria": { label: "Polyuria" },
      "ros-endo-weight": { label: "Unexplained weight change" },
    },
  },
  allergic: {
    label: "Allergic / immunologic",
    items: {
      "ros-allergy-seasonal": { label: "Seasonal allergies" },
      "ros-allergy-medication": { label: "Medication allergies" },
    },
  },
  cardiovascular: {
    label: "Cardiovascular",
    items: {
      "ros-cardiovascular-htn": { label: "Known hypertension" },
      "ros-cardiovascular-chest-pain": { label: "Chest pain" },
    },
  },
};
