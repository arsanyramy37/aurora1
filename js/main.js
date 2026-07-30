/* ==========================================================================
   Aurora Marketing Agency - Main Interactive Features & Portfolio Filters
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Portfolio Filtering Logic
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active filter button state
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioCards.forEach((card) => {
        const category = card.getAttribute('data-category');

        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          card.classList.add('animate-scale');
          setTimeout(() => card.classList.remove('animate-scale'), 500);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Testimonials Slider Logic
  const testimonials = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.dot-indicators .dot');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  let currentIndex = 0;
  let autoSlideTimer = null;

  function showTestimonial(index) {
    if (testimonials.length === 0) return;

    if (index < 0) index = testimonials.length - 1;
    if (index >= testimonials.length) index = 0;

    currentIndex = index;

    testimonials.forEach((card, i) => {
      if (i === currentIndex) {
        card.style.display = 'block';
        card.classList.add('animate-fade-up');
      } else {
        card.style.display = 'none';
        card.classList.remove('animate-fade-up');
      }
    });

    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function nextTestimonial() {
    showTestimonial(currentIndex + 1);
  }

  function prevTestimonial() {
    showTestimonial(currentIndex - 1);
  }

  if (testimonials.length > 0) {
    showTestimonial(0);

    nextBtn?.addEventListener('click', () => {
      nextTestimonial();
      resetTimer();
    });

    prevBtn?.addEventListener('click', () => {
      prevTestimonial();
      resetTimer();
    });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        showTestimonial(i);
        resetTimer();
      });
    });

    function startTimer() {
      autoSlideTimer = setInterval(nextTestimonial, 6000);
    }

    function resetTimer() {
      clearInterval(autoSlideTimer);
      startTimer();
    }

    startTimer();
  }

  // Page Transition with Loading Ripple Effect
  const pageLoader = document.querySelector('.page-loader');
  const navLinks = document.querySelectorAll('a[href*=".html"]');

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      // Check if it's an internal navigation link (not the current page)
      const href = link.getAttribute('href');
      const currentPage =
        window.location.pathname.split('/').pop() || 'index.html';

      // Only show loader for different pages
      if (href && href !== currentPage && !href.startsWith('#')) {
        e.preventDefault();

        // Show the loader
        if (pageLoader) {
          pageLoader.classList.add('active');
        }

        // Navigate after a short delay for the ripple animation
        setTimeout(() => {
          window.location.href = href;
        }, 600);
      }
    });
  });
});
