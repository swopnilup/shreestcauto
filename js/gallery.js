document.addEventListener('DOMContentLoaded', async () => {

  const grid       = document.getElementById('galleryGrid');
  const pagination = document.getElementById('galleryPagination');
  const lightbox   = document.getElementById('gallery-lightbox');
  const lbImg      = document.getElementById('lbImg');
  const lbCaption  = document.getElementById('lbCaption');
  const lbCounter  = document.getElementById('lbCounter');
  const lbClose    = document.getElementById('lbClose');
  const lbPrev     = document.getElementById('lbPrev');
  const lbNext     = document.getElementById('lbNext');

  const ITEMS_PER_PAGE = 12;
  let currentPage  = 1;
  let allImages    = [];
  let currentIndex = 0; // lightbox current image index within ALL images

  // ── Load gallery JSON ──
  try {
    const res = await fetch('data/gallery.json');
    allImages = await res.json();
  } catch (err) {
    grid.innerHTML = '<p style="text-align:center;color:#7A8096;padding:40px;">Failed to load gallery. Please try again.</p>';
    console.error('Gallery load error:', err);
    return;
  }

  if (!allImages.length) {
    grid.innerHTML = '<p style="text-align:center;color:#7A8096;padding:40px;">No images yet. Check back soon!</p>';
    return;
  }

  // ── Render current page of images ──
  function render() {
    grid.innerHTML = '';
    const totalPages = Math.max(1, Math.ceil(allImages.length / ITEMS_PER_PAGE));
    currentPage      = Math.min(currentPage, totalPages);

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const slice = allImages.slice(start, start + ITEMS_PER_PAGE);

    slice.forEach((img, sliceIdx) => {
      const globalIdx = start + sliceIdx;

      const item = document.createElement('div');
      item.className = 'gallery-item';

      const el = document.createElement('img');
      el.src     = img.src;
      el.alt     = img.alt || '';
      el.loading = 'lazy';

      item.appendChild(el);
      item.addEventListener('click', () => openLightbox(globalIdx));
      grid.appendChild(item);
    });

    renderPagination(totalPages);
  }

  // ── Smart pagination ──
  function renderPagination(totalPages) {
    pagination.innerHTML = '';
    if (totalPages <= 1) return;

    // Previous
    const prev = document.createElement('button');
    prev.className = 'gallery-page-btn';
    prev.textContent = 'Previous';
    prev.disabled = currentPage === 1;
    prev.addEventListener('click', () => {
      currentPage--;
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    pagination.appendChild(prev);

    // Page number window
    const range = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
        range.push(i);
      }
    }

    let prevNum = null;
    range.forEach(i => {
      if (prevNum && i - prevNum > 1) {
        const dots = document.createElement('span');
        dots.className = 'gallery-page-dots';
        dots.textContent = '...';
        pagination.appendChild(dots);
      }
      const btn = document.createElement('button');
      btn.className = 'gallery-page-btn' + (i === currentPage ? ' active' : '');
      btn.textContent = i;
      btn.addEventListener('click', () => {
        currentPage = i;
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      pagination.appendChild(btn);
      prevNum = i;
    });

    // Next
    const next = document.createElement('button');
    next.className = 'gallery-page-btn';
    next.textContent = 'Next';
    next.disabled = currentPage === totalPages;
    next.addEventListener('click', () => {
      currentPage++;
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    pagination.appendChild(next);
  }

  // ── Lightbox: open ──
  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // ── Lightbox: update image ──
  function updateLightbox() {
    const img = allImages[currentIndex];
    lbImg.classList.add('fading');
    setTimeout(() => {
      lbImg.src       = img.src;
      lbImg.alt       = img.alt || '';
      lbCaption.textContent = img.caption || '';
      lbCounter.textContent = `${currentIndex + 1} / ${allImages.length}`;
      lbPrev.disabled = currentIndex === 0;
      lbNext.disabled = currentIndex === allImages.length - 1;
      lbImg.classList.remove('fading');
    }, 150);
  }

  // ── Lightbox: close ──
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 300);
  }

  // ── Lightbox: navigate ──
  function prevImage() {
    if (currentIndex > 0) { currentIndex--; updateLightbox(); }
  }
  function nextImage() {
    if (currentIndex < allImages.length - 1) { currentIndex++; updateLightbox(); }
  }

  // ── Lightbox event listeners ──
  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', prevImage);
  lbNext.addEventListener('click', nextImage);

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   prevImage();
    if (e.key === 'ArrowRight')  nextImage();
  });

  // Prevent right-click save on lightbox image
  lbImg.addEventListener('contextmenu', (e) => e.preventDefault());

  // Initial render
  render();
});