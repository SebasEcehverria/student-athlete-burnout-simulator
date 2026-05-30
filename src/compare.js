import { runEulerFromLogs, runEulerSimulation } from "./euler.js";
import { getBurnoutCategory } from "./model.js";

export function calculateModeComparison(state, logEntries) {
  if (!logEntries.length) return null;

  const scenarioPoints = runEulerSimulation(state);
  const personalPoints = runEulerFromLogs(state, logEntries);
  const scenarioFinal = scenarioPoints[scenarioPoints.length - 1];
  const personalFinal = personalPoints[personalPoints.length - 1];
  const riskDifference = personalFinal.risk - scenarioFinal.risk;

  return {
    scenarioFinal,
    personalFinal,
    scenarioCategory: getBurnoutCategory(scenarioFinal.risk),
    personalCategory: getBurnoutCategory(personalFinal.risk),
    riskDifference
  };
}

export function renderComparison(state, logEntries) {
  const comparison = calculateModeComparison(state, logEntries);
  const empty = document.querySelector("#compareEmptyMessage");
  const panel = document.querySelector("#comparisonPanel");
  const narrative = document.querySelector("#comparisonNarrative");

  if (!comparison) {
    empty.hidden = false;
    panel.innerHTML = "";
    narrative.textContent = "Add daily logs or load sample data to compare modes.";
    return;
  }

  empty.hidden = true;
  panel.innerHTML = [
    buildModeCard("Scenario Mode", comparison.scenarioFinal, comparison.scenarioCategory),
    buildModeCard("Personal Log Mode", comparison.personalFinal, comparison.personalCategory)
  ].join("");
  narrative.textContent = buildNarrative(comparison.riskDifference);
}

function buildModeCard(title, point, category) {
  return `
    <article class="panel compare-card">
      <h3>${title}</h3>
      <div class="comparison-metrics">
        <p><span>Final stress</span><strong>${point.stress.toFixed(1)}</strong></p>
        <p><span>Final energy</span><strong>${point.energy.toFixed(1)}</strong></p>
        <p><span>Final recovery</span><strong>${point.recovery.toFixed(1)}</strong></p>
        <p><span>Final burnout risk</span><strong>${point.risk.toFixed(1)}</strong></p>
        <p><span>Burnout category</span><strong>${category}</strong></p>
      </div>
    </article>
  `;
}

function buildNarrative(difference) {
  const amount = Math.abs(difference).toFixed(1);
  if (difference > 0) {
    return `Personal logs produced a burnout risk ${amount} points higher than the current scenario.`;
  }
  if (difference < 0) {
    return `Personal logs produced a burnout risk ${amount} points lower than the current scenario.`;
  }
  return "Personal logs produced the same final burnout risk as the current scenario.";
}
