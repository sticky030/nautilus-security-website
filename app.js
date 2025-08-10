/* =========================
   Nautilus Security – App
   ========================= */

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scroll for nav + buttons
function smoothTo(id){
  const el = document.getElementById(id);
  if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
}
document.querySelectorAll('[data-target]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const id = btn.getAttribute('data-target');
    smoothTo(id);
    // close mobile menu if open
    mobileMenu.classList.add('hidden');
  });
});

// Mobile menu
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
if(burger){
  burger.addEventListener('click', ()=> mobileMenu.classList.toggle('hidden'));
}

// Cookie bar
const cookieBar = document.getElementById('cookieBar');
const cookieOk  = document.getElementById('cookieOk');
if(localStorage.getItem('cookie-ok')==='1'){ cookieBar.style.display='none'; }
cookieOk?.addEventListener('click', ()=>{
  localStorage.setItem('cookie-ok','1');
  cookieBar.style.display='none';
});

// Active nav highlight (IntersectionObserver)
const sections = ['home','about','services','why','values','team','jobs','faq','testimonials','contact']
  .map(id => document.getElementById(id))
  .filter(Boolean);
const navLinks = Array.from(document.querySelectorAll('#mainNav .nav-link'));
const linkById = Object.fromEntries(navLinks.map(l=>[l.dataset.target,l]));

const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const id = e.target.id;
      navLinks.forEach(a=>a.classList.remove('active'));
      linkById[id]?.classList.add('active');
    }
  });
},{ rootMargin: "-45% 0px -45% 0px", threshold: 0.01 });
sections.forEach(s=>io.observe(s));

// =========================
// Testimonials – Auto Slider (3 at a time)
// =========================
const testimonials = [
  {q:'Diskret, pünktlich und lösungsorientiert. Unsere Nachtlogistik läuft seitdem ohne Zwischenfälle.', a:'R. Stein, Logistikleiter'},
  {q:'Kurzfristig Personal gestellt und sofort Struktur gebracht. Top Koordination.', a:'C. Werner, Bauprojektleitung'},
  {q:'Angenehm unauffällig, aber präsent. Gäste fühlten sich sicher, Abläufe entspannt.', a:'M. Aziz, Veranstalter'},
  {q:'Transparente Kommunikation und digitale Übergaben – so muss es sein.', a:'M. Reuter, Facility Manager'},
  {q:'Verlässliche Revierfahrten, sauber dokumentiert und zeitnah gemeldet.', a:'S. Lenz, Immobilienverwaltung'},
  {q:'Auch am Wochenende schnell reagiert. Sehr kundenorientiert.', a:'H. Hahn, Office Management'},
  {q:'Diebstähle auf der Baustelle beendet. Starke Präsenz & Abstimmung.', a:'T. Ulrich, Bauherr'},
  {q:'Mehrsprachige Teams waren für unser internationales Event Gold wert.', a:'A. Pereira, Eventkoordination'},
  {q:'Schnell, ruhig, professionell – genau der Dienst, den man selten findet.', a:'L. Berger, Hoteldirektion'}
];

// Build slides (each slide contains 3 cards)
const chunkSize = 3;
const slides = [];
for (let i=0; i<testimonials.length; i+=chunkSize){
  slides.push(testimonials.slice(i, i+chunkSize));
}
const tsTrack = document.getElementById('tsTrack');
function renderSlides(){
  tsTrack.innerHTML = slides.map(group=>{
    const cards = group.map(t=>`
      <article class="ts-card">
        <p>„${t.q}“</p>
        <span>– ${t.a}</span>
      </article>
    `).join('');
    return `<div class="slide grid md:grid-cols-3 gap-6">${cards}</div>`;
  }).join('');
}
renderSlides();

// Sliding logic
let idx = 0;
const viewport = document.getElementById('tsViewport');
function go(n){
  idx = (n + slides.length) % slides.length;
  tsTrack.style.transform = `translateX(-${idx*100}%)`;
}
let timer = setInterval(()=>go(idx+1), 5000);
viewport.addEventListener('mouseenter', ()=> clearInterval(timer));
viewport.addEventListener('mouseleave', ()=> timer = setInterval(()=>go(idx+1), 5000));

// =========================
// Forms (Demo-Hooks)
// =========================
const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contactStatus');
contactForm?.addEventListener('submit', (e)=>{
  e.preventDefault();
  contactStatus.textContent = 'Danke! Wir melden uns kurzfristig.';
  contactForm.reset();
});

const careerForm = document.getElementById('careerForm');
const careerStatus = document.getElementById('careerStatus');
careerForm?.addEventListener('submit', (e)=>{
  e.preventDefault();
  careerStatus.textContent = 'Bewerbung gesendet. Wir melden uns.';
  careerForm.reset();
});
