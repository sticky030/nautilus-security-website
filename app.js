/* ---------- Utils ---------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const smoothScrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

/* ---------- Cookie-Bar & Sticky CTA ---------- */
(function initCookieBar() {
  const bar = $("#cookieBar");
  const ok = $("#cookieOk");
  const cta = $("#stickyCta");

  if (!bar || !ok) return;

  const KEY = "nautilus_cookie_ok";
  const accepted = localStorage.getItem(KEY) === "1";

  if (accepted) {
    bar.style.display = "none";
  } else {
    // hebe den CTA etwas an, solange die Bar sichtbar ist
    if (cta) cta.style.bottom = "6rem";
  }

  ok.addEventListener("click", () => {
    localStorage.setItem(KEY, "1");
    bar.style.display = "none";
    if (cta) cta.style.bottom = "1.5rem";
  });
})();

/* ---------- Mobile-Burger ---------- */
(function initBurger() {
  const burger = $("#burger");
  const mobileMenu = $("#mobileMenu");
  const overlay = $("#mobileOverlay");

  if (!burger || !mobileMenu || !overlay) return;

  const close = () => {
    mobileMenu.classList.add("hidden");
    overlay.classList.add("hidden");
  };
  const open = () => {
    mobileMenu.classList.remove("hidden");
    overlay.classList.remove("hidden");
  };

  burger.addEventListener("click", () => {
    const isHidden = mobileMenu.classList.contains("hidden");
    isHidden ? open() : close();
  });

  overlay.addEventListener("click", close);

  $$(".mobile-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      if (target) smoothScrollTo(target);
      close();
    });
  });
})();

/* ---------- Smooth Scroll für Desktop-Nav & CTAs ---------- */
(function initNavScroll() {
  $$("#mainNav .nav-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      if (target) smoothScrollTo(target);
    });
  });

  $$(".cta-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target") || "contact";
      smoothScrollTo(target);
    });
  });

  const stickyCta = $("#stickyCta");
  if (stickyCta) {
    stickyCta.addEventListener("click", () => smoothScrollTo("contact"));
  }
})();

/* ---------- Scrollspy (aktiver Menüpunkt) ---------- */
(function initScrollSpy() {
  const navLinks = $$("#mainNav .nav-link");
  if (!navLinks.length) return;

  const ids = navLinks.map((b) => b.getAttribute("data-target"));
  const sections = ids
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const mapById = new Map(
    navLinks.map((b) => [b.getAttribute("data-target"), b])
  );

  const onIntersect = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((l) => l.classList.remove("active"));
        const link = mapById.get(id);
        if (link) link.classList.add("active");
      }
    });
  };

  const obs = new IntersectionObserver(onIntersect, {
    root: null,
    rootMargin: "-40% 0px -50% 0px", // „Aktiv“, wenn Sektion mittig im Viewport
    threshold: 0.0,
  });

  sections.forEach((sec) => obs.observe(sec));
})();

/* ---------- FAQ: weiches Auf-/Zuklappen ---------- */
(function initFAQ() {
  const faqs = $$(".faq-item");
  if (!faqs.length) return;

  faqs.forEach((item) => {
    const btn = $(".faq-btn", item);
    const panel = $(".faq-panel", item);
    if (!btn || !panel) return;

    // Startzustand
    panel.style.maxHeight = "0px";
    panel.style.opacity = "0";

    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // andere schließen (optional; auskommentieren, falls mehrere offen bleiben sollen)
      faqs.forEach((it) => {
        if (it !== item) {
          it.classList.remove("open");
          const p = $(".faq-panel", it);
          if (p) {
            p.style.maxHeight = "0px";
            p.style.opacity = "0";
          }
        }
      });

      if (isOpen) {
        item.classList.remove("open");
        panel.style.maxHeight = "0px";
        panel.style.opacity = "0";
      } else {
        item.classList.add("open");
        panel.style.maxHeight = panel.scrollHeight + "px";
        panel.style.opacity = "1";
      }
    });
  });
})();

/* ---------- Testimonials: 3 gleichzeitig, Auto-Slide alle 5s ---------- */
(function initTestimonials() {
  const track = document.getElementById("tsTrack");
  if (!track) return;

  // Finde den „Viewport“ (Eltern-Container) und stelle sicher, dass overflow hidden ist
  let viewport = document.getElementById("tsViewport");
  if (!viewport) {
    viewport = track.parentElement;
    if (viewport) viewport.style.overflow = "hidden";
  }

  const slides = $$(".ts-card", track);
  if (!slides.length) return;

  // Packe Cards in „.ts-slide“-Wrapper, damit jede 33.333% Breite hat
  if (!slides[0].parentElement.classList.contains("ts-slide")) {
    slides.forEach((card) => {
      const wrap = document.createElement("div");
      wrap.className = "ts-slide";
      card.parentNode.insertBefore(wrap, card);
      wrap.appendChild(card);
    });
  }

  const groups = Math.ceil(track.children.length / 3);
  let index = 0;
  let timer = null;

  const applyTransform = () => {
    // Jede Gruppe belegt 100% der Viewport-Breite
    track.style.transform = `translateX(-${index * 100}%)`;
  };

  const next = () => {
    index = (index + 1) % groups;
    applyTransform();
  };

  // Auto-Advance alle 5 Sekunden
  const start = () => {
    stop();
    timer = setInterval(next, 5000);
  };
  const stop = () => timer && clearInterval(timer);

  // Start
  applyTransform();
  start();

  // Pause bei Hover (Desktop)
  if (viewport) {
    viewport.addEventListener("mouseenter", stop);
    viewport.addEventListener("mouseleave", start);
  }

  // Fallback für manuelle Buttons, falls vorhanden (werden ignoriert, wenn es sie nicht gibt)
  const prevBtn = document.getElementById("tsPrev");
  const nextBtn = document.getElementById("tsNext");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      stop();
      index = (index - 1 + groups) % groups;
      applyTransform();
      start();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      stop();
      next();
      start();
    });
  }

  // Responsiveness: bei Größenänderung kurz neu messen (hier reicht Re-Transform)
  window.addEventListener("resize", () => {
    applyTransform();
  });
})();

/* ---------- AOS init (smooth reinkommen) ---------- */
document.addEventListener("DOMContentLoaded", () => {
  if (window.AOS) {
    window.AOS.init({ duration: 700, once: true, easing: "ease-out-cubic" });
  }

  // Jahr im Footer
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
});
