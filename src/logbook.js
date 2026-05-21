const STORAGE_KEY = "student-athlete-burnout-logbook";

const logFields = [
  { key: "academic", inputId: "logAcademic", valueId: "logAcademicValue" },
  { key: "training", inputId: "logTraining", valueId: "logTrainingValue" },
  { key: "work", inputId: "logWork", valueId: "logWorkValue" },
  { key: "sleep", inputId: "logSleep", valueId: "logSleepValue" },
  { key: "support", inputId: "logSupport", valueId: "logSupportValue" }
];

let entries = [];

export function initializeLogbook() {
  entries = loadEntries();
  setDefaultDate();
  bindLogSliders();
  bindLogForm();
  bindClearButton();
  renderLogEntries();
}

function loadEntries() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function setDefaultDate() {
  const dateInput = document.querySelector("#logDate");
  if (!dateInput.value) {
    dateInput.value = new Date().toISOString().slice(0, 10);
  }
}

function bindLogSliders() {
  logFields.forEach((field) => {
    const input = document.querySelector(`#${field.inputId}`);
    const label = document.querySelector(`#${field.valueId}`);
    label.textContent = input.value;
    input.addEventListener("input", () => {
      label.textContent = input.value;
    });
  });
}

function bindLogForm() {
  document.querySelector("#dailyLogForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const entry = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
      date: document.querySelector("#logDate").value,
      academic: Number(document.querySelector("#logAcademic").value),
      training: Number(document.querySelector("#logTraining").value),
      work: Number(document.querySelector("#logWork").value),
      sleep: Number(document.querySelector("#logSleep").value),
      support: Number(document.querySelector("#logSupport").value),
      note: document.querySelector("#logNote").value.trim()
    };

    entries = [entry, ...entries].sort((a, b) => b.date.localeCompare(a.date));
    saveEntries();
    document.querySelector("#logNote").value = "";
    renderLogEntries();
  });
}

function bindClearButton() {
  document.querySelector("#clearLogsButton").addEventListener("click", () => {
    entries = [];
    saveEntries();
    renderLogEntries();
  });
}

function renderLogEntries() {
  const body = document.querySelector("#logTableBody");
  const empty = document.querySelector("#emptyLogMessage");

  body.innerHTML = entries
    .map(
      (entry) => `
        <tr>
          <td>${escapeHtml(entry.date)}</td>
          <td>${entry.academic}</td>
          <td>${entry.training}</td>
          <td>${entry.work}</td>
          <td>${entry.sleep}</td>
          <td>${entry.support}</td>
          <td class="note-cell">${escapeHtml(entry.note || "-")}</td>
          <td><button class="table-button" type="button" data-delete-log="${entry.id}">Delete</button></td>
        </tr>
      `
    )
    .join("");

  empty.hidden = entries.length > 0;
  body.querySelectorAll("[data-delete-log]").forEach((button) => {
    button.addEventListener("click", () => {
      entries = entries.filter((entry) => entry.id !== button.dataset.deleteLog);
      saveEntries();
      renderLogEntries();
    });
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
