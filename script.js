/* ===========================================================
   UPMINAA FAN HUB — SCRIPT
=========================================================== */

/* ---------- Loading screen ----------
   Runs immediately (not nested inside DOMContentLoaded) since this
   script sits at the end of <body>, the loader element already
   exists in the DOM by the time this line runs. Also has its own
   timeout so it hides itself no matter what else happens. */
const loaderEl = document.getElementById('loader');
if (loaderEl) {
  window.addEventListener('load', () => {
    setTimeout(() => loaderEl.classList.add('hidden'), 400);
  });
  setTimeout(() => loaderEl.classList.add('hidden'), 2000);
}

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header on scroll ---------- */
  const header = document.getElementById('siteHeader');
  const onScrollHeader = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile nav after clicking a link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Scroll-reveal animations ---------- */
  const revealTargets = document.querySelectorAll(
    '.about-card, .social-card, .gallery-card, .section-heading'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------- Subtle parallax on hero background orbs ---------- */
  const orbA = document.querySelector('.orb-a');
  const orbB = document.querySelector('.orb-b');
  const heroFrame = document.querySelector('.hero-frame');

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        if (orbA) orbA.style.transform = `translate(${y * 0.06}px, ${y * 0.12}px)`;
        if (orbB) orbB.style.transform = `translate(${-y * 0.05}px, ${-y * 0.08}px)`;
        if (heroFrame) heroFrame.style.transform = `translateY(${y * -0.08}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ---------- Cursor-follow tilt on hero frame (desktop only) ---------- */
  const hero = document.querySelector('.hero');
  if (heroFrame && window.matchMedia('(hover: hover)').matches) {
    hero.addEventListener('mousemove', (e) => {
      const rect = heroFrame.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      heroFrame.style.transition = 'transform 0.15s ease-out';
      heroFrame.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    hero.addEventListener('mouseleave', () => {
      heroFrame.style.transition = 'transform 0.5s ease';
      heroFrame.style.transform = 'rotateY(0) rotateX(0)';
    });
  }

});
