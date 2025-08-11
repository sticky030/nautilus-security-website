// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scroll for nav + sticky CTA
document.querySelectorAll('[data-target]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const id = btn.getAttribute('data-target');
    document.getElementById(id)?.scrollIntoView({behavior:'smooth', block:'start'});
  });
});
document.getElementById('stickyCta').addEventListener('click', ()=> {
  document.getElementById('contact')?.scrollIntoView({behavior:'smooth'});
});

// Nav highlight (IntersectionObserver)
(function(){
  const links = document.querySelectorAll(".nav-link");
  const sections = ["home","about","services","why","values","team","jobs","faq","testimonials","contact"].map(id=>document.getElementById(id)).filter(Boolean);
  const map = {};
  links.forEach(l=> map[l.getAttribute('data-target')] = l);

  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const id = e.target.id;
      links.forEach(l=> l.classList.toggle('active', l.getAttribute('data-target')===id));
    });
  },{rootMargin:"-45% 0px -55% 0px", threshold:0.01});
  sections.forEach(s=>obs.observe(s));
})();

// ===== FAQ: ganze Karte klickbar, weich, keine Linie =====
(function(){
  const items = document.querySelectorAll('#faqList .faq-item');
  items.forEach(item=>{
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');

    // Start geschlossen
    a.style.maxHeight = '0px';

    const toggle = ()=>{
      const open = item.classList.contains('open');
      // Single-open: zuerst alle schließen
      document.querySelectorAll('#faqList .faq-item.open').forEach(it=>{
        if(it!==item){
          it.classList.remove('open');
          const aa = it.querySelector('.faq-a');
          aa.style.maxHeight = '0px';
        }
      });
      if(!open){
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }else{
        item.classList.remove('open');
        a.style.maxHeight = '0px';
      }
    };

    // ganze Karte klickbar
    q.addEventListener('click', toggle);
    item.addEventListener('click', (e)=>{
      // nur wenn nicht auf Links/Buttons in der Antwort geklickt wird
      if(e.target.closest('.faq-a a, .faq-a button')) return;
      if(e.target.closest('.faq-q')) return; // schon oben behandelt
      toggle();
    });

    // bei Resize Höhe neu setzen (offene Items)
    window.addEventListener('resize', ()=>{
      if(item.classList.contains('open')) a.style.maxHeight = a.scrollHeight + 'px';
    });
  });
})();

// ===== Testimonials: 3 gleichzeitig, Auto-Slide alle 5s =====
(function(){
  const track = document.getElementById('tsTrack');
  if(!track) return;

  const items = [
    {t:"„Diskret, pünktlich und lösungsorientiert. Unsere Nachtlogistik läuft ohne Zwischenfälle.“", a:"– R. Stein, Logistikleiter"},
    {t:"„Kurzfristig Personal gestellt und direkt Struktur reingebracht. Top Koordination.“", a:"– C. Werner, Bauprojektleitung"},
    {t:"„Unauffällig, aber präsent. Gäste fühlten sich sicher, Abläufe blieben entspannt.“", a:"– M. Aziz, Veranstalter"},
    {t:"„Transparente Kommunikation, digitale Übergaben – keine leeren Versprechen.“", a:"– M. Reuter, Facility Manager"},
    {t:"„Verlässliche Revierfahrten. Vorkommnisse sauber dokumentiert und zeitnah gemeldet.“", a:"– M. Lenz, Immobilienverwaltung"},
    {t:"„Wochenends schnell reagiert. Professionelles Auftreten am Empfang – sehr kundenorientiert.“", a:"– M. Hahn, Office Management"},
    {t:"„Diebstähle auf der Baustelle aufgehört – starke Präsenz, gute Abstimmung mit der Polizei.“", a:"– M. Ulrich, Bauherr"},
    {t:"„Mehrsprachige Teams – für unser internationales Event Gold wert.“", a:"– M. Pereira, Eventkoordination"},
    {t:"„Schnell, ruhig, professionell. Genau die Art Sicherheitsdienst, die man selten findet.“", a:"– L. Berger, Hoteldirektion"}
  ];

  const render = (start)=>{
    track.innerHTML = "";
    const slice = [];
    for(let i=0;i<3;i++){
      slice.push(items[(start+i)%items.length]);
    }
    slice.forEach(({t,a})=>{
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `<p class="italic text-gray-200">${t}</p><p class="mt-3 font-bold text-yellow-500">${a}</p>`;
      track.appendChild(card);
    });
  };

  let idx = 0;
  render(idx);
  setInterval(()=>{ idx = (idx+3)%items.length; track.style.opacity = 0; setTimeout(()=>{ render(idx); track.style.opacity = 1; }, 250); }, 5000);
})();
