document.addEventListener('DOMContentLoaded', async () => {

  const SESSION_KEY_NEWS  = 'stc_news_popup_shown';
  const SESSION_KEY_PROMO = 'stc_popup_shown';

  // ── Load both JSON files in parallel ──
  let newsArticles = [];
  let promoConfig  = null;

  try {
    const [newsRes, promoRes] = await Promise.all([
      fetch('data/news.json'),
      fetch('data/popup.json')
    ]);
    newsArticles = await newsRes.json();
    promoConfig  = await promoRes.json();
  } catch (err) {
    console.warn('Popup loader error:', err);
  }

  // ── Helper: detect YouTube ──
  function isYouTube(url) {
    return url && (url.includes('youtube.com') || url.includes('youtu.be'));
  }

  // ══════════════════════════════════════
  // POPUP 2 — Promo image
  // ══════════════════════════════════════
  function buildPromoPopup() {
    if (!promoConfig || !promoConfig.enabled) return;
    if (sessionStorage.getItem(SESSION_KEY_PROMO)) return;

    const popup = document.createElement('div');
    popup.id = 'promo-popup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-modal', 'true');
    popup.setAttribute('aria-label', 'Announcement');

    popup.innerHTML = `
      <div class="promo-popup-backdrop" id="promoBackdrop"></div>
      <div class="promo-popup-box">
        <button class="promo-popup-close" id="promoClose" aria-label="Close">✕</button>
        <img
          src="${promoConfig.image}"
          alt="${promoConfig.imageAlt || 'Announcement'}"
          draggable="false"
          onerror="document.getElementById('promo-popup').remove()">
      </div>
    `;

    document.body.appendChild(popup);

    function closePromo() {
      popup.classList.remove('active');
      document.body.style.overflow = '';
      sessionStorage.setItem(SESSION_KEY_PROMO, 'true');
      setTimeout(() => popup.remove(), 350);
    }

    document.getElementById('promoClose').addEventListener('click', closePromo);
    document.getElementById('promoBackdrop').addEventListener('click', closePromo);
    document.addEventListener('keydown', function promoEsc(e) {
      if (e.key === 'Escape' && popup.classList.contains('active')) {
        closePromo();
        document.removeEventListener('keydown', promoEsc);
      }
    });

    // Show immediately (no extra delay — user already waited for news popup)
    setTimeout(() => {
      popup.classList.add('active');
      document.body.style.overflow = 'hidden';
    }, 100);
  }

  // ══════════════════════════════════════
  // POPUP 1 — Latest news card
  // ══════════════════════════════════════
  function buildNewsPopup(onClose) {
    if (!newsArticles.length) { onClose(); return; }
    if (sessionStorage.getItem(SESSION_KEY_NEWS)) { onClose(); return; }

    // Pick the latest article (first in array)
    const article = newsArticles[0];

    const popup = document.createElement('div');
    popup.id = 'news-popup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-modal', 'true');
    popup.setAttribute('aria-label', 'Latest News');

    const playIcon = isYouTube(article.url) ? `
      <div class="np-play">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" fill="rgba(0,0,0,0.45)"/>
          <polygon points="10,8 16,12 10,16" fill="white"/>
        </svg>
      </div>` : '';

    popup.innerHTML = `
      <div class="np-backdrop" id="npBackdrop"></div>
      <div class="np-box">
        <button class="np-close" id="npClose" aria-label="Close">✕</button>

        <div class="np-thumb">
          <img src="${article.thumbnail}" alt="${article.title}" draggable="false"
               onerror="this.closest('.np-thumb').style.display='none'">
          ${playIcon}
        </div>

        <div class="np-body">
          <div class="np-meta">
            <span class="np-tag">${article.tag || 'News'}</span>
            <span class="np-date">${article.date || ''}</span>
          </div>
          <h2 class="np-title">${article.title}</h2>
          <div class="np-source">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            ${article.source || ''}
          </div>
          <div class="np-actions">
            <a href="news.html" class="np-btn-primary">
              View All News
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="np-btn-ghost">
              Read Article →
            </a>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(popup);

    function closeNews() {
      popup.classList.remove('active');
      document.body.style.overflow = '';
      sessionStorage.setItem(SESSION_KEY_NEWS, 'true');
      setTimeout(() => {
        popup.remove();
        onClose(); // trigger promo popup after news popup closes
      }, 350);
    }

    document.getElementById('npClose').addEventListener('click', closeNews);
    document.getElementById('npBackdrop').addEventListener('click', closeNews);
    document.addEventListener('keydown', function newsEsc(e) {
      if (e.key === 'Escape' && popup.classList.contains('active')) {
        closeNews();
        document.removeEventListener('keydown', newsEsc);
      }
    });

    // Show news popup after 2.5s delay
    const delay = (promoConfig?.delaySeconds || 2.5) * 1000;
    const timer = setTimeout(() => {
      popup.classList.add('active');
      document.body.style.overflow = 'hidden';
    }, delay);

    window.addEventListener('beforeunload', () => clearTimeout(timer));
  }

  // ══════════════════════════════════════
  // SEQUENCE: News first → then Promo
  // ══════════════════════════════════════
  buildNewsPopup(() => {
    buildPromoPopup();
  });

});