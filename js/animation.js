/* ==========================================================================
   Aurora Marketing Agency - Scroll Reveal & Statistics Counter Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for Scroll Reveals
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Animated Number Counter
  const counterElements = document.querySelectorAll('.stat-number');
  let hasCounted = false;

  function startCounters() {
    counterElements.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target') || '0', 10);
      const suffix = counter.getAttribute('data-suffix') || '';
      const prefix = counter.getAttribute('data-prefix') || '';
      const duration = 2000; // 2 seconds
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Ease out quadratic calculation
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeProgress * target);

        counter.textContent = `${prefix}${currentVal}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = `${prefix}${target}${suffix}`;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // Observe statistics section to trigger counter
  const statsSection = document.querySelector('.stats-banner');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasCounted) {
          hasCounted = true;
          startCounters();
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  // Hero Card Floating Mouse Parallax
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    heroVisual.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = heroVisual.getBoundingClientRect();
      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;

      const mainCard = heroVisual.querySelector('.hero-card-main');
      if (mainCard) {
        mainCard.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
      }
    });

    heroVisual.addEventListener('mouseleave', () => {
      const mainCard = heroVisual.querySelector('.hero-card-main');
      if (mainCard) {
        mainCard.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
      }
    });
  }
});
