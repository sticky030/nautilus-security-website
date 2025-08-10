/* Helpers */
const $ = (s, c=document)=>c.querySelector(s);
const $$ = (s, c=document)=>Array.from(c.querySelectorAll(s));
const smoothScrollTo = (id)=>{ const el = document.getElementById(id); if(el) el.scrollIntoView({behavior:"smooth", block:"start"}); };

/* Cookie-Bar + CTA */
(function(){
  const bar=$("#cookieBar"), ok=$("#cookieOk"), cta=$("#stickyCta");
  if(!bar||!ok) return;
  const KEY="nautilus_cookie_ok";
  if(localStorage.getItem(KEY)==="1"){ bar.style.display="none"; if(cta) cta.style.bottom="1.5rem"; }
  else { if(cta) cta.style.bottom="6rem"; }
  ok.addEventListener("click",()=>{ localStorage.setItem(KEY,"1"); bar.style.display="none"; if(cta) cta.style.bottom="1.5rem"; });
})();

/* Burger */
(function(){
  const b=$("#burger"), menu=$("#mobileMenu"), overlay=$("#mobileOverlay");
  if(!b||!menu||!overlay) return;
  const open=()=>{ menu.classList.remove("hidden"); overlay.classList.remove("hidden"); };
  const close=()=>{ menu.classList.add("hidden"); overlay.classList.add("hidden"); };
  b.addEventListener("click",()=> menu.classList.contains("hidden")?open():close());
  overlay.addEventListener("click",close);
  $$(".mobile-link").forEach(btn=>btn.addEventListener("click",()=>{ const t=btn.getAttribute("data-target"); if(t) smoothScrollTo(t); close(); }));
})();

/* Smooth Scroll (Nav + CTA) */
(function(){
  $$("#mainNav .nav-link").forEach(btn=>{
    btn.addEventListener("click",()=>{ const t=btn.getAttribute("data-target"); if(t) smoothScrollTo(t); });
  });
  $$(".cta-btn").forEach(btn=>{
    btn.addEventListener("click",()=> smoothScrollTo(btn.getAttribute("data-target")||"contact"));
  });
  const sticky=$("#stickyCta"); if(sticky) sticky.addEventListener("click",()=> smoothScrollTo("contact"));
})();

/* Scrollspy */
(function(){
  const links=$$("#mainNav .nav-link"); if(!links.length) return;
  const map=new Map(links.map(l=>[l.getAttribute("data-target"), l]));
  const secs=links.map(l=>document.getElementById(l.getAttribute("data-target"))).filter(Boolean);
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        links.forEach(x=>x.classList.remove("active"));
        const id=e.target.id, link=map.get(id);
        if(link) link.classList.add("active");
      }
    });
  },{root:null, rootMargin:"-40% 0px -50% 0px", threshold:0});
  secs.forEach(s=>io.observe(s));
})();

/* FAQ soft toggle */
(function(){
  const items=$$(".faq-item"); if(!items.length) return;
  items.forEach(item=>{
    const btn=$(".faq-btn",item), panel=$(".faq-panel",item); if(!btn||!panel) return;
    panel.style.maxHeight="0px"; panel.style.opacity="0";
    btn.addEventListener("click",()=>{
      const open=item.classList.contains("open");
      items.forEach(i=>{ if(i!==item){ i.classList.remove("open"); const p=$(".faq-panel",i); if(p){ p.style.maxHeight="0px"; p.style.opacity="0"; } } });
      if(open){ item.classList.remove("open"); panel.style.maxHeight="0px"; panel.style.opacity="0"; }
      else{ item.classList.add("open"); panel.style.maxHeight=panel.scrollHeight+"px"; panel.style.opacity="1"; }
    });
  });
})();

/* Testimonials: 3 sichtbar, Auto-Slide alle 5s (weich) */
(function(){
  const track=$("#tsTrack"), viewport=$("#tsViewport");
  if(!track||!viewport) return;
  const slides=$$(".ts-slide", track); if(!slides.length) return;

  let index=0;
  const groups=Math.ceil(slides.length/3);
  const apply=()=>{ track.style.transform=`translateX(-${index*100}%)`; };
  const next=()=>{ index=(index+1)%groups; apply(); };

  let timer=setInterval(next, 5000);
  const stop=()=>{ if(timer){ clearInterval(timer); timer=null; } };
  const start=()=>{ stop(); timer=setInterval(next,5000); };

  viewport.addEventListener("mouseenter", stop);
  viewport.addEventListener("mouseleave", start);
  window.addEventListener("resize", apply);
  apply();
})();

/* AOS & Jahr */
document.addEventListener("DOMContentLoaded", ()=>{
  if(window.AOS){ window.AOS.init({ duration:700, once:true, easing:"ease-out-cubic" }); }
  const y=$("#year"); if(y) y.textContent=new Date().getFullYear();
});
