const requiredFields = ["date", "academic", "training", "work", "sleep", "support"];

export function exportLogs(logEntries) {
  const blob = new Blob([JSON.stringify(logEntries, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "burnout-logbook.json";
  link.click();
  URL.revokeObjectURL(url);
}

export function importLogsFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        resolve(validateLogs(parsed));
      } catch {
        reject(new Error("Invalid JSON file."));
      }
    });
    reader.addEventListener("error", () => reject(new Error("Could not read the selected file.")));
    reader.readAsText(file);
  });
}

function validateLogs(value) {
  if (!Array.isArray(value)) {
    throw new Error("Imported file must contain an array of log entries.");
  }

  return value.map((entry, index) => {
    requiredFields.forEach((field) => {
      if (!(field in entry)) {
        throw new Error(`Entry ${index + 1} is missing ${field}.`);
      }
    });

    return {
      id: entry.id || (crypto.randomUUID ? crypto.randomUUID() : `import-${Date.now()}-${index}`),
      date: String(entry.date),
      academic: validateInput(entry.academic, "academic", index),
      training: validateInput(entry.training, "training", index),
      work: validateInput(entry.work, "work", index),
      sleep: validateInput(entry.sleep, "sleep", index),
      support: validateInput(entry.support, "support", index),
      note: entry.note ? String(entry.note) : ""
    };
  });
}

function validateInput(value, field, index) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > 10) {
    throw new Error(`Entry ${index + 1} has an invalid ${field} value.`);
  }
  return number;
}
