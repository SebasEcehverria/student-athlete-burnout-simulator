import { drawChart } from "./chart.js";
import { runEulerFromLogs, runEulerSimulation } from "./euler.js";
import { getLogEntries, initializeLogbook } from "./logbook.js";
import { getBurnoutCategory, getInterpretation } from "./model.js";
import { defaultState, presets, sliderDefinitions } from "./presets.js";
import { renderInsights } from "./insights.js";

let state = { ...defaultState };
let activePreset = "balanced";
let chartCanvas;
let currentPoints = [];
let modelMode = "scenario";

const sectionTitles = {
  dashboard: "Dashboard",
  "daily-log": "Daily Log",
  simulator: "Simulator",
  model: "Model",
  insights: "Insights"
};

const recommendations = {
  Low: "Current balance looks sustainable in the model.",
  Moderate: "Recovery may need more attention.",
  High: "Stress is overpowering energy and recovery in this scenario."
};

export function initializeUI() {
  chartCanvas = document.querySelector("#simulationChart");

  buildSliders();
  bindNavigation();
  bindModelModeButtons();
  bindProfileInput();
  bindPresetButtons();
  bindThemeToggle();
  bindResetButton();
  bindUseLogsButton();
  initializeLogbook({ onEntriesChange: () => render() });
  applyState({ ...defaultState, ...presets.balanced.values }, "balanced");

  window.addEventListener("resize", () => render());
}

function buildSliders() {
  const container = document.querySelector("#sliderControls");
  container.innerHTML = sliderDefinitions
    .map(
      (slider) => `
        <label class="slider-control" for="${slider.key}">
          <span class="slider-row">
            <span>${slider.label}</span>
            <strong id="${slider.key}Value">${defaultState[slider.key]}</strong>
          </span>
          <input
            id="${slider.key}"
            type="range"
            min="${slider.min}"
            max="${slider.max}"
            step="${slider.step}"
            value="${defaultState[slider.key]}"
            data-key="${slider.key}"
          />
        </label>
      `
    )
    .join("");

  container.querySelectorAll("input[type='range']").forEach((input) => {
    input.addEventListener("input", (event) => {
      const key = event.target.dataset.key;
      state[key] = Number(event.target.value);
      activePreset = "";
      updateSliderLabels();
      updatePresetState();
      render();
    });
  });
}

function bindNavigation() {
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.addEventListener("click", () => {
      const section = button.dataset.section;
      navigateToSection(section);
    });
  });
}

function bindModelModeButtons() {
  document.querySelectorAll(".mode-button").forEach((button) => {
    button.addEventListener("click", () => {
      modelMode = button.dataset.mode;
      updateModelModeButtons();
      updateScenarioLabels();
      render();
    });
  });
}

function bindProfileInput() {
  const input = document.querySelector("#profileName");
  input.addEventListener("input", (event) => {
    state.profileName = event.target.value.trim() || "Student-Athlete";
    render();
  });
}

function bindPresetButtons() {
  document.querySelectorAll(".preset-button").forEach((button) => {
    button.addEventListener("click", () => {
      const presetKey = button.dataset.preset;
      modelMode = "scenario";
      updateModelModeButtons();
      applyState(presets[presetKey].values, presetKey);
    });
  });
}

function bindThemeToggle() {
  const button = document.querySelector("#themeToggle");
  const icon = document.querySelector("#themeIcon");

  button.addEventListener("click", () => {
    const isLight = document.documentElement.dataset.theme === "light";
    document.documentElement.dataset.theme = isLight ? "dark" : "light";
    icon.textContent = isLight ? "Dark" : "Light";
    render();
  });
}

function bindResetButton() {
  document.querySelector("#resetButton").addEventListener("click", () => {
    document.querySelector("#profileName").value = defaultState.profileName;
    state.profileName = defaultState.profileName;
    modelMode = "scenario";
    updateModelModeButtons();
    applyState({ ...defaultState, ...presets.balanced.values }, "balanced");
  });
}

function bindUseLogsButton() {
  document.querySelector("#useLogsButton").addEventListener("click", () => {
    modelMode = "personal";
    updateModelModeButtons();
    updateScenarioLabels();
    navigateToSection("simulator");
    render();
  });
}

function applyState(values, presetKey) {
  state = { ...state, ...values };
  activePreset = presetKey;

  sliderDefinitions.forEach((slider) => {
    const input = document.querySelector(`#${slider.key}`);
    input.value = state[slider.key];
  });

  updateSliderLabels();
  updatePresetState();
  render();
}

function updateSliderLabels() {
  sliderDefinitions.forEach((slider) => {
    document.querySelector(`#${slider.key}Value`).textContent = state[slider.key];
  });
}

function updatePresetState() {
  document.querySelectorAll(".preset-button").forEach((button) => {
    button.classList.toggle("active", modelMode === "scenario" && button.dataset.preset === activePreset);
  });

  updateScenarioLabels();
}

function updateScenarioLabels() {
  const scenarioName = getActiveScenarioName();

  document.querySelector("#scenarioName").textContent = scenarioName;
  document.querySelector("#sidebarScenario").textContent = scenarioName;
  document.querySelector("#dashboardScenario").textContent = scenarioName;
}

function render() {
  const logEntries = getLogEntries();
  currentPoints = modelMode === "personal" ? runEulerFromLogs(state, logEntries) : runEulerSimulation(state);
  const finalPoint = currentPoints[currentPoints.length - 1];
  const category = getBurnoutCategory(finalPoint.risk);

  updateModelModeButtons();
  updateScenarioLabels();
  renderModeMessage(logEntries.length);
  drawChart(chartCanvas, currentPoints);
  renderSimulatorSummary(finalPoint, category, logEntries.length);
  renderDashboard(finalPoint, category, logEntries.length);
  renderInsights(currentPoints);
}

function renderSimulatorSummary(finalPoint, category, logCount) {
  const titleDetail = modelMode === "personal" ? `Personal Log Model (${logCount} logged days)` : `Scenario Simulation (${state.days} days)`;
  document.querySelector("#chartTitle").textContent = `${state.profileName}'s ${titleDetail}`;
  document.querySelector("#finalStress").textContent = finalPoint.stress.toFixed(1);
  document.querySelector("#finalEnergy").textContent = finalPoint.energy.toFixed(1);
  document.querySelector("#finalRecovery").textContent = finalPoint.recovery.toFixed(1);
  document.querySelector("#finalRisk").textContent = finalPoint.risk.toFixed(1);

  const badge = document.querySelector("#categoryBadge");
  badge.textContent = category;
  badge.className = `category-badge ${category.toLowerCase()}`;

  document.querySelector("#interpretation").textContent = getInterpretation(category, state.profileName);
}

function renderDashboard(finalPoint, category, logCount) {
  document.querySelector("#dashboardName").textContent = state.profileName;
  document.querySelector("#dashboardMode").textContent = modelMode === "personal" ? "Personal Log Mode" : "Scenario Mode";
  document.querySelector("#dashboardModeDetail").textContent =
    modelMode === "personal" ? `Based on ${logCount} logged day${logCount === 1 ? "" : "s"}.` : "Using one repeated scenario input set.";
  document.querySelector("#dashFinalStress").textContent = finalPoint.stress.toFixed(1);
  document.querySelector("#dashFinalEnergy").textContent = finalPoint.energy.toFixed(1);
  document.querySelector("#dashFinalRecovery").textContent = finalPoint.recovery.toFixed(1);
  document.querySelector("#dashFinalRisk").textContent = finalPoint.risk.toFixed(1);
  document.querySelector("#dashboardMeaning").textContent = getDashboardMeaning(category, state.profileName);
  document.querySelector("#dashboardRecommendation").textContent = recommendations[category];

  const badge = document.querySelector("#dashboardCategoryBadge");
  badge.textContent = `${category} Risk`;
  badge.className = `category-badge ${category.toLowerCase()}`;
}

function navigateToSection(section) {
  document.querySelectorAll(".nav-button").forEach((item) => {
    item.classList.toggle("active", item.dataset.section === section);
  });
  document.querySelectorAll(".app-section").forEach((panel) => {
    panel.classList.toggle("active", panel.id === section);
  });
  document.querySelector("#sectionTitle").textContent = sectionTitles[section];
  render();
}

function updateModelModeButtons() {
  document.querySelectorAll(".mode-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === modelMode);
  });
}

function renderModeMessage(logCount) {
  const message = document.querySelector("#personalLogEmptyMessage");
  message.hidden = !(modelMode === "personal" && logCount === 0);
}

function getActiveScenarioName() {
  if (modelMode === "personal") return "Personal Logs";
  return activePreset ? presets[activePreset].name : "Custom Scenario";
}

function getDashboardMeaning(category, profileName) {
  if (category === "High") {
    return `${profileName}'s final stress is high compared with energy and recovery, so the model flags this scenario as difficult to sustain.`;
  }

  if (category === "Moderate") {
    return `${profileName}'s final risk lands in the middle range, which means recovery and energy are helping but may not fully offset stress.`;
  }

  return `${profileName}'s final energy and recovery offset stress enough for a low-risk result in this model.`;
}
