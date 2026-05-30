import { getBurnoutCategory } from "./model.js";

export function calculateInsights(points) {
  const firstPoint = points[0];
  const finalPoint = points[points.length - 1];
  const modeledPoints = points.length > 1 ? points.slice(1) : points;
  const highestStress = maxBy(modeledPoints, "stress");
  const averages = {
    stress: average(points, "stress"),
    energy: average(points, "energy"),
    recovery: average(points, "recovery")
  };
  const changes = {
    stress: finalPoint.stress - firstPoint.stress,
    energy: finalPoint.energy - firstPoint.energy,
    recovery: finalPoint.recovery - firstPoint.recovery,
    risk: finalPoint.risk - firstPoint.risk
  };

  return {
    firstPoint,
    finalPoint,
    highestStress,
    finalCategory: getBurnoutCategory(finalPoint.risk),
    averages,
    changes,
    riskTrend: changes.risk,
    interpretation: buildInsightInterpretation(changes)
  };
}

export function renderInsights(points) {
  if (!points.length) {
    document.querySelector("#insightCards").innerHTML = "";
    document.querySelector("#insightInterpretation").textContent = "Add daily logs first to model your personal trend.";
    return;
  }

  const insights = calculateInsights(points);
  const cards = [
    {
      label: "Highest Stress Day",
      value: formatPointLabel(insights.highestStress),
      detail: insights.highestStress.stress.toFixed(1)
    },
    {
      label: "Energy Change",
      value: formatTransition(insights.firstPoint.energy, insights.finalPoint.energy),
      detail: `${formatTrend(insights.changes.energy)} over the model`
    },
    {
      label: "Recovery Change",
      value: formatTransition(insights.firstPoint.recovery, insights.finalPoint.recovery),
      detail: `${formatTrend(insights.changes.recovery)} over the model`
    },
    {
      label: "Final Burnout Category",
      value: insights.finalCategory,
      detail: "End of simulation"
    },
    {
      label: "Average Stress",
      value: insights.averages.stress.toFixed(1),
      detail: "Across all simulated days"
    },
    {
      label: "Average Energy",
      value: insights.averages.energy.toFixed(1),
      detail: "Across all simulated days"
    },
    {
      label: "Average Recovery",
      value: insights.averages.recovery.toFixed(1),
      detail: "Across all simulated days"
    },
    {
      label: "Burnout Risk Trend",
      value: formatTransition(insights.firstPoint.risk, insights.finalPoint.risk),
      detail: `${formatTrend(insights.changes.risk)} over the model`
    }
  ];

  document.querySelector("#insightCards").innerHTML = cards
    .map(
      (card) => `
        <article class="panel insight-card">
          <span>${card.label}</span>
          <strong>${card.value}</strong>
          <p>${card.detail}</p>
        </article>
      `
    )
    .join("");

  document.querySelector("#insightInterpretation").textContent = insights.interpretation;
}

function buildInsightInterpretation(changes) {
  return `Over the model, stress ${describeDirection(changes.stress)}, energy ${describeDirection(changes.energy)}, and recovery ${describeDirection(changes.recovery)}. Burnout risk ${describeDirection(changes.risk)}, which shows how the balance between pressure and protective factors changed over time.`;
}

function maxBy(points, key) {
  return points.reduce((best, point) => (point[key] > best[key] ? point : best), points[0]);
}

function average(points, key) {
  return points.reduce((sum, point) => sum + point[key], 0) / points.length;
}

function formatTrend(value) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}`;
}

function formatPointLabel(point) {
  return point.date ? `Day ${point.day} / ${point.date}` : `Day ${point.day}`;
}

function formatTransition(start, end) {
  return `${start.toFixed(1)} \u2192 ${end.toFixed(1)}`;
}

function describeDirection(value) {
  if (value > 0.05) return `increased by ${value.toFixed(1)}`;
  if (value < -0.05) return `decreased by ${Math.abs(value).toFixed(1)}`;
  return "stayed nearly unchanged";
}
