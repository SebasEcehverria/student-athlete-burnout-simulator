const series = [
  { key: "stress", color: "#e65f5c" },
  { key: "energy", color: "#2f80ed" },
  { key: "recovery", color: "#2fa66a" },
  { key: "risk", color: "#8b5cf6" }
];

export function drawChart(canvas, points) {
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const pixelRatio = window.devicePixelRatio || 1;

  canvas.width = Math.floor(rect.width * pixelRatio);
  canvas.height = Math.floor(rect.height * pixelRatio);
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const width = rect.width;
  const height = rect.height;
  const padding = { top: 24, right: 24, bottom: 42, left: 54 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const yMin = -100;
  const yMax = 100;
  const maxDay = points[points.length - 1]?.day || 1;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = getCssColor("--chart-bg");
  ctx.fillRect(0, 0, width, height);

  drawGrid(ctx, padding, chartWidth, chartHeight, yMin, yMax, maxDay);

  series.forEach((item) => {
    ctx.beginPath();
    points.forEach((point, index) => {
      const x = padding.left + (point.day / maxDay) * chartWidth;
      const y = padding.top + ((yMax - point[item.key]) / (yMax - yMin)) * chartHeight;

      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.strokeStyle = item.color;
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();
  });
}

function drawGrid(ctx, padding, chartWidth, chartHeight, yMin, yMax, maxDay) {
  const textColor = getCssColor("--muted-text");
  const gridColor = getCssColor("--grid-line");
  const axisColor = getCssColor("--axis-line");

  ctx.font = "12px system-ui, sans-serif";
  ctx.fillStyle = textColor;
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;

  for (let value = -100; value <= 100; value += 50) {
    const y = padding.top + ((yMax - value) / (yMax - yMin)) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(padding.left + chartWidth, y);
    ctx.stroke();
    ctx.fillText(String(value), 14, y + 4);
  }

  for (let tick = 0; tick <= 4; tick += 1) {
    const day = Math.round((maxDay / 4) * tick);
    const x = padding.left + (day / maxDay) * chartWidth;
    ctx.beginPath();
    ctx.moveTo(x, padding.top);
    ctx.lineTo(x, padding.top + chartHeight);
    ctx.stroke();
    ctx.fillText(String(day), x - 6, padding.top + chartHeight + 24);
  }

  ctx.strokeStyle = axisColor;
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, padding.top + chartHeight);
  ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
  ctx.stroke();

  ctx.fillText("Day", padding.left + chartWidth - 18, padding.top + chartHeight + 38);
}

function getCssColor(variableName) {
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}
