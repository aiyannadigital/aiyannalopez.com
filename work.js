document.addEventListener("DOMContentLoaded", () => {
  // Icons
  if (window.lucide) lucide.createIcons();

  /* ================= CURSOR + SPOTLIGHT ================= */
  const cursor = document.querySelector(".cursor");
  const cursorDot = document.querySelector(".cursor-dot");
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
      cursor.style.pointerEvents = "none";
    }
    if (cursorDot) cursorDot.style.pointerEvents = "none";
    if (spotlight) spotlight.style.pointerEvents = "none";

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  /* ================= TWINKLING STITCH SPARKLES (INDEX STYLE) ================= */
  const canvas = document.getElementById("workSky");
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;

  let w = 0,
    h = 0,
    dpr = 1;

  const rand = (a, b) => Math.random() * (b - a) + a;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function drawStitchX(x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x - size, y - size);
    ctx.lineTo(x + size, y + size);
    ctx.moveTo(x - size, y + size);
    ctx.lineTo(x + size, y - size);
    ctx.stroke();
  }

  function drawStitchStar(x, y, size) {
    // layered stitched sparkle (same logic as index)
    drawStitchX(x, y, size);
    drawStitchX(x + size * 0.15, y - size * 0.1, size * 0.85);

    // tiny plus = “glisten”
    ctx.beginPath();
    ctx.moveTo(x - size * 0.95, y);
    ctx.lineTo(x + size * 0.95, y);
    ctx.moveTo(x, y - size * 0.95);
    ctx.lineTo(x, y + size * 0.95);
    ctx.stroke();
  }

  let stars = [];
  function makeStars() {
    stars = [];

    // ✅ MORE STARS (density increased)
    const topCount = Math.floor((window.innerWidth / 70) * 10);
    const midCount = Math.floor((window.innerWidth / 95) * 9);
    const lowCount = Math.floor((window.innerWidth / 140) * 7);

    // Top band
    for (let i = 0; i < topCount; i++) {
      stars.push({
        x: rand(18, w - 18),
        y: rand(18, h * 0.34),
        s: rand(0.55, 1.35) * dpr, // ✅ base size (edit smaller here)
        tw: rand(0.9, 1.9),
        ph: rand(0, Math.PI * 2),
        baseA: rand(0.35, 0.8),
        glintPhase: rand(0, Math.PI * 2),
        glintSpeed: rand(0.55, 1.25),
      });
    }

    // Upper-mid filler
    for (let i = 0; i < midCount; i++) {
      stars.push({
        x: rand(18, w - 18),
        y: rand(h * 0.30, h * 0.70),
        s: rand(0.50, 1.15) * dpr,
        tw: rand(0.75, 1.6),
        ph: rand(0, Math.PI * 2),
        baseA: rand(0.18, 0.55),
        glintPhase: rand(0, Math.PI * 2),
        glintSpeed: rand(0.55, 1.25),
      });
    }

    // Lower subtle filler (keeps whole page alive)
    for (let i = 0; i < lowCount; i++) {
      stars.push({
        x: rand(18, w - 18),
        y: rand(h * 0.68, h - 24),
        s: rand(0.40, 0.95) * dpr,
        tw: rand(0.65, 1.3),
        ph: rand(0, Math.PI * 2),
        baseA: rand(0.12, 0.42),
        glintPhase: rand(0, Math.PI * 2),
        glintSpeed: rand(0.55, 1.25),
      });
    }
  }

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.floor(window.innerWidth * dpr);
    h = Math.floor(window.innerHeight * dpr);
    canvas.width = w;
    canvas.height = h;
    makeStars();
  }

  resizeCanvas();

  let lastStarT = performance.now();
  function drawStars(now) {
    const dt = (now - lastStarT) / 1000;
    lastStarT = now;

    ctx.clearRect(0, 0, w, h);

    // ✅ THIN like your index
    ctx.strokeStyle = "rgba(0,0,0,0.55)";
    ctx.lineWidth = 0.35 * dpr; // thinner
    ctx.lineCap = "round";

    for (const st of stars) {
      const tw = (Math.sin(now * 0.00022 * st.tw + st.ph) + 1) / 2;
      const gl = (Math.sin(now * 0.003 * st.glintSpeed + st.glintPhase) + 1) / 2;
      const glintPulse = Math.pow(gl, 10);

      const alpha = st.baseA * (0.22 + tw * 1.05) + glintPulse * 0.65;
      const size = st.s * (0.78 + tw * 0.58 + glintPulse * 0.85);

      ctx.globalAlpha = clamp(alpha, 0, 1);
      drawStitchStar(st.x, st.y, size);
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(drawStars);
  }
  requestAnimationFrame(drawStars);

  /* ================= TILE LAYOUT (RANDOM ONCE, SMOOTH) ================= */
  const stage = document.getElementById("workStage");
  const tiles = Array.from(document.querySelectorAll(".work-tile"));
  if (!stage || !tiles.length) return;

  // Hide tiles until placed (prevents visible jumping)
  tiles.forEach((t) => {
    t.style.opacity = "0";
    t.style.willChange = "transform";
  });

  function overlaps(a, b, pad = 18) {
    return !(
      a.x + a.w + pad < b.x ||
      a.x > b.x + b.w + pad ||
      a.y + a.h + pad < b.y ||
      a.y > b.y + b.h + pad
    );
  }

  function layoutTilesOnce() {
    const rect = stage.getBoundingClientRect();
    const placed = [];
    const innerPad = 12;

    tiles.forEach((tile, idx) => {
      const box = tile.getBoundingClientRect();
      const tw = box.width;
      const th = box.height;

      const xMax = Math.max(innerPad, rect.width - tw - innerPad);
      const yMax = Math.max(innerPad, rect.height - th - innerPad);

      let found = false;

      for (let i = 0; i < 700; i++) {
        const x = rand(innerPad, xMax);
        const y = rand(innerPad, yMax);
        const cand = { x, y, w: tw, h: th };

        if (!placed.some((p) => overlaps(cand, p, 22))) {
          placed.push(cand);
          tile.style.left = `${x}px`;
          tile.style.top = `${y}px`;
          found = true;
          break;
        }
      }

      if (!found) {
        const cols = 2;
        const gx = idx % cols;
        const gy = Math.floor(idx / cols);
        const x = innerPad + gx * (rect.width / cols);
        const y = innerPad + gy * (rect.height / 4);
        tile.style.left = `${Math.min(x, xMax)}px`;
        tile.style.top = `${Math.min(y, yMax)}px`;
      }
    });

    tiles.forEach((t) => (t.style.opacity = "1"));
  }

  function waitForImagesOrTimeout() {
    const imgs = tiles.map((t) => t.querySelector("img")).filter(Boolean);
    if (!imgs.length) return Promise.resolve();

    return Promise.race([
      Promise.all(
        imgs.map((img) => {
          if (img.complete && img.naturalWidth > 0) return Promise.resolve();
          if (img.decode) return img.decode().catch(() => {});
          return new Promise((res) => {
            img.addEventListener("load", res, { once: true });
            img.addEventListener("error", res, { once: true });
          });
        })
      ),
      new Promise((res) => setTimeout(res, 600)),
    ]);
  }

  let laidOut = false;
  async function initLayout() {
    if (laidOut) return;
    laidOut = true;

    // wait for fonts too (prevents width change after paint)
    try {
      if (document.fonts && document.fonts.ready) {
        await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 500))]);
      }
    } catch (_) {}

    await waitForImagesOrTimeout();
    requestAnimationFrame(() => layoutTilesOnce());
  }

  initLayout();

  // Optional: re-layout + stars on resize (debounced)
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeCanvas();
      tiles.forEach((t) => (t.style.opacity = "0"));
      requestAnimationFrame(() => layoutTilesOnce());
    }, 220);
  });

  /* ================= MODAL (VIDEO FIRST: YOUTUBE URL OR ID) ================= */
  const modal = document.getElementById("workModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMeta = document.getElementById("modalMeta");
  const modalDesc = document.getElementById("modalDesc");

  // Ensure media host exists
  let mediaHost = document.querySelector(".work-modal-media");
  const modalBody = document.querySelector(".work-modal-body");
  if (!mediaHost && modalBody) {
    mediaHost = document.createElement("div");
    mediaHost.className = "work-modal-media";
    const text = modalBody.querySelector(".work-modal-text");
    if (text) modalBody.insertBefore(mediaHost, text);
    else modalBody.appendChild(mediaHost);
  }

  // Ensure links host exists
  const modalText = document.querySelector(".work-modal-text");
  let linksHost = document.querySelector(".work-modal-links");
  if (modalText && !linksHost) {
    linksHost = document.createElement("div");
    linksHost.className = "work-modal-links";
    modalText.appendChild(linksHost);
  }

  // ✅ Force pixel font on modal text (so it never “goes away”)
  function enforceModalPixelFont() {
    if (!modal) return;
    const px = '"Pix32", monospace';
    const targets = modal.querySelectorAll(
      ".work-modal-card, .work-modal-text, .work-modal-title, .work-modal-meta, .work-modal-desc, .work-modal-links, .work-modal-link, .work-modal-close"
    );
    targets.forEach((el) => {
      el.style.fontFamily = px;
    });
  }

  function clearMedia() {
    if (!mediaHost) return;
    mediaHost.innerHTML = "";
  }

  function youtubeIdFromAnything(input) {
    if (!input) return "";
    // already an ID
    if (!input.includes("http") && !input.includes("/") && input.length >= 8) {
      return input.trim();
    }
    try {
      const u = new URL(input);
      if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "");
      if (u.searchParams.get("v")) return u.searchParams.get("v");
      const parts = u.pathname.split("/").filter(Boolean);
      const embedIdx = parts.indexOf("embed");
      if (embedIdx >= 0 && parts[embedIdx + 1]) return parts[embedIdx + 1];
    } catch (_) {}
    return "";
  }

  function setMediaFromTile(tile) {
    if (!mediaHost) return;
    clearMedia();

    const title = tile.dataset.title || "Project";
    const youtubeRaw = tile.dataset.youtube || "";
    const videoId = youtubeIdFromAnything(youtubeRaw);
    const imgSrc = tile.dataset.img || "";

    // ✅ VIDEO FIRST
    if (videoId) {
      const iframe = document.createElement("iframe");
      iframe.className = "work-modal-yt";
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`;
      iframe.title = title;
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute(
        "allow",
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      );
      iframe.allowFullscreen = true;

      // ✅ Make video BIG
      iframe.style.width = "100%";
      iframe.style.aspectRatio = "16 / 9";
      iframe.style.height = "auto";
      iframe.style.border = "0";
      iframe.style.display = "block";

      mediaHost.appendChild(iframe);
      return;
    }

    // fallback image (only if no video)
    if (imgSrc) {
      const img = document.createElement("img");
      img.className = "work-modal-img";
      img.src = imgSrc;
      img.alt = title;
      img.style.width = "100%";
      img.style.height = "auto";
      img.style.display = "block";
      mediaHost.appendChild(img);
    }
  }

  function setLinksFromTile(tile) {
    if (!linksHost) return;
    linksHost.innerHTML = "";

    const l1Label = tile.dataset.link1Label;
    const l1Url = tile.dataset.link1Url;
    const l2Label = tile.dataset.link2Label;
    const l2Url = tile.dataset.link2Url;

    function addLink(label, url) {
      if (!label || !url) return;
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noreferrer";
      a.className = "work-modal-link underline";
      a.textContent = label;
      linksHost.appendChild(a);
    }

    addLink(l1Label, l1Url);
    addLink(l2Label, l2Url);

    linksHost.style.display = linksHost.children.length ? "flex" : "none";
    linksHost.style.gap = "14px";
    linksHost.style.marginTop = "14px";
    linksHost.style.flexWrap = "wrap";
  }

  function openModal(tile) {
    if (!modal) return;

    enforceModalPixelFont();

    if (modalTitle) modalTitle.textContent = tile.dataset.title || "";
    if (modalMeta) modalMeta.textContent = tile.dataset.meta || "";
    if (modalDesc) modalDesc.textContent = tile.dataset.desc || "";

    setMediaFromTile(tile);
    setLinksFromTile(tile);

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    clearMedia();
  }

  tiles.forEach((tile) => {
    tile.addEventListener("click", () => openModal(tile));
  });

  modal?.addEventListener("click", (e) => {
    const t = e.target;
    if (!t) return;
    if (t.matches("[data-close]")) closeModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
});
