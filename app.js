/* Utilities */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* Year */
$("#year").textContent = new Date().getFullYear();

/* AOS init (optional, wir nutzen zusätzlich eigene Reveals) */
document.addEventListener("DOMContentLoaded", () => {
  if (window.AOS) AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });
});

/* Mobile Menü */
const burger = $("#burger");
const mobileMenu = $("#mobileMenu");
const mobileOverlay = $("#mobileOverlay");
if (burger) {
  burger.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
    mobileOverlay.classList.toggle("hidden");
  });
}
if (mobileOverlay) {
  mobileOverlay.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
    mobileOverlay.classList.add("hidden");
  });
}

/* Smooth Scroll (Nav & CTA) */
function scrollToId(id){
  const el = document.getElementById(id);
  if(!el) return;
  el.scrollIntoView({ behavior:"smooth", block:"start" });
  mobileMenu?.classList.add("hidden");
  mobileOverlay?.classList.add("hidden");
}
$$("[data-target]").forEach(btn=>{
  btn.addEventListener("click", ()=> scrollToId(btn.getAttribute("data-target")));
});

/* Cookie-Bar & CTA lift */
const cookieBar = $("#cookieBar");
const cookieOk = $("#cookieOk");
const stickyCta = $("#stickyCta");
const liftCTA = (lift) => {
  if(!stickyCta) return;
  stickyCta.classList.toggle("cta-lift", !!lift);
};
if (cookieOk) {
  cookieOk.addEventListener("click", ()=>{
    cookieBar.style.display = "none";
    liftCTA(false);
  });
}
/* initial: wenn Cookie-Bar sichtbar, CTA liften */
if (cookieBar && getComputedStyle(cookieBar).display !== "none") {
  liftCTA(true);
}

/* Active Nav / Scrollspy */
const sectionIds = ["home","about","services","why","values","team","jobs","faq","testimonials","contact"];
const navLinks = $$("#mainNav .nav-link");
const mobileLinks = $$("#mobileMenu .mobile-link");
const markActive = (id)=>{
  [...navLinks, ...mobileLinks].forEach(l=>{
    const match = l.getAttribute("data-target") === id;
    l.classList.toggle("text-yellow-500", match);
    l.classList.toggle("font-bold", match);
  });
};
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      markActive(entry.target.id);
    }
  });
},{ rootMargin:"-40% 0px -50% 0px", threshold:0.01 });
sectionIds.forEach(id=>{
  const el = document.getElementById(id);
  if(el) io.observe(el);
});

/* Reveal on scroll (smooth-in) */
const revealTargets = [
  ...$$(".section"),
  ...$$(".card"),
  ...$$(".faq-item"),
  $("#tsViewport")
].filter(Boolean);
// initial: alle als "reveal" markieren
revealTargets.forEach(el => el.classList.add("reveal"));
const revealIO = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
      revealIO.unobserve(entry.target); // einmalig animieren
    }
  });
},{ rootMargin:"-10% 0px -10% 0px", threshold:0.01 });
revealTargets.forEach(el => revealIO.observe(el));

/* FAQ Accordion (ein Panel offen) */
(function(){
  const items = Array.from(document.querySelectorAll('#faqList .faq-item'));
  if(!items.length) return;

  const setMaxH = (panel, open) => {
    if(open){
      panel.classList.add('open');
      panel.style.maxHeight = panel.scrollHeight + 'px';
    } else {
      panel.classList.remove('open');
      panel.style.maxHeight = '0px';
    }
  };

  items.forEach(it => {
    const btn = it.querySelector('.faq-toggle');
    const panel = it.querySelector('.faq-panel');
    setMaxH(panel, false);
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // close all
      items.forEach(other => {
        const b = other.querySelector('.faq-toggle');
        const p = other.querySelector('.faq-panel');
        b.setAttribute('aria-expanded','false');
        other.removeAttribute('aria-current');
        other.querySelector('.chev')?.classList.remove('rotate-180');
        setMaxH(p, false);
      });

      // open clicked (if it was closed)
      if(!isOpen){
        btn.setAttribute('aria-expanded','true');
        it.setAttribute('aria-current','open');
        it.querySelector('.chev')?.classList.add('rotate-180');
        setMaxH(panel, true);
      }
    });
  });
})();

/* Testimonials – 3er Carousel, auto alle 5s */
(function(){
  const viewport = $("#tsViewport");
  const track = $("#tsTrack");
  if(!viewport || !track) return;

  const groups = $$("#tsTrack .ts-group");
  let index = 0;
  const total = groups.length; // 3

  const applyTransform = () => {
    const offset = -(index % total) * 100; // 0, -100, -200
    track.style.transform = `translateX(${offset}%)`;
  };

  // Auto‑Rotate alle 5 Sekunden
  let timer = setInterval(()=>{ index++; applyTransform(); }, 5000);

  // Pause bei Hover (Desktop)
  viewport.addEventListener("mouseenter", ()=> clearInterval(timer));
  viewport.addEventListener("mouseleave", ()=>{
    clearInterval(timer);
    timer = setInterval(()=>{ index++; applyTransform(); }, 5000);
  });

  // Swipe (Mobile)
  let startX = null;
  viewport.addEventListener("touchstart",(e)=>{ startX = e.touches[0].clientX; }, {passive:true});
  viewport.addEventListener("touchmove",(e)=>{
    if(startX === null) return;
    const dx = e.touches[0].clientX - startX;
    if(Math.abs(dx) > 40){
      if(dx < 0) index++; else index--;
      applyTransform();
      startX = null;
    }
  }, {passive:true});

  // Initial
  applyTransform();
})();

/* Dark Toggle (optional) */
const darkToggle = $("#darkToggle");
if(darkToggle){
  let dark = true;
  darkToggle.addEventListener("click", ()=>{
    dark = !dark;
    document.body.classList.toggle("bg-white", !dark);
    document.body.classList.toggle("text-black", !dark);
    darkToggle.textContent = dark ? "🌙" : "☀️";
  });
}

/* Sticky CTA click scroll */
stickyCta?.addEventListener("click", ()=> scrollToId("contact"));
