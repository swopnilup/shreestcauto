document.addEventListener('DOMContentLoaded', () => {

  const hamburger = document.getElementById('hamburger');
  const mainNav   = document.getElementById('mainNav');

  if (!hamburger || !mainNav) return;

  // ── Toggle dropdown open/close ──
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = mainNav.classList.toggle('open');
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // ── Close when a nav link is clicked ──
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // ── Close when clicking outside ──
  document.addEventListener('click', (e) => {
    if (
      mainNav.classList.contains('open') &&
      !mainNav.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      mainNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // ── Close on Escape key ──
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('open')) {
      mainNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

});