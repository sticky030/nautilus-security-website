/* ========= AOS Init ========= */
document.addEventListener("DOMContentLoaded", () => {
  if (window.AOS) AOS.init({ duration: 700, once: true, easing: 'ease-out-cubic' });
});

/* ========= Jahr im Footer ========= */
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});

/* ========= Burger-Menü Mobile ========= */
document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger");
  const overlay = document.getElementById("mobileOverlay");
  const menu = document.getElementById("mobileMenu");

  const closeMenu = () => {
    menu.classList.add("hidden");
    overlay.classList.add("hidden");
  };
  const openMenu = () => {
    menu.classList.remove("hidden");
    overlay.classList.remove("hidden");
  };

  burger && burger.addEventListener("click", () => {
    if (menu.classList.contains("hidden")) openMenu(); else closeMenu();
  });
  overlay && overlay.addEventListener("click", closeMenu);

  // Mobile Links scrollen + schließen
  menu?.querySelectorAll(".mobile-link").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-target");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      closeMenu();
    });
  });
});

/* ========= Smooth Scroll für Desktop-Navigation & CTAs ========= */
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("mainNav");
  nav?.querySelectorAll(".nav-link").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-target");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    });
  });

  document.querySelectorAll(".cta-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-target");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    });
  });

  const stickyCta = document.getElementById("stickyCta");
  stickyCta && stickyCta.addEventListener("click", () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  });
});

/* ========= Cookie-Bar & CTA-Abstand ========= */
document.addEventListener("DOMContentLoaded", () => {
  const bar = document.getElementById("cookieBar");
  const ok = document.getElementById("cookieOk");
  const cta = document.getElementById("stickyCta");

  const setLift = (on) => {
    if (!cta) return;
    if (on) cta.classList.add("cta-lift");
    else cta.classList.remove("cta-lift");
  };

  if (bar) {
    setLift(true); // solange Cookie-Bar sichtbar ist
    ok?.addEventListener("click", () => {
      bar.style.display = "none";
      setLift(false);
    });
  }
});

/* ========= Scrollspy (aktiver Menüpunkt wird gelb) ========= */
document.addEventListener("DOMContentLoaded", () => {
  const ids = ["home","about","services","why","values","team","jobs","faq","testimonials","contact"];
  const nav = document.getElementById("mainNav");
  const links = nav ? Array.from(nav.querySelectorAll(".nav-link")) : [];

  const setActive = (id) => {
    links.forEach(l => l.classList.remove("active"));
    const btn = links.find(b => b.getAttribute("data-target") === id);
    if (btn) btn.classList.add("active");
  };

  const observer = new IntersectionObserver((entries) => {
    // der, der am meisten im Viewport ist, gewinnt
    let best = null, maxRatio = 0;
    entries.forEach(e => {
      if (e.isIntersecting && e.intersectionRatio > maxRatio) {
        maxRatio = e.intersectionRatio;
        best = e.target;
      }
    });
    if (best && best.id) setActive(best.id);
  }, { root: null, threshold: [0.25, 0.5, 0.75] });

  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
});

/* ========= FAQ – sanftes Accordion ========= */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".faq-item").forEach(item => {
    const btn = item.querySelector(".faq-btn");
    const panel = item.querySelector(".faq-panel");
    const icon = item.querySelector(".faq-icon");
    if (!btn || !panel) return;

    const close = () => {
      item.classList.remove("open");
      panel.style.maxHeight = "0px";
      if (icon) icon.textContent = "+";
    };
    const open = () => {
      item.classList.add("open");
      panel.style.maxHeight = panel.scrollHeight + "px";
      if (icon) icon.textContent = "–";
    };

    btn.addEventListener("click", () => {
      if (item.classList.contains("open")) close(); else open();
    });

    // Start zu
    close();
  });
});

/* ========= Testimonials – 3 gleichzeitig, Auto-Slide alle 5s ========= */
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("tsTrack");
  if (!track) return;

  const slides = Array.from(track.querySelectorAll(".ts-slide"));
  let current = 0;
  const total = slides.length;

  const go = (idx) => {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
  };

  // Auto alle 5 Sekunden
  let timer = setInterval(() => go(current + 1), 5000);

  // Bei Tab-Wechsel anhalten / fortsetzen
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { clearInterval(timer); }
    else { timer = setInterval(() => go(current + 1), 5000); }
  });

  // Resize-Sicherheit (Layout bleibt prozentbasiert, aber wir resetten die Transform)
  window.addEventListener("resize", () => go(current));
});

/* ========= (Optional) Form-Submit-Stub – falls EmailJS noch nicht konfiguriert ist ========= */
document.addEventListener("DOMContentLoaded", () => {
  const contact = document.getElementById("contactForm");
  const contactStatus = document.getElementById("contactStatus");
  if (contact) {
    contact.addEventListener("submit", (e) => {
      e.preventDefault();
      // Hier könntest du EmailJS integrieren; wir zeigen Feedback:
      if (contactStatus) {
        contactStatus.textContent = "Vielen Dank! Wir melden uns zeitnah.";
        contactStatus.style.color = "#f59e0b";
      }
      contact.reset();
    });
  }

  const career = document.getElementById("careerForm");
  const careerStatus = document.getElementById("careerStatus");
  if (career) {
    career.addEventListener("submit", (e) => {
      e.preventDefault();
      if (careerStatus) {
        careerStatus.textContent = "Bewerbung gesendet! Wir melden uns zeitnah.";
        careerStatus.style.color = "#f59e0b";
      }
      career.reset();
      const file = document.getElementById("cvFile");
      if (file) file.value = "";
    });
  }
});
