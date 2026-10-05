const BAR_GAP_RATIO = 0.1;

// Colors live in CSS so themes need no JS changes.
function readCssColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function createBarRenderer(canvas) {
  const ctx = canvas.getContext('2d');

  // Canvas has its own pixel buffer; scaling it by devicePixelRatio keeps it sharp on retina.
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function render(values) {
    const { width, height } = canvas.getBoundingClientRect();
    ctx.fillStyle = readCssColor('--color-canvas-bg');
    ctx.fillRect(0, 0, width, height);

    const max = Math.max(...values);
    const slot = width / values.length;
    const barWidth = slot * (1 - BAR_GAP_RATIO);
    ctx.fillStyle = readCssColor('--color-bar');

    values.forEach((value, i) => {
      const barHeight = (value / max) * height;
      ctx.fillRect(i * slot, height - barHeight, barWidth, barHeight);
    });
  }

  return { render, resize };
}