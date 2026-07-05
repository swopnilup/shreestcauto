document.addEventListener('DOMContentLoaded', () => {
  const lightbox  = document.getElementById('cert-lightbox');
  const lbImg     = document.getElementById('cert-lightbox-img');
  const lbCaption = document.getElementById('cert-lightbox-caption');
  const lbClose   = document.querySelector('.lightbox-close');

  if (!lightbox || !lbImg || !lbClose) return;

  // ── Open lightbox when a cert card is clicked ──
  document.querySelectorAll('.cert-card[data-img]').forEach(card => {
    card.addEventListener('click', () => {
      const src     = card.dataset.img;
      const caption = card.dataset.label || '';

      lbImg.src = src;
      if (lbCaption) lbCaption.textContent = caption;

      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // ── Close lightbox ──
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 300);
  }

  lbClose.addEventListener('click', closeLightbox);

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // ── Prevent right-click save on all cert images ──
  document.querySelectorAll('#certifications img, #cert-lightbox img').forEach(img => {
    img.addEventListener('contextmenu', (e) => e.preventDefault());
    img.addEventListener('dragstart',   (e) => e.preventDefault());
  });
});