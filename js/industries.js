document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('industriesTrack');
  const viewport = document.querySelector('.industries-track-viewport');
  const prevBtn = document.querySelector('.industries-arrow.prev');
  const nextBtn = document.querySelector('.industries-arrow.next');

  if (!track || !viewport || !prevBtn || !nextBtn) return;

  const cards = Array.from(track.children);
  if (cards.length === 0) return;

  let cardsPerView = getCardsPerView();
  let currentIndex = 0;

  function getCardsPerView() {
    const width = window.innerWidth;
    if (width <= 520) return 1;
    if (width <= 760) return 2;
    if (width <= 1100) return 3;
    return 4;
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - cardsPerView);
  }

  function update() {
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const offset = currentIndex * (cardWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= getMaxIndex();
  }

  prevBtn.addEventListener('click', () => {
    currentIndex = Math.max(0, currentIndex - 1);
    update();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = Math.min(getMaxIndex(), currentIndex + 1);
    update();
  });

  window.addEventListener('resize', () => {
    cardsPerView = getCardsPerView();
    currentIndex = Math.min(currentIndex, getMaxIndex());
    update();
  });

  update();
});