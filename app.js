// AOS init
document.addEventListener("DOMContentLoaded", () => {
  AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });
});

// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Dark mode toggle
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
  if (s === "open") { mobileMenu.classList.remove("hidden"); mobileOverlay.classList.remove("hidden"); }
  else { mobileMenu.classList.add("hidden"); mobileOverlay.classList.add("hidden"); }
};
burger?.addEventListener("click", () => toggleMobile("open"));
mobileOverlay?.addEventListener("click", () => toggleMobile("close"));
document.querySelectorAll(".mobile-link, .nav-link, .cta-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const id = btn.getAttribute("data-target");
    if (id){
      document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
      toggleMobile("close");
    }
  });
});

// Scrollspy (aktiviert Gold-Linie)
const links = document.querySelectorAll(".nav-link");
const sections = ["home","about","services","why","values","team","jobs","faq","testimonials","contact"].map(id=>document.getElementById(id));
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if (entry.isIntersecting){
      const id = entry.target.id;
      links.forEach(l=>{
        const active = l.getAttribute("data-target")===id;
        l.classList.toggle("text-yellow-500", active);
        l.classList.toggle("font-bold", active);
        l.classList.toggle("nav-active", active);
      });
    }
  });
},{ rootMargin:"-40% 0px -55% 0px", threshold:0.01 });
sections.forEach(sec=>sec && observer.observe(sec));

// FAQ accordion
(function initFAQ(){
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
    q.addEventListener("click", ()=>{
      const open = item.classList.toggle("open");
      if (open){
        a.style.maxHeight = a.scrollHeight + "px";
        a.style.opacity = "1";
        q.setAttribute("aria-expanded","true");
        a.setAttribute("aria-hidden","false");
        a.addEventListener("transitionend", function onEnd(ev){
          if (ev.propertyName!=="max-height") return;
          a.style.maxHeight = "none";
          a.removeEventListener("transitionend", onEnd);
        });
      } else {
        const h = a.scrollHeight;
        a.style.maxHeight = h + "px";
        requestAnimationFrame(()=>{
          a.style.maxHeight = "0px";
          a.style.opacity = "0";
          q.setAttribute("aria-expanded","false");
          a.setAttribute("aria-hidden","true");
        });
      }
    });
  });
})();

// Testimonials Slider – immer 3 sichtbar (pro Seite), Auto-Wechsel
(function initTestimonials(){
  const track = document.getElementById("tsTrack");
  if (!track) return;

  const items = [
    { t:"Kurzfristig startklar, Übergaben sauber – Betrieb lief durch.", a:"Bauprojektleitung, Berlin" },
    { t:"Präsenz ruhig, Abläufe klar. Keine Reibung mit der Nachtlogistik.", a:"Logistikleitung, Potsdam" },
    { t:"Unauffällig am Gast, deutlich im Ergebnis. Zutritt & Backstage im Griff.", a:"Eventkoordination, Berlin" },
    { t:"Revierfahrten mit GPS, Meldungen mit Maßnahmen. So funktioniert Reporting.", a:"Immobilienverwaltung, Berlin" },
    { t:"Empfang professionell, Auftreten höflich und durchsetzungsfähig.", a:"Office Management, Charlottenburg" },
    { t:"Alarmfolge strukturiert, Kommunikation ruhig. Risiken sauber priorisiert.", a:"Facility Management, Berlin" },
    { t:"Aufbau, Briefing, Startabend – man merkt die Routine.", a:"Projektsteuerung, Brandenburg" },
    { t:"Dokumentation auditfähig. Übergaben nachvollziehbar.", a:"Geschäftsführung, Berlin" },
    { t:"Mehrsprachige Teams, klare Funkdisziplin. Gäste fühlten sich sicher.", a:"Veranstalter, Mitte" }
  ];

  // Seiten à 3 Items bauen
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

  // In Track einfügen + erste Seite klonen (für Loop)
  pages.forEach(p=>track.appendChild(p));
  if (pages.length > 0) track.appendChild(pages[0].cloneNode(true));

  // Slider Logik
  let idx = 0; 
  const total = pages.length;
  const duration = 5200; // ms
  const go = () => {
    idx++;
    track.style.transform = `translateX(-${idx*100}%)`;
    if (idx === total){
      setTimeout(()=>{
        track.style.transition = "none";
        track.style.transform = "translateX(0%)";
        idx = 0;
        void track.offsetWidth; // reflow
        track.style.transition = "transform 700ms ease-in-out";
      }, 720);
    }
  };
  track.style.transition = "transform 700ms ease-in-out";
  setInterval(go, duration);
})();

// Forms: Formspree optional, sonst Mailto-Fallback
const FORMSPREE_CONTACT = "";  // z.B. https://formspree.io/f/xxxxxx
const FORMSPREE_CAREER  = "";

function handleForm(formId, endpoint, subject){
  const form = document.getElementById(formId);
  const status = document.getElementById(formId === "contactForm" ? "contactStatus" : "careerStatus");
  if (!form) return;

  form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    if (status) { status.textContent = ""; status.style.color = ""; }

    // simple required check
    const requireds = form.querySelectorAll("[required]");
    for (const el of requireds){
      if (!el.value || !String(el.value).trim()){
        if (status){ status.textContent = "Bitte Pflichtfelder ausfüllen."; status.style.color = "#f87171"; }
        return;
      }
    }

    // Endpoint → Formspree
    if (endpoint){
      try{
        const fd = new FormData(form);
        const res = await fetch(endpoint, { method:"POST", body: fd, headers: { "Accept":"application/json" } });
        if (res.ok){
          if (status){ status.textContent = "Vielen Dank. Wir melden uns werktags zeitnah."; status.style.color = "#C79A3A"; }
          form.reset();
          return;
        }
        throw new Error("Fehler");
      }catch{
        if (status){ status.textContent = "Übermittlung fehlgeschlagen. Bitte per E-Mail senden."; status.style.color = "#f87171"; }
      }
    }

    // Fallback → Mailto
    const fd = new FormData(form);
    const kv = []; fd.forEach((v,k)=>{ if(String(v).trim()) kv.push(`${k}: ${v}`); });
    const body = encodeURIComponent(kv.join("\n"));
    location.href = `mailto:kontakt@nautilus-security.de?subject=${encodeURIComponent(subject)}&body=${body}`;
  });
}

handleForm("contactForm", FORMSPREE_CONTACT, "Kontaktanfrage – Nautilus Security");
handleForm("careerForm",  FORMSPREE_CAREER,  "Bewerbung – Nautilus Security");

// Sticky CTA: erst nach ~40% Scroll sichtbar
(function stickyCtaVisibility(){
  const cta = document.getElementById("stickyCta");
  if(!cta) return;
  const hero = document.getElementById("home");
  const showAfter = () => (hero ? hero.offsetHeight * 0.4 : window.innerHeight * 0.4);
  const hideBeforeBottomPx = 320;

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(()=>{
      const y = window.scrollY || window.pageYOffset;
      const docH = document.documentElement.scrollHeight;
      const vpH  = window.innerHeight;
      const fromBottom = docH - (y + vpH);
      const visible = y > showAfter() && fromBottom > hideBeforeBottomPx;
      cta.classList.toggle("is-visible", visible);
      ticking = false;
    });
  };
  window.addEventListener("scroll", onScroll, {passive:true});
  window.addEventListener("resize", onScroll);
  onScroll();

  cta.addEventListener("click", ()=>document.getElementById("contact")?.scrollIntoView({behavior:"smooth"}));
})();
// Scroll-Reveal (arbeitet mit .reveal)
(() => {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || !els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('is-inview'); io.unobserve(e.target); }});
  }, { threshold: 0.12, rootMargin: "60px" });
  els.forEach(el => io.observe(el));
})();

// Testimonials Auto-Rotate – Container benötigt Klasse .testimonials
(() => {
  const track = document.querySelector('.testimonials');
  if (!track) return;
  const cards = Array.from(track.children);
  if (cards.length <= 3) return; // keine Rotation nötig
  let groupSize = window.matchMedia('(min-width: 901px)').matches ? 3 : 1;
  let index = 0;
  const show = () => { cards.forEach((c, i) => c.style.display = (i >= index && i < index + groupSize) ? '' : 'none'); };
  const next = () => { index = (index + groupSize) % cards.length; show(); };
  show();
  let timer = setInterval(next, 6000);
  track.addEventListener('mouseenter', () => clearInterval(timer));
  track.addEventListener('mouseleave', () => timer = setInterval(next, 6000));
  window.addEventListener('resize', () => {
    const s = window.matchMedia('(min-width: 901px)').matches ? 3 : 1;
    if (s !== groupSize){ groupSize = s; index = 0; show(); }
  });
})();
