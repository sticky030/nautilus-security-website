// ---- EmailJS CONFIG ----
const EMAILJS_SERVICE_ID = "service_1c36sq9";
const EMAILJS_TEMPLATE_ID_CONTACT = "template_pq8cblr";
const EMAILJS_TEMPLATE_ID_CAREER = "template_s0e55ms";
const EMAILJS_PUBLIC_KEY = "7Cbu70svtmAc7qdHx";
// ------------------------

document.addEventListener('DOMContentLoaded', () => {
  if (window.AOS) AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });
  const $ = (s)=>document.querySelector(s); const $$=(s)=>Array.from(document.querySelectorAll(s));

  // Year
  $('#year').textContent = new Date().getFullYear();

  // Cookie bar & CTA lift
  const cookieBar = $('#cookieBar'); const cookieOk = $('#cookieOk'); const stickyCta = $('#stickyCta');
  function updateCtaLift(){ const vis = cookieBar && cookieBar.style.display !== 'none'; stickyCta.classList.toggle('cta-lift', vis); }
  cookieOk.addEventListener('click', ()=>{ cookieBar.style.display='none'; updateCtaLift(); });
  updateCtaLift();

  // Dark mode toggle
  const body = document.body; const header = document.getElementById('site-header');
  let dark = true;
  document.getElementById('darkToggle').addEventListener('click', ()=>{
    dark = !dark;
    if (dark) { body.classList.remove('bg-white','text-black'); body.classList.add('bg-[#0a0f1c]','text-white');
      header.classList.add('border-yellow-500','bg-[#0a0f1c]'); header.classList.remove('border-black','bg-white'); }
    else { body.classList.remove('bg-[#0a0f1c]','text-white'); body.classList.add('bg-white','text-black');
      header.classList.remove('border-yellow-500','bg-[#0a0f1c]'); header.classList.add('border-black','bg-white'); }
  });

  // Navigation + mobile menu
  function scrollToId(id){ const el=document.getElementById(id); if (el) el.scrollIntoView({behavior:'smooth'}); }
  $$('#mainNav .nav-link').forEach(b=>b.addEventListener('click', ()=>scrollToId(b.dataset.target)));
  const burger = $('#burger'); const mobileMenu = $('#mobileMenu'); const mobileOverlay = $('#mobileOverlay');
  const openMobile=()=>{ mobileMenu.classList.remove('hidden'); mobileOverlay.classList.remove('hidden'); };
  const closeMobile=()=>{ mobileMenu.classList.add('hidden'); mobileOverlay.classList.add('hidden'); };
  burger.addEventListener('click', ()=> mobileMenu.classList.contains('hidden') ? openMobile() : closeMobile());
  mobileOverlay.addEventListener('click', closeMobile);
  $$('.mobile-link').forEach(b=>b.addEventListener('click', ()=>{ scrollToId(b.dataset.target); closeMobile(); }));
  $('#stickyCta').addEventListener('click', ()=>scrollToId('contact'));
  $$('.cta-btn').forEach(b=>b.addEventListener('click', ()=>scrollToId('contact')));

  // Scrollspy via IntersectionObserver (präzise)
  const ids = ['home','about','services','why','values','team','jobs','career-form','faq','testimonials','contact'];
  const navLinks = Array.from(document.querySelectorAll('#mainNav .nav-link'));

  const io = new IntersectionObserver((entries) => {
    const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) {
      const id = visible.target.id;
      navLinks.forEach(b => {
        const active = b.dataset.target === id;
        b.classList.toggle('text-yellow-500', active);
        b.classList.toggle('font-bold', active);
      });
    }
  }, { root: null, threshold: [0.25, 0.5, 0.8], rootMargin: "-10% 0px -35% 0px" });

  ids.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });

  // Testimonials Carousel (3 sichtbar, 9 total) + Swipe
  const tsTrack = document.getElementById('tsTrack');
  const tsCards = tsTrack ? Array.from(tsTrack.querySelectorAll('.ts-card')) : [];
  let tsIndex = 0;
  function renderTs(){
    tsCards.forEach((c,i)=>{ c.style.display = (i>=tsIndex && i<tsIndex+3) ? '' : 'none'; });
  }
  function tsNext(){ tsIndex = (tsIndex + 3) % tsCards.length; renderTs(); }
  function tsPrev(){ tsIndex = (tsIndex - 3 + tsCards.length) % tsCards.length; renderTs(); }
  const btnNext = document.getElementById('tsNext');
  const btnPrev = document.getElementById('tsPrev');
  if (btnNext) btnNext.addEventListener('click', tsNext);
  if (btnPrev) btnPrev.addEventListener('click', tsPrev);
  let startX=0;
  if (tsTrack) {
    tsTrack.addEventListener('touchstart', e=>{ startX = e.changedTouches[0].clientX; }, {passive:true});
    tsTrack.addEventListener('touchend', e=>{ const dx = e.changedTouches[0].clientX - startX; if (Math.abs(dx)>50){ dx<0?tsNext():tsPrev(); } }, {passive:true});
  }
  renderTs();

  // EmailJS init
  function initEmailJS(){ if(window.emailjs) emailjs.init(EMAILJS_PUBLIC_KEY); }
  initEmailJS();

  // Contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) contactForm.addEventListener('submit', async (e) => {
    e.preventDefault(); initEmailJS();
    const status = document.getElementById('contactStatus'); status.textContent = 'Sende…';
    const fd = new FormData(contactForm);
    const params = { name: fd.get('name'), email: fd.get('email'), message: fd.get('message') };
    try { await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_CONTACT, params); status.textContent='Danke! Ihre Nachricht wurde gesendet.'; contactForm.reset(); }
    catch (err) { console.error(err); status.textContent='Fehler beim Senden. Bitte später erneut versuchen.'; }
  });

  // Career form (optional CV)
  const careerForm = document.getElementById('careerForm');
  if (careerForm) careerForm.addEventListener('submit', async (e) => {
    e.preventDefault(); initEmailJS();
    const status = document.getElementById('careerStatus'); status.textContent = 'Sende…';
    const fd = new FormData(careerForm);
    const fileInput = document.getElementById('cvFile');
    let attachmentBase64=''; let filename='';
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const f = fileInput.files[0]; filename = f.name;
      if (f.size > 5*1024*1024) { status.textContent='Datei zu groß (max. 5 MB).'; return; }
      attachmentBase64 = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result.split(',')[1]);
        r.onerror = reject;
        r.readAsDataURL(f);
      });
    }
    const params = { name: fd.get('name'), email: fd.get('email'), phone: fd.get('phone')||'-', position: fd.get('position'), message: fd.get('message')||'-', attachment: attachmentBase64, attachment_filename: filename };
    try { await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_CAREER, params); status.textContent='Danke! Ihre Bewerbung wurde gesendet.'; careerForm.reset(); if (fileInput) fileInput.value=''; }
    catch (err) { console.error(err); status.textContent='Fehler beim Senden. Bitte später erneut versuchen.'; }
  });
});
