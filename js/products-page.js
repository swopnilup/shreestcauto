document.addEventListener('DOMContentLoaded', () => {

  const grid        = document.getElementById('productsGrid');
  const pagination  = document.getElementById('productsPagination');
  const searchInput = document.getElementById('productSearch');
  const catRadios   = document.querySelectorAll('.cat-radio');
  const allCards    = Array.from(document.querySelectorAll('.product-card'));

  const CARDS_PER_PAGE = 9;
  let currentPage = 1;
  let activeCategory = 'all';
  let searchTerm = '';

  // ── Filtering ──
  function getVisibleCards() {
    return allCards.filter(card => {
      const cat   = card.dataset.cat || '';
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const catLabel = card.querySelector('.product-category')?.textContent.toLowerCase() || '';

      const matchesCat    = activeCategory === 'all' || cat === activeCategory;
      const matchesSearch = searchTerm === '' ||
        title.includes(searchTerm) || catLabel.includes(searchTerm);

      return matchesCat && matchesSearch;
    });
  }

  // ── Render ──
  function render() {
    const visible = getVisibleCards();
    const totalPages = Math.max(1, Math.ceil(visible.length / CARDS_PER_PAGE));
    currentPage = Math.min(currentPage, totalPages);

    const start = (currentPage - 1) * CARDS_PER_PAGE;
    const end   = start + CARDS_PER_PAGE;

    // Remove existing no-results
    grid.querySelectorAll('.no-results').forEach(el => el.remove());

    allCards.forEach((card, i) => {
      const inVisible = visible.includes(card);
      const inPage    = inVisible && visible.indexOf(card) >= start && visible.indexOf(card) < end;
      card.classList.toggle('hidden', !inPage);
    });

    if (visible.length === 0) {
      const msg = document.createElement('p');
      msg.className = 'no-results';
      msg.textContent = 'No products found. Try a different category or search term.';
      grid.appendChild(msg);
    }

    renderPagination(totalPages);
  }

  // ── Pagination ──
  function renderPagination(totalPages) {
    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    // Prev
    const prev = document.createElement('button');
    prev.className = 'page-btn';
    prev.textContent = '←';
    prev.disabled = currentPage === 1;
    prev.addEventListener('click', () => { currentPage--; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    pagination.appendChild(prev);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
      btn.textContent = i;
      btn.addEventListener('click', () => { currentPage = i; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
      pagination.appendChild(btn);
    }

    // Next
    const next = document.createElement('button');
    next.className = 'page-btn';
    next.textContent = '→';
    next.disabled = currentPage === totalPages;
    next.addEventListener('click', () => { currentPage++; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    pagination.appendChild(next);
  }

  // ── Category filter ──
  catRadios.forEach(label => {
    label.addEventListener('click', () => {
      catRadios.forEach(l => l.classList.remove('active'));
      label.classList.add('active');
      activeCategory = label.dataset.cat;
      currentPage = 1;
      render();
    });
  });

  // ── Search ──
  searchInput.addEventListener('input', () => {
    searchTerm = searchInput.value.trim().toLowerCase();
    currentPage = 1;
    render();
  });

  // ── Handle broken images — show placeholder ──
  allCards.forEach(card => {
    const img = card.querySelector('.product-card-img img');
    const placeholder = card.querySelector('.product-card-placeholder');
    if (!img || !placeholder) return;

    if (!img.src || img.naturalWidth === 0) {
      placeholder.style.display = 'flex';
    }

    img.addEventListener('error', () => {
      img.style.display = 'none';
      placeholder.style.display = 'flex';
    });

    img.addEventListener('load', () => {
      placeholder.style.display = 'none';
    });
  });

  // Initial render
  render();
});