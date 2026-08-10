document.addEventListener('DOMContentLoaded', async () => {

  const SESSION_KEY = 'stc_popup_shown';

  // ── Already shown this session — skip everything ──
  if (sessionStorage.getItem(SESSION_KEY)) return;

  // ── Load popup config from JSON ──
  let config;
  try {
    const res = await fetch('data/popup.json');
    config    = await res.json();
  } catch (err) {
    console.warn('Popup: failed to load popup.json', err);
    return;
  }

  // ── Popup disabled in JSON — do nothing ──
  if (!config || !config.enabled) return;

  // ── Build popup HTML dynamically ──
  const popup = document.createElement('div');
  popup.id            = 'promo-popup';
  popup.role          = 'dialog';
  popup.setAttribute('aria-modal', 'true');
  popup.setAttribute('aria-label', config.tag || 'Announcement');

  popup.innerHTML = `
    <div class="promo-popup-backdrop" id="promoBackdrop"></div>
    <div class="promo-popup-box">

      <button class="promo-popup-close" id="promoClose" aria-label="Close popup">✕</button>

      <div class="promo-popup-img-wrap">
        <img
          src="${config.image}"
          alt="${config.imageAlt || config.title}"
          draggable="false"
          onerror="this.closest('.promo-popup-img-wrap').style.display='none'">
      </div>

      <div class="promo-popup-body">
        <div class="promo-popup-tag">${config.tag || 'News'}</div>
        <h2 class="promo-popup-title">${config.title}</h2>
        <p class="promo-popup-desc">${config.description}</p>
        <div class="promo-popup-actions">
          <a href="${config.buttonLink || 'news.html'}" class="promo-popup-btn-primary">
            ${config.buttonText || 'Read More'}
          </a>
          <button class="promo-popup-btn-ghost" id="promoCloseBtn">Maybe Later</button>
        </div>
      </div>

    </div>
  `;

  document.body.appendChild(popup);

  // ── Close function ──
  function closePopup() {
    popup.classList.remove('active');
    document.body.style.overflow = '';
    sessionStorage.setItem(SESSION_KEY, 'true');
  }

  // ── Wire up close triggers ──
  document.getElementById('promoClose').addEventListener('click', closePopup);
  document.getElementById('promoCloseBtn').addEventListener('click', closePopup);
  document.getElementById('promoBackdrop').addEventListener('click', closePopup);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('active')) {
      closePopup();
    }
  });

  // ── Show after delay ──
  const delayMs = (config.delaySeconds || 2.5) * 1000;
  const timer   = setTimeout(() => {
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
  }, delayMs);

  window.addEventListener('beforeunload', () => clearTimeout(timer));

});