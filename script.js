(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Only animate content when an observer is supported. Otherwise everything stays visible.
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    document.documentElement.classList.add('js-ready');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });
    $$('.reveal').forEach((el) => observer.observe(el));
  }

  // Build two identical, viewport-filling marquee sequences. Each complete group
  // passes through the window before the same group replaces it, with no empty tail.
  const ticker = $('.ticker');
  const tickerTrack = $('.ticker-track', ticker || document);
  const tickerGroups = tickerTrack ? $$('.ticker-group', tickerTrack) : [];
  if (ticker && tickerTrack && tickerGroups.length === 2) {
    const [lead, duplicate] = tickerGroups;
    const originalMarkup = lead.innerHTML;
    const fillMarquee = () => {
      // Reset first to the fixed editorial sequence, then repeat until it fully
      // covers the viewport (plus a small safety buffer for subpixel rendering).
      lead.innerHTML = originalMarkup;
      let count = 0;
      while (lead.getBoundingClientRect().width < ticker.clientWidth + 200 && count++ < 60) {
        lead.insertAdjacentHTML('beforeend', originalMarkup);
      }
      duplicate.innerHTML = lead.innerHTML;
      const cycleWidth = lead.getBoundingClientRect().width;
      // Keep motion velocity uniform when the viewport requires more repeats.
      tickerTrack.style.setProperty('--ticker-duration', `${Math.round(cycleWidth / 38)}s`);
    };
    fillMarquee();
    // Keep the uninterrupted loop across phone rotation and desktop resizing.
    let sizeFrame = 0;
    window.addEventListener('resize', () => {
      if (sizeFrame) cancelAnimationFrame(sizeFrame);
      sizeFrame = requestAnimationFrame(() => { fillMarquee(); sizeFrame = 0; });
    }, { passive: true });
  }

  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
  const header = $('#site-header');
  const menuButton = $('#menu-button');
  const mobileNav = $('#mobile-nav');

  function closeMenu() {
    if (!menuButton || !mobileNav) return;
    mobileNav.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
  }
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    mobileNav.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  $$('#mobile-nav a').forEach((a) => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
  const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 35);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Contact panel: open/close with focus management and a keyboard focus trap.
  const modal = $('#contact-modal');
  const dialog = $('.contact-dialog');
  let previousFocus = null;
  const focusables = () => $$('button:not([disabled]), a[href], input:not([type="hidden"]):not([tabindex="-1"]), select, textarea', dialog)
    .filter((el) => el.getClientRects().length && !el.closest('.honeypot'));
  function openContact() {
    if (!modal) return;
    previousFocus = document.activeElement;
    closeMenu();
    modal.hidden = false;
    document.body.classList.add('modal-open');
    $('#full-name')?.focus({ preventScroll: true });
  }
  function closeContact() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
  }
  $$('[data-open-contact]').forEach((button) => button.addEventListener('click', openContact));
  $$('[data-close-contact]').forEach((button) => button.addEventListener('click', closeContact));
  document.addEventListener('keydown', (event) => {
    if (!modal || modal.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); closeContact(); }
    if (event.key !== 'Tab') return;
    const elements = focusables();
    if (!elements.length) return;
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  // Avoid implying that a local preview can deliver an email or store a lead.
  const form = $('#contact-form');
  const notice = $('#form-notice');
  const previewOnly = window.location.protocol === 'file:' || ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname) || /(^|\.)github\.io$/i.test(window.location.hostname);
  if (form && previewOnly) {
    if (notice) notice.textContent = 'Portfolio preview only — this form does not send or store inquiries on GitHub Pages or local preview.';
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (notice) {
        notice.textContent = 'Preview only: no message was sent. Inquiries are accepted only after configuring a form service such as Netlify Forms.';
        notice.classList.add('is-alert');
        notice.scrollIntoView({ behavior: reduceMotion.matches ? 'instant' : 'smooth', block: 'nearest' });
      }
    });
  }

  // Continuous 3D cube rotation; drag on desktop or mobile to explore the geometry.
  const stage = $('#cube-stage');
  const cube = $('#cube');
  if (stage && cube) {
    const mobileCube = window.matchMedia('(max-width: 630px)');
    let rotationX = -25;
    let rotationY = -34;
    let dragging = false;
    let px = 0;
    let py = 0;
    let last = 0;
    let frame = null;
    let inView = true;

    function render(time) {
      if (mobileCube.matches) { last = 0; frame = null; return; }
      if (!dragging && !reduceMotion.matches && inView) {
        if (last) rotationY += Math.min(time - last, 50) * .012;
        rotationX = -25 + Math.sin(time * .00045) * 7;
      }
      last = time;
      cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
      if (!reduceMotion.matches) frame = requestAnimationFrame(render);
    }
    if (reduceMotion.matches) cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
    else if (!mobileCube.matches) frame = requestAnimationFrame(render);
    mobileCube.addEventListener?.('change', () => {
      last = 0;
      if (!mobileCube.matches && frame === null && !reduceMotion.matches) frame = requestAnimationFrame(render);
    });

    if ('IntersectionObserver' in window) {
      const cubeObserver = new IntersectionObserver(([entry]) => { inView = !!entry?.isIntersecting; last = 0; }, { threshold: 0 });
      cubeObserver.observe(stage);
    }
    stage.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 || mobileCube.matches) return;
      dragging = true;
      px = event.clientX;
      py = event.clientY;
      stage.setPointerCapture?.(event.pointerId);
    });
    stage.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      const dx = event.clientX - px;
      const dy = event.clientY - py;
      px = event.clientX;
      py = event.clientY;
      rotationY += dx * .65;
      rotationX = Math.max(-85, Math.min(85, rotationX - dy * .65));
      cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
    });
    const endDrag = () => { dragging = false; last = 0; };
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);
    stage.addEventListener('lostpointercapture', endDrag);
    document.addEventListener('visibilitychange', () => { last = 0; });
    window.addEventListener('pagehide', () => { if (frame !== null) cancelAnimationFrame(frame); }, { once: true });
  }
})();
