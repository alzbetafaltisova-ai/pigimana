/* Pigimana — interakce
   - hlavička při scrollu
   - mobilní menu
   - zvýraznění aktivní sekce v navigaci
   - odhalování prvků při scrollu
   - detail mýdla v dialogu
*/
(function () {
  'use strict';

  const header   = document.querySelector('.site-header');
  const toggle   = document.querySelector('.nav__toggle');
  const navList  = document.getElementById('nav-list');
  const navLinks = Array.from(navList.querySelectorAll('a[href^="#"]'));
  const darkSections = Array.from(document.querySelectorAll('.section--dark'));

  /* ---------- Hlavička ---------- */
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 24);

    // Když je hlavička nad tmavou sekcí (a není „sklo“), použij světlý text
    const top = header.offsetHeight / 2;
    const overDark = darkSections.some(sec => {
      const r = sec.getBoundingClientRect();
      return r.top <= top && r.bottom >= top;
    });
    header.classList.toggle('on-dark', overDark && y <= 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobilní menu ---------- */
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    navList.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  navLinks.forEach(a => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Aktivní sekce ---------- */
  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const activeObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => activeObs.observe(s));

    /* ---------- Reveal ---------- */
    const revealObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Detail mýdla ---------- */
  const modal     = document.getElementById('product-modal');
  const mFigure   = document.getElementById('modal-figure');
  const mIndex    = document.getElementById('modal-index');
  const mTitle    = document.getElementById('modal-title');
  const mNotes    = document.getElementById('modal-notes');
  const mContent  = document.getElementById('modal-content');
  const mPrice    = document.getElementById('modal-price');
  const mOrder    = document.getElementById('modal-order');
  let lastFocus   = null;

  function openProduct(card) {
    const img   = card.querySelector('.product__figure img');
    const name  = card.querySelector('.product__name').textContent.trim();
    const index = card.querySelector('.product__index').textContent.trim();
    const notes = card.querySelector('.product__notes').innerHTML;
    const price = card.querySelector('.product__price').textContent.trim();
    const details = card.querySelector('.product__details');

    mFigure.innerHTML = '';
    const bigImg = img.cloneNode();
    bigImg.removeAttribute('loading');
    mFigure.appendChild(bigImg);
    mFigure.style.setProperty('--tint', getComputedStyle(card).getPropertyValue('--tint'));

    mIndex.textContent = 'Mýdlo ' + index;
    mTitle.textContent = name;
    mNotes.innerHTML   = notes;
    mContent.innerHTML = details.innerHTML;
    mPrice.textContent = price;

    const subject = encodeURIComponent('Objednávka mýdla: ' + name);
    const body    = encodeURIComponent('Dobrý den,\n\nmám zájem o mýdlo „' + name + '“.\n\nPočet kusů:\nJméno:\nAdresa:\n\nDěkuji.');
    mOrder.href = 'mailto:ahoj@pigimana.cz?subject=' + subject + '&body=' + body;

    lastFocus = document.activeElement;
    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal__close').focus();
  }

  function closeProduct() {
    if (modal.open) modal.close(); else modal.removeAttribute('open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll('.product__open').forEach(btn => {
    btn.addEventListener('click', () => openProduct(btn.closest('.product')));
  });
  modal.querySelector('.modal__close').addEventListener('click', closeProduct);
  modal.addEventListener('click', e => { if (e.target === modal) closeProduct(); });
  modal.addEventListener('close', () => { document.body.style.overflow = ''; });
  modal.addEventListener('cancel', e => { e.preventDefault(); closeProduct(); });

  /* ---------- Rok v patičce ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
