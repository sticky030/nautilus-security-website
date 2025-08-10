// Navigation: smooth scroll + scrollspy
(function(){
  const navLinks = document.querySelectorAll('#mainNav .nav-link, #mobileMenu .mobile-link, .cta-btn');
  const stickyCta = document.getElementById('stickyCta');
  const cookieBar = document.getElementById('cookieBar');
  const header = document.getElementById('site-header');
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');

  function closeMobile(){ mobileMenu.classList.add('hidden'); mobileOverlay.classList.add('hidden'); }
  function openMobile(){ mobileMenu.classList.remove('hidden'); mobileOverlay.classList.remove('hidden'); }
  burger && burger.addEventListener('click', () => {
    if(mobileMenu.classList.contains('hidden')) openMobile(); else closeMobile();
  });
  mobileOverlay && mobileOverlay.addEventListener('click', closeMobile);

  navLinks.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-target');
      const el = document.getElementById(id);
      if(el){
        e.preventDefault();
        el.scrollIntoView({behavior:'smooth', block:'start'});
        closeMobile();
      }
    });
  });

  // Scrollspy via IntersectionObserver
  const sections = ['home','about','services','why','values','team','jobs','career-form','faq','testimonials','contact']
    .map(id => document.getElementById(id)).filter(Boolean);
  const navButtons = document.querySelectorAll('#mainNav .nav-link');
  const map = {}; navButtons.forEach(b => map[b.getAttribute('data-target')] = b);
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const id = entry.target.id;
        navButtons.forEach(b => b.classList.remove('text-yellow-500','font-bold'));
        if(map[id]){ map[id].classList.add('text-yellow-500','font-bold'); }
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });
  sections.forEach(s => obs.observe(s));

  // Cookie bar accept
  const cookieOk = document.getElementById('cookieOk');
  if(cookieOk && cookieBar){
    cookieOk.addEventListener('click', ()=> cookieBar.remove());
  }

  // Testimonials slider (3 per page) – auto every 5s + smooth slide
  const strip = document.getElementById('tsStrip');
  const prev = document.getElementById('tsPrev');
  const next = document.getElementById('tsNext');
  let page = 0, pages = 3, timer;
  function goTo(p){
    page = (p + pages) % pages;
    strip.style.transform = `translateX(-${page*100}%)`;
  }
  function auto(){ timer = setInterval(()=> goTo(page+1), 5000); }
  function resetAuto(){ clearInterval(timer); auto(); }
  prev && prev.addEventListener('click', ()=>{ goTo(page-1); resetAuto(); });
  next && next.addEventListener('click', ()=>{ goTo(page+1); resetAuto(); });
  auto();

  // AOS init
  if(window.AOS){ AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' }); }

  // Year
  const y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();
})();