// Mobile Menü
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const app = document.getElementById("app");

toggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(isOpen));
});

// Scroll to Section (wird nach dem Laden der Sections initialisiert)
function initScrollNavigation() {
  const scrollLinks = Array.from(document.querySelectorAll("[data-scroll-to]"));
  const sections = Array.from(document.querySelectorAll(".page"));
  const navButtons = Array.from(document.querySelectorAll(".nav__link"));

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el || !app) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });

    nav.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");

    history.replaceState(null, "", `#${id}`);
  }

  scrollLinks.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const target = btn.dataset.scrollTo;
      if (!target) return;
      scrollToSection(target);
    });
  });

  // Active Link beim Scrollen
  const io = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    const id = visible.target.id;
    navButtons.forEach(b => b.classList.toggle("is-active", b.dataset.scrollTo === id));
    history.replaceState(null, "", `#${id}`);
  }, { root: app, threshold: [0.55, 0.7] });

  sections.forEach(s => io.observe(s));

  // Initial Hash
  const initial = (location.hash || "#start").replace("#", "");
  setTimeout(() => scrollToSection(initial), 80);
}

// =========================
// 3D CAROUSEL (init nach Sections Load)
// =========================
function initCarousel() {
  const ring = document.getElementById("ring");
  const cards = ring ? Array.from(ring.querySelectorAll(".pcard")) : [];
  if (!ring || !cards.length) return;

  let index = 0;

  function layoutCarousel() {
    const n = cards.length;
    const step = 360 / n;

    cards.forEach((card, i) => {
      const rot = step * i;
      card.style.transform = `rotateY(${rot}deg) translateZ(var(--radius))`;
    });

    rotateTo(index);
  }

  function rotateTo(i) {
    const n = cards.length;
    index = (i % n + n) % n;
    const step = 360 / n;
    ring.style.setProperty("--rot", `${-step * index}deg`);
  }

  document.getElementById("prev")?.addEventListener("click", () => rotateTo(index - 1));
  document.getElementById("next")?.addEventListener("click", () => rotateTo(index + 1));

  layoutCarousel();
  window.addEventListener("resize", layoutCarousel);

  // Autoplay
  let autoplay = setInterval(() => rotateTo(index + 1), 4500);
  ["mousedown","touchstart","pointerdown"].forEach(evt => {
    document.getElementById("carousel3d")?.addEventListener(evt, () => clearInterval(autoplay), { passive: true });
  });

  // Drag
  const scene = document.getElementById("carousel3d");
  let dragging = false, startX = 0, startIndex = 0;

  scene?.addEventListener("pointerdown", (e) => {
    dragging = true;
    startX = e.clientX;
    startIndex = index;
    scene.setPointerCapture(e.pointerId);
  });

  scene?.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const steps = Math.round(dx / 60);
    rotateTo(startIndex - steps);
  });

  scene?.addEventListener("pointerup", () => dragging = false);
  scene?.addEventListener("pointercancel", () => dragging = false);
}

// Warten bis Sections geladen sind
const waitForSections = setInterval(() => {
  const pages = document.querySelectorAll(".page");
  if (pages.length >= 5) {
    clearInterval(waitForSections);
    initScrollNavigation();
    initCarousel();
  }
}, 50);

// =========================
// FORMSUBMIT - Kontaktformular (nur Button UI, KEIN preventDefault)
// =========================
function hookFormSubmitUX() {
  const form = document.getElementById("contact-form");
  if (!form) return false;

  form.addEventListener("submit", () => {
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;

    // UI: Button sperren + Text ändern, aber Absenden NICHT blockieren
    btn.dataset.oldText = btn.textContent || "Senden";
    btn.textContent = "Sende...";
    btn.disabled = true;
  });

  return true;
}

// Warten bis das Kontakt-Section geladen wurde (weil fetch/SPA)
const formWait = setInterval(() => {
  if (document.getElementById("contact-form")) {
    clearInterval(formWait);
    hookFormSubmitUX();
  }
}, 150);
