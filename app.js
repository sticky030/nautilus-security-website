// Jahr im Footer
document.getElementById('year').textContent = new Date().getFullYear();

// Burger-Menü
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger?.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// Smooth Scroll für alle Nav-Buttons (Header + Mobile + CTAs)
document.querySelectorAll('[data-target]').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-target');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      mobileMenu?.classList.add('hidden');
    }
  });
});

// ---------- Testimonials: 3 Karten pro Seite, Auto-Slide alle 5 Sekunden ----------
const track = document.getElementById('tsTrack');
const pages = Array.from(document.querySelectorAll('.ts-page'));
let pageIndex = 0;

function gotoPage(i) {
  pageIndex = (i + pages.length) % pages.length;
  track.style.transform = `translateX(-${pageIndex * 100}%)`;
}
setInterval(() => gotoPage(pageIndex + 1), 5000);

// ---------- (Optional) Form-Handler Platzhalter ----------
// Hier kannst du später EmailJS o.ä. einbinden.
// Aktuell nur Dummy-Feedback, damit nichts kaputt geht.
const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contactStatus');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  contactStatus.textContent = 'Vielen Dank! Wir melden uns kurzfristig.';
});

const careerForm = document.getElementById('careerForm');
const careerStatus = document.getElementById('careerStatus');
careerForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  careerStatus.textContent = 'Bewerbung eingegangen. Wir melden uns zeitnah.';
});
