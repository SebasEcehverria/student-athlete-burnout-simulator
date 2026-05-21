import { getBurnoutCategory } from "./model.js";

export function calculateInsights(points) {
  const finalPoint = points[points.length - 1];
  const highestStress = maxBy(points, "stress");
  const lowestEnergy = minBy(points, "energy");
  const lowestRecovery = minBy(points, "recovery");
  const averages = {
    stress: average(points, "stress"),
    energy: average(points, "energy"),
    recovery: average(points, "recovery")
  };
  const riskTrend = finalPoint.risk - points[0].risk;

  return {
    highestStress,
    lowestEnergy,
    lowestRecovery,
    finalCategory: getBurnoutCategory(finalPoint.risk),
    averages,
    riskTrend,
    interpretation: buildInsightInterpretation(points, averages, riskTrend)
  };
}

export function renderInsights(points) {
  const insights = calculateInsights(points);
  const cards = [
    {
      label: "Highest Stress Day",
      value: `Day ${insights.highestStress.day}`,
      detail: insights.highestStress.stress.toFixed(1)
    },
    {
      label: "Lowest Energy Day",
      value: `Day ${insights.lowestEnergy.day}`,
      detail: insights.lowestEnergy.energy.toFixed(1)
    },
    {
      label: "Lowest Recovery Day",
      value: `Day ${insights.lowestRecovery.day}`,
      detail: insights.lowestRecovery.recovery.toFixed(1)
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
      value: formatTrend(insights.riskTrend),
      detail: insights.riskTrend >= 0 ? "Risk increased" : "Risk decreased"
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

function buildInsightInterpretation(points, averages, riskTrend) {
  const first = points[0];
  const final = points[points.length - 1];
  const stressRises = final.stress > first.stress;
  const energyFalls = final.energy < first.energy;
  const recoveryFalls = final.recovery < first.recovery;

  if (stressRises && energyFalls && recoveryFalls) {
    return "If stress rises while energy and recovery fall, the model suggests the schedule may become harder to sustain over time.";
  }

  if (riskTrend > 15) {
    return "Burnout risk climbs noticeably in this run, so the model points toward reducing load or adding more recovery support.";
  }

  if (averages.energy > averages.stress && averages.recovery > averages.stress) {
    return "Energy and recovery stay above stress on average, so this scenario looks more balanced in the model.";
  }

  return "The simulation shows a mixed pattern. Small changes to sleep, support, workload, or training could shift the final risk category.";
}

function maxBy(points, key) {
  return points.reduce((best, point) => (point[key] > best[key] ? point : best), points[0]);
}

function minBy(points, key) {
  return points.reduce((best, point) => (point[key] < best[key] ? point : best), points[0]);
}

function average(points, key) {
  return points.reduce((sum, point) => sum + point[key], 0) / points.length;
}

function formatTrend(value) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}`;
}
