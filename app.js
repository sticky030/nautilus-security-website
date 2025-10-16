// Year
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

// Nav toggle
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');
if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    navList.classList.toggle('open');
  });
  // Close on click
  navList.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navList.classList.remove('open'));
  });
}

// Smooth scroll for hash links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').substring(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Sticky CTA visibility
(function stickyCTA() {
  const cta = document.getElementById('stickyCta');
  if (!cta) return;
  const hero = document.getElementById('home');
  function update() {
    const y = window.scrollY || window.pageYOffset;
    const docH = document.documentElement.scrollHeight;
    const vpH = window.innerHeight;
    const fromBottom = docH - (y + vpH);
    const heroH = hero ? hero.offsetHeight : 600;
    const visible = y > heroH * 0.4 && fromBottom > 320;
    cta.classList.toggle('show', visible);
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
  cta.addEventListener('click', () => {
    const target = document.getElementById('contact');
    target && target.scrollIntoView({ behavior: 'smooth' });
  });
})();

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  if (!q || !a) return;
  q.addEventListener('click', () => {
    const open = item.classList.toggle('open');
    if (open) {
      a.style.maxHeight = a.scrollHeight + 'px';
      a.style.opacity = '1';
      setTimeout(() => (a.style.maxHeight = '300px'), 350);
    } else {
      a.style.maxHeight = a.scrollHeight + 'px';
      requestAnimationFrame(() => {
        a.style.maxHeight = '0px';
        a.style.opacity = '0';
      });
    }
  });
});

// Testimonials slider – 3 pro Seite, Auto, Pause/Play
(function testimonials() {
  const track = document.getElementById('tsTrack');
  if (!track) return;

  const items = [
    { t: "Kurzfristig startklar, Übergaben sauber – Betrieb lief durch.", a: "Bauprojektleitung, Berlin" },
    { t: "Präsenz ruhig, Abläufe klar. Keine Reibung mit der Nachtlogistik.", a: "Logistikleitung, Potsdam" },
    { t: "Unauffällig am Gast, deutlich im Ergebnis. Zutritt & Backstage im Griff.", a: "Eventkoordination, Berlin" },
    { t: "Revierfahrten mit GPS, Meldungen mit Maßnahmen. So funktioniert Reporting.", a: "Immobilienverwaltung, Berlin" },
    { t: "Empfang professionell, Auftreten höflich und durchsetzungsfähig.", a: "Office Management, Charlottenburg" },
    { t: "Alarmfolge strukturiert, Kommunikation ruhig. Risiken sauber priorisiert.", a: "Facility Management, Berlin" },
    { t: "Aufbau, Briefing, Startabend – man merkt die Routine.", a: "Projektsteuerung, Brandenburg" },
    { t: "Dokumentation auditfähig. Übergaben nachvollziehbar.", a: "Geschäftsführung, Berlin" },
    { t: "Mehrsprachige Teams, klare Funkdisziplin. Gäste fühlten sich sicher.", a: "Veranstalter, Mitte" }
  ];

  const pages = [];
  for (let i = 0; i < items.length; i += 3) {
    const page = document.createElement('div');
    page.className = 'ts-page';
    items.slice(i, i + 3).forEach(x => {
      const card = document.createElement('div');
      card.className = 'ts-card';
      card.innerHTML = `<p style="color:#d1d5db;font-style:italic">„${x.t}“</p><p style="color:#C79A3A;font-weight:700;margin-top:8px">– ${x.a}</p>`;
      page.appendChild(card);
    });
    pages.push(page);
  }
  pages.forEach(p => track.appendChild(p));
  if (pages.length > 0) track.appendChild(pages[0].cloneNode(true));

  let idx = 0, timer = null, step = 5200;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function go() {
    idx++; track.style.transform = `translateX(-${idx * 100}%)`;
    if (idx === pages.length) {
      setTimeout(() => {
        track.style.transition = 'none';
        track.style.transform = 'translateX(0)';
        idx = 0; void track.offsetWidth;
        track.style.transition = 'transform .7s ease';
      }, 700);
    }
  }

  const pauseBtn = document.getElementById('tsPause');
  const playBtn = document.getElementById('tsPlay');
  function start() { if (timer) return; timer = setInterval(go, step); pauseBtn?.classList.remove('hidden'); playBtn?.classList.add('hidden'); }
  function stop() { if (!timer) return; clearInterval(timer); timer = null; pauseBtn?.classList.add('hidden'); playBtn?.classList.remove('hidden'); }
  pauseBtn?.addEventListener('click', stop);
  playBtn?.addEventListener('click', start);

  if (!prefersReduced) start();
})();

// Forms: Honeypot + Time-Gate + Mailto fallback
function handleForm(formId, subject) {
  const form = document.getElementById(formId);
  if (!form) return;
  const status = form.querySelector('.form-status');
  const start = Date.now();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (status) { status.textContent = ''; status.style.color = ''; }

    // Honeypot
    const hp = form.querySelector('input[name="company"]');
    if (hp && hp.value && hp.value.trim() !== '') {
      if (status) { status.textContent = 'Übermittlung fehlgeschlagen.'; status.style.color = '#f87171'; }
      return;
    }
    // Time gate (≥ 1.2s)
    if (Date.now() - start < 1200) {
      if (status) { status.textContent = 'Bitte erneut senden.'; status.style.color = '#f87171'; }
      return;
    }
    // Required fields
    const req = form.querySelectorAll('[required]');
    for (const el of req) {
      if (!el.value || !String(el.value).trim()) {
        if (status) { status.textContent = 'Bitte Pflichtfelder ausfüllen.'; status.style.color = '#f87171'; }
        return;
      }
    }
    // Mailto fallback
    const fd = new FormData(form);
    const kv = [];
    fd.forEach((v,k)=>{ if (String(v).trim()) kv.push(`${k}: ${v}`) });
    const body = encodeURIComponent(kv.join('\n'));
    location.href = `mailto:kontakt@nautilus-security.de?subject=${encodeURIComponent(subject)}&body=${body}`;
  });
}
handleForm('contactForm', 'Kontaktanfrage – Nautilus Security');
handleForm('careerForm', 'Bewerbung – Nautilus Security');
