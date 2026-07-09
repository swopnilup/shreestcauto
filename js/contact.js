document.addEventListener('DOMContentLoaded', () => {

  // ── Initialize EmailJS ──
  emailjs.init('zqieh1Xru1Af0dtT7'); // ← paste your public key here

  // ── Mobile menu ──
  // const hamburger = document.getElementById('hamburger');
  // const mainNav   = document.getElementById('mainNav');

  // if (hamburger && mainNav) {
  //   hamburger.addEventListener('click', () => {
  //     const isOpen = mainNav.classList.toggle('open');
  //     hamburger.classList.toggle('open');
  //     hamburger.setAttribute('aria-expanded', isOpen);
  //   });

  //   document.querySelectorAll('.nav-links a').forEach(link => {
  //     link.addEventListener('click', () => {
  //       mainNav.classList.remove('open');
  //       hamburger.classList.remove('open');
  //       hamburger.setAttribute('aria-expanded', false);
  //     });
  //   });

  //   document.addEventListener('click', (e) => {
  //     if (mainNav.classList.contains('open') &&
  //         !mainNav.contains(e.target) &&
  //         !hamburger.contains(e.target)) {
  //       mainNav.classList.remove('open');
  //       hamburger.classList.remove('open');
  //       hamburger.setAttribute('aria-expanded', false);
  //     }
  //   });
  // }

  // ── Contact form submit ──
  const form  = document.getElementById('contactForm');
  const toast = document.getElementById('contactToast');
  const btn   = document.querySelector('.contact-submit-btn');

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Disable button while sending
      btn.textContent = 'Sending...';
      btn.disabled = true;

      // Collect form data
      const templateParams = {
        from_name:    form.querySelector('input[type="text"]').value,
        phone:        form.querySelector('input[type="tel"]').value,
        from_email:   form.querySelector('input[type="email"]').value,
        inquiry_type: form.querySelector('select').value,
        message:      form.querySelector('textarea').value,
      };

      emailjs.send(
        'service_bwodff7',   //  your service ID 
        'template_y5oo0rp',  //  your template ID 
        templateParams
      )
      .then(() => {
        // Success
        toast.classList.add('visible');
        setTimeout(() => toast.classList.remove('visible'), 4000);
        form.reset();
      })
      .catch((error) => {
        // Error
        alert('Something went wrong. Please try again or contact us directly by phone.');
        console.error('EmailJS error:', error);
      })
      .finally(() => {
        // Re-enable button
        btn.innerHTML = `Send Message
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M13 5l7 7-7 7"/>
          </svg>`;
        btn.disabled = false;
      });
    });
  }

});