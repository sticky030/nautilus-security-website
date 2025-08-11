document.addEventListener("DOMContentLoaded", () => {
  // Jahr im Footer
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Smooth Scroll (Desktop + Mobile Links)
  function scrollToId(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - 72; // Header-Höhe
    window.scrollTo({ top, behavior: "smooth" });
  }
  document.querySelectorAll("[data-target]").forEach(btn => {
    btn.addEventListener("click", e => {
      const target = e.currentTarget.getAttribute("data-target");
      if (target) {
        scrollToId(target);
        // mobile close
        mobileMenu.classList.add("hidden");
        mobileOverlay.classList.add("hidden");
      }
    });
  });

  // Mobile Menu
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileOverlay = document.getElementById("mobileOverlay");
  burger && burger.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
    mobileOverlay.classList.toggle("hidden");
  });
  mobileOverlay && mobileOverlay.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
    mobileOverlay.classList.add("hidden");
  });

  // Cookie-Bar → Button schiebt Sticky-CTA hoch
  const cookieBar = document.getElementById("cookieBar");
  const cookieOk = document.getElementById("cookieOk");
  const stickyCta = document.getElementById("stickyCta");
  if (cookieOk && cookieBar) {
    cookieOk.addEventListener("click", () => {
      cookieBar.remove();
      stickyCta && stickyCta.classList.remove("cta-lift");
    });
    // Solange Cookie-Bar sichtbar ist, Sticky-CTA etwas höher
    stickyCta && stickyCta.classList.add("cta-lift");
  }

  // Active-Nav beim Scrollen
  const links = document.querySelectorAll(".nav-link");
  const sections = ["home","about","services","why","values","team","jobs","faq","testimonials","contact"];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => {
          l.classList.toggle("text-yellow-500", l.getAttribute("data-target") === id);
          l.classList.toggle("font-bold",       l.getAttribute("data-target") === id);
        });
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 });
  sections.forEach(s => {
    const sec = document.getElementById(s);
    if (sec) observer.observe(sec);
  });

  // FAQ – ganzer Eintrag klickbar (nicht nur Pfeil)
  document.querySelectorAll("#faqList .faq-item").forEach(item => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    if (!q || !a) return;

    const toggle = () => {
      const open = item.classList.contains("open");
      // Single-open: erst alle schließen
      document.querySelectorAll("#faqList .faq-item.open").forEach(it => {
        if (it !== item) {
          it.classList.remove("open");
          const ta = it.querySelector(".faq-a");
          if (ta) {
            ta.style.maxHeight = "0px";
            ta.style.opacity = "0";
          }
        }
      });

      if (!open) {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
        a.style.opacity = "1";
      } else {
        item.classList.remove("open");
        a.style.maxHeight = "0px";
        a.style.opacity = "0";
      }
    };

    // Karte komplett klickbar
    item.addEventListener("click", (e) => {
      // Verhindert doppeltes Triggern, falls Links o.ä. inhaltlich vorhanden sind
      if (e.target.closest(".faq-q") || e.target.closest(".faq-a")) {
        toggle();
      } else {
        toggle();
      }
    });

    // Startzustand
    a.style.transition = "max-height 260ms ease, opacity 220ms ease";
    a.style.maxHeight = "0px";
    a.style.opacity = "0";
  });

  // Testimonials – 3 gleichzeitig, alle 5s Weiter, weiche Animation
  (function initTestimonials(){
    const track = document.getElementById("tsTrack");
    if (!track) return;

    const items = [
      {t:"Diskret, pünktlich und lösungsorientiert. Unsere Nachtlogistik läuft seitdem ohne Zwischenfälle.", a:"R. Stein, Logistikleiter"},
      {t:"Kurzfristig Personal gestellt und direkt Struktur reingebracht. Top Koordination.", a:"C. Werner, Bauprojektleitung"},
      {t:"Angenehm unauffällig, aber präsent. Gäste fühlten sich sicher, Abläufe blieben entspannt.", a:"M. Aziz, Veranstalter"},
      {t:"Transparente Kommunikation, digitale Übergaben, keine leeren Versprechen – so muss es sein.", a:"M. Reuter, Facility Manager"},
      {t:"Endlich verlässliche Revierfahrten. Vorkommnisse sauber dokumentiert und zeitnah gemeldet.", a:"M. Lenz, Immobilienverwaltung"},
      {t:"Auch an Wochenenden schnell reagiert. Professionelles Auftreten am Empfang, sehr kundenorientiert.", a:"M. Hahn, Office Management"},
      {t:"Diebstähle auf der Baustelle aufgehört. Präsenz und Abstimmung mit der Polizei tadellos.", a:"M. Ulrich, Bauherr"},
      {t:"Mehrsprachige Teams waren für unser internationales Event Gold wert.", a:"M. Pereira, Eventkoordination"},
      {t:"Schnell, ruhig, professionell. Genau die Art Sicherheitsdienst, die man selten findet.", a:"L. Berger, Hoteldirektion"}
    ];

    let idx = 0;
    function render() {
      const three = [ items[idx % items.length], items[(idx+1) % items.length], items[(idx+2) % items.length] ];
      track.style.opacity = "0";
      setTimeout(() => {
        track.innerHTML = three.map(it => `
          <article class="bg-[#1f2937] p-6 rounded-lg shadow-md">
            <p class="text-gray-300 italic">„${it.t}“</p>
            <p class="text-yellow-500 font-bold mt-3">– ${it.a}</p>
          </article>
        `).join("");
        track.style.opacity = "1";
      }, 200);
      idx = (idx + 3) % items.length;
    }

    render();
    setInterval(render, 5000);
  })();
});
