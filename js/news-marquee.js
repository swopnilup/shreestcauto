document.addEventListener('DOMContentLoaded', async () => {

  const track = document.getElementById('newsMarqueeInner');
  if (!track) return;

  // ── Load news from JSON ──
  let articles = [];
  try {
    const res = await fetch('data/news.json');
    articles  = await res.json();
  } catch (err) {
    console.error('News marquee: failed to load news.json', err);
    document.getElementById('news-strip')?.remove();
    return;
  }

  if (!articles.length) {
    document.getElementById('news-strip')?.remove();
    return;
  }

  function isYouTube(url) {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

  // ── Build a single marquee card ──
  function buildCard(article) {
    const a = document.createElement('a');
    a.className = 'news-marquee-card';
    a.href      = article.url;
    a.target    = '_blank';
    a.rel       = 'noopener noreferrer';

    const playIcon = isYouTube(article.url) ? `
      <div class="nm-play">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" fill="rgba(0,0,0,0.5)"/>
          <polygon points="10,8 16,12 10,16" fill="white"/>
        </svg>
      </div>` : '';

    a.innerHTML = `
      <div class="news-marquee-thumb">
        <img src="${article.thumbnail}" alt="${article.title}" loading="lazy"
             onerror="this.parentElement.style.background='#1C2130'">
        ${playIcon}
      </div>
      <div class="news-marquee-body">
        <div class="news-marquee-meta">
          <span class="news-marquee-tag">${article.tag || 'News'}</span>
          <span class="news-marquee-date">${article.date || ''}</span>
        </div>
        <h3 class="news-marquee-title">${article.title}</h3>
        <div class="news-marquee-source">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          ${article.source || ''}
        </div>
      </div>
    `;
    return a;
  }

  // ── Render cards + duplicates for seamless loop ──
  // Need enough cards to fill the screen width twice
  // Duplicate until we have at least 8 cards for a smooth loop
  const minCards = 8;
  let sourceArticles = [...articles];
  while (sourceArticles.length < minCards) {
    sourceArticles = [...sourceArticles, ...articles];
  }

  // Render twice (original + duplicate) for seamless loop
  [...sourceArticles, ...sourceArticles].forEach(a => {
    track.appendChild(buildCard(a));
  });

});