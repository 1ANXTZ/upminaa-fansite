/* ===========================================================
   UPMINAA FAN HUB — STYLE SHEET
   Palette: near-black base, deep violet fields, magenta-purple
   primary glow, cyan secondary accent for a streaming/gamer feel.
=========================================================== */

:root{
  --bg-black:      #08060d;
  --bg-purple:     #150a28;
  --bg-purple-2:   #1d0f38;
  --purple:        #8b2fe0;
  --purple-light:  #b565f5;
  --cyan:          #4deeea;
  --text-main:     #f1eaff;
  --text-dim:      #b9aed1;
  --border-soft:   rgba(181,101,245,0.25);

  --font-display: 'Orbitron', sans-serif;
  --font-body: 'Rajdhani', sans-serif;

  --radius-lg: 24px;
  --radius-md: 16px;
  --radius-sm: 10px;

  --shadow-glow: 0 0 30px rgba(139,47,224,0.45);
  --transition: 0.35s cubic-bezier(.4,0,.2,1);
}

*{ margin:0; padding:0; box-sizing:border-box; }

html{
  scroll-behavior: smooth;
}

body{
  background: var(--bg-black);
  color: var(--text-main);
  font-family: var(--font-body);
  overflow-x: hidden;
  line-height: 1.6;
}

img, svg{ display:block; max-width:100%; }
a{ text-decoration:none; color:inherit; }
ul{ list-style:none; }
button{ font-family:inherit; cursor:pointer; }

::selection{ background: var(--purple); color:#fff; }

/* Focus visibility */
a:focus-visible, button:focus-visible{
  outline: 2px solid var(--cyan);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce){
  *{ animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; scroll-behavior:auto !important; }
}

/* ===========================================================
   LOADER
=========================================================== */
.loader{
  position: fixed; inset:0; z-index: 999;
  background: radial-gradient(circle at 50% 40%, var(--bg-purple) 0%, var(--bg-black) 70%);
  display:flex; align-items:center; justify-content:center;
  transition: opacity 0.6s ease, visibility 0.6s ease;
  /* CSS-only safety net: hides the loader on its own even if script.js
     never loads or fails, so the page is never stuck. */
  animation: forceHideLoader 0s linear 3.5s forwards;
}
.loader.hidden{ opacity:0; visibility:hidden; pointer-events:none; }

@keyframes forceHideLoader{
  to{ opacity:0; visibility:hidden; pointer-events:none; }
}

.loader-inner{ display:flex; flex-direction:column; align-items:center; gap:22px; }

.loader-ring{
  width:64px; height:64px; border-radius:50%;
  border: 3px solid rgba(181,101,245,0.2);
  border-top-color: var(--purple-light);
  border-right-color: var(--cyan);
  animation: spin 1s linear infinite;
}
@keyframes spin{ to{ transform: rotate(360deg);} }

.loader-tag{
  font-family: var(--font-display);
  letter-spacing: 6px;
  font-size: 0.9rem;
  color: var(--text-dim);
}

.loader-bars{ display:flex; gap:5px; height:20px; align-items:flex-end; }
.loader-bars span{
  width:4px; background: linear-gradient(var(--cyan), var(--purple));
  border-radius: 2px;
  animation: barPulse 1s ease-in-out infinite;
}
.loader-bars span:nth-child(1){ animation-delay:0s; }
.loader-bars span:nth-child(2){ animation-delay:0.1s; }
.loader-bars span:nth-child(3){ animation-delay:0.2s; }
.loader-bars span:nth-child(4){ animation-delay:0.3s; }
.loader-bars span:nth-child(5){ animation-delay:0.4s; }
@keyframes barPulse{
  0%,100%{ height:6px; }
  50%{ height:20px; }
}

/* ===========================================================
   BACKGROUND FX
=========================================================== */
.bg-fx{ position: fixed; inset:0; z-index:-2; overflow:hidden; background: var(--bg-black); }

.orb{
  position:absolute; border-radius:50%;
  filter: blur(90px);
  opacity:0.55;
  will-change: transform;
}
.orb-a{
  width:520px; height:520px;
  background: var(--purple);
  top:-120px; left:-100px;
  animation: floatA 16s ease-in-out infinite;
}
.orb-b{
  width:460px; height:460px;
  background: var(--cyan);
  bottom:-160px; right:-120px;
  opacity: 0.28;
  animation: floatB 20s ease-in-out infinite;
}
@keyframes floatA{
  0%,100%{ transform: translate(0,0); }
  50%{ transform: translate(60px, 80px); }
}
@keyframes floatB{
  0%,100%{ transform: translate(0,0); }
  50%{ transform: translate(-50px,-60px); }
}

.grid-overlay{
  position:absolute; inset:0;
  background-image:
    linear-gradient(rgba(181,101,245,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(181,101,245,0.06) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(circle at 50% 30%, black 0%, transparent 75%);
}

/* ===========================================================
   HEADER / NAV
=========================================================== */
.site-header{
  position: fixed; top:0; left:0; right:0; z-index:100;
  padding: 18px 6vw;
  transition: background var(--transition), backdrop-filter var(--transition), padding var(--transition), border-color var(--transition);
  border-bottom: 1px solid transparent;
}
.site-header.scrolled{
  background: rgba(8,6,13,0.75);
  backdrop-filter: blur(14px);
  padding: 12px 6vw;
  border-color: var(--border-soft);
}

.navbar{ display:flex; align-items:center; justify-content:space-between; }

.brand{
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--text-main);
}
.brand span{ color: var(--purple-light); text-shadow: 0 0 12px var(--purple-light); }

.nav-links{ display:flex; gap: 40px; }

.nav-link{
  font-size: 1rem; font-weight:600; letter-spacing:0.5px;
  color: var(--text-dim);
  position: relative;
  transition: color var(--transition);
}
.nav-link::after{
  content:''; position:absolute; left:0; bottom:-6px;
  width:0; height:2px;
  background: linear-gradient(90deg, var(--purple-light), var(--cyan));
  transition: width var(--transition);
}
.nav-link:hover{ color: var(--text-main); }
.nav-link:hover::after{ width:100%; }

.nav-toggle{
  display:none; flex-direction:column; gap:5px;
  background:none; border:none; z-index:110;
}
.nav-toggle span{
  width:26px; height:2px; background: var(--text-main);
  transition: transform var(--transition), opacity var(--transition);
}
.nav-toggle.open span:nth-child(1){ transform: translateY(7px) rotate(45deg); }
.nav-toggle.open span:nth-child(2){ opacity:0; }
.nav-toggle.open span:nth-child(3){ transform: translateY(-7px) rotate(-45deg); }

/* ===========================================================
   HERO
=========================================================== */
.hero{
  min-height: 100vh;
  display:flex; align-items:center; justify-content:space-between; gap: 40px;
  padding: 140px 6vw 100px;
  position: relative;
  flex-wrap: wrap;
}

.hero-content{ max-width: 620px; }

.hero-eyebrow{
  font-family: var(--font-display);
  font-size: 0.75rem;
  letter-spacing: 3px;
  color: var(--cyan);
  margin-bottom: 18px;
  opacity: 0.9;
}

.hero-title{
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(2.8rem, 8vw, 5.2rem);
  line-height: 1.02;
  letter-spacing: 2px;
  color: #fff;
  text-shadow:
    0 0 20px rgba(181,101,245,0.65),
    0 0 60px rgba(139,47,224,0.35);
  position: relative;
  margin-bottom: 22px;
}

.hero-desc{
  font-size: 1.15rem;
  color: var(--text-dim);
  max-width: 520px;
  margin-bottom: 36px;
}

.hero-actions{ display:flex; gap: 20px; flex-wrap: wrap; }

.btn{
  display:inline-flex; align-items:center; gap:10px;
  font-family: var(--font-body);
  font-weight:700; font-size:1rem; letter-spacing:0.5px;
  padding: 15px 30px;
  border-radius: 50px;
  border: 1px solid var(--border-soft);
  color: var(--text-main);
  position: relative;
  overflow: hidden;
  transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
}
.btn-icon{ font-size:0.7rem; }

.btn-glow{
  background: linear-gradient(135deg, var(--bg-purple-2), var(--bg-black));
}
.btn-glow::before{
  content:''; position:absolute; inset:-2px; border-radius: 50px; z-index:-1;
  background: linear-gradient(135deg, var(--purple), var(--cyan));
  opacity: 0; transition: opacity var(--transition);
}
.btn-glow:hover{
  transform: translateY(-3px);
  box-shadow: 0 0 25px rgba(139,47,224,0.6), 0 0 50px rgba(77,238,234,0.15);
}
.btn-glow:hover::before{ opacity: 0.5; }

.btn-twitch{ box-shadow: 0 0 18px rgba(139,47,224,0.35); }
.btn-youtube{ box-shadow: 0 0 18px rgba(77,238,234,0.15); }

/* Hero visual */
.hero-visual{
  position: relative;
  flex: 1 1 380px;
  max-width: 460px;
  display:flex; flex-direction:column; align-items:center; gap:24px;
}

.hero-frame{
  width:100%; aspect-ratio: 4/5;
  border-radius: var(--radius-lg);
  background: linear-gradient(160deg, var(--bg-purple-2), var(--bg-black) 70%);
  border: 1px solid var(--border-soft);
  position: relative;
  overflow:hidden;
  box-shadow: var(--shadow-glow), inset 0 0 60px rgba(139,47,224,0.15);
  animation: floatCard 6s ease-in-out infinite;
}
@keyframes floatCard{
  0%,100%{ transform: translateY(0); }
  50%{ transform: translateY(-14px); }
}

.hero-frame::after{
  content:'UPMINAA';
  position:absolute; inset:0;
  display:flex; align-items:center; justify-content:center;
  font-family: var(--font-display);
  font-size: 2rem;
  letter-spacing: 4px;
  color: rgba(241,234,255,0.08);
}

.hero-frame-glow{
  position:absolute; inset:0;
  background: radial-gradient(circle at 30% 20%, rgba(181,101,245,0.35), transparent 60%);
}

.hero-scanline{
  position:absolute; left:0; right:0; height:2px;
  background: linear-gradient(90deg, transparent, var(--cyan), transparent);
  opacity:0.7;
  animation: scan 3.5s linear infinite;
}
@keyframes scan{
  0%{ top:0%; }
  100%{ top:100%; }
}

.live-tag{
  position:absolute; top:16px; left:16px;
  background: rgba(255,60,80,0.15);
  border: 1px solid rgba(255,60,80,0.5);
  color:#ff5c72;
  font-family: var(--font-display);
  font-size: 0.7rem;
  letter-spacing:1px;
  padding: 6px 12px;
  border-radius: 30px;
  animation: livePulse 1.8s ease-in-out infinite;
}
@keyframes livePulse{
  0%,100%{ opacity:1; }
  50%{ opacity:0.5; }
}

.visualizer{
  display:flex; align-items:flex-end; gap:6px; height:36px;
}
.visualizer span{
  width:5px; border-radius:3px;
  background: linear-gradient(var(--cyan), var(--purple));
  animation: vis 1.2s ease-in-out infinite;
}
.visualizer span:nth-child(1){ height:14px; animation-delay:0s; }
.visualizer span:nth-child(2){ height:28px; animation-delay:0.1s; }
.visualizer span:nth-child(3){ height:18px; animation-delay:0.2s; }
.visualizer span:nth-child(4){ height:34px; animation-delay:0.3s; }
.visualizer span:nth-child(5){ height:20px; animation-delay:0.4s; }
.visualizer span:nth-child(6){ height:30px; animation-delay:0.5s; }
.visualizer span:nth-child(7){ height:12px; animation-delay:0.6s; }
@keyframes vis{
  0%,100%{ transform: scaleY(0.5); }
  50%{ transform: scaleY(1.3); }
}

.scroll-cue{
  position:absolute; bottom: 24px; left:50%; transform: translateX(-50%);
  width: 26px; height: 42px; border-radius: 20px;
  border: 2px solid var(--border-soft);
  display:flex; justify-content:center; padding-top:8px;
}
.scroll-cue-dot{
  width:5px; height:5px; border-radius:50%;
  background: var(--cyan);
  animation: cueDrop 1.6s ease-in-out infinite;
}
@keyframes cueDrop{
  0%{ transform: translateY(0); opacity:1; }
  70%{ opacity:0; }
  100%{ transform: translateY(14px); opacity:0; }
}

/* ===========================================================
   SECTION SHARED
=========================================================== */
section{ position:relative; padding: 120px 6vw; }

.section-heading{ text-align:center; margin-bottom: 60px; }
.section-eyebrow{
  font-family: var(--font-display);
  font-size: 0.75rem; letter-spacing: 3px;
  color: var(--cyan); margin-bottom: 10px;
}
.section-title{
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 700;
  color:#fff;
}

/* reveal-on-scroll */
.reveal{ opacity:0; transform: translateY(40px); transition: opacity 0.8s ease, transform 0.8s ease; }
.reveal.in-view{ opacity:1; transform: translateY(0); }

/* ===========================================================
   ABOUT
=========================================================== */
.about{ background: linear-gradient(180deg, transparent, rgba(21,10,40,0.4), transparent); }

.about-grid{
  display:grid; grid-template-columns: repeat(3, 1fr); gap: 28px;
  max-width: 1200px; margin:0 auto;
}

.card{
  background: linear-gradient(160deg, rgba(29,15,56,0.6), rgba(8,6,13,0.6));
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  padding: 36px 30px;
  transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
}
.card:hover{
  transform: translateY(-8px);
  border-color: var(--purple-light);
  box-shadow: 0 12px 40px rgba(139,47,224,0.3);
}

.card-icon{ font-size: 2rem; margin-bottom: 18px; }
.about-card h3{
  font-family: var(--font-display);
  font-size: 1.15rem; margin-bottom: 14px; color:#fff;
}
.about-card p{ color: var(--text-dim); font-size: 1rem; }

/* ===========================================================
   SOCIAL
=========================================================== */
.social-grid{
  display:grid; grid-template-columns: repeat(4, 1fr); gap: 24px;
  max-width: 1200px; margin:0 auto;
}

.social-card{
  position:relative; overflow:hidden;
  background: linear-gradient(160deg, rgba(29,15,56,0.6), rgba(8,6,13,0.7));
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  padding: 40px 24px;
  display:flex; flex-direction:column; align-items:center; gap:10px;
  text-align:center;
  transition: transform var(--transition), box-shadow var(--transition);
}

.social-glow{
  position:absolute; inset:-40%;
  background: radial-gradient(circle, rgba(181,101,245,0.35), transparent 65%);
  opacity:0; transition: opacity var(--transition);
}
.social-card:hover{ transform: translateY(-8px) scale(1.02); box-shadow: 0 14px 40px rgba(139,47,224,0.35); }
.social-card:hover .social-glow{ opacity:1; }

.social-icon{
  font-size: 1.6rem;
  width: 60px; height:60px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  background: rgba(181,101,245,0.12);
  border: 1px solid var(--border-soft);
  z-index:1;
}
.social-name{ font-family: var(--font-display); font-size:1rem; z-index:1; }
.social-sub{ color: var(--text-dim); font-size: 0.9rem; z-index:1; }

/* ===========================================================
   GALLERY
=========================================================== */
.gallery-grid{
  display:grid; grid-template-columns: repeat(3, 1fr); gap: 22px;
  max-width: 1200px; margin: 0 auto;
}

.gallery-card{
  aspect-ratio: 4/3;
  border-radius: var(--radius-md);
  position: relative; overflow:hidden;
  border: 1px solid var(--border-soft);
  display:flex; align-items:flex-end; padding: 18px;
  transition: transform var(--transition), box-shadow var(--transition);
}
.gallery-card:hover{ transform: scale(1.03) translateY(-4px); box-shadow: 0 14px 40px rgba(139,47,224,0.4); }

.gallery-card::before{
  content:'';
  position:absolute; inset:0;
  background: linear-gradient(160deg, var(--bg-purple-2), var(--bg-black));
}
.gallery-card::after{
  content:'';
  position:absolute; inset:0;
  background: linear-gradient(0deg, rgba(0,0,0,0.65), transparent 55%);
}
.g1::before{ background: linear-gradient(160deg, #3a1364, #08060d); }
.g2::before{ background: linear-gradient(160deg, #14324f, #08060d); }
.g3::before{ background: linear-gradient(160deg, #4a1440, #08060d); }
.g4::before{ background: linear-gradient(160deg, #1a2c52, #08060d); }
.g5::before{ background: linear-gradient(160deg, #33124f, #08060d); }
.g6::before{ background: linear-gradient(160deg, #123939, #08060d); }

.gallery-tag{
  position: relative; z-index:1;
  font-family: var(--font-display);
  font-size: 0.85rem; letter-spacing:1px;
  color:#fff;
}

/* ===========================================================
   FOOTER
=========================================================== */
.site-footer{
  text-align:center; padding: 60px 6vw 40px;
  border-top: 1px solid var(--border-soft);
  color: var(--text-dim);
}
.footer-brand{
  font-family: var(--font-display);
  font-size: 1.1rem; letter-spacing:2px; color:#fff; margin-bottom: 14px;
}
.footer-brand span{ color: var(--purple-light); }
.site-footer p{ font-size: 0.9rem; margin-bottom:6px; }
.disclaimer{ max-width: 560px; margin: 10px auto 0; opacity:0.7; font-size:0.82rem; }

/* ===========================================================
   RESPONSIVE
=========================================================== */
@media (max-width: 980px){
  .about-grid{ grid-template-columns: 1fr 1fr; }
  .social-grid{ grid-template-columns: 1fr 1fr; }
  .gallery-grid{ grid-template-columns: 1fr 1fr; }
}

@media (max-width: 760px){
  .nav-toggle{ display:flex; }
  .nav-links{
    position: fixed; top:0; right:-100%; height:100vh; width: 68%;
    background: rgba(8,6,13,0.97);
    backdrop-filter: blur(16px);
    flex-direction: column; justify-content:center; align-items:center; gap: 34px;
    transition: right var(--transition);
    border-left: 1px solid var(--border-soft);
  }
  .nav-links.open{ right:0; }

  .hero{ flex-direction: column; text-align:center; padding-top: 120px; }
  .hero-content{ max-width: 100%; }
  .hero-desc{ margin-left:auto; margin-right:auto; }
  .hero-actions{ justify-content:center; }

  .about-grid{ grid-template-columns: 1fr; }
  .social-grid{ grid-template-columns: 1fr 1fr; }
  .gallery-grid{ grid-template-columns: 1fr; }

  section{ padding: 90px 6vw; }
}

@media (max-width: 420px){
  .social-grid{ grid-template-columns: 1fr; }
}
