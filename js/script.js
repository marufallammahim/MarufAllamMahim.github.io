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

  // =========================================================
  // CUSTOM CAT + CAT FOOD CURSOR
  // =========================================================

  const dot = $("#cursorDot");
  const ring = $("#cursorRing");

  if (matchMedia("(pointer:fine)").matches && dot && ring) {

    /*
     * The small circular food is the actual mouse pointer.
     * The cat follows behind it with a smooth delay.
     */

    dot.innerHTML = `
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style="display:block;overflow:visible"
      >
        <circle
          cx="9"
          cy="9"
          r="5.5"
          fill="#c99055"
          stroke="#f0c58d"
          stroke-width="1"
        />
        <circle
          cx="6.8"
          cy="7.2"
          r="1"
          fill="#6b351c"
        />
        <circle
          cx="10.9"
          cy="10.3"
          r=".9"
          fill="#6b351c"
        />
        <circle
          cx="9.4"
          cy="5.6"
          r=".7"
          fill="#6b351c"
        />
      </svg>
    `;

    /*
     * Direct SVG artwork.
     * No cat emoji is used.
     */
    ring.innerHTML = `
      <svg
        class="cat-cursor-art"
        width="76"
        height="62"
        viewBox="0 0 76 62"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style="display:block;overflow:visible"
      >

        <!-- soft ground shadow -->
        <ellipse
          class="cat-shadow"
          cx="37"
          cy="54"
          rx="19"
          ry="3.5"
          fill="rgba(0,0,0,.28)"
        />

        <!-- tail -->
        <g class="cat-tail">
          <path
            d="M18 43
               C8 45 5 37 10 31
               C13 27 19 30 17 34
               C15 37 12 36 12 34"
            fill="none"
            stroke="#c7b6ae"
            stroke-width="5"
            stroke-linecap="round"
          />
          <path
            d="M18 43
               C8 45 5 37 10 31"
            fill="none"
            stroke="#eadbd5"
            stroke-width="1.2"
            stroke-linecap="round"
            opacity=".55"
          />
        </g>

        <!-- back legs -->
        <g class="cat-back-legs">
          <path
            d="M25 42 C22 47 22 51 25 53"
            fill="none"
            stroke="#b9a7a0"
            stroke-width="5"
            stroke-linecap="round"
          />
          <path
            d="M46 42 C49 47 49 51 46 53"
            fill="none"
            stroke="#b9a7a0"
            stroke-width="5"
            stroke-linecap="round"
          />
        </g>

        <!-- body -->
        <g class="cat-body">
          <ellipse
            cx="36"
            cy="39"
            rx="17"
            ry="13"
            fill="#d7c7c0"
          />

          <ellipse
            cx="36"
            cy="41"
            rx="11"
            ry="8"
            fill="#eaded8"
            opacity=".72"
          />

          <!-- front legs -->
          <path
            class="cat-front-leg cat-leg-a"
            d="M29 43 C27 48 27 51 30 53"
            fill="none"
            stroke="#c2b1aa"
            stroke-width="5"
            stroke-linecap="round"
          />

          <path
            class="cat-front-leg cat-leg-b"
            d="M41 43 C43 48 43 51 40 53"
            fill="none"
            stroke="#c2b1aa"
            stroke-width="5"
            stroke-linecap="round"
          />
        </g>

        <!-- neck -->
        <path
          d="M25 31 C28 26 39 25 45 31"
          fill="none"
          stroke="#b9a7a0"
          stroke-width="7"
          stroke-linecap="round"
        />

        <!-- head -->
        <g class="cat-head">

          <!-- ears -->
          <path
            d="M23 26 L24 13 L33 21 Z"
            fill="#d7c7c0"
          />

          <path
            d="M42 21 L51 13 L50 27 Z"
            fill="#d7c7c0"
          />

          <path
            d="M25 21 L25.5 16 L30 21"
            fill="#b77f86"
          />

          <path
            d="M44 21 L49 16 L48 22"
            fill="#b77f86"
          />

          <!-- face -->
          <ellipse
            cx="37"
            cy="27"
            rx="15"
            ry="12"
            fill="#dfd0ca"
          />

          <!-- forehead marking -->
          <path
            d="M35 17 L37 22 L39 17"
            fill="none"
            stroke="#b4a09a"
            stroke-width="1.4"
            stroke-linecap="round"
          />

          <!-- eyes -->
          <ellipse
            class="cat-eye cat-eye-left"
            cx="31.5"
            cy="26"
            rx="2"
            ry="2.4"
            fill="#3a2928"
          />

          <ellipse
            class="cat-eye cat-eye-right"
            cx="42.5"
            cy="26"
            rx="2"
            ry="2.4"
            fill="#3a2928"
          />

          <!-- eye highlights -->
          <circle
            cx="32"
            cy="25.3"
            r=".55"
            fill="#fff"
          />

          <circle
            cx="43"
            cy="25.3"
            r=".55"
            fill="#fff"
          />

          <!-- muzzle -->
          <ellipse
            cx="37"
            cy="30"
            rx="5"
            ry="3.7"
            fill="#eee4df"
          />

          <!-- nose -->
          <path
            class="cat-nose"
            d="M35.2 29.2 Q37 27.8 38.8 29.2 Q37 31 35.2 29.2"
            fill="#8f5d63"
          />

          <!-- mouth -->
          <path
            class="cat-mouth"
            d="M37 30.5 C36 32.2 34.7 32.2 34 31.4
               M37 30.5 C38 32.2 39.3 32.2 40 31.4"
            fill="none"
            stroke="#765052"
            stroke-width="1"
            stroke-linecap="round"
          />

          <!-- whiskers -->
          <g
            fill="none"
            stroke="#927f79"
            stroke-width=".7"
            stroke-linecap="round"
            opacity=".85"
          >
            <path d="M29 30 L19 28" />
            <path d="M29 32 L18 33" />
            <path d="M45 30 L55 28" />
            <path d="M45 32 L56 33" />
          </g>

        </g>
      </svg>
    `;

    /*
     * Inline styling is used here so the existing CSS does not
     * need to be changed. Everything else on the website remains
     * untouched.
     */

    dot.style.width = "18px";
    dot.style.height = "18px";
    dot.style.borderRadius = "50%";
    dot.style.background = "transparent";
    dot.style.boxShadow = "0 0 14px rgba(201,144,85,.28)";
    dot.style.zIndex = "1002";

    ring.style.width = "76px";
    ring.style.height = "62px";
    ring.style.border = "0";
    ring.style.background = "transparent";
    ring.style.borderRadius = "0";
    ring.style.boxShadow = "none";
    ring.style.transition = "none";
    ring.style.zIndex = "1001";

    const catArt = $(".cat-cursor-art", ring);
    const catHead = $(".cat-head", ring);
    const catBody = $(".cat-body", ring);
    const catTail = $(".cat-tail", ring);
    const catFrontLegA = $(".cat-leg-a", ring);
    const catFrontLegB = $(".cat-leg-b", ring);
    const catShadow = $(".cat-shadow", ring);

    let mx = innerWidth / 2;
    let my = innerHeight / 2;

    /*
     * Cat position starts behind the food.
     */
    let cx = mx - 65;
    let cy = my + 12;

    let lastMouseX = mx;
    let lastMouseY = my;

    let mouseMoving = false;
    let eating = false;
    let stopTimer = null;

    /*
     * Detect mouse movement.
     * Food instantly follows the pointer.
     * Cat receives a small delayed destination.
     */
    document.addEventListener("mousemove", e => {

      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;

      mx = e.clientX;
      my = e.clientY;

      if (Math.abs(dx) + Math.abs(dy) > 0.5) {
        mouseMoving = true;
        eating = false;

        clearTimeout(stopTimer);

        /*
         * After the pointer stops for a moment,
         * the cat begins eating.
         */
        stopTimer = setTimeout(() => {
          mouseMoving = false;
        }, 220);
      }

      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    });

    /*
     * Hover interactions.
     * Keep the original behavior but prevent the old ring
     * from turning into a plain circle.
     */
    $$("a, button, .project-card, .magnetic").forEach(el => {

      el.addEventListener("mouseenter", () => {
        ring.classList.add("hover");

        ring.style.width = "76px";
        ring.style.height = "62px";
        ring.style.background = "transparent";
        ring.style.border = "0";
      });

      el.addEventListener("mouseleave", () => {
        ring.classList.remove("hover");

        ring.style.width = "76px";
        ring.style.height = "62px";
        ring.style.background = "transparent";
        ring.style.border = "0";
      });

    });

    /*
     * Cat animation loop.
     */
    const cursorLoop = () => {

      /*
       * Food stays exactly under the mouse.
       */
      dot.style.left = `${mx}px`;
      dot.style.top = `${my}px`;

      /*
       * Calculate direction from cat to food.
       */
      const dx = mx - cx;
      const dy = my - cy;
      const distance = Math.hypot(dx, dy);

      /*
       * The cat follows the food with a smooth spring-like movement.
       */
      const targetDistance = 47;

      if (mouseMoving) {

        eating = false;

        let tx = mx;
        let ty = my;

        if (distance > targetDistance) {
          const nx = dx / distance;
          const ny = dy / distance;

          tx = mx - nx * targetDistance;
          ty = my - ny * targetDistance;
        }

        /*
         * Smooth running movement.
         */
        cx += (tx - cx) * 0.095;
        cy += (ty - cy) * 0.095;

      } else {

        /*
         * When the mouse stops, slowly approach the food.
         */
        const eatDistance = 27;

        if (distance > eatDistance) {

          const nx = dx / distance;
          const ny = dy / distance;

          const tx = mx - nx * eatDistance;
          const ty = my - ny * eatDistance;

          cx += (tx - cx) * 0.055;
          cy += (ty - cy) * 0.055;

        } else {

          /*
           * Close enough to eat.
           */
          eating = true;

          cx += (mx - cx) * 0.025;
          cy += (my - cy) * 0.025;
        }
      }

      ring.style.left = `${cx}px`;
      ring.style.top = `${cy}px`;

      /*
       * Cat rotation based on movement direction.
       */
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;

      /*
       * Keep the cat mostly facing the food.
       */
      let faceScale = 1;

      if (dx < -5) {
        faceScale = -1;
      }

      if (catArt) {

        /*
         * Slight body movement while running.
         */
        if (mouseMoving) {

          const runBounce = Math.sin(performance.now() * 0.018) * 2;

          catArt.style.transform =
            `translateY(${runBounce}px) scaleX(${faceScale})`;

          /*
           * Tail wag.
           */
          if (catTail) {
            const tailMove = Math.sin(performance.now() * 0.022) * 10;

            catTail.style.transformOrigin = "18px 43px";
            catTail.style.transform = `rotate(${tailMove}deg)`;
          }

          /*
           * Alternating legs.
           */
          const step = Math.sin(performance.now() * 0.028);

          if (catFrontLegA) {
            catFrontLegA.style.transform =
              `translate(${step * 1.8}px, ${Math.abs(step) * -1.5}px)`;
          }

          if (catFrontLegB) {
            catFrontLegB.style.transform =
              `translate(${-step * 1.8}px, ${Math.abs(step) * -1.5}px)`;
          }

          if (catShadow) {
            catShadow.style.transform =
              `scaleX(${1 - Math.abs(step) * .08})`;
          }

        } else if (eating) {

          /*
           * -----------------------------------------------------
           * EATING ANIMATION
           * -----------------------------------------------------
           *
           * The head slowly dips toward the food.
           * The food remains untouched and never decreases.
           */

          const chew = Math.sin(performance.now() * 0.009);

          /*
           * Small repeated head dip.
           */
          const headDown =
            3.5 + Math.max(0, chew) * 2.5;

          if (catHead) {
            catHead.style.transformOrigin = "37px 30px";
            catHead.style.transform =
              `translate(0, ${headDown}px) scaleX(${faceScale})`;
          }

          /*
           * Body gently follows the head.
           */
          if (catBody) {
            catBody.style.transform =
              `translateY(${headDown * .35}px)`;
          }

          /*
           * Tail becomes calm while eating.
           */
          if (catTail) {
            catTail.style.transformOrigin = "18px 43px";
            catTail.style.transform =
              `rotate(${Math.sin(performance.now() * .004) * 2}deg)`;
          }

          /*
           * Legs stop running.
           */
          if (catFrontLegA) {
            catFrontLegA.style.transform = "none";
          }

          if (catFrontLegB) {
            catFrontLegB.style.transform = "none";
          }

          /*
           * Tiny shadow breathing effect.
           */
          if (catShadow) {
            catShadow.style.transform =
              `scaleX(${1 + Math.abs(chew) * .035})`;
          }

        } else {

          /*
           * Waiting / approaching the food.
           */
          const idle =
            Math.sin(performance.now() * 0.003) * .7;

          catArt.style.transform =
            `translateY(${idle}px) scaleX(${faceScale})`;

          if (catHead) {
            catHead.style.transform = "none";
          }

          if (catBody) {
            catBody.style.transform = "none";
          }

          if (catTail) {
            catTail.style.transformOrigin = "18px 43px";
            catTail.style.transform =
              `rotate(${Math.sin(performance.now() * .003) * 3}deg)`;
          }

          if (catFrontLegA) {
            catFrontLegA.style.transform = "none";
          }

          if (catFrontLegB) {
            catFrontLegB.style.transform = "none";
          }
        }
      }

      requestAnimationFrame(cursorLoop);
    };

    cursorLoop();
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
