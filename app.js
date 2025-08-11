// Jahr im Footer
document.getElementById("year").textContent = new Date().getFullYear();

// Smooth nav scroll
document.querySelectorAll("[data-target]").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const id = btn.getAttribute("data-target");
    const el = document.getElementById(id);
    if(el){ el.scrollIntoView({behavior:"smooth", block:"start"}); }
  });
});

// Cookie Bar + CTA Lift
(() => {
  const bar = document.getElementById("cookieBar");
  const ok  = document.getElementById("cookieOk");
  const cta = document.getElementById("stickyCta");
  const hide = () => { bar.style.display="none"; cta.classList.remove("cta-lift"); }
  if(localStorage.getItem("cookieOk")) hide();
  else cta.classList.add("cta-lift");
  ok.addEventListener("click", ()=>{ localStorage.setItem("cookieOk","1"); hide(); });
})();

/* ===========================
   FAQ – ganze Frage klickbar,
   weiches Accordion, single-open
=========================== */
(function initFAQ(){
  const items = [...document.querySelectorAll("#faqList .faq-item")];
  if(!items.length) return;

  const openItem = (item) => {
    // single-open: alle anderen schließen
    items.forEach(it=>{
      if(it!==item){ it.classList.remove("open"); }
    });
    // toggle aktuellen
    item.classList.toggle("open");

    // Dynamische max-height (falls Antwort länger ist)
    const a = item.querySelector(".faq-a");
    if(!a) return;
    if(item.classList.contains("open")){
      a.style.maxHeight = a.scrollHeight + "px";
    }else{
      a.style.maxHeight = "0px";
    }
  };

  // initial: alle geschlossen
  items.forEach(item=>{
    const btn = item.querySelector(".faq-q");
    // gesamte Karte klickbar: auch Klicks auf die Karte zulassen
    item.addEventListener("click", (e)=>{
      // Links in Antworten nicht abfangen
      if(e.target.closest("a")) return;
      openItem(item);
    });
    // zusätzlich: Button selbst
    btn && btn.addEventListener("click", (e)=>{ e.preventDefault(); openItem(item); });
  });

  // Recalc height on resize (falls Text umbrechen)
  window.addEventListener("resize", ()=>{
    const open = document.querySelector("#faqList .faq-item.open .faq-a");
    if(open){ open.style.maxHeight = open.scrollHeight + "px"; }
  });
})();

/* ===========================
   Testimonials – 3 gleichzeitig, Auto‑Slide alle 5s
   (entspricht dem gewünschten Verhalten)
=========================== */
(function initTestimonials(){
  const track = document.getElementById("tsTrack");
  if(!track) return;

  const cards = [...track.children];
  const groupSize = 3;
  let index = 0;

  const render = () => {
    cards.forEach((c,i)=>{
      const page = Math.floor(i / groupSize);
      c.style.display = (page === index) ? "block" : "none";
    });
  };

  const pages = Math.ceil(cards.length / groupSize);
  render();

  setInterval(()=>{
    index = (index + 1) % pages;
    render();
  }, 5000);
})();
