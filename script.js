/* ═══════════════════════════════════════════════
   DIVYANSH GREEN HEIGHTS — script.js
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── 1. NAVBAR SCROLL EFFECT ── */
  const nav = document.getElementById('mainNav');
  let scrollTicking = false;

  function handleNavScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    scrollTicking = false;
  }

  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      requestAnimationFrame(handleNavScroll);
      scrollTicking = true;
    }
  }, { passive: true });
  handleNavScroll();

  /* ── 2. SMOOTH ACTIVE NAV LINKS ── */
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('#navMenu .nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));

  /* ── 3. FADE-IN ANIMATIONS ON SCROLL ── */
  const fadeEls = document.querySelectorAll(
    '.config-card, .amenity-card, .why-card, .loc-item, .stat-item, .highlight-pills, .overview-img-grid'
  );
  fadeEls.forEach(el => el.classList.add('fade-in-up'));

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 100);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(el => fadeObserver.observe(el));

  /* ── 4. STAGGERED CARD ANIMATIONS ── */
  function addStaggerDelay(selector) {
    const cards = document.querySelectorAll(selector);
    cards.forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.1}s`;
    });
  }
  addStaggerDelay('.amenity-card');
  addStaggerDelay('.why-card');

  /* ── 5. COUNTER ANIMATION ── */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const start = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statNums = document.querySelectorAll('.stat-num[data-target]');
  const statsSection = document.querySelector('.stats-strip');

  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        statNums.forEach(el => animateCounter(el));
        statsObserver.disconnect();
      }
    }, { threshold: 0.4 });
    statsObserver.observe(statsSection);
  }

  /* ── 6. FORM SUBMIT HANDLER ── */
  function handleFormSubmit(btn) {
    btn.addEventListener('click', function () {
      const form = btn.closest('.form-card-body, .modal-body');
      if (!form) return;

      const nameInput = form.querySelector('input[type="text"]');
      const telInput = form.querySelector('input[type="tel"]');

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = telInput ? telInput.value.trim() : '';

      if (!name) {
        shakeInput(nameInput);
        return;
      }
      if (!phone || phone.length < 10) {
        shakeInput(telInput);
        return;
      }

      // Success state
      btn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Callback Scheduled!';
      // Keep button green consistent with the site theme variables.
      btn.style.background = 'linear-gradient(135deg, var(--emerald), var(--emerald-light))';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = 'Request Callback <i class="bi bi-arrow-right ms-1"></i>';
        btn.style.background = '';
        btn.disabled = false;
        if (nameInput) nameInput.value = '';
        if (telInput) telInput.value = '';
      }, 3500);

      // Close modal if inside modal
      const modal = btn.closest('.modal');
      if (modal) {
        setTimeout(() => {
          const bsModal = bootstrap.Modal.getInstance(modal);
          if (bsModal) bsModal.hide();
        }, 1800);
      }
    });
  }

  function shakeInput(input) {
    if (!input) return;
    input.classList.add('shake');
    input.style.borderColor = '#dc3545';
    input.focus();
    setTimeout(() => {
      input.classList.remove('shake');
      input.style.borderColor = '';
    }, 600);
  }

  // Apply to all submit buttons
  document.querySelectorAll('.btn-hero-submit').forEach(btn => handleFormSubmit(btn));

  /* ── 7. PARALLAX HERO ── */
  const heroBg = document.querySelector('.hero-img-bg');
  if (heroBg) {
    let parallaxTicking = false;
    window.addEventListener('scroll', function () {
      if (!parallaxTicking) {
        requestAnimationFrame(function () {
          const scrollY = window.scrollY;
          if (scrollY < window.innerHeight) {
            heroBg.style.transform = 'translateY(' + (scrollY * 0.35) + 'px)';
          }
          parallaxTicking = false;
        });
        parallaxTicking = true;
      }
    }, { passive: true });
  }

  /* ── 8. FLOATING BUTTON TOOLTIP POSITIONING ── */
  // (Handled via CSS ::after pseudo-elements in style.css)

  /* ── 9. AUTO-POPUP: show modal after 12 seconds ── */
  let autoPopupShown = sessionStorage.getItem('autoPopupShown');
  if (!autoPopupShown) {
    setTimeout(() => {
      const popupModal = new bootstrap.Modal(document.getElementById('formModal'));
      popupModal.show();
      sessionStorage.setItem('autoPopupShown', 'true');
    }, 12000);
  }

  /* ── 10. NAVBAR MOBILE COLLAPSE ON LINK CLICK ── */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const toggler = document.querySelector('.navbar-toggler');
      const collapse = document.getElementById('navMenu');
      if (collapse && collapse.classList.contains('show') && toggler) {
        toggler.click();
      }
    });
  });

  /* ── 11. INPUT ANIMATION: Remove red border on input ── */
  document.querySelectorAll('.luxury-input').forEach(input => {
    input.addEventListener('input', function () {
      this.style.borderColor = '';
    });
  });

  /* ── 12. SCROLL TO TOP ON LOGO CLICK ── */
  document.querySelector('.navbar-brand')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});

/* ── SHAKE KEYFRAME (injected via JS) ── */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}
.shake { animation: shake 0.5s ease; }
`;
document.head.appendChild(shakeStyle);
