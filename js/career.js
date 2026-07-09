document.addEventListener('DOMContentLoaded', async () => {

  // ── Mobile menu ──
  // const hamburger = document.getElementById('hamburger');
  // const mainNav   = document.getElementById('mainNav');
  // if (hamburger && mainNav) {
  //   hamburger.addEventListener('click', () => {
  //     const isOpen = mainNav.classList.toggle('open');
  //     hamburger.classList.toggle('open');
  //     hamburger.setAttribute('aria-expanded', String(isOpen));
  //   });
  //   document.querySelectorAll('.nav-links a').forEach(link => {
  //     link.addEventListener('click', () => {
  //       mainNav.classList.remove('open');
  //       hamburger.classList.remove('open');
  //       hamburger.setAttribute('aria-expanded', 'false');
  //     });
  //   });
  //   document.addEventListener('click', (e) => {
  //     if (mainNav.classList.contains('open') &&
  //         !mainNav.contains(e.target) &&
  //         !hamburger.contains(e.target)) {
  //       mainNav.classList.remove('open');
  //       hamburger.classList.remove('open');
  //       hamburger.setAttribute('aria-expanded', 'false');
  //     }
  //   });
  // }

  const noVacancy = document.getElementById('noVacancy');
  const jobList   = document.getElementById('jobList');
  const jobDetail = document.getElementById('jobDetail');

  // ══════════════════════════════════════
  // VACANCY SWITCH
  // true  = show job listings from JSON
  // false = show "no vacancy" message
  // ══════════════════════════════════════
  const hasVacancy = false; // ← change to false when no openings

  if (!hasVacancy) {
    noVacancy.classList.remove('hidden');
    jobList.classList.add('hidden');
    return; // stop here, no need to load JSON
  }

  // ── Load jobs from JSON ──
  let jobs = [];
  try {
    const res = await fetch('data/jobs.json');
    jobs = await res.json();
  } catch (err) {
    jobList.innerHTML = '<p style="color:#D72B2B;padding:20px;">Failed to load job listings. Please contact us directly.</p>';
    console.error('Failed to load jobs.json:', err);
    return;
  }

  // ── If JSON is empty array, show no vacancy ──
  if (!jobs.length) {
    noVacancy.classList.remove('hidden');
    jobList.classList.add('hidden');
    return;
  }

  // ── Build job card ──
  function buildJobCard(job) {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.dataset.jobId = job.id;
    card.innerHTML = `
      <div class="job-card-header">
        <div class="job-logo">
          <img src="logoimg/stclogo.png" alt="STC Logo">
        </div>
        <div class="job-card-title-wrap">
          <h3 class="job-title">${job.title}</h3>
          <div class="job-meta">
            <span class="job-tag">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              ${job.type}
            </span>
            <span class="job-tag">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              ${job.location}
            </span>
          </div>
        </div>
      </div>
    `;

    card.addEventListener('click', () => showJobDetail(job));
    return card;
  }

  // ── Render job list ──
  jobList.innerHTML = '';
  noVacancy.classList.add('hidden');
  jobs.forEach(job => jobList.appendChild(buildJobCard(job)));

  // ── Show job detail panel ──
  function showJobDetail(job) {
    const requirementsList = job.requirements
      .map(r => `<li>${r}</li>`)
      .join('');

    const descFormatted = job.description
      .split('\n\n')
      .map(para => `<p class="job-detail-body">${para.replace(/\n/g, '<br>')}</p>`)
      .join('');

    document.getElementById('jobDetailContent').innerHTML = `
      <h2 class="job-detail-title">${job.title}</h2>

      ${descFormatted}

      <div class="job-requirements">
        <h4>Requirements</h4>
        <ul>${requirementsList}</ul>
      </div>

      <div class="job-detail-meta">
        <span class="job-detail-tag">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ${job.type}
        </span>
        <span class="job-detail-tag">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${job.location}
        </span>
      </div>

      <a href="mailto:info@shreestcgroup.com?subject=Application — ${job.title}"
         class="job-apply-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        Apply via Email
      </a>
    `;

    jobList.classList.add('hidden');
    jobDetail.classList.add('visible');

    setTimeout(() => {
      jobDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  // ── Back button ──
  document.getElementById('jobDetailBack').addEventListener('click', () => {
    jobDetail.classList.remove('visible');
    jobList.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});