// AOS
document.addEventListener("DOMContentLoaded", () => {
  if (window.AOS) AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });
});

// Jahr im Footer
document.getElementById("year").textContent = new Date().getFullYear();

// Burger / Mobile
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");
const mobileOverlay = document.getElementById("mobileOverlay");
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
document.querySelectorAll(".mobile-link").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const id = btn.getAttribute("data-target");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({behavior:"smooth"});
    mobileMenu.classList.add("hidden");
    mobileOverlay.classList.add("hidden");
  });
});

// Smooth Scroll (Desktop Nav + CTA)
function scrollToId(id){ const el=document.getElementById(id); if(el) el.scrollIntoView({behavior:"smooth"}); }
document.querySelectorAll("#mainNav .nav-link, .cta-btn").forEach(btn=>{
  btn.addEventListener("click", ()=> scrollToId(btn.getAttribute("data-target")));
});

// Sticky CTA liften, wenn Cookiebar sichtbar
const cookieBar = document.getElementById("cookieBar");
const stickyCta = document.getElementById("stickyCta");
const cookieOk = document.getElementById("cookieOk");
function updateCtaLift(){
  if (!cookieBar || !stickyCta) return;
  const styles = getComputedStyle(cookieBar);
  const isVisible = styles.display !== "none" && cookieBar.offsetHeight > 0;
  stickyCta.classList.toggle("cta-lift", isVisible);
}
updateCtaLift();
if (cookieOk) cookieOk.addEventListener("click", ()=>{
  cookieBar.style.display = "none";
  updateCtaLift();
});

// Active Section Highlight
const sectionIds = ["home","about","services","why","values","team","jobs","faq","testimonials","contact"];
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    const id = entry.target.id;
    const link = document.querySelector(`#mainNav .nav-link[data-target="${id}"]`);
    if (link) {
      if (entry.isIntersecting) link.classList.add("active");
      else link.classList.remove("active");
    }
  });
},{ root:null, rootMargin:"-50% 0px -50% 0px", threshold:0 });
sectionIds.forEach(id=>{ const el=document.getElementById(id); if(el) observer.observe(el); });

// FAQ Accordion
document.querySelectorAll(".faq-item").forEach(item=>{
  const q = item.querySelector(".faq-q");
  q.addEventListener("click", ()=>{
    item.classList.toggle("open");
  });
});

// Testimonials – 3 Karten pro Slide, Auto alle 5s, smooth translate
(function initTestimonials(){
  const track = document.getElementById("tsTrack");
  if(!track) return;
  const totalCards = track.children.length; // 9
  const perSlide = 3;
  const slides = Math.ceil(totalCards / perSlide); // 3
  let index = 0;

  function apply() {
    const gap = 24; // Tailwind gap-6 ≈ 24px
    const cardWidth = track.children[0].getBoundingClientRect().width;
    const viewportWidth = (cardWidth * perSlide) + (gap * (perSlide - 1));
    track.style.transform = `translateX(-${index * (viewportWidth + gap)}px)`;
  }

  // Initial after layout
  setTimeout(apply, 0);
  window.addEventListener("resize", apply);

  setInterval(()=>{
    index = (index + 1) % slides;
    apply();
  }, 5000);
})();

// Kontakt & Karriere – (EmailJS ggf. später)
document.getElementById("contactForm")?.addEventListener("submit", (e)=>{
  e.preventDefault();
  const status = document.getElementById("contactStatus");
  status.textContent = "Danke! Wir melden uns kurzfristig.";
  e.target.reset();
});
document.getElementById("careerForm")?.addEventListener("submit", (e)=>{
  e.preventDefault();
  const status = document.getElementById("careerStatus");
  status.textContent = "Bewerbung gesendet. Wir melden uns zeitnah.";
  e.target.reset();
});
