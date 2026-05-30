import { drawChart } from "./chart.js";

const slideCount = 9;
let slideIndex = 0;
let getPresentationData = () => null;

export function initializePresentationMode(dataProvider) {
  getPresentationData = dataProvider;
  document.querySelector("#exitPresentationButton").addEventListener("click", exitPresentationMode);
  document.querySelector("#previousPresentationButton").addEventListener("click", previousPresentationSlide);
  document.querySelector("#nextPresentationButton").addEventListener("click", nextPresentationSlide);
  document.addEventListener("keydown", handleKeyboardNavigation);
}

export function enterPresentationMode() {
  slideIndex = 0;
  document.body.classList.add("presentation-active");
  document.querySelector("#presentationView").hidden = false;
  renderPresentationSlide();
}

export function exitPresentationMode() {
  document.body.classList.remove("presentation-active");
  document.querySelector("#presentationView").hidden = true;
}

export function nextPresentationSlide() {
  if (slideIndex >= slideCount - 1) return;
  slideIndex += 1;
  renderPresentationSlide();
}

export function previousPresentationSlide() {
  if (slideIndex <= 0) return;
  slideIndex -= 1;
  renderPresentationSlide();
}

export function renderPresentationSlide() {
  const data = getPresentationData();
  if (!data) return;

  const slide = buildSlides(data)[slideIndex];
  document.querySelector("#presentationSlide").innerHTML = slide.content;
  document.querySelector("#presentationNotes").textContent = slide.notes;
  document.querySelector("#presentationCounter").textContent = `Slide ${slideIndex + 1} of ${slideCount}`;
  document.querySelector("#previousPresentationButton").disabled = slideIndex === 0;
  document.querySelector("#nextPresentationButton").disabled = slideIndex === slideCount - 1;

  if (slideIndex === 6) {
    drawChart(document.querySelector("#presentationChart"), data.currentPoints);
  }
}

function handleKeyboardNavigation(event) {
  if (!document.body.classList.contains("presentation-active")) return;
  if (event.key === "ArrowRight") nextPresentationSlide();
  if (event.key === "ArrowLeft") previousPresentationSlide();
  if (event.key === "Escape") exitPresentationMode();
}

function buildSlides(data) {
  return [
    {
      notes: "Introduce the project as a dynamic system: burnout changes over time as daily pressures and protective factors interact.",
      content: `
        <article class="presentation-hero">
          <p class="presentation-kicker">Differential Equations Final Project</p>
          <h1>Student-Athlete Burnout Simulator</h1>
          <p class="presentation-lead">This project models burnout as a changing system instead of a single fixed score. The model tracks how stress, energy, and recovery change over time based on academic load, training, work, sleep, and social support.</p>
          <div class="presentation-meta">
            <span>Athlete: <strong>${escapeHtml(data.profileName)}</strong></span>
            <span>Mode: <strong>${data.modeLabel}</strong></span>
            <span>Scenario: <strong>${escapeHtml(data.scenarioName)}</strong></span>
          </div>
        </article>
      `
    },
    {
      notes: "Explain the category using the actual current model output. This slide changes when the simulator or personal logs change.",
      content: `
        ${slideHeading("Current Burnout Status", "Live result from the active model")}
        <div class="presentation-status-layout">
          <div class="presentation-card status-card">
            <div class="presentation-category-badge ${data.burnoutCategory.toLowerCase()}">${data.burnoutCategory} Risk</div>
            <p>${escapeHtml(data.statusMeaning)}</p>
            <strong class="presentation-recommendation">${escapeHtml(data.recommendation)}</strong>
          </div>
          <div class="presentation-metric-grid">
            ${metricCard("Final stress", data.finalPoint.stress)}
            ${metricCard("Final energy", data.finalPoint.energy)}
            ${metricCard("Final recovery", data.finalPoint.recovery)}
            ${metricCard("Final burnout risk", data.finalPoint.risk)}
          </div>
        </div>
      `
    },
    {
      notes: "Define the three state variables first, then the five external inputs that push the rates of change up or down.",
      content: `
        ${slideHeading("Model Variables", "What the system tracks")}
        <div class="presentation-three-grid">
          ${variableCard("S(t)", "Stress", "Pressure from school, training, work, and life responsibilities.")}
          ${variableCard("E(t)", "Energy", "Available physical and mental energy.")}
          ${variableCard("R(t)", "Recovery", "How well the athlete is rebuilding after stress and training.")}
        </div>
        <div class="presentation-card presentation-inputs">
          <h3>Inputs</h3>
          <div class="presentation-input-grid">
            <span><strong>A</strong> Academic workload</span>
            <span><strong>T</strong> Training intensity</span>
            <span><strong>W</strong> Work responsibilities</span>
            <span><strong>L</strong> Sleep</span>
            <span><strong>P</strong> Social support</span>
          </div>
        </div>
      `
    },
    {
      notes: "These are coupled differential equations: the current stress, energy, and recovery values affect what happens next.",
      content: `
        ${slideHeading("What the Math Is Doing", "Three connected rates of change")}
        <div class="presentation-equation-stack">
          ${equationCard("Stress", "dS/dt = aA + bT + cW - dR - eP", "Academics, training, and work increase stress. Recovery and social support reduce stress.")}
          ${equationCard("Energy", "dE/dt = fR + gL - hS - iT - jW", "Recovery and sleep increase energy. Stress, training, and work drain energy.")}
          ${equationCard("Recovery", "dR/dt = kL + mP - nS - qT", "Sleep and support improve recovery. Stress and training reduce recovery.")}
        </div>
      `
    },
    {
      notes: "Emphasize that the app does not solve a closed-form equation. It approximates the trajectory one day at a time.",
      content: `
        ${slideHeading("How the App Approximates the Solution", "Euler's Method")}
        <div class="presentation-card euler-card">
          <p class="presentation-equation large">next value = current value + dt * rate of change</p>
          <div class="dt-callout">dt = 1 day</div>
          <p>The app calculates the rate of change for stress, energy, and recovery, then moves forward one day at a time.</p>
          <p>Each point on the graph is one Euler step. The app uses the current state and inputs to predict the next day's stress, energy, and recovery.</p>
        </div>
      `
    },
    {
      notes: "Scenario Mode repeats a hypothetical input pattern. Personal Log Mode allows the inputs to change from one recorded day to the next.",
      content: `
        ${slideHeading("Two Ways to Run the Model", "Scenario Mode vs Personal Log Mode")}
        <div class="presentation-two-grid">
          <article class="presentation-card">
            <h3>Scenario Mode</h3>
            <ul>
              <li>Uses one set of slider inputs repeatedly</li>
              <li>Good for testing hypothetical weeks</li>
              <li>Examples: Finals Week, Heavy Training Week, Low Sleep Week</li>
            </ul>
          </article>
          <article class="presentation-card">
            <h3>Personal Log Mode</h3>
            <ul>
              <li>Uses actual saved daily logs</li>
              <li>Each logged day becomes one Euler step</li>
              <li>Good for modeling a real schedule pattern</li>
            </ul>
            <p class="presentation-callout">${data.logCount ? `Based on ${data.logCount} logged days.` : "No logs loaded yet. Use sample data or daily logs to run Personal Log Mode."}</p>
          </article>
        </div>
      `
    },
    {
      notes: "Read the four lines as a story: pressure, available resources, rebuilding, and the combined burnout risk score.",
      content: `
        ${slideHeading("Reading the Results", "Graph and insights")}
        <div class="presentation-graph-layout">
          <div class="presentation-chart-frame">
            <canvas id="presentationChart" width="1100" height="500"></canvas>
          </div>
          <div class="presentation-insight-list">
            ${insightItem("Highest stress", formatPoint(data.insights.highestStress))}
            ${trendInsightItem("Energy change", data.insights.firstPoint.energy, data.insights.finalPoint.energy, data.insights.changes.energy)}
            ${trendInsightItem("Recovery change", data.insights.firstPoint.recovery, data.insights.finalPoint.recovery, data.insights.changes.recovery)}
            ${trendInsightItem("Burnout risk trend", data.insights.firstPoint.risk, data.insights.finalPoint.risk, data.insights.changes.risk)}
          </div>
        </div>
        <p class="presentation-caption"><strong>Stress</strong> shows pressure, <strong>energy</strong> shows available resources, <strong>recovery</strong> shows rebuilding, and <strong>burnout risk</strong> subtracts protective energy and recovery from stress.</p>
        <p class="presentation-caption">${escapeHtml(data.insights.interpretation)}</p>
      `
    },
    {
      notes: "The what-if experiments rerun the same logged sequence with one virtual adjustment. They do not edit the saved logs.",
      content: `
        ${slideHeading("Testing Changes", "Compare and what-if results")}
        ${
          data.comparison
            ? `
              <div class="presentation-three-grid compact">
                ${metricTextCard("Scenario final risk", data.comparison.scenarioFinal.risk.toFixed(1))}
                ${metricTextCard("Personal log final risk", data.comparison.personalFinal.risk.toFixed(1))}
                ${metricTextCard("Difference", formatSigned(data.comparison.riskDifference))}
              </div>
              <div class="presentation-what-if-grid">
                ${data.whatIfResults.map(buildPresentationWhatIfCard).join("")}
              </div>
              <p class="presentation-caption">The what-if experiments rerun the model without permanently changing saved logs. This shows how changing one input can change the solution curve.</p>
            `
            : `<p class="presentation-empty">Load sample logs to compare and run what-if experiments.</p>`
        }
      `
    },
    {
      notes: "Close by separating the educational value from clinical interpretation. The model is useful for exploring patterns, not diagnosing people.",
      content: `
        ${slideHeading("Final Takeaways", "What this project demonstrates")}
        <div class="presentation-three-grid">
          ${takeawayCard("1", "Burnout can be modeled dynamically", "Stress, energy, and recovery change over time instead of staying fixed.")}
          ${takeawayCard("2", "Small inputs can change long-term trends", "Sleep, support, training, and workload all affect the model's trajectory.")}
          ${takeawayCard("3", "The model is educational", "The coefficients are chosen for demonstration and are not clinical data.")}
        </div>
        <div class="presentation-card limitation-slide-card">
          <h3>Limitations</h3>
          <ul>
            <li>This is not a medical or psychological assessment tool.</li>
            <li>Burnout is simplified into three variables.</li>
            <li>Real life has more factors than this model includes.</li>
            <li>The model is meant to explore patterns, not diagnose anyone.</li>
          </ul>
        </div>
      `
    }
  ];
}

function slideHeading(title, subtitle) {
  return `<header class="presentation-slide-heading"><p class="presentation-kicker">${escapeHtml(subtitle)}</p><h2>${escapeHtml(title)}</h2></header>`;
}

function metricCard(label, value) {
  return `<article class="presentation-card presentation-metric"><span>${label}</span><strong>${Number(value).toFixed(1)}</strong></article>`;
}

function metricTextCard(label, value) {
  return `<article class="presentation-card presentation-metric"><span>${label}</span><strong>${escapeHtml(value)}</strong></article>`;
}

function variableCard(symbol, label, text) {
  return `<article class="presentation-card variable-card"><strong>${symbol}</strong><h3>${label}</h3><p>${text}</p></article>`;
}

function equationCard(label, equation, text) {
  return `<article class="presentation-card equation-slide-card"><h3>${label}</h3><p class="presentation-equation">${equation}</p><p>${text}</p></article>`;
}

function insightItem(label, value) {
  return `<article class="presentation-card insight-slide-card"><span>${label}</span><strong>${escapeHtml(value)}</strong></article>`;
}

function trendInsightItem(label, start, end, difference) {
  return `<article class="presentation-card insight-slide-card"><span>${label}</span><strong>${formatTransition(start, end)}</strong><small>${formatSigned(difference)} over the model</small></article>`;
}

function takeawayCard(number, title, text) {
  return `<article class="presentation-card takeaway-card"><strong>${number}</strong><h3>${title}</h3><p>${text}</p></article>`;
}

function buildPresentationWhatIfCard(result) {
  return `
    <article class="presentation-card presentation-what-if-card">
      <h3>${result.label}</h3>
      <p>${formatWhatIfSentence(result)}</p>
      <dl>
        <div><dt>Original final risk</dt><dd>${result.originalFinalRisk.toFixed(1)}</dd></div>
        <div><dt>Adjusted final risk</dt><dd>${result.finalRisk.toFixed(1)}</dd></div>
        <div><dt>Final risk change</dt><dd>${formatSigned(result.difference)}</dd></div>
        <div><dt>Average risk change</dt><dd>${formatSigned(result.averageRiskChange)}</dd></div>
      </dl>
      ${result.reachesMinimumRisk ? `<small>This reaches the model's minimum possible risk because stress, energy, and recovery are clamped between 0 and 100.</small>` : ""}
    </article>
  `;
}

function formatWhatIfSentence(result) {
  const amount = Math.abs(result.difference).toFixed(1);
  if (result.difference < -0.05) return `${result.label} lowers final burnout risk by ${amount} points.`;
  if (result.difference > 0.05) return `${result.label} raises final burnout risk by ${amount} points.`;
  return `${result.label} does not meaningfully change final burnout risk.`;
}

function formatPoint(point) {
  const date = point.date ? ` / ${point.date}` : "";
  return `Day ${point.day}${date}`;
}

function formatSigned(value) {
  const number = Number(value);
  return `${number > 0 ? "+" : ""}${number.toFixed(1)}`;
}

function formatTransition(start, end) {
  return `${Number(start).toFixed(1)} \u2192 ${Number(end).toFixed(1)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
