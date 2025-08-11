// AOS init
document.addEventListener("DOMContentLoaded", () => {
  AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });
});

// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Dark mode toggle (optional: persist)
const darkToggle = document.getElementById("darkToggle");
darkToggle?.addEventListener("click", () => {
  const body = document.body;
  if (body.classList.contains("bg-[#0a0f1c]")) {
    body.classList.remove("bg-[#0a0f1c]", "text-white");
    body.classList.add("bg-white", "text-black");
  } else {
    body.classList.remove("bg-white", "text-black");
    body.classList.add("bg-[#0a0f1c]", "text-white");
  }
});

// Burger Menu
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");
const mobileOverlay = document.getElementById("mobileOverlay");
const toggleMobile = (s) => {
  if (s === "open") {
    mobileMenu.classList.remove("hidden");
    mobileOverlay.classList.remove("hidden");
  } else {
    mobileMenu.classList.add("hidden");
    mobileOverlay.classList.add("hidden");
  }
};
burger?.addEventListener("click", () => toggleMobile("open"));
mobileOverlay?.addEventListener("click", () => toggleMobile("close"));
document.querySelectorAll(".mobile-link, .nav-link, .cta-btn").forEach(btn=>{
  btn.addEventListener("click", (e)=>{
    const id = btn.getAttribute("data-target");
    if (id){
      document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
      toggleMobile("close");
    }
  });
});

// Cookiebar + CTA lift
const cookieBar = document.getElementById("cookieBar");
const cookieOk = document.getElementById("cookieOk");
const stickyCta = document.getElementById("stickyCta");
const liftCTA = () => {
  if (!cookieBar) return;
  const visible = window.getComputedStyle(cookieBar).display !== "none";
  if (visible) stickyCta?.classList.add("cta-lift");
  else stickyCta?.classList.remove("cta-lift");
};
cookieOk?.addEventListener("click", ()=>{
  cookieBar.style.display = "none";
  liftCTA();
});
liftCTA();

// Scrollspy
const links = document.querySelectorAll(".nav-link");
const sections = ["home","about","services","why","values","team","jobs","faq","testimonials","contact"].map(id=>document.getElementById(id));
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if (entry.isIntersecting){
      const id = entry.target.id;
      links.forEach(l=>{
        l.classList.toggle("text-yellow-500", l.getAttribute("data-target")===id);
        l.classList.toggle("font-bold", l.getAttribute("data-target")===id);
      });
    }
  });
},{ rootMargin:"-40% 0px -55% 0px", threshold:0.01 });
sections.forEach(sec=>sec && observer.observe(sec));

// FAQ smooth accordion (auto-upgrade markup, single-open, soft animation)
(function initFAQ(){
  const faqSection = document.getElementById("faq");
  if (!faqSection) return;

  // 1) Container finden: #faqList oder das ursprüngliche .space-y-6
  const container =
    faqSection.querySelector("#faqList") ||
    faqSection.querySelector(".space-y-6") ||
    faqSection;

  // 2) Items ermitteln (direkte Kinder-DIVs sind dein altes Muster)
  const rawItems = Array.from(container.children).filter(el => el.tagName === "DIV");

  rawItems.forEach(item => {
    // Wenn bereits aufgerüstet, weiter
    if (item.classList.contains("faq-item")) return;

    // Heading (h1–h4) + Antwort (p oder div) finden
    const heading = item.querySelector("h1, h2, h3, h4");
    const answer  = item.querySelector("p, div:not(:has(h1,h2,h3,h4))");

    if (!heading || !answer) return;

    // Button aus der Überschrift bauen
    const btn = document.createElement("button");
    btn.className = "faq-q w-full text-left font-semibold text-white";
    btn.innerHTML = heading.innerHTML;
    heading.replaceWith(btn);

    // Antwort-Wrapper
    const ansWrap = document.createElement("div");
    ansWrap.className = "faq-a text-gray-300";
    ansWrap.innerHTML = answer.outerHTML;
    answer.remove();

    // Klassen & Struktur setzen
    item.classList.add("faq-item", "border", "border-gray-700", "rounded-md", "p-4", "bg-[#0f1627]");
    item.appendChild(ansWrap);
  });

  // 3) Jetzt alle FAQ-Items selektieren (egal ob neu oder schon vorhanden)
  const items = faqSection.querySelectorAll("#faqList .faq-item, .space-y-6 .faq-item, .faq-item");
  if (!items.length) return;

  // 4) Startzustand + weiche Transition setzen
  items.forEach(item => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    if (!q || !a) return;

    a.style.overflow = "hidden";
    a.style.maxHeight = "0px";
    a.style.opacity   = "0";
    a.style.transition = "max-height 320ms ease, opacity 220ms ease";
    q.setAttribute("aria-expanded", "false");
    a.setAttribute("aria-hidden", "true");

    // Klick-Handler
    q.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Single-open: alle anderen schließen
      items.forEach(other => {
        if (other === item) return;
        other.classList.remove("open");
        const oa = other.querySelector(".faq-a");
        const oq = other.querySelector(".faq-q");
        if (oa) {
          oa.style.maxHeight = "0px";
          oa.style.opacity = "0";
          oa.setAttribute("aria-hidden", "true");
        }
        oq?.setAttribute("aria-expanded", "false");
      });

      // aktuelles toggeln
      if (!isOpen) {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
        a.style.opacity = "1";
        a.setAttribute("aria-hidden", "false");
        q.setAttribute("aria-expanded", "true");
      } else {
        item.classList.remove("open");
        a.style.maxHeight = "0px";
        a.style.opacity = "0";
        a.setAttribute("aria-hidden", "true");
        q.setAttribute("aria-expanded", "false");
      }
    });
  });

  // 5) Falls beim Laden schon .open gesetzt ist → korrekt ausklappen
  faqSection.querySelectorAll(".faq-item.open .faq-a").forEach(a => {
    a.style.maxHeight = a.scrollHeight + "px";
    a.style.opacity = "1";
    a.setAttribute("aria-hidden", "false");
    a.parentElement.querySelector(".faq-q")?.setAttribute("aria-expanded", "true");
  });
})();
// Testimonials: 3-at-a-time slider with smooth slide every 5s
(function initTestimonials(){
  const track = document.getElementById("tsTrack");
  if (!track) return;

  // Original testimonials (texts + authors) – stabil & deutsch, nicht alle mit "M."
  const items = [
    { t:"Diskret, pünktlich und lösungsorientiert. Unsere Nachtlogistik läuft ohne Zwischenfälle.", a:"R. Stein, Logistikleiter" },
    { t:"Kurzfristig Personal gestellt und direkt Struktur reingebracht. Top Koordination.", a:"C. Werner, Bauprojektleitung" },
    { t:"Unauffällig, aber präsent. Gäste fühlten sich sicher, Abläufe blieben entspannt.", a:"M. Aziz, Veranstalter" },
    { t:"Transparente Kommunikation und digitale Übergaben – so muss es sein.", a:"T. Reuter, Facility Manager" },
    { t:"Verlässliche Revierfahrten. Vorkommnisse sauber dokumentiert.", a:"L. Lenz, Immobilienverwaltung" },
    { t:"Auch am Wochenende schnell reagiert. Professionelles Auftreten am Empfang.", a:"S. Hahn, Office Management" },
    { t:"Diebstähle auf der Baustelle aufgehört. Präsenz tadellos.", a:"D. Ulrich, Bauherr" },
    { t:"Mehrsprachige Teams waren für unser Event Gold wert.", a:"A. Pereira, Eventkoordination" },
    { t:"Schnell, ruhig, professionell. Genau so stellt man sich Sicherheit vor.", a:"L. Berger, Hoteldirektion" }
  ];

  // Build pages (3 per page)
  const pages = [];
  for (let i=0;i<items.length;i+=3){
    const page = document.createElement("div");
    page.className = "ts-page";
    items.slice(i,i+3).forEach(x=>{
      const art = document.createElement("article");
      art.className = "ts-card";
      art.innerHTML = `<p class="text-gray-300 italic">„${x.t}“</p><p class="text-yellow-500 font-bold mt-3">– ${x.a}</p>`;
      page.appendChild(art);
    });
    pages.push(page);
  }
  // Looping: clone first page to tail for smooth wrap
  pages.forEach(p=>track.appendChild(p));
  track.appendChild(pages[0].cloneNode(true));

  let idx = 0;
  const total = pages.length;
  const go = () => {
    idx++;
    track.style.transform = `translateX(-${idx*100}%)`;
    if (idx === total){
      // after animation end, jump back to 0 without flicker
      setTimeout(()=>{
        track.style.transition = "none";
        track.style.transform = "translateX(0%)";
        idx = 0;
        // force reflow then restore transition
        void track.offsetWidth;
        track.style.transition = "transform 700ms ease-in-out";
      }, 720);
    }
  };
  // Initial CSS transition
  track.style.transition = "transform 700ms ease-in-out";
  // Auto-advance every 5s
  setInterval(go, 5000);
})();

// Sticky CTA scroll to contact
stickyCta?.addEventListener("click", ()=>document.getElementById("contact")?.scrollIntoView({behavior:"smooth"}));
