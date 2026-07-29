/* Aurora Animation Kit
   For another project: copy /animations, include both files, then only edit
   the class names in SELECTORS below. No library or build step is required. */

document.addEventListener('DOMContentLoaded', () => {
  const SELECTORS = {
    hero: '.hero',
    heroContent: '.hero-content',
    heroVisual: '.hero-visual',
    cards: '.service-card, .portfolio-card, .contact-info-card, .contact-form-wrapper, .faq-item',
    text: '.section-title, .section-subtitle',
    navbar: '.header',
    stats: '.stats-banner',
    counter: '.stat-number',
    parallax: '.hero-visual img, .portfolio-image, .map-mockup',
    cta: '.cta-banner',
    footer: '.site-footer',
  };

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const rtl = () => root.dir === 'rtl';
  const query = (selector) => Array.from(document.querySelectorAll(selector));
  let ticking = false;

  // Smooth anchor scrolling; native scrolling remains touch-friendly on mobile.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
  });

  const progress = document.createElement('div');
  progress.className = 'ak-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.prepend(progress);
  document.body.classList.add('ak-js');

  const header = document.querySelector(SELECTORS.navbar);
  header?.classList.add('ak-navbar-ready');
  const hero = document.querySelector(SELECTORS.hero);
  if (hero) {
    hero.style.setProperty('--ak-enter-x', rtl() ? '22px' : '-22px');
    requestAnimationFrame(() => hero.classList.add('ak-hero-ready'));
  }

  function splitWords(element) {
    if (element.querySelector('.ak-word')) return;
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    let index = 0;
    nodes.forEach((node) => {
      const parts = node.textContent.split(/(\s+)/);
      const fragment = document.createDocumentFragment();
      parts.forEach((part) => {
        if (/^\s+$/.test(part)) fragment.append(part);
        else if (part) {
          const word = document.createElement('span');
          word.className = 'ak-word';
          word.style.setProperty('--ak-word-index', index++);
          word.textContent = part;
          fragment.append(word);
        }
      });
      node.replaceWith(fragment);
    });
    element.classList.add('ak-text');
  }

  const revealItems = [];
  query(SELECTORS.cards).forEach((card, index) => revealItems.push({ element: card, index, kind: 'card' }));
  query(SELECTORS.text).forEach((text, index) => {
    splitWords(text);
    revealItems.push({ element: text, index, kind: 'text' });
  });
  const footer = document.querySelector(SELECTORS.footer);
  if (footer) revealItems.push({ element: footer, index: 0, kind: 'footer' });

  revealItems.forEach(({ element, index, kind }) => {
    if (kind === 'footer') element.classList.add('ak-footer');
    else {
      element.classList.add('ak-reveal');
      element.style.setProperty('--ak-delay', `${(index % 5) * 75}ms`);
      element.style.setProperty('--ak-reveal-x', `${(index % 2 ? -1 : 1) * (rtl() ? -18 : 18)}px`);
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('ak-exit-up');
        entry.target.classList.add('ak-visible');
      } else if (entry.boundingClientRect.bottom < 0) {
        entry.target.classList.remove('ak-visible');
        entry.target.classList.add('ak-exit-up');
      } else if (entry.boundingClientRect.top > window.innerHeight) {
        entry.target.classList.remove('ak-visible', 'ak-exit-up');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
  document.body.classList.add('ak-observer-ready');
  revealItems.forEach(({ element }) => observer.observe(element));

  // Counters run once, independently of the reveal observer.
  const stats = document.querySelector(SELECTORS.stats);
  if (stats) {
    let counted = false;
    new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting || counted) return;
      counted = true;
      query(SELECTORS.counter).forEach((counter) => {
        const target = Number(counter.dataset.target || 0);
        const prefix = counter.dataset.prefix || '';
        const suffix = counter.dataset.suffix || '';
        const start = performance.now();
        const render = (now) => {
          const p = Math.min((now - start) / 1500, 1);
          counter.textContent = `${prefix}${Math.floor((1 - Math.pow(1 - p, 3)) * target)}${suffix}`;
          if (p < 1) requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
      });
    }), { threshold: 0.3 }).observe(stats);
  }

  const parallax = query(SELECTORS.parallax);
  function updateScrollEffects() {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    root.style.setProperty('--ak-progress', String(window.scrollY / max));
    if (!reduced) parallax.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const distance = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      element.classList.add('ak-parallax');
      element.style.setProperty('--ak-parallax-y', `${Math.max(-18, Math.min(18, distance * (index % 2 ? 12 : -12)))}px`);
      element.style.setProperty('--ak-parallax-scale', '1.025');
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(updateScrollEffects); }
  }, { passive: true });
  updateScrollEffects();

  // CTA glow plus a lightweight magnetic button on pointer devices.
  query(SELECTORS.cta).forEach((cta) => {
    cta.classList.add('ak-cta');
    cta.querySelectorAll('.btn').forEach((button) => {
      button.classList.add('ak-magnetic');
      button.addEventListener('pointermove', (event) => {
        if (reduced || !window.matchMedia('(pointer: fine)').matches) return;
        const rect = button.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.2;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.25;
        button.style.transform = `translate(${x}px, ${y}px)`;
      });
      button.addEventListener('pointerleave', () => { button.style.transform = ''; });
    });
  });

  document.addEventListener('aurora:languagechange', () => window.setTimeout(() => {
    query(SELECTORS.text).forEach(splitWords);
    updateScrollEffects();
  }, 350));
});
