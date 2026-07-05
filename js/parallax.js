document.addEventListener('DOMContentLoaded', () => {
  // Sections that should get a parallax background effect.
  // Each .speed value controls how much slower the image moves vs the page scroll
  // (lower = more dramatic drift, higher = more subtle).
  const parallaxLayers = [
    { el: document.querySelector('#hero .hero-bg-image'), speed: 0.35 },
    { el: document.querySelector('#about .about-bg-image'), speed: 0.25 },
  ].filter(layer => layer.el);

  if (parallaxLayers.length === 0) return;

  // Respect users who've asked their OS/browser to reduce motion.
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  let ticking = false;

  function updateParallax() {
    const viewportHeight = window.innerHeight;

    parallaxLayers.forEach(({ el, speed }) => {
      const section = el.closest('section');
      if (!section) return;

      const rect = section.getBoundingClientRect();

      // Only animate sections that are at least partly in view —
      // skips unnecessary work for off-screen sections.
      if (rect.bottom < 0 || rect.top > viewportHeight) return;

      // How far the section's top has scrolled past the top of the viewport.
      const scrolledPast = -rect.top;
      const offset = scrolledPast * speed;

      el.style.transform = `translate3d(0, ${offset}px, 0) scale(1.15)`;
    });

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  // Initial position on load (in case the page loads mid-scroll, e.g. on refresh).
  updateParallax();

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateParallax);
});