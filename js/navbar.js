/* ==========================================================================
   Aurora Marketing Agency - Navbar & Scroll Behavior
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerOverlay = document.querySelector('.drawer-overlay');
  const drawerClose = document.querySelector('.drawer-close');
  const scrollTopBtn = document.querySelector('.scroll-top-btn');

  // Sticky Header on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Scroll to Top Button Visibility
    if (window.scrollY > 400) {
      scrollTopBtn?.classList.add('visible');
    } else {
      scrollTopBtn?.classList.remove('visible');
    }
  });

  // Mobile Drawer Toggle
  function openMobileNav() {
    mobileDrawer?.classList.add('open');
    drawerOverlay?.classList.add('open');
    // Defer overflow change to next frame for smoother animation
    requestAnimationFrame(() => {
      document.body.style.overflow = 'hidden';
    });
  }

  function closeMobileNav() {
    if (!mobileDrawer || !drawerOverlay) return;

    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');

    const onTransitionEnd = (event) => {
      if (event.target !== mobileDrawer || event.propertyName !== 'transform')
        return;
      document.body.style.overflow = '';
      mobileDrawer.removeEventListener('transitionend', onTransitionEnd);
    };

    mobileDrawer.addEventListener('transitionend', onTransitionEnd);
  }

  mobileToggle?.addEventListener('click', openMobileNav);
  drawerOverlay?.addEventListener('click', closeMobileNav);
  drawerClose?.addEventListener('click', closeMobileNav);

  // Close drawer on link click
  document.querySelectorAll('.mobile-drawer .nav-link').forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });

  // Active Link Highlighting based on Page URL
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Scroll To Top Click
  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
});
