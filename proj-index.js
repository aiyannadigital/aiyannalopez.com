document.addEventListener("DOMContentLoaded", () => {
  // Icons (if header uses lucide)
  if (window.lucide) lucide.createIcons();

  // Canvas shooting stars
  const canvas = document.getElementById("projSky");
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;

  let w = 0, h = 0, dpr = 1;

  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.floor(window.innerWidth * dpr);
    h = Math.floor(window.innerHeight * dpr);
    canvas.width = w;
    canvas.height = h;
  }
  window.addEventListener("resize", resize);
  resize();

  // Stitch drawing (same “x” vibe as your homepage sparkles)
  function drawStitchX(x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x - size, y - size);
    ctx.lineTo(x + size, y + size);
    ctx.moveTo(x - size, y + size);
    ctx.lineTo(x + size, y - size);
    ctx.stroke();
  }

  function drawStitchStar(x, y, size) {
    drawStitchX(x, y, size);
    drawStitchX(x + size * 0.15, y - size * 0.1, size * 0.85);

    ctx.beginPath();
    ctx.moveTo(x - size * 0.95, y);
    ctx.lineTo(x + size * 0.95, y);
    ctx.moveTo(x, y - size * 0.95);
    ctx.lineTo(x, y + size * 0.95);
    ctx.stroke();
  }

  //   // Background “static” twinkles (very light)
  //   let stars = [];
  //   function makeStars() {
  //     const count = Math.floor((window.innerWidth * window.innerHeight) / 18000);
  //     stars = Array.from({ length: Math.max(90, count) }, () => ({
  //       x: rand(0, w),
  //       y: rand(0, h),
  //       s: rand(1.1, 2.2) * dpr,
  //       tw: rand(0.8, 1.8),
  //       ph: rand(0, Math.PI * 2),
  //       baseA: rand(0.12, 0.35),
  //     }));
  //   }
  makeStars();

  // Lots of shooting stars
  let shooting = [];
  let nextShootAt = 0;

  function scheduleNext(now) {
    // lots of them: every ~0.8–1.8s
    nextShootAt = now + rand(800, 1800);
  }

  function spawnShootingStar() {
    // spawn from left/top-ish, shoot to right/down-ish
    const startX = rand(-w * 0.15, w * 0.55);
    const startY = rand(h * 0.05, h * 0.55);

    const speed = rand(900, 1350) * dpr;
    const ang = rand(0.10, 0.22) * Math.PI; // down-right

    shooting.push({
      x: startX,
      y: startY,
      vx: Math.cos(ang) * speed,
      vy: Math.sin(ang) * speed,
      life: 0,
      maxLife: rand(0.75, 1.15),
      size: rand(1.2, 2.1) * dpr,
      trail: Math.floor(rand(22, 40)),
    });
  }

  let last = performance.now();
  scheduleNext(last);

  function draw(now) {
    const dt = (now - last) / 1000;
    last = now;

    ctx.clearRect(0, 0, w, h);

    // stitch styling
    ctx.strokeStyle = "rgba(0,0,0,0.55)";
    ctx.lineWidth = 1.05 * dpr;
    ctx.lineCap = "round";

    // Static twinkles (subtle)
    for (const st of stars) {
      const tw = (Math.sin(now * 0.00035 * st.tw + st.ph) + 1) / 2;
      const a = clamp(st.baseA * (0.35 + tw * 0.9), 0, 0.6);
      ctx.globalAlpha = a;
      drawStitchX(st.x, st.y, st.s);
    }
    ctx.globalAlpha = 1;

    // Spawn shooting stars often
    if (now >= nextShootAt) {
      spawnShootingStar();
      // sometimes spawn a second one quickly
      if (Math.random() < 0.25) spawnShootingStar();
      scheduleNext(now);
    }

    // Update + draw shooting stars
    shooting = shooting.filter((s) => {
      s.life += dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;

      const lifeT = s.life / s.maxLife;
      const alive = lifeT < 1;

      // trail (stitched x)
      for (let i = 0; i < s.trail; i++) {
        const t = i / s.trail;
        const tx = s.x - s.vx * (t * 0.06);
        const ty = s.y - s.vy * (t * 0.06);

        const fade = (1 - t) * (1 - lifeT);
        ctx.globalAlpha = fade * 0.75;
        drawStitchX(tx, ty, s.size * (0.95 - t * 0.5));
      }

      // head sparkle
      ctx.globalAlpha = (1 - lifeT) * 0.9;
      drawStitchStar(s.x, s.y, s.size * 1.35);

      ctx.globalAlpha = 1;

      // kill if off-screen
      if (s.x > w + 220 || s.y > h + 220) return false;
      return alive;
    });

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
});
