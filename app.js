// AOS init
document.addEventListener("DOMContentLoaded", () => {
  if (window.AOS) AOS.init({ duration: 800, once: true, easing: "ease-out-cubic" });
});

// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Smooth scroll buttons
function scrollToId(id){
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}
document.querySelectorAll("[data-target]").forEach(btn=>{
  btn.addEventListener("click", (e)=>{
    const id = e.currentTarget.getAttribute("data-target");
    scrollToId(id);
    closeMobile();
  });
});

// Mobile menu
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");
const mobileOverlay = document.getElementById("mobileOverlay");
function closeMobile(){ mobileMenu.classList.add("hidden"); mobileOverlay.classList.add("hidden"); }
if (burger){
  burger.addEventListener("click", ()=>{
    mobileMenu.classList.toggle("hidden");
    mobileOverlay.classList.toggle("hidden");
  });
}
if (mobileOverlay){ mobileOverlay.addEventListener("click", closeMobile); }

// Cookie bar + CTA lift
const cookieBar = document.getElementById("cookieBar");
const cookieOk = document.getElementById("cookieOk");
const stickyCta = document.getElementById("stickyCta");
if (cookieOk){
  cookieOk.addEventListener("click", ()=>{
    cookieBar.style.display = "none";
    if (stickyCta) stickyCta.classList.remove("cta-lift");
  });
  // initial lift (mobile)
  if (stickyCta) stickyCta.classList.add("cta-lift");
}

// Sticky CTA → contact
if (stickyCta){
  stickyCta.addEventListener("click", ()=> scrollToId("contact"));
}

// IntersectionObserver for nav highlight
const sectionIds = ["home","about","services","why","values","team","jobs","career-form","faq","testimonials","contact"];
const navLinks = document.querySelectorAll("#mainNav .nav-link");
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if (entry.isIntersecting){
      const id = entry.target.id;
      navLinks.forEach(l=>{
        l.classList.toggle("active", l.getAttribute("data-target") === id);
      });
    }
  });
}, { root:null, rootMargin:"0px 0px -70% 0px", threshold:0.1 });
sectionIds.forEach(id=>{
  const el = document.getElementById(id);
  if (el) observer.observe(el);
});

// FAQ smooth accordion
document.querySelectorAll(".faq").forEach(box=>{
  const q = box.querySelector(".faq-q");
  const a = box.querySelector(".faq-a");
  q.addEventListener("click", ()=>{
    const open = box.classList.contains("open");
    // close others
    document.querySelectorAll(".faq.open").forEach(o=>{
      if (o !== box){
        o.classList.remove("open");
        const oa = o.querySelector(".faq-a");
        oa.style.maxHeight = 0;
      }
    });
    // toggle current
    box.classList.toggle("open", !open);
    if (!open){
      a.style.maxHeight = a.scrollHeight + "px";
    } else {
      a.style.maxHeight = 0;
    }
  });
  // set initial height for open items (none open by default)
  a.style.maxHeight = 0;
});

// Testimonials: 3 sichtbar, Auto-Slide alle 5s, weicher Übergang
(function(){
  const track = document.getElementById("tsTrack");
  if (!track) return;

  const cards = Array.from(track.children);
  const groupSizeDesktop = 3;
  const groupSizeMobile = 1;

  function groupsCount(){
    const isDesktop = window.matchMedia("(min-width:768px)").matches;
    const size = isDesktop ? groupSizeDesktop : groupSizeMobile;
    return Math.ceil(cards.length / size);
  }

  let idx = 0;
  function applyTransform(){
    const isDesktop = window.matchMedia("(min-width:768px)").matches;
    const size = isDesktop ? groupSizeDesktop : groupSizeMobile;
    const step = isDesktop ? 100 : 100; // translate in %
    const translate = -(idx * step);
    // Desktop: each group equals 100% of viewport width due to flex-basis
    track.style.transform = `translateX(${translate}%)`;
  }

  function next(){
    idx = (idx + 1) % groupsCount();
    applyTransform();
  }

  let timer = setInterval(next, 5000);
  window.addEventListener("resize", ()=>{
    // reset on resize to avoid wrong offset
    idx = 0;
    applyTransform();
    clearInterval(timer);
    timer = setInterval(next, 5000);
  });

  // initial
  applyTransform();
})();

// Career button scroll
document.querySelectorAll('button[data-target="career-form"]').forEach(b=>{
  b.addEventListener("click", ()=> scrollToId("career-form"));
});

// Desktop nav: keyboard focus
document.querySelectorAll("#mainNav .nav-link").forEach(l=>{
  l.addEventListener("keydown",(e)=>{
    if (e.key === "Enter" || e.key === " "){
      e.preventDefault();
      const id = l.getAttribute("data-target");
      scrollToId(id);
    }
  });
});
