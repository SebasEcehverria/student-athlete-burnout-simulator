import { drawChart } from "./chart.js";
import { runEulerSimulation } from "./euler.js";
import { getBurnoutCategory, getInterpretation } from "./model.js";
import { defaultState, presets, sliderDefinitions } from "./presets.js";

let state = { ...defaultState };
let activePreset = "balanced";
let chartCanvas;

export function initializeUI() {
  chartCanvas = document.querySelector("#simulationChart");

  buildSliders();
  bindProfileInput();
  bindPresetButtons();
  bindThemeToggle();
  bindResetButton();
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
  document.querySelectorAll(".preset-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.preset === activePreset);
  });

  document.querySelector("#scenarioName").textContent = activePreset ? presets[activePreset].name : "Custom Scenario";
}

function render() {
  const points = runEulerSimulation(state);
  const finalPoint = points[points.length - 1];
  const category = getBurnoutCategory(finalPoint.risk);

  drawChart(chartCanvas, points);
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
