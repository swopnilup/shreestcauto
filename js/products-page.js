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

  // ── Load products from JSON ──
  try {
    const res   = await fetch('data/products.json');
    allProducts = await res.json();
  } catch (err) {
    grid.innerHTML = '<p class="no-results">Failed to load products. Please refresh the page or contact us directly.</p>';
    console.error('Failed to load products.json:', err);
    return;
  }

  // ── Capitalise category label ──
  function formatCat(cat) {
    const map = {
      'battery':      'Battery',
      'lubricants':   'Lubricants',
      'tyre':         'Tyre',
      'parts':        'Parts',
      'brake-parts':  'Brake Parts',
      'fuel-systems': 'Fuel Systems',
      'evs':          'EVs'
    };
    return map[cat] || cat;
  }

  // ── Build one card element from product data ──
  function buildCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.cat = product.category;

    card.innerHTML = `
      <div class="product-card-img">
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy">
        <span class="product-card-placeholder">No Image</span>
      </div>
      <div class="product-card-body">
        <h3>${product.name}</h3>
        <p class="product-price">${product.price}</p>
        <p class="product-category">Category: ${formatCat(product.category)}</p>
        <p class="product-desc">${product.description}</p>
        <a href="contact.html" class="product-inquiry-btn">Inquiry</a>
      </div>
    `;

    // Handle broken images
    const img         = card.querySelector('img');
    const placeholder = card.querySelector('.product-card-placeholder');

    img.addEventListener('load', () => {
      placeholder.style.display = 'none';
    });
    img.addEventListener('error', () => {
      img.style.display = 'none';
      placeholder.style.display = 'flex';
    });

    return card;
  }

  // ── Filter products ──
  function getVisible() {
    return allProducts.filter(p => {
      const matchCat    = activeCategory === 'all' || p.category === activeCategory;
      const matchSearch = searchTerm === '' ||
        p.name.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm);
      return matchCat && matchSearch;
    });
  }

  // ── Render current page ──
  function render() {
    grid.innerHTML = '';

    const visible    = getVisible();
    const totalPages = Math.max(1, Math.ceil(visible.length / CARDS_PER_PAGE));
    currentPage      = Math.min(currentPage, totalPages);

    const start = (currentPage - 1) * CARDS_PER_PAGE;
    const slice = visible.slice(start, start + CARDS_PER_PAGE);

    if (slice.length === 0) {
      const msg = document.createElement('p');
      msg.className = 'no-results';
      msg.textContent = 'No products found. Try a different category or search term.';
      grid.appendChild(msg);
    } else {
      slice.forEach(p => grid.appendChild(buildCard(p)));
    }

    renderPagination(totalPages);
  }

  // ── Smart pagination ──
  function renderPagination(totalPages) {
    pagination.innerHTML = '';
    if (totalPages <= 1) return;

    // Prev button
    const prev = document.createElement('button');
    prev.className = 'page-btn';
    prev.textContent = '←';
    prev.disabled = currentPage === 1;
    prev.addEventListener('click', () => {
      currentPage--;
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    pagination.appendChild(prev);

    // Smart page number window
    const range = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 2 && i <= currentPage + 2)
      ) {
        range.push(i);
      }
    }

    let prevNum = null;
    range.forEach(i => {
      if (prevNum && i - prevNum > 1) {
        const dots = document.createElement('span');
        dots.textContent = '...';
        dots.style.cssText = 'padding:0 6px;color:#7A8096;font-size:14px;display:flex;align-items:center;';
        pagination.appendChild(dots);
      }
      const btn = document.createElement('button');
      btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
      btn.textContent = i;
      btn.addEventListener('click', () => {
        currentPage = i;
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      pagination.appendChild(btn);
      prevNum = i;
    });

    // Next button
    const next = document.createElement('button');
    next.className = 'page-btn';
    next.textContent = '→';
    next.disabled = currentPage === totalPages;
    next.addEventListener('click', () => {
      currentPage++;
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
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

  // Initial render
  render();
});