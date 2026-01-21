// Mobile Menü
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const app = document.getElementById("app");

toggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(isOpen));
});

// Scroll to Section
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
    btn.addEventListener("click", e => {
      e.preventDefault();
      scrollToSection(btn.dataset.scrollTo);
    });
  });

  const io = new IntersectionObserver(entries => {
    const visible = entries.find(e => e.isIntersecting);
    if (!visible) return;
    navButtons.forEach(b =>
      b.classList.toggle("is-active", b.dataset.scrollTo === visible.target.id)
    );
  }, { root: app, threshold: 0.6 });

  sections.forEach(s => io.observe(s));
}


function initCarousel() {
  const carousel = document.getElementById("carousel3d");
  const ring = document.getElementById("ring");
  const cards = [...ring.querySelectorAll(".pcard")];

  let index = 0;
  let autoplay = setInterval(() => rotateTo(index + 1), 10000);

  function rotateTo(i) {
    index = (i + cards.length) % cards.length;
    ring.style.setProperty("--rot", `${-(360 / cards.length) * index}deg`);
  }

  cards.forEach((card, i) => {
    card.style.transform = `rotateY(${(360 / cards.length) * i}deg) translateZ(var(--radius))`;
  });

  document.getElementById("prev").onclick = () => rotateTo(index - 1);
  document.getElementById("next").onclick = () => rotateTo(index + 1);

  // DRAG – LINK-SAFE
  let startX = null;

  carousel.addEventListener("pointerdown", e => {
    if (e.target.closest("a")) return; 
    startX = e.clientX;
  });

  carousel.addEventListener("pointermove", e => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    rotateTo(index - Math.round(dx / 80));
  });

  carousel.addEventListener("pointerup", () => startX = null);
  carousel.addEventListener("pointercancel", () => startX = null);

  carousel.addEventListener("mouseenter", () => clearInterval(autoplay));
  carousel.addEventListener("mouseleave", () => autoplay = setInterval(() => rotateTo(index + 1), 10000));
}

// Init
const wait = setInterval(() => {
  if (document.querySelectorAll(".page").length) {
    clearInterval(wait);
    initScrollNavigation();
    initCarousel();
  }
}, 50);
