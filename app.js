// AOS init
document.addEventListener('DOMContentLoaded', () => {
  if (window.AOS) AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });
});

// Jahr im Footer
document.getElementById('year').textContent = new Date().getFullYear();

// Burger Menü
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');
if (burger) {
  burger.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    mobileOverlay.classList.toggle('hidden');
  });
}
if (mobileOverlay) {
  mobileOverlay.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    mobileOverlay.classList.add('hidden');
  });
}
// Mobile Nav click scroll
document.querySelectorAll('.mobile-link, .nav-link, .cta-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-target');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    mobileMenu?.classList.add('hidden');
    mobileOverlay?.classList.add('hidden');
  });
});

// Cookie-Bar
const cookieBar = document.getElementById('cookieBar');
const cookieOk = document.getElementById('cookieOk');
if (cookieOk) {
  cookieOk.addEventListener('click', () => {
    cookieBar.style.display = 'none';
  });
}

// Sticky CTA klick → Kontakt
const stickyCta = document.getElementById('stickyCta');
if (stickyCta) {
  stickyCta.addEventListener('click', () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
}

// Scrollspy (Navigation hervorheben)
const sectionIds = ['home','about','services','why','values','team','jobs','faq','testimonials','contact'];
const navButtons = [...document.querySelectorAll('#mainNav .nav-link')];
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navButtons.forEach(b => {
        if (b.getAttribute('data-target') === id) {
          b.classList.add('text-yellow-500','font-bold');
        } else {
          b.classList.remove('text-yellow-500','font-bold');
        }
      });
    }
  });
}, { root: null, rootMargin: '0px 0px -70% 0px', threshold: 0.1 });
sectionIds.forEach(id => {
  const el = document.getElementById(id);
  if (el) io.observe(el);
});

// FAQ Accordion – smooth & voll sichtbar
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    // close all
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      const openA = openItem.querySelector('.faq-a');
      if (openA) { openA.style.maxHeight = '0px'; }
    });
    if (!isOpen) {
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px'; // volle Höhe
    }
  });
  // initial height
  a.style.maxHeight = '0px';
});

// Testimonials – 9 Karten, immer 3 anzeigen, alle 5s smooth wechseln
(function(){
  const track = document.getElementById('tsTrack');
  if (!track) return;
  const cards = [...track.querySelectorAll('.ts-card')];
  let index = 0;
  const show = () => {
    // alle ausblenden
    cards.forEach(c => c.classList.remove('ts-show','ts-fade'));
    // drei aktuelle holen
    const visible = [
      cards[index % cards.length],
      cards[(index+1) % cards.length],
      cards[(index+2) % cards.length]
    ];
    // Track leeren & wieder füllen (weicher durch CSS Fade)
    track.innerHTML = '';
    visible.forEach(c => {
      const clone = c.cloneNode(true);
      clone.classList.add('ts-fade');
      track.appendChild(clone);
      // Force reflow, dann sichtbarkeit
      requestAnimationFrame(() => clone.classList.add('ts-show'));
    });
    index = (index + 3) % cards.length;
  };
  show();
  setInterval(show, 5000);
})();

// Career Button → Online Bewerbung Section
document.querySelectorAll('button[data-target="career-form"]').forEach(btn => {
  btn.addEventListener('click', () => {
    const el = document.getElementById('career-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
});
