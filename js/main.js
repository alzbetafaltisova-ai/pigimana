/* Pigi mána — interakce
   - hlavička při scrollu, mobilní menu, aktivní položka navigace
   - hero slider (automatické přepínání, šipky, tečky, swipe)
   - odhalování prvků při scrollu
   - detail mýdla v dialogu s galerií
   - newsletter → e-mail
*/
(function () {
  'use strict';

  const header   = document.querySelector('.site-header');
  const toggle   = document.querySelector('.nav__toggle');
  const navList  = document.getElementById('nav-list');
  const navLinks = Array.from(navList.querySelectorAll('a[href^="#"]'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Hlavička ---------- */
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
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

  /* ---------- Aktivní sekce + reveal ---------- */
  const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const activeObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id));
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => activeObs.observe(s));

    const revealObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Hero slider ---------- */
  const slider = document.getElementById('hero-slider');
  if (slider) {
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const dotsWrap = slider.querySelector('.slider__dots');
    const INTERVAL = 6500;
    let index = 0, timer = null;

    const dots = slides.map((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', 'Snímek ' + (i + 1));
      b.addEventListener('click', () => { go(i); restart(); });
      dotsWrap.appendChild(b);
      return b;
    });

    function go(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, n) => {
        const active = n === index;
        s.classList.toggle('is-active', active);
        s.setAttribute('aria-hidden', String(!active));
      });
      dots.forEach((d, n) => d.classList.toggle('is-current', n === index));
    }
    function start() { if (!reduceMotion && slides.length > 1) timer = setInterval(() => go(index + 1), INTERVAL); }
    function stop() { clearInterval(timer); timer = null; }
    function restart() { stop(); start(); }

    slider.querySelector('.slider__arrow--prev').addEventListener('click', () => { go(index - 1); restart(); });
    slider.querySelector('.slider__arrow--next').addEventListener('click', () => { go(index + 1); restart(); });
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('focusin', stop);
    slider.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : (timer || start()));

    // swipe
    let startX = null;
    slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', e => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { go(index + (dx < 0 ? 1 : -1)); restart(); }
      startX = null;
    });

    go(0);
    start();
  }

  /* ---------- Detail mýdla ---------- */
  const modal    = document.getElementById('product-modal');
  const mFigure  = document.getElementById('modal-figure');
  const mCat     = document.getElementById('modal-cat');
  const mTitle   = document.getElementById('modal-title');
  const mContent = document.getElementById('modal-content');
  const mPrice   = document.getElementById('modal-price');
  const mOrder   = document.getElementById('modal-order');
  let lastFocus  = null;

  function openProduct(card) {
    const mainImg = card.querySelector('.product__img');
    const name    = card.querySelector('.product__name').textContent.trim();
    const cat     = card.querySelector('.product__cat').innerHTML;
    const price   = card.querySelector('.product__price').textContent.trim();
    const details = card.querySelector('.product__details');
    const gallery = card.querySelector('.product__gallery');

    mFigure.innerHTML = '';
    mFigure.className = 'modal__figure';

    const main = document.createElement('div');
    main.className = 'modal__main';
    const bigImg = document.createElement('img');
    bigImg.src = mainImg.getAttribute('src');
    bigImg.alt = mainImg.alt;
    main.appendChild(bigImg);
    mFigure.appendChild(main);

    if (gallery) {
      const items = Array.from(gallery.querySelectorAll('img'));
      const thumbs = document.createElement('div');
      thumbs.className = 'modal__thumbs';
      thumbs.setAttribute('role', 'tablist');
      thumbs.setAttribute('aria-label', 'Další fotografie');

      const show = (item, btn) => {
        bigImg.src = item.dataset.src;
        bigImg.alt = item.alt;
        mFigure.classList.toggle('is-photo', item.dataset.kind === 'photo');
        thumbs.querySelectorAll('button').forEach(b => b.classList.toggle('is-current', b === btn));
      };

      items.forEach((item, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('aria-label', item.alt);
        const t = document.createElement('img');
        t.src = item.dataset.src; t.alt = '';
        btn.appendChild(t);
        btn.addEventListener('click', () => show(item, btn));
        thumbs.appendChild(btn);
        if (i === 0) show(item, btn);
      });
      mFigure.classList.add('has-thumbs');
      mFigure.appendChild(thumbs);
    }

    mCat.innerHTML = cat;
    mTitle.textContent = name;
    mContent.innerHTML = details.innerHTML;
    mPrice.textContent = price;

    const subject = encodeURIComponent('Objednávka: ' + name);
    const body = encodeURIComponent('Dobrý den,\n\nmám zájem o „' + name + '“.\n\nPočet kusů:\nJméno:\nAdresa:\n\nDěkuji.');
    mOrder.href = 'mailto:ahoj@pigimana.cz?subject=' + subject + '&body=' + body;

    lastFocus = document.activeElement;
    if (typeof modal.showModal === 'function') modal.showModal(); else modal.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal__close').focus();
  }
  function closeProduct() {
    if (modal.open) modal.close(); else modal.removeAttribute('open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  document.querySelectorAll('.product__open').forEach(btn => btn.addEventListener('click', () => openProduct(btn.closest('.product'))));
  modal.querySelector('.modal__close').addEventListener('click', closeProduct);
  modal.addEventListener('click', e => { if (e.target === modal) closeProduct(); });
  modal.addEventListener('close', () => { document.body.style.overflow = ''; });
  modal.addEventListener('cancel', e => { e.preventDefault(); closeProduct(); });

  /* ---------- Newsletter (zatím přes e-mail) ---------- */
  const newsletter = document.getElementById('newsletter');
  if (newsletter) {
    newsletter.addEventListener('submit', e => {
      e.preventDefault();
      const email = newsletter.querySelector('input').value.trim();
      const body = encodeURIComponent('Dobrý den,\n\nrád/a bych dostával/a novinky Pigi mána na adresu ' + email + '.\n\nDěkuji.');
      window.location.href = 'mailto:ahoj@pigimana.cz?subject=' + encodeURIComponent('Novinky Pigi mána') + '&body=' + body;
    });
  }

  /* ---------- Rok v patičce ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
