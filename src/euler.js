import { calculateBurnoutRisk, calculateRates } from "./model.js";

export function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export function runEulerSimulation(config) {
  const inputs = {
    academic: config.academic,
    training: config.training,
    work: config.work,
    sleep: config.sleep,
    support: config.support
  };

  const dt = 1;
  const days = Number(config.days);
  let current = {
    stress: Number(config.stress),
    energy: Number(config.energy),
    recovery: Number(config.recovery)
  };

  const points = [
    {
      day: 0,
      ...current,
      risk: calculateBurnoutRisk(current)
    }
  ];

  for (let day = 1; day <= days; day += 1) {
    const rates = calculateRates(current, inputs);

    current = {
      stress: clamp(current.stress + dt * rates.stress),
      energy: clamp(current.energy + dt * rates.energy),
      recovery: clamp(current.recovery + dt * rates.recovery)
    };

    points.push({
      day,
      ...current,
      risk: calculateBurnoutRisk(current)
    });
  }

  return points;
}
