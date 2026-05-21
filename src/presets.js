export const defaultState = {
  profileName: "Jordan Lee",
  academic: 6,
  training: 7,
  work: 4,
  sleep: 6,
  support: 5,
  days: 30,
  stress: 30,
  energy: 70,
  recovery: 60
};

export const presets = {
  balanced: {
    name: "Balanced Week",
    values: { academic: 6, training: 7, work: 4, sleep: 6, support: 5, days: 30, stress: 30, energy: 70, recovery: 60 }
  },
  finals: {
    name: "Finals Week",
    values: { academic: 9, training: 6, work: 4, sleep: 4, support: 5, days: 30, stress: 45, energy: 60, recovery: 50 }
  },
  training: {
    name: "Heavy Training Week",
    values: { academic: 6, training: 9, work: 3, sleep: 6, support: 5, days: 30, stress: 38, energy: 66, recovery: 55 }
  },
  lowSleep: {
    name: "Low Sleep Week",
    values: { academic: 7, training: 7, work: 5, sleep: 3, support: 4, days: 30, stress: 40, energy: 58, recovery: 45 }
  },
  support: {
    name: "Strong Support Week",
    values: { academic: 6, training: 7, work: 4, sleep: 7, support: 9, days: 30, stress: 30, energy: 70, recovery: 70 }
  }
};

export const sliderDefinitions = [
  { key: "academic", label: "Academic workload", min: 0, max: 10, step: 1 },
  { key: "training", label: "Training intensity", min: 0, max: 10, step: 1 },
  { key: "work", label: "Work responsibilities", min: 0, max: 10, step: 1 },
  { key: "sleep", label: "Sleep", min: 0, max: 10, step: 1 },
  { key: "support", label: "Social support", min: 0, max: 10, step: 1 },
  { key: "days", label: "Simulation days", min: 7, max: 90, step: 1 },
  { key: "stress", label: "Initial stress", min: 0, max: 100, step: 1 },
  { key: "energy", label: "Initial energy", min: 0, max: 100, step: 1 },
  { key: "recovery", label: "Initial recovery", min: 0, max: 100, step: 1 }
];
