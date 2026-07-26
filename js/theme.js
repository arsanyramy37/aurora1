/* ==========================================================================
   Aurora Marketing Agency - Dark/Light Theme Switcher
   ========================================================================== */

(function () {
  const THEME_KEY = 'aurora_theme';

  // Get current or system theme
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  // Apply theme to document element IMMEDIATELY (no flashing)
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem(THEME_KEY, theme);
    updateThemeIcons(theme);
  }

  // Apply theme before DOM content loads to prevent white flash
  applyTheme(getPreferredTheme());

  // Update theme toggle button icons
  function updateThemeIcons(theme) {
    const themeBtns = document.querySelectorAll('.theme-toggle');
    themeBtns.forEach((btn) => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'fas fa-sun';
          btn.setAttribute('aria-label', 'Switch to Light Mode');
        } else {
          icon.className = 'fas fa-moon';
          btn.setAttribute('aria-label', 'Switch to Dark Mode');
        }
      }
    });
  }

  // Toggle function
  function toggleTheme() {
    const currentTheme =
      document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  }

  // Initialize Theme on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    const themeBtns = document.querySelectorAll('.theme-toggle');
    themeBtns.forEach((btn) => {
      btn.addEventListener('click', toggleTheme);
    });

    // Listen to OS theme changes if user has no stored preference
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!localStorage.getItem(THEME_KEY)) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
  });
})();
