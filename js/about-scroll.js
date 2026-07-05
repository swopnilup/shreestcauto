document.addEventListener('DOMContentLoaded', () => {

  // ─────────────────────────────────────────────
  // Hero Parallax
  // ─────────────────────────────────────────────
  const hero = document.getElementById('about-hero');
  const heroBg = hero?.querySelector('.about-hero-bg');

  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (hero && heroBg && !prefersReducedMotion) {

    let ticking = false;

    function updateParallax() {

      const rect = hero.getBoundingClientRect();

      // Reset image once hero is outside the viewport
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) {
        heroBg.style.transform = "translate3d(0,0,0) scale(1.15)";
        ticking = false;
        return;
      }

      // Smooth movement
      let offset = -rect.top * 0.25;

      // Limit movement
      offset = Math.max(-80, Math.min(80, offset));

      heroBg.style.transform =
        `translate3d(0, ${offset}px, 0) scale(1.15)`;

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateParallax);

    // Initial position
    updateParallax();
  }

  // ─────────────────────────────────────────────
  // Scroll Reveal
  // ─────────────────────────────────────────────
  const revealEls = document.querySelectorAll(
    '.story-text-wrap, .story-image-wrap, .mission-text-wrap, .mission-card'
  );

  if (revealEls.length) {

    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    revealEls.forEach(el => observer.observe(el));
  }

});