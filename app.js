// © Nautilus Security – App JS (robustes Smooth-Reveal + Rest)

// Jahr im Footer
(() => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();

// Burger-Menü + Smooth Scroll
(() => {
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileOverlay = document.getElementById("mobileOverlay");
  const toggleMobile = (state) => {
    if (!mobileMenu || !mobileOverlay) return;
    const open = state === "open";
    mobileMenu.classList.toggle("hidden", !open);
    mobileOverlay.classList.toggle("hidden", !open);
  };
  burger?.addEventListener("click", () => toggleMobile("open"));
  mobileOverlay?.addEventListener("click", () => toggleMobile("close"));

  document.querySelectorAll(".mobile-link, .nav-link, .cta-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-target");
      if (id) {
        const el = document.getElementById(id);
        if (id === "about") el?.classList.add("is-inview"); // sichtbar bei Direktklick
        el?.scrollIntoView({ behavior: "smooth" });
        toggleMobile("close");
      }
    });
  });
})();

// Scrollspy
(() => {
  const links = document.querySelectorAll(".nav-link");
  const ids = ["home","about","services","why","values","team","jobs","faq","testimonials","contact"];
  const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
  if (!sections.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach(l => {
        const active = l.getAttribute("data-target") === id;
        l.classList.toggle("text-yellow-500", active);
        l.classList.toggle("font-bold", active);
        l.classList.toggle("nav-active", active);
      });
    });
  }, { rootMargin: "-42% 0px -52% 0px", threshold: 0.01 });

  sections.forEach(sec => io.observe(sec));
})();

// FAQ
(() => {
  const list = document.getElementById("faqList");
  if (!list) return;
  list.querySelectorAll(".faq-item").forEach(item => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    if (!q || !a) return;

    a.style.overflow = "hidden";
    a.style.maxHeight = "0px";
    a.style.opacity = "0";
    a.style.transition = "max-height 380ms cubic-bezier(.25,.8,.25,1), opacity 260ms ease";
    q.setAttribute("aria-expanded","false");
    a.setAttribute("aria-hidden","true");

    q.addEventListener("click", () => {
      const open = item.classList.toggle("open");
      if (open) {
        a.style.maxHeight = a.scrollHeight + "px";
        a.style.opacity = "1";
        q.setAttribute("aria-expanded","true");
        a.setAttribute("aria-hidden","false");
        a.addEventListener("transitionend", function onEnd(ev){
          if (ev.propertyName !== "max-height") return;
          a.style.maxHeight = "none";
          a.removeEventListener("transitionend", onEnd);
        });
      } else {
        const h = a.scrollHeight;
        a.style.maxHeight = h + "px";
        requestAnimationFrame(() => {
          a.style.maxHeight = "0px";
          a.style.opacity = "0";
          q.setAttribute("aria-expanded","false");
          a.setAttribute("aria-hidden","true");
        });
      }
    });
  });
})();

// Sticky CTA
(() => {
  const cta = document.getElementById("stickyCta");
  const hero = document.getElementById("home");
  if (!cta) return;

  const thresholdPx = () => (hero ? hero.offsetHeight * 0.4 : window.innerHeight * 0.4);
  const bottomGuard = 320;

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY || window.pageYOffset;
      const docH = document.documentElement.scrollHeight;
      const vpH  = window.innerHeight;
      const fromBottom = docH - (y + vpH);
      const visible = y > thresholdPx() && fromBottom > bottomGuard;
      cta.classList.toggle("is-visible", visible);
      ticking = false;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  cta.addEventListener("click", () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }));
})();

/* ========= Smooth Reveal (JS-gated via <html class="js">) ========= */
(() => {
  const sections = Array.from(document.querySelectorAll("section[id]"));
  if (!sections.length) return;

  const about = document.getElementById("about");
  const normals = sections.filter(s => s !== about);

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("is-inview");
        io.unobserve(e.target);
      }
    });
  }, {
    threshold: 0.08,              // früh triggern
    rootMargin: "0px 0px 28% 0px" // +28% unten
  });

  // alle außer #about sofort beobachten
  normals.forEach(el => io.observe(el));

  // #about erst nach erster User-Aktion aktivieren
  const activateAbout = () => { about && io.observe(about); cleanup(); };
  function cleanup(){
    window.removeEventListener("scroll", activateAbout);
    window.removeEventListener("wheel", activateAbout);
    window.removeEventListener("touchstart", activateAbout);
    window.removeEventListener("keydown", activateAbout);
  }
  window.addEventListener("scroll", activateAbout, { once:true, passive:true });
  window.addEventListener("wheel",  activateAbout, { once:true, passive:true });
  window.addEventListener("touchstart", activateAbout, { once:true, passive:true });
  window.addEventListener("keydown", activateAbout, { once:true });

  // Initial-Check (falls schon im Viewport)
  const vh = window.innerHeight || document.documentElement.clientHeight;
  normals.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < vh * 0.92 && r.bottom > vh * 0.08) el.classList.add("is-inview");
  });
})();

// Forms (unchanged scaffolding)
(() => {
  const FORMSPREE_CONTACT = "";
  const FORMSPREE_CAREER  = "";

  function handleForm(formId, endpoint, subject) {
    const form = document.getElementById(formId);
    const status = document.getElementById(formId === "contactForm" ? "contactStatus" : "careerStatus");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (status) { status.textContent = ""; status.style.color = ""; }

      const requireds = form.querySelectorAll("[required]");
      for (const el of requireds) {
        if (!el.value || !String(el.value).trim()) {
          if (status) { status.textContent = "Bitte Pflichtfelder ausfüllen."; status.style.color = "#f87171"; }
          return;
        }
      }

      if (endpoint) {
        try {
          const fd = new FormData(form);
          const res = await fetch(endpoint, { method: "POST", body: fd, headers: { "Accept": "application/json" } });
          if (res.ok) {
            if (status) { status.textContent = "Vielen Dank. Wir melden uns werktags zeitnah."; status.style.color = "#C79A3A"; }
            form.reset();
            return;
          }
          throw new Error("Fehler");
        } catch {
          if (status) { status.textContent = "Übermittlung fehlgeschlagen. Bitte per E-Mail senden."; status.style.color = "#f87171"; }
        }
      }

      const fd = new FormData(form);
      const kv = [];
      fd.forEach((v, k) => { if (String(v).trim()) kv.push(`${k}: ${v}`); });
      const body = encodeURIComponent(kv.join("\n"));
      location.href = `mailto:kontakt@nautilus-security.de?subject=${encodeURIComponent(subject)}&body=${body}`;
    });
  }

  handleForm("contactForm", FORMSPREE_CONTACT, "Kontaktanfrage – Nautilus Security");
  handleForm("careerForm",  FORMSPREE_CAREER,  "Bewerbung – Nautilus Security");
})();
