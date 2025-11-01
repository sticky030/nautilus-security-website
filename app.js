// © Nautilus Security – stabil, ohne Reveal/Experimente

/* Jahr im Footer */
(() => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();

/* Mobile-Menü */
(() => {
  const burger = document.getElementById("burger");
  const drawer = document.getElementById("mobileMenu");
  const overlay = document.getElementById("mobileOverlay");
  const closeBtn = document.getElementById("closeDrawer");
  const open = () => { drawer.classList.remove("hidden"); overlay.classList.remove("hidden"); };
  const close = () => { drawer.classList.add("hidden"); overlay.classList.add("hidden"); };
  burger?.addEventListener("click", open);
  overlay?.addEventListener("click", close);
  closeBtn?.addEventListener("click", close);
  document.querySelectorAll(".mobile-link").forEach(a => a.addEventListener("click", close));
})();

/* Sticky CTA */
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

/* FAQ Akkordeon */
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

/* Forms – mailto-Fallback (keine externen Endpoints nötig) */
(() => {
  function handleForm(formId, subject, statusId){
    const form = document.getElementById(formId);
    const status = statusId ? document.getElementById(statusId) : null;
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (status) { status.textContent = ""; status.style.color = ""; }
      const requireds = form.querySelectorAll("[required]");
      for (const el of requireds) {
        if (!el.value || !String(el.value).trim()) {
          if (status) { status.textContent = "Bitte Pflichtfelder ausfüllen."; status.style.color = "#f87171"; }
          return;
        }
      }
      const fd = new FormData(form);
      const kv = [];
      fd.forEach((v, k) => { if (String(v).trim()) kv.push(`${k}: ${v}`); });
      const body = encodeURIComponent(kv.join("\n"));
      location.href = `mailto:kontakt@nautilus-security.de?subject=${encodeURIComponent(subject)}&body=${body}`;
    });
  }
  handleForm("contactForm", "Kontaktanfrage – Nautilus Security", "contactStatus");
  handleForm("careerForm",  "Bewerbung – Nautilus Security",      "careerStatus");
})();

/* Testimonials – 3 pro Seite (mobil 1), Endlos-Slider */
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
    { q: "„Kommunikation schnell, höflich, erreichbar.“", a: "Hausverwaltung, Bestand" }
  ];

  // Build pages (3 per page)
  track.innerHTML = "";
  const makeCard = (t) => {
    const art = document.createElement("article");
    art.className = "ts-card";
    art.innerHTML = `<p class="muted" style="font-style:italic">${t.q}</p><p style="color:#C79A3A;margin-top:8px;font-size:14px">— ${t.a}</p>`;
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
  if (pages.length) track.appendChild(pages[0].cloneNode(true)); // loop clone

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
        void track.offsetWidth; // reflow
        track.style.transition = "transform 700ms ease-in-out";
      }, 740);
    }
  };

  let timer = setInterval(step, 5200);
  track.addEventListener("mouseenter", () => { clearInterval(timer); });
  track.addEventListener("mouseleave", () => { timer = setInterval(step, 5200); });
})();

/* Sanfter Scroll für interne Links (Basis) */
(() => {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth" });
    });
  });
})();
