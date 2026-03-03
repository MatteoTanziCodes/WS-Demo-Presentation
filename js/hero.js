/* js/hero.js
   Mouse-reactive flowing curve animation matching background-agents.com hero */

(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  let mouse = { x: null, y: null };
  let curves = [];
  let animId;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    initCurves();
  }

  // Each "curve" is an elastic bezier path that gently bends toward mouse
  function makeCurve() {
    return {
      // Control points as fractions of viewport
      p0: { x: Math.random(), y: 0.2 + Math.random() * 0.6 },
      p1: { x: 0.2 + Math.random() * 0.3, y: 0.1 + Math.random() * 0.8 },
      p2: { x: 0.5 + Math.random() * 0.3, y: 0.1 + Math.random() * 0.8 },
      p3: { x: Math.random(), y: 0.2 + Math.random() * 0.6 },
      // Base control points (targets when no mouse)
      base1: null,
      base2: null,
      // Velocity for spring dynamics
      v1: { x: 0, y: 0 },
      v2: { x: 0, y: 0 },
      opacity: 0.12 + Math.random() * 0.18,
      width: 0.4 + Math.random() * 0.6,
      speed: 0.0003 + Math.random() * 0.0004,
      phase: Math.random() * Math.PI * 2,
      // Dots along curve
      hasDot: Math.random() > 0.4,
      dotT: Math.random(),
      dotSpeed: (Math.random() > 0.5 ? 1 : -1) * (0.001 + Math.random() * 0.002),
    };
  }

  function initCurves() {
    curves = [];
    const count = 8;
    for (let i = 0; i < count; i++) {
      const c = makeCurve();
      // Base positions spread across screen
      c.p0.x = i / (count - 1) * 0.3;
      c.p3.x = 0.7 + i / (count - 1) * 0.3;
      c.base1 = { x: c.p1.x, y: c.p1.y };
      c.base2 = { x: c.p2.x, y: c.p2.y };
      curves.push(c);
    }
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function getCurvePoint(c, t) {
    const mt = 1 - t;
    return {
      x: (mt * mt * mt * c.p0.x + 3 * mt * mt * t * c.p1.x + 3 * mt * t * t * c.p2.x + t * t * t * c.p3.x) * W,
      y: (mt * mt * mt * c.p0.y + 3 * mt * mt * t * c.p1.y + 3 * mt * t * t * c.p2.y + t * t * t * c.p3.y) * H,
    };
  }

  function draw(ts) {
    ctx.clearRect(0, 0, W, H);

    curves.forEach((c, i) => {
      // Gentle undulation even without mouse
      const breathe = Math.sin(ts * c.speed + c.phase) * 0.04;

      // Spring toward mouse influence
      const spring = 0.06;
      const damping = 0.82;
      const mouseInfluence = 0.18;

      if (mouse.x !== null) {
        const mx = mouse.x / W;
        const my = mouse.y / H;

        // Only pull if mouse is near the midpoint of the curve
        const midX = (c.p1.x + c.p2.x) / 2;
        const midY = (c.p1.y + c.p2.y) / 2;
        const dist = Math.hypot(mx - midX, my - midY);
        const influence = Math.max(0, 1 - dist / 0.6) * mouseInfluence;

        const targetX1 = c.base1.x + (mx - c.base1.x) * influence + breathe;
        const targetY1 = c.base1.y + (my - c.base1.y) * influence * 0.5;
        const targetX2 = c.base2.x + (mx - c.base2.x) * influence + breathe * 0.5;
        const targetY2 = c.base2.y + (my - c.base2.y) * influence * 0.5;

        c.v1.x += (targetX1 - c.p1.x) * spring;
        c.v1.y += (targetY1 - c.p1.y) * spring;
        c.v2.x += (targetX2 - c.p2.x) * spring;
        c.v2.y += (targetY2 - c.p2.y) * spring;
      } else {
        // Return to base with gentle undulation
        c.v1.x += (c.base1.x + breathe - c.p1.x) * spring;
        c.v1.y += (c.base1.y - c.p1.y) * spring;
        c.v2.x += (c.base2.x + breathe * 0.5 - c.p2.x) * spring;
        c.v2.y += (c.base2.y - c.p2.y) * spring;
      }

      c.v1.x *= damping; c.v1.y *= damping;
      c.v2.x *= damping; c.v2.y *= damping;
      c.p1.x += c.v1.x; c.p1.y += c.v1.y;
      c.p2.x += c.v2.x; c.p2.y += c.v2.y;

      // Draw the curve
      ctx.beginPath();
      ctx.moveTo(c.p0.x * W, c.p0.y * H);
      ctx.bezierCurveTo(
        c.p1.x * W, c.p1.y * H,
        c.p2.x * W, c.p2.y * H,
        c.p3.x * W, c.p3.y * H
      );
      ctx.strokeStyle = `rgba(192, 57, 43, ${c.opacity})`;
      ctx.lineWidth = c.width;
      ctx.stroke();

      // Animated dot traveling along the curve
      if (c.hasDot) {
        c.dotT += c.dotSpeed;
        if (c.dotT > 1) c.dotT = 0;
        if (c.dotT < 0) c.dotT = 1;
        const pt = getCurvePoint(c, c.dotT);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(192, 57, 43, ${c.opacity * 2.5})`;
        ctx.fill();
      }
    });

    // Subtle dot grid background (very faint)
    const gridSpacing = 32;
    ctx.fillStyle = 'rgba(150, 140, 130, 0.15)';
    for (let x = gridSpacing; x < W; x += gridSpacing) {
      for (let y = gridSpacing; y < H; y += gridSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    animId = requestAnimationFrame(draw);
  }

  // Mouse tracking
  document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  document.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
})();
