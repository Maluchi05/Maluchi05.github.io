'use strict';

/* =====================================================
   MALUCHI PORTFOLIO — SCRIPT
===================================================== */


// ─── CUSTOM CURSOR ────────────────────────────────
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    raf = requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Expand on interactive elements
  const interactives = 'a, button, input, textarea, [data-page], [data-filter], .project-card, .service-card, .stat-card, .tech-chip';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactives)) {
      cursor.classList.add('expand');
      follower.classList.add('expand');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactives)) {
      cursor.classList.remove('expand');
      follower.classList.remove('expand');
    }
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });
})();


// ─── PAGE NAVIGATION ─────────────────────────────
(function initNavigation() {
  const pages    = document.querySelectorAll('.page');
  const navBtns  = document.querySelectorAll('.nav-btn');
  const mobileBtns = document.querySelectorAll('.mobile-nav-btn');

  function switchPage(targetPage) {
    // Deactivate all pages
    pages.forEach(p => p.classList.remove('active'));

    // Deactivate all nav btns
    navBtns.forEach(b => b.classList.remove('active'));
    mobileBtns.forEach(b => b.classList.remove('active'));

    // Activate target
    const targetEl = document.getElementById('page-' + targetPage);
    if (targetEl) {
      targetEl.classList.add('active');
    }

    // Activate matching nav buttons
    document.querySelectorAll(`[data-page="${targetPage}"]`).forEach(btn => {
      btn.classList.add('active');
    });

    // Scroll to top of main
    const mainWrapper = document.querySelector('.main-wrapper');
    if (mainWrapper) mainWrapper.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
      document.getElementById('sidebar')?.classList.remove('open');
    }
  }

  // Desktop nav
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => switchPage(btn.dataset.page));
  });

  // Mobile nav
  mobileBtns.forEach(btn => {
    btn.addEventListener('click', () => switchPage(btn.dataset.page));
  });
})();


// ─── MOBILE SIDEBAR TOGGLE ───────────────────────
(function initSidebarToggle() {
  const toggle  = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (
      window.innerWidth <= 768 &&
      !sidebar.contains(e.target) &&
      !toggle.contains(e.target) &&
      sidebar.classList.contains('open')
    ) {
      sidebar.classList.remove('open');
    }
  });
})();


// ─── PORTFOLIO FILTER ────────────────────────────
(function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active filter button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const category = card.dataset.category;
        const match = filter === 'all' || category === filter;

        if (match) {
          card.classList.remove('hidden');
          // Stagger animation
          card.style.animationDelay = '0ms';
          card.style.animation = 'none';
          void card.offsetWidth; // force reflow
          card.style.animation = '';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();


// ─── SKILL BARS ANIMATION ────────────────────────
// Observes when the resume page becomes visible and triggers skill animations
(function initSkillAnimation() {
  const resumePage = document.getElementById('page-resume');
  if (!resumePage) return;

  // The CSS handles animation-play-state via .page.active class,
  // but we need to reset + replay when navigating to the page
  const resumeNavBtns = document.querySelectorAll('[data-page="resume"]');
  resumeNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Reset skill fills so they animate each time the page is visited
      setTimeout(() => {
        const fills = resumePage.querySelectorAll('.skill-fill');
        fills.forEach(fill => {
          fill.style.animation = 'none';
          void fill.offsetWidth;
          fill.style.animation = '';
        });
      }, 50);
    });
  });
})();


// ─── CONTACT FORM ────────────────────────────────
(function initContactForm() {
  const form      = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  if (!form || !submitBtn) return;

  const inputs = form.querySelectorAll('input[required], textarea[required]');

  function checkFormValidity() {
    let valid = true;
    inputs.forEach(input => {
      if (!input.value.trim()) valid = false;
    });
    submitBtn.disabled = !valid;
  }

  inputs.forEach(input => {
    input.addEventListener('input', checkFormValidity);
    input.addEventListener('blur', checkFormValidity);
  });

  // Initial state
  checkFormValidity();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const action = form.action;
    if (action.includes('YOUR_FORMSPREE_CODE')) {
      // Show friendly notice if not configured
      const btnText = submitBtn.querySelector('.btn-text');
      const original = btnText.textContent;
      btnText.textContent = 'Set up Formspree first!';
      submitBtn.style.background = 'linear-gradient(135deg, #f87171, #ef4444)';
      setTimeout(() => {
        btnText.textContent = original;
        submitBtn.style.background = '';
      }, 3000);
      return;
    }

    // Submit via fetch
    submitBtn.disabled = true;
    const btnText = submitBtn.querySelector('.btn-text');
    const originalText = btnText.textContent;
    btnText.textContent = 'Sending…';

    try {
      const data = new FormData(form);
      const response = await fetch(action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        btnText.textContent = 'Sent! ✓';
        submitBtn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
        form.reset();
        setTimeout(() => {
          btnText.textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = true;
        }, 4000);
      } else {
        throw new Error('Failed');
      }
    } catch {
      btnText.textContent = 'Failed — try email directly';
      submitBtn.style.background = 'linear-gradient(135deg, #f87171, #ef4444)';
      submitBtn.disabled = false;
      setTimeout(() => {
        btnText.textContent = originalText;
        submitBtn.style.background = '';
        checkFormValidity();
      }, 4000);
    }
  });
})();


// ─── STAGGER PROJECT CARDS ON LOAD ───────────────
(function staggerProjectCards() {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach((card, i) => {
    card.style.animationDelay = `${i * 60}ms`;
  });
})();


// ─── PARALLAX / TILT ON SERVICE CARDS ────────────
(function initCardTilt() {
  const cards = document.querySelectorAll('.service-card, .stat-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const tiltX = dy * -6;
      const tiltY = dx * 6;
      card.style.transform = `translateY(-4px) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();