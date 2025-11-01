// © Nautilus Security – App JS (clean reveal + stable testimonials)

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
        if (id === "about") el?.classList.add("is-inview"); // sichtbar, wenn direkt angewählt
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

// Einheitlicher Scroll-Reveal – „Über uns“ NICHT beim Laden zeigen
(() => {
  // allen Sections die Reveal-Klasse geben
  document.querySelectorAll("section").forEach(s => s.classList.add("reveal"));

  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const all = Array.from(document.querySelectorAll(".reveal"));
  const about = document.getElementById("about");
  const normals = all.filter(el => el !== about);

  if (prefersReduced) {
    all.forEach(el => el.classList.add("is-inview"));
    return;
  }

  // Früh triggern: threshold sehr klein, rootMargin +25% unten
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("is-inview");
        io.unobserve(e.target);
      }
    });
  }, {
    threshold: 0.04,
    rootMargin: "0px 0px 25% 0px"
  });

  // normale Sektionen sofort beobachten
  normals.forEach(el => io.observe(el));

  // „Über uns“ erst beobachten, wenn Nutzer wirklich scrollt
  if (about) {
    const activateAbout = () => { io.observe(about); };
    window.addEventListener("scroll", activateAbout, { once:true, passive:true });
    window.addEventListener("wheel",  activateAbout, { once:true, passive:true });
    window.addEventListener("touchstart", activateAbout, { once:true, passive:true });
  }
})();

// Form-Handler
(() => {
  const FORMSPREE_CONTACT = ""; // https://formspree.io/f/xxxxxx
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

// Testimonials – 3 pro Seite (mobil 1), ohne Glow
(() => {
  const track = document.getElementById("tsTrack");
  if (!track) return;

  const TESTIMONIALS = [
    { q: "„Präsenz wie vereinbart, Berichte lückenlos. Übergaben funktionieren.“", a: "Objektleiter, Großbaustelle Berlin-City" },
    { q: "„Start binnen weniger Tage, sauber organisiert und dokumentiert.“", a: "Projektleiter, Bauherr Berlin" },
    { q: "„Ruhige Umsetzung, klare Eskalationen, kein Theater.“", a: "FM-Leitung, Gewerbepark" },
    { q: "„Revierfahrten mit GPS und Fotobelegen – auditfähig.“", a: "Sicherheitsbeauftragter, Industrie" },
    { q: "„Doorman dezent und verbindlich; Besucherprozesse liefen.“", a: "Center Manager, Office-Quartier" },
    { q: "„Event: Einlassfluss stabil, Backstage geschützt, Funkdisziplin top.“", a: "Veranstaltungsleitung, Messe" },
    { q: "„Nachtschicht störungsfrei; Hotspots konsequent angelaufen.“", a: "Bauüberwachung, Innenstadt" },
    { q: "„Schichtberichte präzise; Abweichungen mit Maßnahmen dokumentiert.“", a: "Technischer Leiter, Campus" },
    { q: "„Kommunikation schnell, höflich, erreichbar.“", a: "Hausverwaltung, Bestand" },
    { q: "„Kosten planbar, Leistung konstant.“", a: "Betreiber, Logistikstandort" },
    { q: "„Kurzfristiger Ersatz pünktlich und eingearbeitet.“", a: "Objektleitung, Rechenzentrum" },
    { q: "„Auftreten diskret; Wirkung nach außen professionell.“", a: "Eigentümervertretung, Neubauprojekt" }
  ];

  track.innerHTML = "";
  track.style.willChange = "transform";

  const makeCard = (t) => {
    const art = document.createElement("article");
    art.className = "card ts-card";
    art.innerHTML = `<p class="text-gray-200 italic">${t.q}</p><p class="text-yellow-500 mt-3 text-sm">— ${t.a}</p>`;
    return art;
  };
  const makePage = (slice) => {
    const page = document.createElement("div");
    page.className = "ts-page";
    slice.forEach(x => page.appendChild(makeCard(x)));
    return page;
  };

  const pages = [];
  for (let i = 0; i < TESTIMONIALS.length; i += 3) {
    pages.push(makePage(TESTIMONIALS.slice(i, i + 3)));
  }
  pages.forEach(p => track.appendChild(p));
  if (pages.length) track.appendChild(pages[0].cloneNode(true));

  let idx = 0;
  const total = pages.length;
  const step = () => {
    idx++;
    track.style.transition = "transform 700ms ease-in-out";
    track.style.transform = `translateX(-${idx * 100}%)`;
    if (idx === total) {
      setTimeout(() => {
        track.style.transition = "none";
        track.style.transform = "translateX(0%)";
        idx = 0;
        void track.offsetWidth;
        track.style.transition = "transform 700ms ease-in-out";
      }, 740);
    }
  };

  let timer = setInterval(step, 5200);
  track.addEventListener("mouseenter", () => { clearInterval(timer); });
  track.addEventListener("mouseleave", () => { timer = setInterval(step, 5200); });
})();

/* === Scroll Reveal (ohne Layout-/Text-Änderungen) === */
(() => {
  // Alle Sections markieren – Hero #home sofort sichtbar lassen
  const sections = Array.from(document.querySelectorAll('section'));
  sections.forEach(s => s.classList.add('reveal'));

  const hero = document.getElementById('home');
  if (hero) hero.classList.add('is-inview');

  // Bewegungen systemweit reduziert? -> alles direkt anzeigen
  const prefersReduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    sections.forEach(s => s.classList.add('is-inview'));
    return;
  }

  // Früh triggern, damit es "smooth" wirkt
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-inview');
        io.unobserve(e.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px 25% 0px' // 25% extra unten -> früheres Einblenden
  });

  sections.forEach(s => { if (s !== hero) io.observe(s); });

  // Falls beim Reload schon im Viewport
  const vh = window.innerHeight || document.documentElement.clientHeight;
  sections.forEach(s => {
    const r = s.getBoundingClientRect();
    if (r.top < vh * 0.92 && r.bottom > vh * 0.08) s.classList.add('is-inview');
  });
})();
/* === Smooth Section Reveal (JS-only, keine CSS-Änderung nötig) === */
(() => {
  // Alle Sections holen
  const sections = Array.from(document.querySelectorAll('section'));
  if (!sections.length) return;

  // Hero sofort sichtbar lassen
  const hero = document.getElementById('home');
  const rest = sections.filter(s => s !== hero);

  // Anfangszustand NUR per Inline-Style (kein Layout-/CSS-Eingriff)
  rest.forEach(s => {
    s.style.opacity = '0';
    s.style.transform = 'translateY(12px)';
    s.style.transition = 'opacity 500ms ease, transform 500ms ease';
    s.style.willChange = 'opacity, transform';
  });
  if (hero) {
    hero.style.opacity = '1';
    hero.style.transform = 'none';
  }

  // Barrierefreiheit: Bewegung reduzieren → alles direkt sichtbar
  const prefersReduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    rest.forEach(s => { s.style.opacity = '1'; s.style.transform = 'none'; });
    return;
  }

  // Fallback: Wenn kein IntersectionObserver → alles einblenden
  if (!('IntersectionObserver' in window)) {
    setTimeout(() => {
      rest.forEach(s => { s.style.opacity = '1'; s.style.transform = 'none'; });
    }, 120);
    return;
  }

  // Observer: früh triggern, damit es "smooth" wirkt
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        requestAnimationFrame(() => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
        io.unobserve(el);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px 25% 0px' });

  rest.forEach(el => io.observe(el));

  // Direkt beim Laden schon sichtbare Bereiche auch einblenden
  const vh = window.innerHeight || document.documentElement.clientHeight;
  rest.forEach(s => {
    const r = s.getBoundingClientRect();
    if (r.top < vh * 0.92 && r.bottom > vh * 0.08) {
      s.style.opacity = '1';
      s.style.transform = 'none';
    }
  });
})();
/* === Smooth Reveal (Observer) – HTML & Texte bleiben unberührt === */
(() => {
  // Accessibility: wenn Nutzer Motion reduziert, keine Animation
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const sections = Array.from(document.querySelectorAll('section')).filter(s => s.id !== 'home');
  if (!sections.length) return;

  // Früh triggern, damit es "smooth" wirkt
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('ns-in');
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.06, rootMargin: '0px 0px 28% 0px' });

  sections.forEach(s => io.observe(s));

  // Bereits sichtbare Sektionen beim Laden sanft zeigen
  const vh = window.innerHeight || document.documentElement.clientHeight;
  sections.forEach(s => {
    const r = s.getBoundingClientRect();
    if (r.top < vh * 0.92 && r.bottom > vh * 0.08) {
      s.classList.add('ns-in');
      io.unobserve(s);
    }
  });
})();
/* === SAFE SMOOTH REVEAL (kein HTML-/Text-Change) === */
(() => {
  // Abschnitte holen (Hero bleibt sofort sichtbar)
  const sections = Array.from(document.querySelectorAll('section'));
  if (!sections.length) return;
  const hero = document.getElementById('home');

  // JS ist aktiv → Reveal-System scharf schalten
  document.body.classList.add('ns-ready');

  // Alle außer Hero als "pending" markieren (erst jetzt greift das CSS-Hide)
  sections.forEach(s => {
    if (s !== hero) s.classList.add('ns-pending');
  });

  const reveal = el => {
    el.classList.add('ns-in');
    el.classList.remove('ns-pending');
  };

  // Fallback ohne IntersectionObserver: alles sanft einblenden
  if (!('IntersectionObserver' in window)) {
    setTimeout(() => sections.forEach(s => s !== hero && reveal(s)), 150);
    return;
  }

  // Früh triggern → wirkt smooth
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        reveal(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px 28% 0px' });

  sections.forEach(s => { if (s !== hero) io.observe(s); });

  // Bereits sichtbare beim Laden sanft zeigen
  const vh = window.innerHeight || document.documentElement.clientHeight;
  sections.forEach(s => {
    if (s === hero) return;
    const r = s.getBoundingClientRect();
    if (r.top < vh * 0.92 && r.bottom > vh * 0.08) reveal(s);
  });
})();
