// AOS init
document.addEventListener("DOMContentLoaded", () => {
  if (window.AOS) AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });
});

// Jahr im Footer
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});

// Smooth Scroll (Buttons)
function scrollToId(id){ const el = document.getElementById(id); if(el){ el.scrollIntoView({behavior:"smooth"}); } }

// Burger & Mobile-Navigation
document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("mobileOverlay");

  function closeMenu(){ menu.classList.add("hidden"); overlay.classList.add("hidden"); }
  function openMenu(){ menu.classList.remove("hidden"); overlay.classList.remove("hidden"); }

  burger && burger.addEventListener("click", () => menu.classList.contains("hidden") ? openMenu() : closeMenu());
  overlay && overlay.addEventListener("click", closeMenu);

  document.querySelectorAll(".mobile-link, .nav-link, .cta-btn").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      const target = e.currentTarget.getAttribute("data-target");
      if (target) { scrollToId(target); }
      closeMenu();
    });
  });
});

// Cookie-Bar + CTA-Lift
document.addEventListener("DOMContentLoaded", () => {
  const bar = document.getElementById("cookieBar");
  const ok = document.getElementById("cookieOk");
  const cta = document.getElementById("stickyCta");

  function hideBar(){
    if (bar) bar.style.display = "none";
    if (cta) cta.classList.remove("cta-lift");
  }
  function showBar(){
    if (bar) bar.style.display = "flex";
    if (cta) cta.classList.add("cta-lift");
  }

  // Einfache Persistenz
  if (localStorage.getItem("cookiesAccepted") === "1"){ hideBar(); }
  else { showBar(); }

  ok && ok.addEventListener("click", ()=>{
    localStorage.setItem("cookiesAccepted","1");
    hideBar();
  });

  // Sticky CTA scrollt zu Kontakt
  cta && cta.addEventListener("click", ()=> scrollToId("contact"));
});

// Scrollspy (aktiviert aktuelles Menü-Item)
document.addEventListener("DOMContentLoaded", () => {
  const links = Array.from(document.querySelectorAll("#mainNav .nav-link"));
  const sections = ["home","about","services","why","values","team","jobs","faq","testimonials","contact"]
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const byId = id => links.find(l => l.getAttribute("data-target") === id);

  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting){
        const id = entry.target.id;
        links.forEach(l => l.classList.remove("text-yellow-500","font-bold"));
        const active = byId(id);
        if (active){ active.classList.add("text-yellow-500","font-bold"); }
      }
    });
  }, { root:null, threshold:0.5 });

  sections.forEach(sec => obs.observe(sec));
});

// FAQ Accordion
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".faq-item .faq-q").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const item = btn.closest(".faq-item");
      item.classList.toggle("open");
    });
  });
});

// Testimonials Carousel – 3 gleichzeitig, Auto-Slide 5s, sanftes Schieben
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById('tsTrack');
  if (!track) return;

  const slides = Array.from(track.querySelectorAll('.ts-slide'));
  const dots = Array.from(document.querySelectorAll('.ts-dot'));
  const total = slides.length;
  let index = 0;
  let timer = null;

  function setActive(i){
    index = (i + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle('active', di === index));
  }
  function start(){ stop(); timer = setInterval(()=> setActive(index+1), 5000); }
  function stop(){ if (timer) clearInterval(timer); }

  setActive(0); start();

  track.addEventListener('mouseenter', stop);
  track.addEventListener('mouseleave', start);
  dots.forEach((dot, di)=> dot.addEventListener('click', ()=>{ setActive(di); start(); }));

  window.addEventListener('resize', ()=> setActive(index));
});
