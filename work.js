document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();

  const PROJECTS = [
    {
      id: "olympia",
      title: "Olympia USA",
      date: "2025",
      location: "E-Commerce Web Design",
      categories: ["All", "Web Design"],
      thumb: "imgs/1.png",
      image: "imgs/1.png",
      video: "https://www.youtube.com/watch?v=hA1Tk3f6CYo",
      desc: `Revitalized the digital presence of a long-established luggage brand...`,
      links: []
    },
    {
      id: "elsewhere",
      title: "Elsewhere, Within.",
      date: "2025",
      location: "Narrative + Graphic Design",
      categories: ["All", "Narrative"],
      thumb: "imgs/EW_mockup3.png",
      images: [
        "imgs/EW_mockup.png",
        "imgs/EW_mockup1.png",
        "imgs/EW_mockup2.png",
        "imgs/EW_mockup3.png"
      ],
      desc: `Elsewhere, Within is an interactive publication...`,
      links: [
        { label: "view PDF", href: "https://drive.google.com/file/d/1PZ0Sq86vRXe5gpgtv-VWR9QYFKfeJ4L6/view" }
      ]
    },
    {
      id: "loom",
      title: "LOOM",
      date: "2023",
      location: "Creative Code",
      categories: ["All", "Web Design"],
      thumb: "imgs/2.png",
      image: "imgs/2.png",
      video: "https://www.youtube.com/watch?v=E_He4EIbW0Q",
      desc: `Loom is a platform coded from scratch...`,
      links: [
        { label: "live site", href: "https://ty-disruption.vercel.app/" },
        { label: "github", href: "https://github.com/aiyannaaaaa/ty_disruption" }
      ]
    },
    {
      id: "birds",
      title: "Birds Etc.",
      date: "2024",
      location: "Creative Code",
      categories: ["All", "Web Design"],
      thumb: "imgs/3.png",
      image: "imgs/3.png",
      video: "https://www.youtube.com/watch?v=e1svqYoYnA4",
      desc: `This site is an experiment in documentation...`,
      links: [
        { label: "live site", href: "https://birdsetc.vercel.app/" },
        { label: "github", href: "https://github.com/aiyannaaaaa/birdsetc" }
      ]
    },
    {
      id: "matchayan",
      title: "matchayan",
      date: "2024",
      location: "Creative Code",
      categories: ["All", "Web Design"],
      thumb: "imgs/4.png",
      image: "imgs/4.png",
      video: "https://www.youtube.com/watch?v=sAONflLda_M",
      desc: `A personal website that blends creativity...`,
      links: [
        { label: "live site", href: "https://matchayan.vercel.app/" },
        { label: "github", href: "https://github.com/aiyannaaaaa/matchayan" }
      ]
    },
    {
      id: "outerra",
      title: "Outerra",
      date: "2025",
      location: "Branding + Web Design",
      categories: ["All", "Web Design", "Branding"],
      thumb: "imgs/5.png",
      image: "imgs/5.png",
      video: "https://www.youtube.com/watch?v=BGGH-K60c0I",
      desc: `Partnered with a travel gear startup...`,
      links: [{ label: "live site", href: "https://outerrabrands.com/" }]
    },
    {
      id: "midulce",
      title: "Mi Dulce P’jel",
      date: "2025",
      location: "E-Commerce Web Design",
      categories: ["All", "Web Design", "Branding"],
      thumb: "imgs/thing1.png",
      images: ["imgs/6.png", "imgs/thing1.png"],
      video: "https://www.youtube.com/watch?v=JoAPY2k6ju4",
      desc: `Reimagined the brand identity...`,
      links: [{ label: "live site", href: "https://mi-dulce-pjel.square.site/" }]
    },
    {
      id: "granos",
      title: "Granos",
      date: "2024",
      location: "Independent Short Film",
      categories: ["All", "Narrative"],
      thumb: "imgs/thing2.png",
      images: ["imgs/8.png", "imgs/thing2.png"],
      video: "https://www.youtube.com/watch?v=rLWHHfDYhTI",
      desc: `Granos is an intimate reflection...`,
      links: []
    },

    // ===== WRITING SAMPLES =====
    {
      id: "heart-of-practice",
      title: "Heart of Practice",
      date: "2025",
      location: "Writing Sample",
      categories: ["All", "Writing Samples"],
      type: "writing",
      thumb: "imgs/writing1.png",
      pdf: "pdfs/heart-of-practice.pdf",
      desc: `A reflective research-based writing sample outlining my creative practice.`,
      links: [{ label: "open PDF", href: "pdfs/heart-of-practice.pdf" }]
    },
    {
      id: "elsewhere-concept",
      title: "Elsewhere, Within. Explorations...",
      date: "2025",
      location: "Writing Sample",
      categories: ["All", "Writing Samples"],
      type: "writing",
      thumb: "imgs/writing2.png",
      pdf: "pdfs/elsewhere-within-concept-paper.pdf",
      desc: `Concept paper exploring contemplative interactive design.`,
      links: [{ label: "open PDF", href: "pdfs/elsewhere-within-concept-paper.pdf" }]
    },
    // {
    //   id: "elsewhere-excerpt",
    //   title: "Elsewhere, Within — Excerpt",
    //   date: "2025",
    //   location: "Writing Sample",
    //   categories: ["All", "Writing Samples"],
    //   type: "writing",
    //   thumb: "imgs/writing3.png",
    //   pdf: "pdfs/elsewhere-within-excerpt.pdf",
    //   desc: `Excerpt reflecting on habit and identity.`,
    //   links: [{ label: "open PDF", href: "pdfs/elsewhere-within-excerpt.pdf" }]
    // },
    {
      id: "rebuilding-memory",
      title: "Rebuilding Memory",
      date: "2025",
      location: "Writing Sample",
      categories: ["All", "Writing Samples"],
      type: "writing",
      thumb: "imgs/writing4.png",
      pdf: "pdfs/rebuilding-memory.pdf",
      desc: `Critical essay on photography and urban change.`,
      links: [{ label: "open PDF", href: "pdfs/rebuilding-memory.pdf" }]
    }
  ];

  const CATEGORIES = ["All", "Web Design", "Branding", "Narrative", "Writing Samples"];
  let activeCategory = "All";

  const categoryList = document.getElementById("categoryList");
  const projectsGrid = document.getElementById("projectsGrid");

  const modal = document.getElementById("projectModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMeta = document.getElementById("modalMeta");
  const modalDesc = document.getElementById("modalDesc");
  const modalLinks = document.getElementById("modalLinks");
  const modalImageWrap = document.getElementById("modalImageWrap");
  const modalVideoWrap = document.getElementById("modalVideoWrap");
  const modalLayout = document.getElementById("modalLayout");

  function filteredProjects() {
    if (activeCategory === "All") return PROJECTS;
    return PROJECTS.filter(p => p.categories.includes(activeCategory));
  }

  function renderCategories() {
    categoryList.innerHTML = "";
    CATEGORIES.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = `archive-nav-button ${cat === activeCategory ? "is-active" : ""}`;
      btn.textContent = cat;
      btn.onclick = () => {
        activeCategory = cat;
        renderCategories();
        renderProjects();
      };
      categoryList.appendChild(btn);
    });
  }

  function renderProjects() {
    projectsGrid.innerHTML = "";
    filteredProjects().forEach(project => {
      const card = document.createElement("button");
      card.className = `project-card ${project.type === "writing" ? "is-writing-sample" : ""}`;

      card.innerHTML = `
        <div class="project-card-meta">
          <div class="project-card-title">${project.title}</div>
          <div class="project-card-date">${project.date}</div>
          <div class="project-card-location">${project.location}</div>
        </div>
        <div class="project-card-image-wrap">
          <img src="${project.thumb}" class="project-card-image">
        </div>
      `;

      card.onclick = () => openProject(project);
      projectsGrid.appendChild(card);
    });
  }

  function clearMedia() {
    modalImageWrap.innerHTML = "";
    modalVideoWrap.innerHTML = "";
    modalLayout.classList.remove("is-writing-sample");
  }

function buildPDF(project) {
  clearMedia();

  modalLayout.classList.add("is-writing-sample");

  const iframe = document.createElement("iframe");

  // 🔥 KEY CHANGE — hide toolbar + sidebar
  iframe.src = `${project.pdf}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;

  iframe.className = "project-pdf-frame";
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "0";
  iframe.style.display = "block";

  modalImageWrap.style.height = "100%";

  modalImageWrap.appendChild(iframe);
}

  function buildImage(project) {
    modalImageWrap.innerHTML = "";
    if (project.image) {
      const img = document.createElement("img");
      img.src = project.image;
      img.className = "project-hero-image";
      modalImageWrap.appendChild(img);
    }
    if (project.images) {
      project.images.forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        img.className = "project-hero-image";
        modalImageWrap.appendChild(img);
      });
    }
  }

  function buildVideo(project) {
    modalVideoWrap.innerHTML = "";
    if (!project.video) return;

    const iframe = document.createElement("iframe");
    iframe.src = project.video.replace("watch?v=", "embed/");
    iframe.allowFullscreen = true;

    const wrap = document.createElement("div");
    wrap.className = "project-inline-video";
    wrap.appendChild(iframe);

    modalImageWrap.prepend(wrap);
  }

  function buildLinks(project) {
    modalLinks.innerHTML = "";
    (project.links || []).forEach(link => {
      const a = document.createElement("a");
      a.href = link.href;
      a.target = "_blank";
      a.textContent = link.label;
      modalLinks.appendChild(a);
    });
  }

  function openProject(project) {
    modalTitle.textContent = project.title;
    modalMeta.textContent = `${project.date} · ${project.location}`;
    modalDesc.textContent = project.desc;

    if (project.type === "writing") {
      buildPDF(project);
    } else {
      clearMedia();
      buildImage(project);
      buildVideo(project);
    }

    buildLinks(project);

    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeProject() {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
    clearMedia();
  }

  modal.addEventListener("click", e => {
    if (e.target.closest("[data-close]")) closeProject();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeProject();
  });

  renderCategories();
  renderProjects();

  /* ================= SHOOTING STARS ONLY ================= */
  const canvas = document.getElementById("workSky");
  const ctx = canvas ? canvas.getContext("2d") : null;

  if (canvas && ctx) {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;

    const rand = (a, b) => Math.random() * (b - a) + a;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    function currentStarInk() {
      return getComputedStyle(document.body)
        .getPropertyValue("--star-ink")
        .trim() || "rgba(0,0,0,0.45)";
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.floor(window.innerWidth * dpr);
      h = Math.floor(window.innerHeight * dpr);
      canvas.width = w;
      canvas.height = h;
    }

    window.addEventListener("resize", resize);
    resize();

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
      ctx.strokeStyle = currentStarInk();
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
  }

  renderCategories();
  renderProjects();
});