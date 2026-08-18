document.addEventListener('DOMContentLoaded', async () => {

  const SESSION_KEY = 'stc_popup_shown';

  if (sessionStorage.getItem(SESSION_KEY)) return;

  let config;
  try {
    const res = await fetch('data/popup.json');
    config    = await res.json();
  } catch (err) {
    console.warn('Popup: failed to load popup.json', err);
    return;
  }

  if (!config || !config.enabled) return;

  // ── Build popup ──
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
        src="${config.image}"
        alt="${config.imageAlt || 'Announcement'}"
        draggable="false"
        onerror="document.getElementById('promo-popup').remove()">
    </div>
  `;

  document.body.appendChild(popup);

  function closePopup() {
    popup.classList.remove('active');
    document.body.style.overflow = '';
    sessionStorage.setItem(SESSION_KEY, 'true');
    setTimeout(() => popup.remove(), 350);
  }

  document.getElementById('promoClose').addEventListener('click', closePopup);
  document.getElementById('promoBackdrop').addEventListener('click', closePopup);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('active')) closePopup();
  });

  const delayMs = (config.delaySeconds || 2.5) * 1000;
  const timer   = setTimeout(() => {
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
  }, delayMs);

  window.addEventListener('beforeunload', () => clearTimeout(timer));

});