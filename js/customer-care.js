document.addEventListener('DOMContentLoaded', () => {

  // ── Mobile menu ──
  // const hamburger = document.getElementById('hamburger');
  // const mainNav   = document.getElementById('mainNav');

  // if (hamburger && mainNav) {
  //   hamburger.addEventListener('click', () => {
  //     const isOpen = mainNav.classList.toggle('open');
  //     hamburger.classList.toggle('open');
  //     hamburger.setAttribute('aria-expanded', isOpen);
  //   });
  //   document.querySelectorAll('.nav-links a').forEach(link => {
  //     link.addEventListener('click', () => {
  //       mainNav.classList.remove('open');
  //       hamburger.classList.remove('open');
  //       hamburger.setAttribute('aria-expanded', false);
  //     });
  //   });
  //   document.addEventListener('click', (e) => {
  //     if (mainNav.classList.contains('open') &&
  //         !mainNav.contains(e.target) &&
  //         !hamburger.contains(e.target)) {
  //       mainNav.classList.remove('open');
  //       hamburger.classList.remove('open');
  //       hamburger.setAttribute('aria-expanded', false);
  //     }
  //   });
  // }

  // ── Smooth scroll for quick nav buttons ──
  document.querySelectorAll('.care-nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(btn.getAttribute('href'));
      if (!target) return;
      const offset = 80; // header height offset
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── Active nav button highlight on scroll ──
  const sections = ['faq', 'help-center', 'terms', 'privacy'];
  const navBtns  = document.querySelectorAll('.care-nav-btn');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (window.scrollY >= el.offsetTop - 120) current = id;
    });
    navBtns.forEach(btn => {
      btn.classList.toggle(
        'active-nav',
        btn.getAttribute('href') === `#${current}`
      );
    });
  });

  // ── FAQ accordion ──
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', false);
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', true);
      }
    });
  });

  // ── Scroll to section if URL has hash on load ──
  if (window.location.hash) {
    setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 300);
  }

});