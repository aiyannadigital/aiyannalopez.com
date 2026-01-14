document.addEventListener("DOMContentLoaded", () => {
  // Only run on About page
  if (!document.body.classList.contains("page-about")) return;

  /* ================= CURSOR + SPOTLIGHT ================= */
  const cursor = document.querySelector(".cursor");
  const spotlight = document.querySelector(".spotlight");

  if (cursor && spotlight) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cx = mouseX;
    let cy = mouseY;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // spotlight CSS vars
      document.documentElement.style.setProperty("--mx", `${mouseX}px`);
      document.documentElement.style.setProperty("--my", `${mouseY}px`);
    });

    function animateCursor() {
      cx += (mouseX - cx) * 0.16;
      cy += (mouseY - cy) * 0.16;

      cursor.style.left = `${cx}px`;
      cursor.style.top = `${cy}px`;

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover states (links + buttons)
    const hoverTargets = document.querySelectorAll(
      "a, button, [role='button'], .underline"
    );

    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
    });

    window.addEventListener("mousedown", () =>
      cursor.classList.add("is-down")
    );
    window.addEventListener("mouseup", () =>
      cursor.classList.remove("is-down")
    );

    // Hide when leaving window
    window.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0";
      spotlight.style.opacity = "0";
    });

    window.addEventListener("mouseenter", () => {
      cursor.style.opacity = "1";
      spotlight.style.opacity = "0.7";
    });
  }

  /* ================= SHOOTING STARS (ABOUT ONLY) ================= */
  const canvas = document.getElementById("aboutSky");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let w = 0, h = 0, dpr = 1;
  const rand = (a, b) => Math.random() * (b - a) + a;
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

  /* ---- stitch drawing ---- */
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
    ctx.beginPath();
    ctx.moveTo(x - size * 0.95, y);
    ctx.lineTo(x + size * 0.95, y);
    ctx.moveTo(x, y - size * 0.95);
    ctx.lineTo(x, y + size * 0.95);
    ctx.stroke();
  }

  /* ---- shooting star state ---- */
  let shootingR = null;
  let shootingL = null;
  let nextShootR = performance.now() + rand(3000, 6000);
  let nextShootL = performance.now() + rand(6000, 10000);

  function spawnRight() {
    shootingR = {
      x: rand(w * 0.1, w * 0.5),
      y: rand(h * 0.15, h * 0.45),
      vx: rand(900, 1200) * dpr,
      vy: -rand(900, 1200) * dpr * 0.6,
      life: 0,
      maxLife: rand(0.9, 1.2),
      size: rand(1.6, 2.4) * dpr,
      trail: Math.floor(rand(28, 40)),
    };
  }

  function spawnLeft() {
    shootingL = {
      x: rand(w * 0.5, w * 0.9),
      y: rand(h * 0.15, h * 0.45),
      vx: -rand(900, 1200) * dpr,
      vy: -rand(900, 1200) * dpr * 0.6,
      life: 0,
      maxLife: rand(0.9, 1.2),
      size: rand(1.6, 2.4) * dpr,
      trail: Math.floor(rand(28, 40)),
    };
  }

  let last = performance.now();

  function drawShooting(star, dt) {
    star.life += dt;
    star.x += star.vx * dt;
    star.y += star.vy * dt;

    for (let i = 0; i < star.trail; i++) {
      const t = i / star.trail;
      const tx = star.x - star.vx * (t * 0.06);
      const ty = star.y - star.vy * (t * 0.06);
      const fade = 1 - t;

      ctx.globalAlpha = fade * 0.6 * (1 - star.life / star.maxLife);
      drawStitchX(tx, ty, star.size * (0.9 - t * 0.4));
    }

    ctx.globalAlpha = 0.9 * (1 - star.life / star.maxLife);
    drawStitchStar(star.x, star.y, star.size * 1.3);

    if (
      star.life > star.maxLife ||
      star.x < -200 || star.x > w + 200 ||
      star.y < -200
    ) return null;

    return star;
  }

  function loop(now) {
    const dt = clamp((now - last) / 1000, 0, 0.05);
    last = now;

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(0,0,0,0.45)";
    ctx.lineWidth = 1.05 * dpr;
    ctx.lineCap = "round";

    if (!prefersReduced) {
      if (!shootingR && now >= nextShootR) {
        spawnRight();
        nextShootR = now + rand(6000, 12000);
      }
      if (!shootingL && now >= nextShootL) {
        spawnLeft();
        nextShootL = now + rand(8000, 15000);
      }

      if (shootingR) shootingR = drawShooting(shootingR, dt);
      if (shootingL) shootingL = drawShooting(shootingL, dt);
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
});
