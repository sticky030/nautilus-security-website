/* ===== Utils ===== */
const $ = (sel, scope=document) => scope.querySelector(sel);
const $$ = (sel, scope=document) => [...scope.querySelectorAll(sel)];

/* ===== Year in footer ===== */
$("#year").textContent = new Date().getFullYear();

/* ===== Smooth scroll for nav & CTA ===== */
function scrollToId(id){
  const el = document.getElementById(id);
  if(!el) return;
  el.scrollIntoView({behavior:"smooth", block:"start"});
}
$$("[data-target]").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const id = btn.getAttribute("data-target");
    scrollToId(id);
    // close mobile
    $("#mobileMenu")?.classList.add("hidden");
    $("#mobileOverlay")?.classList.add("hidden");
  });
});
$("#stickyCta")?.addEventListener("click", ()=> scrollToId("contact"));

/* ===== Mobile menu ===== */
$("#burger")?.addEventListener("click", ()=>{
  $("#mobileMenu").classList.toggle("hidden");
  $("#mobileOverlay").classList.toggle("hidden");
});
$("#mobileOverlay")?.addEventListener("click", ()=>{
  $("#mobileMenu").classList.add("hidden");
  $("#mobileOverlay").classList.add("hidden");
});

/* ===== Cookie bar → lifts CTA on mobile ===== */
const cookieBar = $("#cookieBar");
$("#cookieOk")?.addEventListener("click", ()=>{
  cookieBar.style.display = "none";
  $("#stickyCta")?.classList.remove("cta-lift");
});
// Wenn sichtbar und mobile: CTA anheben
if (cookieBar && getComputedStyle(cookieBar).display !== "none" && window.innerWidth < 640) {
  $("#stickyCta")?.classList.add("cta-lift");
}

/* ===== Active nav on scroll (IntersectionObserver) ===== */
const sections = ["home","about","services","why","values","team","jobs","faq","testimonials","contact"];
const navLinks = sections.map(id => ({ id, el: $(`.nav-link[data-target="${id}"]`) })).filter(x=>x.el);

const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const id = entry.target.id;
      navLinks.forEach(n => n.el.classList.toggle("active", n.id === id));
    }
  });
},{ rootMargin:"-60% 0px -35% 0px", threshold:0.0 });

sections.forEach(id=>{
  const el = document.getElementById(id);
  if(el) io.observe(el);
});

/* ===== Testimonials Auto-Carousel (3→3, alle 5s) ===== */
const testimonials = [
  {q:'Diskret, pünktlich und lösungsorientiert. Unsere Nachtlogistik läuft seitdem ohne Zwischenfälle.', a:'R. Stein, Logistikleiter'},
  {q:'Kurzfristig Personal gestellt und sofort Struktur gebracht. Top Koordination.', a:'C. Werner, Bauprojektleitung'},
  {q:'Unauffällig, aber präsent. Gäste fühlten sich sicher, Abläufe entspannt.', a:'M. Aziz, Veranstalter'},
  {q:'Transparente Kommunikation und digitale Übergaben – so muss es sein.', a:'M. Reuter, Facility Manager'},
  {q:'Verlässliche Revierfahrten, sauber dokumentiert und zeitnah gemeldet.', a:'S. Lenz, Immobilienverwaltung'},
  {q:'Auch am Wochenende schnell reagiert. Sehr kundenorientiert.', a:'H. Hahn, Office Management'},
  {q:'Diebstähle auf der Baustelle beendet. Starke Präsenz & Abstimmung.', a:'T. Ulrich, Bauherr'},
  {q:'Mehrsprachige Teams waren für unser internationales Event Gold wert.', a:'A. Pereira, Eventkoordination'},
  {q:'Schnell, ruhig, professionell – genau der Dienst, den man selten findet.', a:'L. Berger, Hoteldirektion'}
];
const chunkSize = 3;
const slides = [];
for (let i=0;i<testimonials.length;i+=chunkSize) {
  slides.push(testimonials.slice(i, i+chunkSize));
}
const tsTrack = document.getElementById("tsTrack");
function renderSlides(){
  tsTrack.innerHTML = slides.map(group=>{
    const cards = group.map(t=>`
      <article class="ts-card">
        <p>„${t.q}“</p>
        <span>– ${t.a}</span>
      </article>
    `).join('');
    return `<div class="slide"><div class="grid md:grid-cols-3 gap-6">${cards}</div></div>`;
  }).join('');
}
renderSlides();

let tsIndex = 0;
function goSlide(n){
  tsIndex = (n + slides.length) % slides.length;
  tsTrack.style.transform = `translateX(-${tsIndex*100}%)`;
}
goSlide(0);

// Auto alle 5 Sekunden (pausiert on hover/touch)
const tsViewport = document.getElementById("tsViewport");
let tsTimer = setInterval(()=>goSlide(tsIndex+1), 5000);
["mouseenter","touchstart"].forEach(evt => tsViewport.addEventListener(evt, ()=> clearInterval(tsTimer)));
["mouseleave","touchend"].forEach(evt => tsViewport.addEventListener(evt, ()=> tsTimer = setInterval(()=>goSlide(tsIndex+1), 5000)));

/* ===== Forms (Dummy-Handling – easy success Feedback) ===== */
function fakeSubmit(form, statusEl){
  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    statusEl.textContent = "Danke! Wir melden uns schnellstmöglich.";
    statusEl.style.color = "#facc15";
    form.reset();
  });
}
const contactForm = $("#contactForm");
if(contactForm) fakeSubmit(contactForm, $("#contactStatus"));
const careerForm = $("#careerForm");
if(careerForm) fakeSubmit(careerForm, $("#careerStatus"));
