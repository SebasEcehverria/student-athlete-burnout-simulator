import { runEulerFromLogs } from "./euler.js";

const experiments = [
  { label: "Sleep +1", key: "sleep", delta: 1 },
  { label: "Support +1", key: "support", delta: 1 },
  { label: "Training -1", key: "training", delta: -1 },
  { label: "Work -1", key: "work", delta: -1 },
  { label: "Academic workload -1", key: "academic", delta: -1 }
];

export function applyWhatIf(logEntries, adjustment) {
  return logEntries.map((entry) => ({
    ...entry,
    [adjustment.key]: clampInput(Number(entry[adjustment.key]) + adjustment.delta)
  }));
}

export function calculateWhatIfResults(state, logEntries) {
  if (!logEntries.length) return [];

  const basePoints = runEulerFromLogs(state, logEntries);
  const baseRisk = basePoints[basePoints.length - 1].risk;

  return experiments.map((experiment) => {
    const modifiedLogs = applyWhatIf(logEntries, experiment);
    const points = runEulerFromLogs(state, modifiedLogs);
    const finalRisk = points[points.length - 1].risk;
    return {
      label: experiment.label,
      originalFinalRisk: baseRisk,
      difference: finalRisk - baseRisk,
      finalRisk,
      averageRiskChange: averageRiskDifference(basePoints, points),
      reachesMinimumRisk: finalRisk <= -99.95
    };
  });
}

export function renderWhatIfResults(state, logEntries) {
  const container = document.querySelector("#whatIfResults");
  const results = calculateWhatIfResults(state, logEntries);

  if (!results.length) {
    container.innerHTML = `<p class="empty-state inline-empty">Add daily logs or load sample data to run what-if experiments.</p>`;
    return;
  }

  container.innerHTML = results
    .map(
      (result) => `
        <article class="what-if-card">
          <strong>${result.label}</strong>
          <p>${formatWhatIfSentence(result)}</p>
          <dl class="what-if-metrics">
            <div><dt>Original final risk</dt><dd>${result.originalFinalRisk.toFixed(1)}</dd></div>
            <div><dt>Adjusted final risk</dt><dd>${result.finalRisk.toFixed(1)}</dd></div>
            <div><dt>Final risk change</dt><dd>${formatSigned(result.difference)}</dd></div>
            <div><dt>Average risk change</dt><dd>${formatSigned(result.averageRiskChange)}</dd></div>
          </dl>
          ${result.reachesMinimumRisk ? `<small>This reaches the model's minimum possible risk because stress, energy, and recovery are clamped between 0 and 100.</small>` : ""}
        </article>
      `
    )
    .join("");
}

function formatWhatIfSentence(result) {
  const amount = Math.abs(result.difference).toFixed(1);
  if (result.difference < -0.05) {
    return `${result.label} lowers final burnout risk by ${amount} points.`;
  }
  if (result.difference > 0.05) {
    return `${result.label} raises final burnout risk by ${amount} points.`;
  }
  return `${result.label} does not meaningfully change final burnout risk in this run.`;
}

function clampInput(value) {
  return Math.min(10, Math.max(0, value));
}

function averageRiskDifference(basePoints, adjustedPoints) {
  return adjustedPoints.reduce((sum, point, index) => sum + point.risk - basePoints[index].risk, 0) / adjustedPoints.length;
}

function formatSigned(value) {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}`;
}
