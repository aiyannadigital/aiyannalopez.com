document.addEventListener("DOMContentLoaded", () => {
  // Icons
  if (window.lucide) lucide.createIcons();

  /* ================= CURSOR + SPOTLIGHT ================= */
  const cursor = document.querySelector(".cursor");
  const spotlight = document.querySelector(".spotlight");

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cx = mouseX;
  let cy = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    document.documentElement.style.setProperty("--mx", `${mouseX}px`);
    document.documentElement.style.setProperty("--my", `${mouseY}px`);
  });

  function animateCursor() {
    cx += (mouseX - cx) * 0.16;
    cy += (mouseY - cy) * 0.16;
    if (cursor) {
      cursor.style.left = `${cx}px`;
      cursor.style.top = `${cy}px`;
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  /* ================= CANVAS SETUP ================= */
  const canvas = document.getElementById("bgDots");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let w = 0, h = 0, dpr = 1;

  const rand = (a, b) => Math.random() * (b - a) + a;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const smoothstep = (a, b, x) => {
    const t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  };

  /* ================= STITCH DRAWING ================= */
  function drawStitchX(x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x - size, y - size);
    ctx.lineTo(x + size, y + size);
    ctx.moveTo(x - size, y + size);
    ctx.lineTo(x + size, y - size);
    ctx.stroke();
  }

  function drawStitchStar(x, y, size) {
    // layered stitched sparkle
    drawStitchX(x, y, size);
    drawStitchX(x + size * 0.15, y - size * 0.1, size * 0.85);

    // tiny plus to read as “glisten”
    ctx.beginPath();
    ctx.moveTo(x - size * 0.95, y);
    ctx.lineTo(x + size * 0.95, y);
    ctx.moveTo(x, y - size * 0.95);
    ctx.lineTo(x, y + size * 0.95);
    ctx.stroke();
  }

  /* ================= STARS ================= */
  let stars = [];
  function makeStars() {
    const topCount = Math.floor((window.innerWidth / 90) * 7);
    const midCount = Math.floor((window.innerWidth / 140) * 5);

    stars = [];

    // Top band stars
    for (let i = 0; i < topCount; i++) {
      stars.push({
        x: rand(24, w - 24),
        y: rand(24, h * 0.26),
        s: rand(1.4, 2.7) * dpr,
        tw: rand(0.9, 1.8),
        ph: rand(0, Math.PI * 2),
        baseA: rand(0.35, 0.75),
        // sparkle pulse: occasional glints
        glintPhase: rand(0, Math.PI * 2),
        glintSpeed: rand(0.6, 1.3),
      });
    }

    // Upper-middle filler stars
    for (let i = 0; i < midCount; i++) {
      stars.push({
        x: rand(30, w - 30),
        y: rand(h * 0.28, h * 0.58),
        s: rand(1.2, 2.3) * dpr,
        tw: rand(0.8, 1.6),
        ph: rand(0, Math.PI * 2),
        baseA: rand(0.18, 0.55),
        glintPhase: rand(0, Math.PI * 2),
        glintSpeed: rand(0.6, 1.3),
      });
    }
  }

  /* ================= SHOOTING STAR ================= */
  let shooting = null;
  let nextShootAt = 0;

  function scheduleNextShootingStar(now) {
    // every ~6–12 seconds
    nextShootAt = now + rand(6000, 12000);
  }

  function spawnShootingStar() {
    const startX = rand(w * 0.05, w * 0.45);
    const startY = rand(h * 0.07, h * 0.33);

    const speed = rand(900, 1250) * dpr;   // faster so it feels snappy
    const ang = rand(0.18, -0.30) * Math.PI; // up-right angle

    shooting = {
      x: startX,
      y: startY,
      vx: Math.cos(ang) * speed,
      vy: Math.sin(ang) * speed,
      life: 0,
      maxLife: rand(0.9, 1.2),
      size: rand(1.7, 2.5) * dpr,
      trail: Math.floor(rand(28, 42)),
    };
  }

  /* ================= DOT GRID ================= */
  let dots = [];

  function makeDots() {
    dots = [];

    // density (smaller = more stitches)
    const gap = 7;

    const cols = Math.ceil(window.innerWidth / gap);
    const rows = Math.ceil(window.innerHeight / gap);

    for (let y = 0; y <= rows; y++) {
      for (let x = 0; x <= cols; x++) {
        const ox = (x * gap + (Math.random() - 0.5) * 4) * dpr;
        const oy = (y * gap + (Math.random() - 0.5) * 4) * dpr;

        dots.push({
          ox,
          oy,
          r: (1.25 + Math.random() * 0.95) * dpr, // stitch size
          s: 0.3 + Math.random() * 0.7,
          a: Math.random() * Math.PI * 2,
          press: 0.7 + Math.random() * 0.6,
        });
      }
    }
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.floor(window.innerWidth * dpr);
    h = Math.floor(window.innerHeight * dpr);
    canvas.width = w;
    canvas.height = h;

    makeDots();
    makeStars();
  }

  window.addEventListener("resize", resize);
  resize();

  /* ================= BUNNY SHAPE ================= */
  function sdEllipse(px, py, ax, ay) {
    const x = Math.abs(px);
    const y = Math.abs(py);
    const t = Math.atan2(y * ax, x * ay);
    const ex = ax * Math.cos(t);
    const ey = ay * Math.sin(t);
    const dx = x - ex;
    const dy = y - ey;
    const inside = (x * x) / (ax * ax) + (y * y) / (ay * ay) - 1;
    return Math.sign(inside) * Math.hypot(dx, dy);
  }

  function sdCircle(px, py, r) {
    return Math.hypot(px, py) - r;
  }

  const opUnion = (a, b) => Math.min(a, b);

  // facing: 1 = right, -1 = left
  function bunnySDF(x, y, bx, by, s, facing = 1) {
    let px = ((x - bx) / s) * facing;
    let py = (by - y) / s; // upright in canvas

    const rot = -0.10;
    const rx = px * Math.cos(rot) - py * Math.sin(rot);
    const ry = px * Math.sin(rot) + py * Math.cos(rot);
    px = rx; py = ry;

    let d = sdEllipse(px, py, 140, 90);
    d = opUnion(d, sdEllipse(px + 120, py - 40, 55, 45));
    d = opUnion(d, sdEllipse(px + 150, py - 110, 18, 55));
    d = opUnion(d, sdEllipse(px + 125, py - 115, 16, 48));
    d = opUnion(d, sdCircle(px - 145, py - 10, 22));
    d = opUnion(d, sdEllipse(px + 80, py + 70, 55, 20));
    d = opUnion(d, sdEllipse(px - 55, py + 75, 70, 22));
    d = opUnion(d, sdEllipse(px + 30, py + 30, 95, 60));

    return d;
  }

  function bunnyOutlineStrength(x, y, bx, by, s, facing) {
    const d = bunnySDF(x, y, bx, by, s, facing);
    const thickness = 5.0 * dpr;
    const ad = Math.abs(d);
    if (ad > thickness) return 0;
    return 1 - smoothstep(0, thickness, ad);
  }

  /* ================= TWO BUNNIES LOOPING (CHASE) ================= */
  const SPEED = 210 * dpr;
  const SPACING = 400 * dpr;
  const HOP_HEIGHT = 70 * dpr;

  // ✅ make bunnies visible but still small
  const BUNNY_SCALE = 0.0006;  // <- smaller than default, but not invisible
  const BASE_Y = 0.93;          // <- safely inside canvas
  const WANDER = 20 * dpr;

  let runnerX = w + 260 * dpr;

  function wrapX(x) {
    const left = -320 * dpr;
    const right = w + 320 * dpr;
    const span = right - left;
    return ((x - left) % span + span) % span + left;
  }

  function bunnyY(x, phaseOffset = 0) {
    return h * BASE_Y + Math.sin((x / (320 * dpr)) + phaseOffset) * WANDER;
  }

  function hopArc(x, phaseOffset = 0) {
    const cyc = (x / (150 * dpr)) + phaseOffset;
    const frac = cyc - Math.floor(cyc);
    return Math.sin(Math.PI * frac);
  }

  /* ================= DRAW LOOP ================= */
  let time = 0;
  let last = performance.now();
  scheduleNextShootingStar(performance.now());

  function draw(now) {
    const dt = (now - last) / 1000;
    last = now;

    time += 0.008;
    ctx.clearRect(0, 0, w, h);

    // Global stitch styling
    ctx.strokeStyle = "rgba(0,0,0,0.55)";
    ctx.lineWidth = 1.05 * dpr;
    ctx.lineCap = "round";

    /* ===== Stars (NOW THEY GLISTEN) ===== */
    for (const st of stars) {
      const tw = (Math.sin(now * 0.00022 * st.tw + st.ph) + 1) / 2;  // stronger twinkle
      const gl = (Math.sin(now * 0.003 * st.glintSpeed + st.glintPhase) + 1) / 2;
      // glintPulse gives occasional sparkles (peaky)
      const glintPulse = Math.pow(gl, 10);

      const alpha = st.baseA * (0.25 + tw * 1.05) + glintPulse * 0.55;
      const size = st.s * (0.85 + tw * 0.55 + glintPulse * 0.75);

      ctx.globalAlpha = clamp(alpha, 0, 1);
      drawStitchStar(st.x, st.y, size);
    }

    /* ===== Shooting star (guaranteed) ===== */
    if (!shooting && now >= nextShootAt) {
      spawnShootingStar();
      scheduleNextShootingStar(now);
    }

    if (shooting) {
      shooting.life += dt;
      shooting.x += shooting.vx * dt;
      shooting.y += shooting.vy * dt;

      // stitched trail
      for (let i = 0; i < shooting.trail; i++) {
        const t = i / shooting.trail;
        const tx = shooting.x - shooting.vx * (t * 0.07);
        const ty = shooting.y - shooting.vy * (t * 0.07);
        const fade = 1 - t;

        ctx.globalAlpha = fade * 0.7 * (1 - shooting.life / shooting.maxLife);
        drawStitchX(tx, ty, shooting.size * (0.95 - t * 0.45));
      }

      // stitched “head” sparkle
      ctx.globalAlpha = 0.9 * (1 - shooting.life / shooting.maxLife);
      drawStitchStar(shooting.x, shooting.y, shooting.size * 1.35);

      if (
        shooting.life > shooting.maxLife ||
        shooting.x > w + 180 ||
        shooting.y > h * 0.80
      ) {
        shooting = null;
      }
    }

    /* ===== Bunnies ===== */
    runnerX += SPEED * dt;
    runnerX = wrapX(runnerX);

    const leaderX = runnerX;
    const chaserX = wrapX(runnerX + SPACING);

    const leaderBaseY = bunnyY(leaderX, 0.0);
    const chaserBaseY = bunnyY(chaserX, 0.7);

    const leaderArc = hopArc(leaderX, 0.0);
    const chaserArc = hopArc(chaserX, 0.7);

    const leaderY = leaderBaseY - leaderArc * HOP_HEIGHT;
    const chaserY = chaserBaseY - chaserArc * (HOP_HEIGHT * 0.92);

    // moving right -> face right
    const facing = -1;

    const bunnyScalePx = Math.min(w, h) * BUNNY_SCALE;

    for (const p of dots) {
      const dx = Math.cos(time * p.s + p.a) * 1.4 * dpr;
      const dy = Math.sin(time * p.s + p.a) * 1.4 * dpr;

      const px = p.ox + dx;
      const py = p.oy + dy;

      const m1 = bunnyOutlineStrength(px, py, leaderX, leaderY, bunnyScalePx, facing);
      const m2 = bunnyOutlineStrength(px, py, chaserX, chaserY, bunnyScalePx, facing);

      const m = Math.max(m1, m2);
      if (m <= 0) continue;

      const landBoost = 0.85 + (1 - leaderArc) * 0.18;
      ctx.globalAlpha = m * p.press * landBoost;

      drawStitchX(px, py, p.r);
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
});
