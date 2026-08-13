document.addEventListener('DOMContentLoaded', async () => {

  const grid        = document.getElementById('productsGrid');
  const pagination  = document.getElementById('productsPagination');
  const searchInput = document.getElementById('productSearch');
  const catRadios   = document.querySelectorAll('.cat-radio');

  const CARDS_PER_PAGE = 9;
  let currentPage    = 1;
  let activeCategory = 'all';
  let searchTerm     = '';
  let allProducts    = [];

  // ── Show loading state ──
  grid.innerHTML = '<p class="no-results" style="opacity:0.5;">Loading products...</p>';

  // ── Load all product JSON files ──
  try {
    const files = [
      'tyre.json',
      'battery.json',
      'parts.json',
      'brake-parts.json',
      'fuel-systems.json',
      'lubricants.json',
      'evs.json'
    ];

    const responses = await Promise.all(
      files.map(async (file) => {
        const res = await fetch(`data/${file}`);
        if (!res.ok) throw new Error(`Could not load ${file}`);
        return await res.json();
      })
    );

    allProducts = responses.flat();

  } catch (err) {
    console.error(err);
    grid.innerHTML = '<p class="no-results">Failed to load products.</p>';
    return;
  }

  // ── Category label formatter ──
  function formatCat(cat) {
    const map = {
      battery:        'Battery',
      lubricants:     'Lubricants',
      tyre:           'Tyre',
      parts:          'Parts',
      'brake-parts':  'Brake Parts',
      'fuel-systems': 'Fuel Systems',
      evs:            'EVs'
    };
    return map[cat] || cat;
  }

  // ── Build product card ──
  function buildCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.cat = product.category;

    card.innerHTML = `
      <div class="product-card-img">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="product-card-placeholder">No Image</span>
      </div>
      <div class="product-card-body">
        <h3>${product.name}</h3>
        <p class="product-price">${product.price}</p>
        <p class="product-category">Category: ${formatCat(product.category)}</p>
        <p class="product-desc">${product.description}</p>
        <a href="contact.html?product=${encodeURIComponent(product.name)}"
           class="product-inquiry-btn"
           id="inquiry-${product._uid || product.id}">
          Inquiry
        </a>
      </div>
    `;

    const img         = card.querySelector('img');
    const placeholder = card.querySelector('.product-card-placeholder');
    const inquiryBtn  = card.querySelector('.product-inquiry-btn');

    img.addEventListener('load',  () => { placeholder.style.display = 'none'; });
    img.addEventListener('error', () => {
      img.style.display = 'none';
      placeholder.style.display = 'flex';
    });

    // ── Open detail on card click (but NOT on inquiry button) ──
    card.addEventListener('click', (e) => {
      if (inquiryBtn.contains(e.target)) return;
      openDetail(product);
    });

    return card;
  }

  // ══════════════════════════════════════
  // PRODUCT DETAIL OVERLAY
  // ══════════════════════════════════════

  // ── Create overlay element once ──
  const overlay = document.createElement('div');
  overlay.id = 'product-detail-overlay';
  overlay.innerHTML = `
    <div class="pd-backdrop" id="pdBackdrop"></div>
    <div class="pd-box">
      <button class="pd-close" id="pdClose" aria-label="Close">✕</button>
      <div class="pd-img-wrap" id="pdImgWrap">
        <img id="pdImg" src="" alt="" draggable="false">
        <span class="pd-img-placeholder" id="pdPlaceholder" style="display:none;">No Image</span>
      </div>
      <div class="pd-info">
        <span class="pd-category" id="pdCategory"></span>
        <h2 class="pd-name" id="pdName"></h2>
        <p class="pd-price" id="pdPrice"></p>
        <div class="pd-divider"></div>
        <p class="pd-desc" id="pdDesc"></p>
        <a href="contact.html" class="pd-inquiry-btn" id="pdInquiry">
          Send Inquiry
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M13 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const pdImg         = document.getElementById('pdImg');
  const pdPlaceholder = document.getElementById('pdPlaceholder');
  const pdCategory    = document.getElementById('pdCategory');
  const pdName        = document.getElementById('pdName');
  const pdPrice       = document.getElementById('pdPrice');
  const pdDesc        = document.getElementById('pdDesc');
  const pdInquiry     = document.getElementById('pdInquiry');
  const pdClose       = document.getElementById('pdClose');
  const pdBackdrop    = document.getElementById('pdBackdrop');

  // ── Open detail overlay ──
  function openDetail(product) {
    // Fill content
    pdCategory.textContent = formatCat(product.category);
    pdName.textContent     = product.name;
    pdPrice.textContent    = product.price;
    pdDesc.textContent     = product.description;
    pdInquiry.href         = `contact.html?product=${encodeURIComponent(product.name)}`;

    // Reset image
    pdImg.style.display         = 'block';
    pdPlaceholder.style.display = 'none';
    pdImg.alt = product.name;
    pdImg.src = product.image;

    pdImg.onerror = () => {
      pdImg.style.display         = 'none';
      pdPlaceholder.style.display = 'flex';
    };

    // Show overlay
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // ── Close detail overlay ──
  function closeDetail() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { pdImg.src = ''; }, 350);
  }

  pdClose.addEventListener('click', closeDetail);
  pdBackdrop.addEventListener('click', closeDetail);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeDetail();
    }
  });

  // ══════════════════════════════════════
  // FILTER, RENDER, PAGINATION
  // ══════════════════════════════════════

  function getVisible() {
    return allProducts.filter(product => {
      const matchCategory =
        activeCategory === 'all' ||
        product.category === activeCategory;

      const matchSearch =
        searchTerm === '' ||
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm);

      return matchCategory && matchSearch;
    });
  }

  function render() {
    grid.innerHTML = '';

    const visible    = getVisible();
    const totalPages = Math.max(1, Math.ceil(visible.length / CARDS_PER_PAGE));
    currentPage      = Math.min(currentPage, totalPages);

    const start    = (currentPage - 1) * CARDS_PER_PAGE;
    const products = visible.slice(start, start + CARDS_PER_PAGE);

    if (!products.length) {
      const msg = document.createElement('p');
      msg.className   = 'no-results';
      msg.textContent = 'No products found. Try another category or search.';
      grid.appendChild(msg);
    } else {
      products.forEach(product => grid.appendChild(buildCard(product)));
    }

    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    pagination.innerHTML = '';
    if (totalPages <= 1) return;

    const prev = document.createElement('button');
    prev.className   = 'page-btn';
    prev.textContent = '←';
    prev.disabled    = currentPage === 1;
    prev.onclick     = () => { currentPage--; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    pagination.appendChild(prev);

    const range = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
        range.push(i);
      }
    }

    let previous = null;
    range.forEach(page => {
      if (previous && page - previous > 1) {
        const dots = document.createElement('span');
        dots.textContent    = '...';
        dots.style.cssText  = 'padding:0 6px;color:#7A8096;display:flex;align-items:center;';
        pagination.appendChild(dots);
      }

      const btn = document.createElement('button');
      btn.className   = 'page-btn' + (page === currentPage ? ' active' : '');
      btn.textContent = page;
      btn.onclick     = () => { currentPage = page; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
      pagination.appendChild(btn);
      previous = page;
    });

    const next = document.createElement('button');
    next.className   = 'page-btn';
    next.textContent = '→';
    next.disabled    = currentPage === totalPages;
    next.onclick     = () => { currentPage++; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    pagination.appendChild(next);
  }

  // ── Category filter ──
  catRadios.forEach(label => {
    label.addEventListener('click', () => {
      catRadios.forEach(l => l.classList.remove('active'));
      label.classList.add('active');
      activeCategory = label.dataset.cat;
      currentPage    = 1;
      render();
    });
  });

  // ── Search ──
  searchInput.addEventListener('input', () => {
    searchTerm  = searchInput.value.trim().toLowerCase();
    currentPage = 1;
    render();
  });

  render();

});