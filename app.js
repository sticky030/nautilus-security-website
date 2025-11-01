// © Nautilus Security – App JS (smooth reveal, mobile nav, faq, slider, sticky cta)

/* Jahr im Footer */
(() => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();

/* Mobile-Menü & Smooth-Scroll */
(() => {
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileOverlay = document.getElementById("mobileOverlay");
  const toggle = (open) => {
    if (!mobileMenu || !mobileOverlay) return;
    mobileMenu.classList.toggle("hidden", !open);
    mobileOverlay.classList.toggle("hidden", !open);
  };
  burger?.addEventListener("click", () => toggle(true));
  mobileOverlay?.addEventListener("click", () => toggle(false));

  document.querySelectorAll(".mobile-link, .nav-link, .cta-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-target");
      if (id) {
        const el = document.getElementById(id);
        if (id === "about") el?.classList.add("is-inview"); // sichtbar, wenn direkt angewählt
        el?.scrollIntoView({ behavior: "smooth" });
        toggle(false);
      }
    });
  });
})();

/* Scrollspy – aktiver Link */
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
        l.classList.toggle("nav-active", active);
        l.classList.toggle("text-yellow-500", active);
        l.classList.toggle("font-bold", active);
      });
    });
  }, { rootMargin: "-42% 0px -52% 0px", threshold: 0.01 });

  sections.forEach(sec => io.observe(sec));
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

/* Sticky CTA sichtbar machen */
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

  cta.addEventListener("click", () =>
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  );
})();

/* Smooth Reveal – robust & früh */
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
    threshold: 0.08,               // früh
    rootMargin: "0px 0px 28% 0px"  // +28% unten
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

  // Initial-Check (Reload mid-page)
  const vh = window.innerHeight || document.documentElement.clientHeight;
  normals.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < vh * 0.92 && r.bottom > vh * 0.08) el.classList.add("is-inview");
  });
})();

/* Form-Handler (mailto-Fallback; Formspree optional) */
(() => {
  const FORMSPREE_CONTACT = ""; // z.B. https://formspree.io/f/xxxxxx
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

      // Fallback: mailto
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
    { q: „Nachtschicht störungsfrei; Hotspots konsequent angelaufen.“", a: "Bauüberwachung, Innenstadt" },
    { q: "„Schichtberichte präzise; Abweichungen mit Maßnahmen dokumentiert.“", a: "Technischer Leiter, Campus" },
    { q: "„Kommunikation schnell, höflich, erreichbar.“", a: "Hausverwaltung, Bestand" },
    { q: "„Kosten planbar, Leistung konstant.“", a: "Betreiber, Logistikstandort" },
    { q: "„Kurzfristiger Ersatz pünktlich und eingearbeitet.“", a: "Objektleitung, Rechenzentrum" },
    { q: "„Auftreten diskret; Wirkung nach außen professionell.“", a: "Eigentümervertretung, Neubauprojekt" }
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
