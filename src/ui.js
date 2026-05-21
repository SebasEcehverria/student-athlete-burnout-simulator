import { drawChart } from "./chart.js";
import { runEulerSimulation } from "./euler.js";
import { initializeLogbook } from "./logbook.js";
import { getBurnoutCategory, getInterpretation } from "./model.js";
import { defaultState, presets, sliderDefinitions } from "./presets.js";
import { renderInsights } from "./insights.js";

let state = { ...defaultState };
let activePreset = "balanced";
let chartCanvas;
let currentPoints = [];

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
  bindProfileInput();
  bindPresetButtons();
  bindThemeToggle();
  bindResetButton();
  initializeLogbook();
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
      document.querySelectorAll(".nav-button").forEach((item) => {
        item.classList.toggle("active", item === button);
      });
      document.querySelectorAll(".app-section").forEach((panel) => {
        panel.classList.toggle("active", panel.id === section);
      });
      document.querySelector("#sectionTitle").textContent = sectionTitles[section];
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
    applyState({ ...defaultState, ...presets.balanced.values }, "balanced");
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
  const scenarioName = activePreset ? presets[activePreset].name : "Custom Scenario";

  document.querySelectorAll(".preset-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.preset === activePreset);
  });

  document.querySelector("#scenarioName").textContent = scenarioName;
  document.querySelector("#sidebarScenario").textContent = scenarioName;
  document.querySelector("#dashboardScenario").textContent = scenarioName;
}

function render() {
  currentPoints = runEulerSimulation(state);
  const finalPoint = currentPoints[currentPoints.length - 1];
  const category = getBurnoutCategory(finalPoint.risk);

  drawChart(chartCanvas, currentPoints);
  renderSimulatorSummary(finalPoint, category);
  renderDashboard(finalPoint, category);
  renderInsights(currentPoints);
}

function renderSimulatorSummary(finalPoint, category) {
  document.querySelector("#chartTitle").textContent = `${state.profileName}'s ${state.days}-Day Simulation`;
  document.querySelector("#finalStress").textContent = finalPoint.stress.toFixed(1);
  document.querySelector("#finalEnergy").textContent = finalPoint.energy.toFixed(1);
  document.querySelector("#finalRecovery").textContent = finalPoint.recovery.toFixed(1);
  document.querySelector("#finalRisk").textContent = finalPoint.risk.toFixed(1);

  const badge = document.querySelector("#categoryBadge");
  badge.textContent = category;
  badge.className = `category-badge ${category.toLowerCase()}`;

  document.querySelector("#interpretation").textContent = getInterpretation(category, state.profileName);
}

function renderDashboard(finalPoint, category) {
  document.querySelector("#dashboardName").textContent = state.profileName;
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

function getDashboardMeaning(category, profileName) {
  if (category === "High") {
    return `${profileName}'s final stress is high compared with energy and recovery, so the model flags this scenario as difficult to sustain.`;
  }

  if (category === "Moderate") {
    return `${profileName}'s final risk lands in the middle range, which means recovery and energy are helping but may not fully offset stress.`;
  }

  return `${profileName}'s final energy and recovery offset stress enough for a low-risk result in this model.`;
}
