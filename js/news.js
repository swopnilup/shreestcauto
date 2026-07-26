document.addEventListener('DOMContentLoaded', async () => {

  const grid  = document.getElementById('newsGrid');
  const empty = document.getElementById('newsEmpty');

  // ── Load news from JSON ──
  let articles = [];
  try {
    const res = await fetch('data/news.json');
    articles  = await res.json();
  } catch (err) {
    console.error('Failed to load news.json:', err);
    empty.classList.remove('hidden');
    return;
  }

  if (!articles.length) {
    empty.classList.remove('hidden');
    return;
  }

  // ── Detect if URL is a YouTube link ──
  function isYouTube(url) {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

  // ── Build a news card ──
  function buildCard(article) {
    const card = document.createElement('a');
    card.className    = 'news-card';
    card.href         = article.url;
    card.target       = '_blank';
    card.rel          = 'noopener noreferrer';

    const playBtn = isYouTube(article.url) ? `
      <div class="play-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" fill="rgba(0,0,0,0.5)"/>
          <polygon points="10,8 16,12 10,16" fill="white"/>
        </svg>
      </div>` : '';

    card.innerHTML = `
      <div class="news-card-thumb">
        <img src="${article.thumbnail}" alt="${article.title}" loading="lazy"
             onerror="this.style.display='none'">
        ${playBtn}
      </div>
      <div class="news-card-body">
        <div class="news-card-meta">
          <span class="news-card-tag">${article.tag || 'News'}</span>
          <span class="news-card-date">${article.date || ''}</span>
        </div>
        <h2 class="news-card-title">${article.title}</h2>
        <div class="news-card-source">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          ${article.source || ''}
        </div>
        <div class="news-card-arrow">
          Read more
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M13 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    `;

    return card;
  }

  // ── Render all articles ──
  articles.forEach(a => grid.appendChild(buildCard(a)));
});