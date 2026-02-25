document.addEventListener("DOMContentLoaded", () => {
  // Icons
  if (window.lucide) lucide.createIcons();

  /* ================= CURSOR + SPOTLIGHT (kept) ================= */
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
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  /* ================= STITCH SPARKLE STARS (kept) ================= */
  const canvas = document.getElementById("workSky");
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;

  let w = 0, h = 0, dpr = 1;
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
    drawStitchX(x, y, size);
    drawStitchX(x + size * 0.15, y - size * 0.1, size * 0.85);

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

    const topCount = Math.floor((window.innerWidth / 70) * 10);
    const midCount = Math.floor((window.innerWidth / 95) * 9);
    const lowCount = Math.floor((window.innerWidth / 140) * 7);

    for (let i = 0; i < topCount; i++) {
      stars.push({
        x: rand(18, w - 18),
        y: rand(18, h * 0.34),
        s: rand(0.55, 1.35) * dpr,
        tw: rand(0.9, 1.9),
        ph: rand(0, Math.PI * 2),
        baseA: rand(0.35, 0.8),
        glintPhase: rand(0, Math.PI * 2),
        glintSpeed: rand(0.55, 1.25),
      });
    }

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
    lastStarT = now;

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = getComputedStyle(document.querySelector(".page-work"))
  .getPropertyValue("--star-ink")
  .trim() || "rgba(0,0,0,0.55)";
    ctx.lineWidth = 0.35 * dpr;
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

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => resizeCanvas(), 200);
  });

  /* ===============================
     FINDER DATA (your projects)
     - categories: Brand + Commerce, Film, Creative Code, Narrative, Misc
  =============================== */

  const projects = [
    {
      id: "olympia",
      title: "Olympia USA",
      meta: "E-Commerce Web Design • 2025",
      category: "Brand + Commerce",
      youtube: "hA1Tk3f6CYo",
      images: ["imgs/1.png"],
      links: [],
      desc:
        "Revitalized the digital presence of a long-established luggage brand by leading a complete website redesign and development project aimed at appealing to a younger, style-conscious audience while preserving the brand’s reputation for quality.\n\nWorked directly with the VP and marketing team to blend modern design trends with proven e-commerce sales strategies, incorporating optimized product categorization, strategic upselling, and a streamlined checkout experience. Introduced a responsive, mobile-first design that improved site speed, usability, and visual impact.\n\nPost-launch, the new website achieved the highest online sales in company history, reinforcing the value of combining data-driven decisions with creative design execution."
    },
    {
      id: "elsewhere",
      title: "Elsewhere, Within.",
      meta: "Narrative + Graphic Design • 2025",
      category: "Narrative",
      youtube: "",
      images: ["imgs/ew.png"],
      links: [],
      desc:
        "Elsewhere, Within is an interactive publication that transforms the familiar structure of an activity book into a meditative space for self-reflection. Through a series of prompts, games, and visual exercises, the project invites readers to engage slowly and intentionally with the page—treating each activity not as a task to complete, but as an opportunity to pause, notice, and reconnect with themselves.\n\nThe book reimagines formats like word searches, mazes, fill-in-the-blanks, and poetry exercises as reflective tools, shifting them away from traditional notions of play and productivity. Each section encourages creative participation through writing, drawing, and intuitive decision-making. The result is a tactile, analog experience that emphasizes process over product, embracing imperfection, curiosity, and presence.\n\nVisually, Elsewhere, Within uses calm, minimal design to hold space for introspection. The addition of subtle color, spacious margins, and gentle typography supports the act of slowing down. Each page is designed to feel open and inviting, allowing readers to bring their own meanings to the work.\n\nConceptually, the project explores ideas of inner movement, quiet transformation, and the relationship between structure and openness."
    },
    {
      id: "loom",
      title: "LOOM",
      meta: "Creative Code • 2023",
      category: "Creative Code",
      youtube: "E_He4EIbW0Q",
      images: ["imgs/2.png"],
      links: [
        { label: "Live Site", url: "https://ty-disruption.vercel.app/" },
        { label: "GitHub", url: "https://github.com/aiyannaaaaa/ty_disruption" },
      ],
      desc:
        "Loom is a platform coded from scratch using HTML, CSS, and JavaScript, created to challenge conventional norms of social media and web design. Inspired by Olia Lialina’s Vernacular Web, Loom disrupts rigid grid layouts and standardized design, embracing disorder to reflect the complexities of human connection.\n\nThis project critiques the increasing uniformity of modern web development by blending creative coding frameworks like P5.js and Three.js to introduce fluid, nonlinear interactions. Content spills beyond boundaries, intertwining to create a dynamic and unpredictable user experience.\n\nLoom is both a commentary on the limitations of structured design and an experiment in fostering deeper engagement."
    },
    {
      id: "birds",
      title: "Birds Etc.",
      meta: "Creative Code • 2024",
      category: "Creative Code",
      youtube: "e1svqYoYnA4",
      images: ["imgs/3.png"],
      links: [],
      desc:
        "I was sitting on my front porch one day, watching the birds come and go at my neighbor’s camera bird feeder. As I observed them, I couldn’t help but think about how fascinating it would be to document these birds—not just for the sake of cataloging them, but to explore how we capture and make sense of the natural world around us.\n\nThis site is an experiment in documentation—less about final outcomes and more about process, curiosity, and experimentation. It invites users to think about how we record and interact with the environment around us in more fluid and open-ended ways."
    },
    {
      id: "matchayan",
      title: "matchayan",
      meta: "Creative Code • 2024",
      category: "Creative Code",
      youtube: "sAONflLda_M",
      images: ["imgs/4.png"],
      links: [],
      desc:
        "A personal website that blends creativity and exploration, showcasing my recent favorites and interests. It functions as a playful, evolving space to experiment with ideas, document curiosities, and test new interactions in a low-pressure, exploratory environment."
    },
    {
      id: "outerra",
      title: "Outerra",
      meta: "Branding + Web Design • 2025",
      category: "Brand + Commerce",
      youtube: "BGGH-K60c0I",
      images: ["imgs/5.png"],
      links: [],
      desc:
        "Partnered with a travel gear startup to create a sleek, futuristic online store that reflected the brand’s emphasis on durability, innovation, and style for the modern traveler.\n\nDirected every stage of the web design process—from wireframing and visual design to development and launch—ensuring a consistent brand narrative throughout the user experience."
    },
    {
      id: "midulce",
      title: "Mi Dulce P’jel",
      meta: "E-Commerce Web Design • 2025",
      category: "Brand + Commerce",
      youtube: "JoAPY2k6ju4",
      images: ["imgs/6.png"],
      links: [],
      desc:
        "Reimagined the brand identity and online experience for a boutique skincare business through a complete rebrand and website rebuild. The refreshed visual direction emphasizes clarity, confidence, and care while delivering a smoother, more intuitive shopping experience."
    },
    {
      id: "granos",
      title: "Granos",
      meta: "Independent Short Film • 2024",
      category: "Film",
      youtube: "rLWHHfDYhTI",
      images: ["imgs/8.png"],
      links: [],
      desc:
        "When a young perfectionist sets out to build his first-ever sandcastle, he must learn to embrace imperfection and accept the challenges that come with bringing visions to life.\n\nGranos is an intimate reflection on creativity, perfectionism, and the struggle between control and impermanence. The film explores the emotional process of creation, capturing frustration, persistence, and eventual acceptance."
    },
  ];

  const categories = [
    { key: "Brand + Commerce", icon: "shopping-bag" },
    { key: "Film", icon: "clapperboard" },
    { key: "Creative Code", icon: "code" },
    { key: "Narrative", icon: "book-open" },
    { key: "Misc", icon: "sparkles" },
  ];

  const byCategory = (cat) => projects.filter(p => p.category === cat);

  /* ===============================
     FINDER UI
  =============================== */

  const categoryList = document.getElementById("categoryList");
  const foldersGrid = document.getElementById("foldersGrid");
  const paneTitle = document.getElementById("paneTitle");
  const breadcrumb = document.getElementById("finderBreadcrumb");
  const emptyState = document.getElementById("emptyState");

  let activeCategory = categories[0].key;
  let selectedProjectId = null;

  function makeSidebar() {
    categoryList.innerHTML = "";

    categories.forEach((c) => {
      const btn = document.createElement("button");
      btn.className = "sidebar-item";
      btn.type = "button";
      btn.dataset.cat = c.key;

      btn.innerHTML = `
        <i data-lucide="${c.icon}"></i>
        <span>${c.key}</span>
      `;

      btn.addEventListener("click", () => {
        activeCategory = c.key;
        selectedProjectId = null;
        render();
      });

      categoryList.appendChild(btn);
    });

    if (window.lucide) lucide.createIcons();
  }

  function renderFolders() {
    const items = byCategory(activeCategory);
    foldersGrid.innerHTML = "";

    if (!items.length) {
      emptyState.hidden = false;
      foldersGrid.style.display = "none";
      return;
    }

    emptyState.hidden = true;
    foldersGrid.style.display = "grid";

    items.forEach((p) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "folder";
      el.dataset.id = p.id;
      el.setAttribute("role", "listitem");
      el.setAttribute("aria-label", `${p.title} folder`);

      el.innerHTML = `
        <div class="folder-icon">
          <i data-lucide="folder"></i>
        </div>
        <div>
          <div class="folder-title">${p.title}</div>
          <div class="folder-meta">${p.meta}</div>
        </div>
      `;

      el.addEventListener("click", () => {
        selectedProjectId = p.id;
        updateSelection();
      });

      el.addEventListener("dblclick", () => openProject(p));

      foldersGrid.appendChild(el);
    });

    if (window.lucide) lucide.createIcons();
    updateSelection();
  }

  function updateSelection() {
    const nodes = Array.from(foldersGrid.querySelectorAll(".folder"));
    nodes.forEach(n => {
      const isSel = n.dataset.id === selectedProjectId;
      n.classList.toggle("is-selected", isSel);
    });
  }

  function render() {
    // sidebar active
    const sidebarItems = Array.from(categoryList.querySelectorAll(".sidebar-item"));
    sidebarItems.forEach((b) => b.classList.toggle("is-active", b.dataset.cat === activeCategory));

    // titles
    paneTitle.textContent = activeCategory;
    breadcrumb.textContent = `/ ${activeCategory}`;

    renderFolders();
  }

  makeSidebar();
  render();

  // Keyboard: Enter to open selected folder
  window.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const modalOpen = document.getElementById("projectModal")?.classList.contains("is-open");
    if (modalOpen) return;

    if (!selectedProjectId) return;
    const p = projects.find(x => x.id === selectedProjectId);
    if (p) openProject(p);
  });

  /* ===============================
     MODAL (project details)
  =============================== */
  const modal = document.getElementById("projectModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMeta = document.getElementById("modalMeta");
  const modalDesc = document.getElementById("modalDesc");
  const modalMedia = document.getElementById("modalMedia");
  const modalLinks = document.getElementById("modalLinks");

  function clearModal() {
    modalMedia.innerHTML = "";
    modalLinks.innerHTML = "";
  }

  function youtubeIdFromAnything(input) {
    if (!input) return "";
    if (!input.includes("http") && !input.includes("/") && input.length >= 8) return input.trim();
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

  function addYouTube(videoId, title) {
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`;
    iframe.title = title || "YouTube video";
    iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    iframe.allowFullscreen = true;
    modalMedia.appendChild(iframe);
  }

  function addImage(src, alt) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt || "";
    modalMedia.appendChild(img);
  }

  function addLink(label, url) {
    if (!label || !url) return;
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noreferrer";
    a.className = "ios-link underline";
    a.textContent = label;
    modalLinks.appendChild(a);
  }

  function openProject(p) {
    clearModal();

    modalTitle.textContent = p.title || "Project";
    modalMeta.textContent = p.meta || "";
    modalDesc.textContent = p.desc || "";

    const yid = youtubeIdFromAnything(p.youtube || "");
    if (yid) addYouTube(yid, p.title);

    (p.images || []).forEach((src) => addImage(src, p.title));

    (p.links || []).forEach((l) => addLink(l.label, l.url));
    modalLinks.style.display = modalLinks.children.length ? "flex" : "none";

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    clearModal();
  }

  modal?.addEventListener("click", (e) => {
    const t = e.target;
    if (!t) return;
    if (t.matches("[data-close]")) closeModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
});