(() => {
  "use strict";

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  // Preloader
  window.addEventListener("load", () => {
    setTimeout(() => $("#preloader")?.classList.add("done"), 500);
  });

  // Theme
  const root = document.documentElement;
  const themeToggle = $("#themeToggle");
  const themeIcon = $("#themeIcon");
  const savedTheme = localStorage.getItem("maheem-theme");
  if (savedTheme === "light" || savedTheme === "dark") root.dataset.theme = savedTheme;

  function updateThemeIcon() {
    if (themeIcon) themeIcon.textContent = root.dataset.theme === "dark" ? "☼" : "☾";
    themeToggle?.setAttribute("aria-label", root.dataset.theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  }
  updateThemeIcon();

  themeToggle?.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("maheem-theme", root.dataset.theme);
    updateThemeIcon();
    toast(root.dataset.theme === "dark" ? "Dark mode enabled" : "Light mode enabled");
  });

  // Header state
  const header = $("#header");
  const onScroll = () => header?.classList.toggle("scrolled", window.scrollY > 20);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const menuToggle = $("#menuToggle");
  const mobileMenu = $("#mobileMenu");
  function closeMenu() {
    menuToggle?.classList.remove("active");
    menuToggle?.setAttribute("aria-expanded", "false");
    mobileMenu?.classList.remove("open");
    mobileMenu?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
  }
  menuToggle?.addEventListener("click", () => {
    const open = !mobileMenu.classList.contains("open");
    menuToggle.classList.toggle("active", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    mobileMenu.classList.toggle("open", open);
    mobileMenu.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("menu-open", open);
  });
  $$("#mobileMenu a").forEach(a => a.addEventListener("click", closeMenu));

  // Reveal on scroll
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  $$(".reveal").forEach(el => revealObserver.observe(el));

  // Project filters
  const filters = $$(".filter");
  const projectCards = $$(".project-card");
  const count = $("#projectCount");
  function filterProjects(category) {
    let visible = 0;
    projectCards.forEach(card => {
      const show = category === "all" || card.dataset.category.split(" ").includes(category);
      card.classList.toggle("hidden", !show);
      if (show) visible++;
    });
    if (count) count.textContent = `${String(visible).padStart(2, "0")} projects`;
    filters.forEach(btn => btn.classList.toggle("active", btn.dataset.filter === category));
  }
  filters.forEach(btn => btn.addEventListener("click", () => filterProjects(btn.dataset.filter)));

  // Quotes
  const quotes = [
    "Hard work is difficult to begin, but its taste is worth everything.",
    "Curiosity turns ordinary questions into extraordinary journeys.",
    "I don't just use technology; I explore what it can become.",
    "Every unfinished idea is a story waiting to be completed.",
    "Sometimes, the quietest mind carries the loudest dreams."
  ];
  let quoteIndex = 0;
  const quoteText = $("#rotatingQuote");
  $("#nextQuote")?.addEventListener("click", () => {
    quoteIndex = (quoteIndex + 1) % quotes.length;
    quoteText.animate(
      [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 400, easing: "ease" }
    );
    quoteText.textContent = quotes[quoteIndex];
  });

  // Command palette
  const overlay = $("#commandOverlay");
  const commandInput = $("#commandInput");
  const commandButtons = $$("#commandList button");
  const commandTrigger = $("#commandTrigger");

  function openCommands() {
    overlay?.classList.add("open");
    overlay?.setAttribute("aria-hidden", "false");
    document.body.classList.add("command-open");
    setTimeout(() => commandInput?.focus(), 80);
  }
  function closeCommands() {
    overlay?.classList.remove("open");
    overlay?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("command-open");
    if (commandInput) commandInput.value = "";
    commandButtons.forEach(b => b.style.display = "");
  }
  commandTrigger?.addEventListener("click", openCommands);
  overlay?.addEventListener("click", e => { if (e.target === overlay) closeCommands(); });

  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      overlay.classList.contains("open") ? closeCommands() : openCommands();
    }
    if (e.key === "Escape") {
      closeCommands();
      closeMenu();
    }
  });

  commandInput?.addEventListener("input", () => {
    const query = commandInput.value.toLowerCase().trim();
    commandButtons.forEach(btn => {
      btn.style.display = btn.textContent.toLowerCase().includes(query) ? "" : "none";
    });
  });

  commandButtons.forEach(btn => btn.addEventListener("click", () => {
    const command = btn.dataset.command;
    if (command === "theme") themeToggle?.click();
    else document.getElementById(command)?.scrollIntoView({ behavior: "smooth" });
    closeCommands();
  }));

  // Back to top
  $("#topButton")?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Current year
  $("#year").textContent = new Date().getFullYear();

  // Toast
  let toastTimer;
  function toast(message) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 1800);
  }

  // Magnetic interactions on desktop
  if (matchMedia("(pointer:fine)").matches) {
    $$(".magnetic").forEach(el => {
      el.addEventListener("mousemove", e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * .12;
        const y = (e.clientY - (r.top + r.height / 2)) * .12;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener("mouseleave", () => el.style.transform = "");
    });
  }

  // Custom cursor
  const dot = $("#cursorDot");
  const ring = $("#cursorRing");
  if (matchMedia("(pointer:fine)").matches && dot && ring) {
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    document.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });
    const cursorLoop = () => {
      rx += (mx - rx) * .16;
      ry += (my - ry) * .16;
      dot.style.left = `${mx}px`; dot.style.top = `${my}px`;
      ring.style.left = `${rx}px`; ring.style.top = `${ry}px`;
      requestAnimationFrame(cursorLoop);
    };
    cursorLoop();
    $$("a, button, .project-card, .magnetic").forEach(el => {
      el.addEventListener("mouseenter", () => ring.classList.add("hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
    });
  }

  // Interactive particle/space background
  const canvas = $("#spaceCanvas");
  const ctx = canvas?.getContext("2d");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let particles = [];
  if (canvas && ctx && !reducedMotion) {
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const amount = Math.min(85, Math.max(35, Math.floor(innerWidth / 16)));
      particles = Array.from({ length: amount }, () => ({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        r: Math.random() * 1.4 + .2,
        vx: (Math.random() - .5) * .12,
        vy: (Math.random() - .5) * .12,
        a: Math.random() * .45 + .08
      }));
    };
    resize();
    addEventListener("resize", resize, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      const isDark = root.dataset.theme !== "light";
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = innerWidth;
        if (p.x > innerWidth) p.x = 0;
        if (p.y < 0) p.y = innerHeight;
        if (p.y > innerHeight) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? `rgba(180,155,255,${p.a})` : `rgba(99,0,13,${p.a * .65})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    draw();
  }

  // Close placeholder links gracefully until real project URLs are added
  $$(".disabled-link").forEach(link => link.addEventListener("click", e => {
    e.preventDefault();
    toast("Project link can be added later.");
  }));
})();
