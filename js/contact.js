/* ==========================================================================
   Aurora Marketing Agency - Form Validation & FAQ Accordion
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('auroraContactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('formName');
      const emailInput = document.getElementById('formEmail');
      const phoneInput = document.getElementById('formPhone');
      const messageInput = document.getElementById('formMessage');
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const successFeedback = document.getElementById('formSuccessMessage');

      let isValid = true;

      // Reset errors
      [nameInput, emailInput, phoneInput, messageInput].forEach(input => {
        if (input) input.classList.remove('error');
      });

      // Name validation
      if (!nameInput || nameInput.value.trim() === '') {
        nameInput?.classList.add('error');
        isValid = false;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
        emailInput?.classList.add('error');
        isValid = false;
      }

      // Phone validation (minimum 6 digits)
      if (!phoneInput || phoneInput.value.trim().length < 6) {
        phoneInput?.classList.add('error');
        isValid = false;
      }

      // Message validation
      if (!messageInput || messageInput.value.trim().length < 10) {
        messageInput?.classList.add('error');
        isValid = false;
      }

      if (isValid) {
        // Show loading state on button
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          contactForm.reset();

          if (successFeedback) {
            successFeedback.style.display = 'block';
            successFeedback.classList.add('animate-fade-up');
            setTimeout(() => {
              successFeedback.style.display = 'none';
            }, 6000);
          }
        }, 1200);
      }
    });

    // Real-time input error clearing
    contactForm.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
      });
    });
  }

  // FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    header?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all active items
      faqItems.forEach(other => other.classList.remove('active'));

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
});
