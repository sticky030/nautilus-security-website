// ================= Nautilus Security · app.js (nur Stabilität + Smooth Reveal) =================

// Jahr im Footer
(() => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();

// Mobile-Menü
(() => {
  const burger = document.getElementById("burger");
  const drawer = document.getElementById("mobileMenu");
  const overlay = document.getElementById("mobileOverlay");
  const closeBtn = document.getElementById("closeDrawer");
  const open = () => { drawer?.classList.remove("hidden"); overlay?.classList.remove("hidden"); };
  const close = () => { drawer?.classList.add("hidden"); overlay?.classList.add("hidden"); };
  burger?.addEventListener("click", open);
  overlay?.addEventListener("click", close);
  closeBtn?.addEventListener("click", close);
  document.querySelectorAll(".mobile-link").forEach(a => a.addEventListener("click", close));
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
    if (ticking) return; ticking = true;
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
})();

// FAQ Akkordeon
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

// Testimonials – 3/Seite (mobil 1), Endlos
(() => {
  const track = document.getElementById("tsTrack");
  if (!track) return;

  const DATA = [
    { q: "„Präsenz wie vereinbart, Berichte lückenlos. Übergaben funktionieren.“", a: "Objektleiter, Großbaustelle Berlin-City" },
    { q: "„Start binnen weniger Tage, sauber organisiert und dokumentiert.“", a: "Projektleiter, Bauherr Berlin" },
    { q: "„Ruhige Umsetzung, klare Eskalationen, kein Theater.“", a: "FM-Leitung, Gewerbepark" },
    { q: "„Revierfahrten mit GPS und Fotobelegen – auditfähig.“", a: "Sicherheitsbeauftragter, Industrie" },
    { q: "„Doorman dezent und verbindlich; Besucherprozesse liefen.“", a: "Center Manager, Office-Quartier" },
    { q: "„Event: Einlassfluss stabil, Backstage geschützt, Funkdisziplin top.“", a: "Veranstaltungsleitung, Messe" },
    { q: "„Nachtschicht störungsfrei; Hotspots konsequent angelaufen.“", a: "Bauüberwachung, Innenstadt" },
    { q: "„Schichtberichte präzise; Abweichungen mit Maßnahmen dokumentiert.“", a: "Technischer Leiter, Campus" },
    { q: "„Kommunikation schnell, höflich, erreichbar.“", a: "Hausverwaltung, Bestand" }
  ];

  track.innerHTML = "";
  const makeCard = (t) => {
    const el = document.createElement("article");
    el.className = "ts-card";
    el.innerHTML = `<p class="muted" style="font-style:italic">${t.q}</p><p style="color:#C79A3A;margin-top:8px;font-size:14px">— ${t.a}</p>`;
    return el;
  };
  const makePage = (slice) => {
    const page = document.createElement("div");
    page.className = "ts-page";
    slice.forEach(x => page.appendChild(makeCard(x)));
    return page;
  };

  const pages = [];
  for (let i = 0; i < DATA.length; i += 3) pages.push(makePage(DATA.slice(i, i + 3)));
  pages.forEach(p => track.appendChild(p));
  if (pages.length) track.appendChild(pages[0].cloneNode(true));

  let idx = 0, total = pages.length;
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
  track.addEventListener("mouseenter", () => clearInterval(timer));
  track.addEventListener("mouseleave", () => timer = setInterval(step, 5200));
})();

// ====================== SMOOTH SECTION REVEAL (JS-only, kollisionssicher) ======================
(() => {
  // keine Rücksicht auf "reduce motion" – du willst den Effekt immer sichtbar
  const hero = document.getElementById('home');
  const sections = Array.from(document.querySelectorAll('section'));
  if (!sections.length) return;

  // evtl. alte Reveal-Klassen neutralisieren
  const wipeClasses = (el) => {
    ['reveal','is-inview','ns-pending','ns-in','ns-reveal-show'].forEach(c => el.classList.remove(c));
  };
  sections.forEach(wipeClasses);

  // Ausgangszustand: nur inline, keine CSS-Abhängigkeit
  const init = (el) => {
    if (el === hero) return; // hero bleibt sofort sichtbar
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 520ms ease, transform 520ms ease';
    el.style.willChange = 'opacity, transform';
  };
  sections.forEach(init);

  // Fallback ohne IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    setTimeout(() => {
      sections.forEach(el => {
        if (el !== hero) {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      });
    }, 150);
    return;
  }

  // Observer – früh triggern
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        // sanft zeigen
        requestAnimationFrame(() => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
        io.unobserve(el);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px 28% 0px' });

  sections.forEach(el => { if (el !== hero) io.observe(el); });

  // Direkt beim Laden bereits sichtbare Sektionen ebenfalls smooth zeigen
  const vh = window.innerHeight || document.documentElement.clientHeight;
  setTimeout(() => {
    sections.forEach(el => {
      if (el === hero) return;
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > vh * 0.08) {
        el.style.opacity = '1';
        el.style.transform = 'none';
        io.unobserve(el);
      }
    });
  }, 120);
})();
