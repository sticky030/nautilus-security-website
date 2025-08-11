/* kleine Utilitys */
.sec-title{ @apply text-3xl font-bold text-yellow-500; }
.inp{ @apply w-full p-3 rounded bg-gray-800 border border-gray-700 text-white; }

/* Karten-Styles (entsprechen deinem Look) */
.card{
  background:#1f2937; /* slate-800 */
  border-radius:14px;
  padding:18px;
  box-shadow:0 6px 20px rgba(0,0,0,.25);
  border:1px solid rgba(255,215,0,.12);
}
.card-elev{ position:relative; transition:transform .25s ease, box-shadow .25s ease; }
.card-elev:hover{ transform:translateY(-2px); box-shadow:0 10px 30px rgba(0,0,0,.35), 0 0 0 2px rgba(245,197,24,.18) inset; }
.card-badge{
  width:36px;height:36px; border-radius:10px;
  display:grid;place-items:center;
  background:rgba(245,197,24,.12); color:#facc15; /* yellow-400 */
  margin-bottom:10px; font-size:18px;
}
.card-title{ font-weight:700; color:#fff; margin-bottom:6px; }
.card-text{ color:#cbd5e1; line-height:1.5; }

/* Werte-Icons */
.icon-dot{
  width:42px;height:42px;border-radius:9999px;
  display:grid;place-items:center;
  background:rgba(245,197,24,.12); color:#facc15;
  margin:0 auto 10px auto; font-size:18px;
}

/* Sticky CTA safe-area */
.sticky-cta{ bottom:calc(env(safe-area-inset-bottom) + 1.5rem); }
.sticky-cta.cta-lift{ bottom:calc(env(safe-area-inset-bottom) + 6.5rem); }
@media (max-width:640px){ .cta-lift{ bottom:6.5rem !important } }

/* ===== FAQ – komplett überarbeitet ===== */
#faqList{ list-style:none; padding:0; margin:0; }
.faq-item{
  background:#1f2937;
  border:1px solid rgba(245,197,24,.15);
  border-radius:14px;
  overflow:hidden; /* damit nichts herausragt */
  transition:box-shadow .25s ease, border-color .25s ease, transform .25s ease;
}
.faq-item:hover{
  box-shadow:0 10px 26px rgba(0,0,0,.35), 0 0 0 2px rgba(245,197,24,.18) inset;
  transform:translateY(-1px);
}
.faq-q{
  width:100%;
  display:flex; align-items:center; justify-content:space-between;
  gap:16px;
  background:transparent;
  border:0; outline:0;
  text-align:left;
  padding:16px 18px;
  font-weight:700;
  color:#e5e7eb; /* gray-200 */
  cursor:pointer;
}
.faq-q .chev{ color:#facc15; transition:transform .25s ease; }
.faq-item.open .faq-q .chev{ transform:rotate(180deg); }

/* Antwort mit smooth height */
.faq-a{
  color:#cbd5e1;
  padding:0 18px; /* Start ohne vertical padding */
  max-height:0;
  overflow:hidden;
  transition:max-height .32s ease, padding .25s ease;
}
.faq-item.open .faq-a{
  padding:10px 18px 16px 18px;               /* weiches Ein-/Ausblenden */
  max-height:400px; /* genug Platz für kurze Antworten */
}

/* Entfernt jede “Trennlinie”-Optik */
.faq-q::after, .faq-a::before{ content:none !important; }

/* Testimonials */
.ts-card{
  background:#1f2937; border:1px solid rgba(245,197,24,.12);
  border-radius:14px; padding:18px; color:#e5e7eb;
}
.ts-card .quote{ font-style:italic; }
.ts-card .author{ margin-top:10px; color:#fbbf24; font-weight:700; }

/* Light theme readability fallback (falls du mal togglest) */
body.bg-white.text-black{ color:#111 }
body.bg-white.text-black h1, 
body.bg-white.text-black h2, 
body.bg-white.text-black h3{ color:#1a1a1a }
body.bg-white.text-black p, 
body.bg-white.text-black li{ color:#333 }
