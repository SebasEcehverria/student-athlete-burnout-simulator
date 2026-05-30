const logSeries = [
  { key: "academic", label: "Academic", color: "#f59e0b" },
  { key: "training", label: "Training", color: "#e65f5c" },
  { key: "work", label: "Work", color: "#8b5cf6" },
  { key: "sleep", label: "Sleep", color: "#2f80ed" },
  { key: "support", label: "Support", color: "#2fa66a" }
];

export function drawLogInputChart(canvas, logEntries) {
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const pixelRatio = window.devicePixelRatio || 1;

  canvas.width = Math.floor(rect.width * pixelRatio);
  canvas.height = Math.floor(rect.height * pixelRatio);
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const width = rect.width;
  const height = rect.height;
  const padding = { top: 20, right: 20, bottom: 36, left: 42 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxIndex = Math.max(logEntries.length - 1, 1);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = getCssColor("--chart-bg");
  ctx.fillRect(0, 0, width, height);
  drawGrid(ctx, padding, chartWidth, chartHeight, logEntries.length);

  if (!logEntries.length) {
    ctx.fillStyle = getCssColor("--muted-text");
    ctx.font = "14px system-ui, sans-serif";
    ctx.fillText("No logs to chart yet.", padding.left, height / 2);
    return;
  }

  logSeries.forEach((item) => {
    ctx.beginPath();
    logEntries.forEach((entry, index) => {
      const x = padding.left + (index / maxIndex) * chartWidth;
      const y = padding.top + ((10 - Number(entry[item.key])) / 10) * chartHeight;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.strokeStyle = item.color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();
  });
}

function drawGrid(ctx, padding, chartWidth, chartHeight, entryCount) {
  const gridColor = getCssColor("--grid-line");
  const axisColor = getCssColor("--axis-line");
  const textColor = getCssColor("--muted-text");

  ctx.font = "12px system-ui, sans-serif";
  ctx.fillStyle = textColor;
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;

  for (let value = 0; value <= 10; value += 5) {
    const y = padding.top + ((10 - value) / 10) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(padding.left + chartWidth, y);
    ctx.stroke();
    ctx.fillText(String(value), 16, y + 4);
  }

  const tickCount = Math.min(Math.max(entryCount - 1, 1), 4);
  for (let tick = 0; tick <= tickCount; tick += 1) {
    const index = Math.round(((entryCount - 1) / tickCount) * tick) || 0;
    const x = padding.left + (tick / tickCount) * chartWidth;
    ctx.beginPath();
    ctx.moveTo(x, padding.top);
    ctx.lineTo(x, padding.top + chartHeight);
    ctx.stroke();
    ctx.fillText(entryCount ? String(index + 1) : "0", x - 4, padding.top + chartHeight + 22);
  }

  ctx.strokeStyle = axisColor;
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, padding.top + chartHeight);
  ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
  ctx.stroke();
}

function getCssColor(variableName) {
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}
