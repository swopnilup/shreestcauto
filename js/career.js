document.addEventListener('DOMContentLoaded', () => {

  // ── Mobile menu ──
  const hamburger = document.getElementById('hamburger');
  const mainNav   = document.getElementById('mainNav');
  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('open') &&
          !mainNav.contains(e.target) &&
          !hamburger.contains(e.target)) {
        mainNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      }
    });
  }

  // ══════════════════════════════════════════════
  // VACANCY SWITCH
  // Set hasVacancy = true  → shows job cards
  // Set hasVacancy = false → shows no vacancy message
  // ══════════════════════════════════════════════
  const hasVacancy = true; // ← change to false when no openings

  const noVacancy = document.getElementById('noVacancy');
  const jobList   = document.getElementById('jobList');
  const jobDetail = document.getElementById('jobDetail');

  if (!hasVacancy) {
    noVacancy.classList.remove('hidden');
    jobList.classList.add('hidden');
  } else {
    noVacancy.classList.add('hidden');
    jobList.classList.remove('hidden');
  }

  // ── Job data ──
  const jobs = {
    'sales-marketing': {
      title: 'Sales and Marketing Executive',
      type: 'Full Time',
      location: 'Kathmandu',
      body: `We are looking for a driven and enthusiastic Sales & Marketing Executive to join the Shree STC Group team. In this role, you will be responsible for promoting our range of genuine automobile parts — including CEAT tyres, ENI lubricants, batteries, and spare parts — to mechanics, dealerships, and resellers across Kathmandu and beyond.

You will identify new business opportunities, maintain relationships with existing clients, and represent Shree STC Group professionally in the field.

<strong>Requirements:</strong>
- Completed BBA or related field, or currently pursuing MBA
- Strong communication and interpersonal skills
- Self-motivated with a passion for sales
- Knowledge of the automobile parts industry is a plus
- Valid two-wheeler license preferred

To apply, please send your CV to <a href="mailto:info@shreestcgroup.com?subject=Application — Sales and Marketing Executive">info@shreestcgroup.com</a> with the subject line "Application — Sales and Marketing Executive".`
    },
    'warehouse': {
      title: 'Warehouse & Inventory Officer',
      type: 'Full Time',
      location: 'Kathmandu',
      body: `We are looking for a detail-oriented and organized Warehouse & Inventory Officer to manage stock, ensure accurate inventory records, and oversee the smooth dispatch and receipt of automobile parts at our Dhugaadda, Kathmandu facility.

You will work closely with our sales and procurement teams to maintain optimal stock levels and ensure timely order fulfillment for our customers.

<strong>Requirements:</strong>
- Minimum SLC/SEE pass; preference for graduates
- Prior experience in warehouse or inventory management preferred
- Strong organizational and record-keeping skills
- Basic computer skills (MS Excel or similar)
- Physically fit and able to handle stock

To apply, please send your CV to <a href="mailto:info@shreestcgroup.com?subject=Application — Warehouse & Inventory Officer">info@shreestcgroup.com</a> with the subject line "Application — Warehouse & Inventory Officer".`
    }
  };

  // ── Job card click → show detail ──
  document.querySelectorAll('.job-card').forEach(card => {
    card.addEventListener('click', () => {
      const jobId = card.dataset.job;
      const job   = jobs[jobId];
      if (!job) return;

      document.getElementById('jobDetailContent').innerHTML = `
        <h2 class="job-detail-title">${job.title}</h2>
        <p class="job-detail-body">${job.body}</p>
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
        <a href="mailto:info@shreestcgroup.com?subject=Application — ${job.title}" class="job-apply-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          Apply via Email
        </a>
      `;

      jobList.classList.add('hidden');
      jobDetail.classList.add('visible');

      // Scroll to detail panel
      setTimeout(() => {
        jobDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    });
  });

  // ── Back button → return to job list ──
  document.getElementById('jobDetailBack').addEventListener('click', () => {
    jobDetail.classList.remove('visible');
    jobList.classList.remove('hidden');
    jobDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

});