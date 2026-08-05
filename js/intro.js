(function () {
  const STORAGE_KEY = 'aurora_intro_shown_v1';
  const overlayId = 'intro-overlay';
  // Only run on index page
  if (!document.body) return;

  function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = overlayId;
    overlay.className = 'intro-overlay';

    const canvas = document.createElement('canvas');
    canvas.className = 'intro-canvas';
    canvas.id = 'intro-canvas';
    overlay.appendChild(canvas);

    const content = document.createElement('div');
    content.className = 'intro-content';

    content.innerHTML = `
      <h1 class="intro-brand" dir="ltr">Aurora</h1>
      <p class="intro-quote">"Strategy Meets Storytelling"</p>
      <div class="intro-logo-wrapper">
        <img src="assets/img/overlayLogo.png" alt="Aurora logo" class="intro-logo" aria-hidden="true" />
      </div>
      <button id="intro-start" class="intro-start-btn">Start</button>
      <div class="intro-hint">Tap Start to enter</div>
    `;
    overlay.appendChild(content);

    document.body.appendChild(overlay);
    document.body.classList.add('intro-active');
    document.documentElement.classList.add('intro-active');
    return overlay;
  }

  function showOverlayOnce() {
    if (sessionStorage.getItem(STORAGE_KEY)) return null;
    return createOverlay();
  }

  const overlay = showOverlayOnce();
  if (!overlay) return;

  const contentEl = overlay.querySelector('.intro-content');
  const startBtn = overlay.querySelector('#intro-start');
  const logoWrapper = overlay.querySelector('.intro-logo-wrapper');
  let exclusionZone = null;
  const canvasOffset = { x: 0, y: 0 };

  // canvas particle system
  const canvas = document.getElementById('intro-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let img = new Image();
  img.src = 'assets/img/logo.png';
  let width = 0,
    height = 0,
    dpr = Math.max(1, window.devicePixelRatio || 1);
  let mouse = { x: null, y: null, vx: 0, vy: 0, moving: false };

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    updateExclusionZone();
    initParticles();
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function updateExclusionZone() {
    if (!contentEl) return;

    if (width <= 520) {
      exclusionZone = null;
      return;
    }

    const rect = contentEl.getBoundingClientRect();
    const padding = Math.max(8, Math.min(14, width * 0.02));
    exclusionZone = {
      left: Math.max(0, rect.left - padding),
      top: Math.max(0, rect.top - padding),
      right: Math.min(width, rect.right + padding),
      bottom: Math.min(height, rect.bottom + padding),
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2,
    };
  }

  function initParticles() {
    particles = [];
    const area = width * height;
    const count = Math.min(220, Math.max(180, Math.floor(area / 1600)));
    const centerExtra = Math.round(count * 0.22);
    const outerCount = count - centerExtra;
    const zone = exclusionZone;
    const centerPaddingX = width * 0.2;
    const centerPaddingY = height * 0.2;

    for (let i = 0; i < outerCount; i++) {
      let x,
        y,
        attempts = 0;
      do {
        x = Math.random() * width;
        y = Math.random() * height;
        attempts += 1;
      } while (
        zone &&
        x > zone.left &&
        x < zone.right &&
        y > zone.top &&
        y < zone.bottom &&
        attempts < 80
      );

      const size = rand(8, 20);
      particles.push({
        x,
        y,
        ox: x,
        oy: y,
        vx: 0,
        vy: 0,
        size,
        r: size / 2 + rand(-2, 2),
        scale: 1,
        wob: rand(0.5, 1.5),
      });
    }

    for (let i = 0; i < centerExtra; i++) {
      let x,
        y,
        attempts = 0;
      do {
        x = width / 2 + rand(-centerPaddingX, centerPaddingX);
        y = height / 2 + rand(-centerPaddingY, centerPaddingY);
        attempts += 1;
      } while (
        zone &&
        x > zone.left &&
        x < zone.right &&
        y > zone.top &&
        y < zone.bottom &&
        attempts < 80
      );

      const size = rand(8, 18);
      particles.push({
        x,
        y,
        ox: x,
        oy: y,
        vx: 0,
        vy: 0,
        size,
        r: size / 2 + rand(-2, 2),
        scale: 1,
        wob: rand(0.5, 1.5),
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';
    ctx.save();
    ctx.translate(canvasOffset.x, canvasOffset.y);

    particles.forEach((p) => {
      // simple glow
      ctx.beginPath();
      ctx.fillStyle = 'rgba(26,180,170,0.06)';
      ctx.arc(p.x, p.y, p.r * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // image clipped circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      // draw image centered in circle scaled
      if (img.complete) {
        const s = p.r * 2;
        ctx.drawImage(img, p.x - p.r, p.y - p.r, s, s);
      } else {
        // fallback circle
        ctx.fillStyle = 'rgba(26,180,170,0.9)';
        ctx.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      }
      ctx.restore();
    });

    ctx.restore();
  }

  function update() {
    const centerX = width / 2;
    const centerY = height / 2;
    const centerRadius = Math.min(width, height) * 0.22;

    particles.forEach((p) => {
      // magnetic attraction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = Math.min(Math.max(width, height) * 0.2, 260);
        if (dist > 0 && dist < maxDist) {
          const force = (1 - dist / maxDist) * 0.95;
          p.vx += (dx / dist) * force * (0.6 + p.wob * 0.25);
          p.vy += (dy / dist) * force * (0.6 + p.wob * 0.25);
        }
      }

      if (exclusionZone) {
        const insideX = p.x > exclusionZone.left && p.x < exclusionZone.right;
        const insideY = p.y > exclusionZone.top && p.y < exclusionZone.bottom;
        if (insideX && insideY) {
          const dx = p.x - exclusionZone.centerX;
          const dy = p.y - exclusionZone.centerY;
          const dist = Math.max(0.1, Math.sqrt(dx * dx + dy * dy));
          const distanceRatio = Math.max(
            Math.abs(dx) / (exclusionZone.width / 2),
            Math.abs(dy) / (exclusionZone.height / 2),
          );
          const repel = 0.95 * (1 - distanceRatio) + 0.24;
          p.vx += (dx / dist) * repel;
          p.vy += (dy / dist) * repel;
        }
      }

      // attraction back to origin
      p.vx += (p.ox - p.x) * 0.02;
      p.vy += (p.oy - p.y) * 0.02;

      // friction
      p.vx *= 0.88;
      p.vy *= 0.88;
      p.x += p.vx;
      p.y += p.vy;
    });
  }

  let rafId = null;
  let textLoopTimeout = null;

  function clearTextLoop() {
    if (textLoopTimeout) {
      clearTimeout(textLoopTimeout);
      textLoopTimeout = null;
    }
  }

  function startTextLoop(el, text, options = {}) {
    const {
      initialDelay = 400,
      typeSpeed = 80,
      deleteSpeed = 50,
      holdTime = 1200,
      pauseTime = 1000,
    } = options;

    clearTextLoop();
    el.textContent = '';

    let index = 0;
    let phase = 'typing';

    function step() {
      if (phase === 'typing') {
        index += 1;
        el.textContent = text.slice(0, index);
        if (index < text.length) {
          textLoopTimeout = setTimeout(step, typeSpeed);
          return;
        }
        phase = 'holding';
        textLoopTimeout = setTimeout(step, holdTime);
        return;
      }

      if (phase === 'holding') {
        phase = 'deleting';
        textLoopTimeout = setTimeout(step, deleteSpeed);
        return;
      }

      if (phase === 'deleting') {
        index -= 1;
        el.textContent = text.slice(0, index);
        if (index > 0) {
          textLoopTimeout = setTimeout(step, deleteSpeed);
          return;
        }
        phase = 'pause';
        textLoopTimeout = setTimeout(step, pauseTime);
        return;
      }

      if (phase === 'pause') {
        phase = 'typing';
        index = 0;
        el.textContent = '';
        textLoopTimeout = setTimeout(step, typeSpeed);
        return;
      }
    }

    textLoopTimeout = setTimeout(step, initialDelay);
  }
  function loop() {
    update();
    draw();
    rafId = requestAnimationFrame(loop);
  }

  // mouse handlers
  let idleTimer = null;
  function onMove(e) {
    mouse.x =
      e.clientX ||
      (e.touches && e.touches[0] && e.touches[0].clientX) ||
      mouse.x;
    mouse.y =
      e.clientY ||
      (e.touches && e.touches[0] && e.touches[0].clientY) ||
      mouse.y;
    mouse.moving = true;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      mouse.x = null;
      mouse.y = null;
      mouse.moving = false;
    }, 800);
  }

  function start() {
    resize();
    initGsap();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    loop();
  }

  function initGsap() {
    if (typeof gsap === 'undefined') return;

    gsap.to(canvasOffset, {
      x: 16,
      y: 10,
      duration: 8,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });

    const brandEl = overlay.querySelector('.intro-brand');
    const quoteEl = overlay.querySelector('.intro-quote');

    if (brandEl) {
      brandEl.style.opacity = '1';
      brandEl.style.transform = 'translateY(0)';
      brandEl.textContent = '';
      startTextLoop(brandEl, 'Aurora', {
        initialDelay: 80,
        typeSpeed: 70,
        deleteSpeed: 45,
        holdTime: 1200,
        pauseTime: 950,
      });
      quoteEl.style.opacity = '1';
      quoteEl.style.transform = 'translateY(0)';
      quoteEl.textContent = '"Strategy Meets Storytelling"';
    }

    gsap.to(canvasOffset, {
      x: 16,
      y: 10,
      duration: 8,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });

    gsap.to('.intro-brand', {
      scale: 1.02,
      duration: 1.4,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      transformOrigin: 'center center',
      repeatDelay: 2.4,
    });

    gsap.to('.intro-hint', {
      y: 2,
      opacity: 1,
      duration: 2.8,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: 0.8,
    });

    if (startBtn) {
      startBtn.addEventListener('pointerenter', () => {
        startBtn.classList.add('hover');
      });
      startBtn.addEventListener('pointerleave', () => {
        startBtn.classList.remove('hover');
        startBtn.classList.remove('pressed');
      });
      startBtn.addEventListener('pointerdown', () => {
        startBtn.classList.add('pressed');
      });
      startBtn.addEventListener('pointerup', () => {
        startBtn.classList.remove('pressed');
      });
      startBtn.addEventListener('pointercancel', () => {
        startBtn.classList.remove('pressed');
      });
    }
  }

  // start button
  startBtn.addEventListener('click', function () {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch (e) {}

    if (typeof gsap === 'undefined') {
      overlay.classList.add('hidden');
      document.body.classList.remove('intro-active');
      document.documentElement.classList.remove('intro-active');
      setTimeout(() => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 400);
      return;
    }

    // ===== نوقف أنيميشن الكتابة =====
    clearTextLoop();

    // ===== مهم: نشيل مستمعي اللمس والماوس فورًا =====
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('touchmove', onMove);
    mouse.x = null;
    mouse.y = null;

    // ===== نظهر الصفحة الرئيسية =====
    document.body.classList.remove('intro-active');
    document.documentElement.classList.remove('intro-active');

    // ===== خلفية شفافة =====
    gsap.set(overlay, {
      backgroundColor: 'transparent',
      backgroundImage: 'none',
    });

    // ===== نخفي كل المحتوى فورًا =====
    gsap.to([startBtn, contentEl], {
      autoAlpha: 0,
      duration: 0.15,
      ease: 'power2.out',
    });

    // ===== ندي للجزيئات قوة تفرق =====
    particles.forEach((p) => {
      const angle = Math.random() * Math.PI * 2;
      const force = 10 + Math.random() * 18;
      p.vx = Math.cos(angle) * force;
      p.vy = Math.sin(angle) * force;
    });

    // ===== الجزيئات تطير ومش تتأثر بأي حاجة =====
    update = function () {
      particles.forEach((p) => {
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.x += p.vx;
        p.y += p.vy;
        p.r *= 0.978;
      });
    };

    // ===== اختفاء ناعم =====
    gsap.to(overlay, {
      autoAlpha: 0,
      duration: 1.5,
      ease: 'power1.out',
      delay: 0.1,
      onComplete: () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', resize);

        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      },
    });
  });

  // allow click outside to close
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) {
      startBtn.click();
    }
  });

  // init when image loaded to ensure particles show logo
  img.addEventListener('load', () => {
    start();
  });
  // fallback if image fails
  setTimeout(() => {
    if (!img.complete) start();
  }, 600);

  // ensure exclusion zone updates if font loading or layout shifts
  window.requestAnimationFrame(updateExclusionZone);
})();
