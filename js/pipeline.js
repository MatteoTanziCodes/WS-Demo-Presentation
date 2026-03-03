/* js/pipeline.js
   Physics-based dot simulation for the SDLC pipeline visualization
   Matches the colored dot "bunching at bottleneck" from background-agents.com */

(function () {
  const canvas = document.getElementById('pipelineCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const STAGE_COLORS = [
    '#8a8480', // intake - grey
    '#4a7c6a', // parse - teal
    '#c0392b', // review - red (bottleneck)
    '#d4823a', // flag - orange
    '#2d6a4f', // approve - green
  ];

  const STAGE_COUNT = 5;
  let W, H;
  let dots = [];
  let hoverStage = -1;
  let animId;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    W = canvas.width = rect.width;
    H = canvas.height = 120;
    canvas.style.height = '120px';
    // Reposition dots when resized
    dots.forEach(d => {
      d.tx = stageX(d.stage);
    });
  }

  function stageX(stage) {
    // 5 stages spread across width, each has some random offset
    const segW = W / STAGE_COUNT;
    return segW * stage + segW / 2 + (Math.random() - 0.5) * segW * 0.6;
  }

  function stageXCenter(stage) {
    return (W / STAGE_COUNT) * stage + (W / STAGE_COUNT) / 2;
  }

  // Wave shape — dots ride a sine curve
  function waveY(x, amplitude) {
    const freq = (Math.PI * 2) / W;
    // Bell bump at center (review stage)
    const center = stageXCenter(2);
    const dist = Math.abs(x - center);
    const bump = Math.exp(-dist * dist / (W * W * 0.02)) * amplitude;
    return H / 2 - bump;
  }

  function makeDot(stage) {
    const cx = stageXCenter(stage);
    const spread = (W / STAGE_COUNT) * 0.5;
    return {
      stage,
      x: cx + (Math.random() - 0.5) * spread * 2,
      y: H / 2 + (Math.random() - 0.5) * 20,
      tx: cx + (Math.random() - 0.5) * spread,
      ty: waveY(cx, 30) + (Math.random() - 0.5) * 18,
      vx: 0, vy: 0,
      r: 3 + Math.random() * 2.5,
      color: STAGE_COLORS[stage],
      opacity: 0.7 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
      floatAmp: 2 + Math.random() * 4,
      floatSpeed: 0.5 + Math.random() * 0.8,
    };
  }

  function initDots() {
    dots = [];
    // Stage 2 (review) gets way more dots — the bottleneck
    const counts = [5, 7, 22, 7, 4];
    counts.forEach((n, stage) => {
      for (let i = 0; i < n; i++) dots.push(makeDot(stage));
    });
  }

  function draw(ts) {
    ctx.clearRect(0, 0, W, H);

    // Draw the wave line
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    for (let x = 0; x <= W; x += 2) {
      ctx.lineTo(x, waveY(x, 28));
    }
    ctx.strokeStyle = 'rgba(180, 170, 160, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Stage divider lines
    for (let s = 1; s < STAGE_COUNT; s++) {
      const x = (W / STAGE_COUNT) * s;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.strokeStyle = 'rgba(180, 170, 160, 0.15)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    const spring = 0.04;
    const damp = 0.75;

    dots.forEach(d => {
      const floatY = Math.sin(ts * 0.001 * d.floatSpeed + d.phase) * d.floatAmp;
      const targetY = d.ty + floatY;

      // If hovered stage matches, push dots out
      let extraX = 0, extraY = 0;
      if (hoverStage === d.stage) {
        const cx = stageXCenter(d.stage);
        const dx = d.x - cx;
        const dy = d.y - H / 2;
        const dist = Math.max(1, Math.hypot(dx, dy));
        extraX = (dx / dist) * 18;
        extraY = (dy / dist) * 18;
      }

      const fx = (d.tx + extraX - d.x) * spring;
      const fy = (targetY + extraY - d.y) * spring;
      d.vx = (d.vx + fx) * damp;
      d.vy = (d.vy + fy) * damp;
      d.x += d.vx;
      d.y += d.vy;

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = d.color;
      ctx.globalAlpha = d.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    animId = requestAnimationFrame(draw);
  }

  // Hover on stage labels
  const labels = document.querySelectorAll('.pl');
  labels.forEach((el, i) => {
    el.addEventListener('mouseenter', () => {
      hoverStage = i;
      // Remove active from all, set on hovered
      labels.forEach(l => l.classList.remove('active'));
      el.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
      hoverStage = -1;
      // Reset to default active (review/index 2)
      labels.forEach(l => l.classList.remove('active'));
      labels[2].classList.add('active');
    });
  });

  // Mouse interaction on canvas itself
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const segW = W / STAGE_COUNT;
    const stage = Math.floor(mx / segW);
    if (stage !== hoverStage) {
      hoverStage = Math.max(0, Math.min(STAGE_COUNT - 1, stage));
    }

    // Repel nearby dots from cursor
    const my = e.clientY - rect.top;
    dots.forEach(d => {
      const dx = d.x - mx;
      const dy = d.y - my;
      const dist = Math.hypot(dx, dy);
      if (dist < 40) {
        const force = (40 - dist) / 40 * 3;
        d.vx += (dx / dist) * force;
        d.vy += (dy / dist) * force;
      }
    });
  });

  canvas.addEventListener('mouseleave', () => {
    hoverStage = -1;
    const labels = document.querySelectorAll('.pl');
    labels.forEach(l => l.classList.remove('active'));
    labels[2].classList.add('active');
  });

  window.addEventListener('resize', resize);
  resize();
  initDots();
  requestAnimationFrame(draw);
})();
