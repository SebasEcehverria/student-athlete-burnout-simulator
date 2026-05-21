export const coefficients = {
  a: 0.35,
  b: 0.32,
  c: 0.2,
  d: 0.05,
  e: 0.35,
  f: 0.04,
  g: 0.35,
  h: 0.05,
  i: 0.3,
  j: 0.18,
  k: 0.35,
  m: 0.32,
  n: 0.045,
  q: 0.28
};

export function calculateRates(state, inputs, c = coefficients) {
  return {
    stress: c.a * inputs.academic + c.b * inputs.training + c.c * inputs.work - c.d * state.recovery - c.e * inputs.support,
    energy: c.f * state.recovery + c.g * inputs.sleep - c.h * state.stress - c.i * inputs.training - c.j * inputs.work,
    recovery: c.k * inputs.sleep + c.m * inputs.support - c.n * state.stress - c.q * inputs.training
  };
}

export function calculateBurnoutRisk(state) {
  return state.stress - 0.5 * state.energy - 0.5 * state.recovery;
}

export function getBurnoutCategory(risk) {
  if (risk >= 25) return "High";
  if (risk >= 0) return "Moderate";
  return "Low";
}

export function getInterpretation(category, profileName) {
  if (category === "High") {
    return `${profileName} ends the simulation with high stress compared with energy and recovery. In the model, this points to a week pattern that may be hard to sustain.`;
  }

  if (category === "Moderate") {
    return `${profileName} finishes with some pressure building up. The model suggests that improving sleep, support, or workload balance could lower risk.`;
  }

  return `${profileName} finishes with enough energy and recovery to offset stress. In the model, this schedule looks more sustainable.`;
}
