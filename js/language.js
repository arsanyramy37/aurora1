/* ==========================================================================
   Aurora Marketing Agency - i18n & RTL/LTR Language Switcher
   ========================================================================== */

(function () {
  const LANG_KEY = 'aurora_lang';
  let translations = {};

  // Inline Fallback Dictionary for File Protocol / Instant Render
  const fallbackDictionary = {
    en: {
      'nav.home': 'Home',
      'nav.about': 'About Us',
      'nav.services': 'Services',
      'nav.clients': 'Clients & Work',
      'nav.contact': 'Contact Us',
      'nav.cta': 'Get Started',
      'hero.tag': 'Next-Gen Marketing Agency',
      'hero.title_1': 'Elevate Your Brand With ',
      'hero.title_highlight': 'Data-Driven Marketing',
      'hero.desc':
        'Aurora is a full-service marketing agency crafting high-impact digital strategies, brand identities, and paid campaigns that accelerate business growth.',
      'hero.btn_primary': 'Launch Your Project',
      'hero.btn_secondary': 'Explore Our Work',
      'hero.trust_text': 'Trusted by 150+ growing brands worldwide',
      'stats.projects': 'Projects Delivered',
      'stats.satisfaction': 'Client Satisfaction',
      'stats.roi': 'Average ROI Increase',
      'stats.awards': 'Industry Awards',
      'about_preview.tag': 'Who We Are',
      'about_preview.title': 'We Turn Creative Ideas Into Market Leaders',
      'about_preview.desc':
        'At Aurora, we fuse innovative design, psychological strategy, and performance metrics to position your business at the forefront of your industry.',
      'about_preview.read_more': 'Learn More About Us',
      'services.tag': 'What We Do',
      'services.title': 'Comprehensive Marketing Solutions',
      'services.subtitle':
        'Tailored strategies designed to scale your brand across all digital channels.',
      'portfolio.tag': 'Our Showcase',
      'portfolio.title': 'Selected Success Stories',
      'portfolio.filter_all': 'All Projects',
      'portfolio.filter_social': 'Social Media',
      'portfolio.filter_brand': 'Brand Identity',
      'portfolio.filter_ads': 'Paid Ads',
      'portfolio.filter_web': 'Web Design',
      'testimonials.tag': 'Client Reviews',
      'testimonials.title': 'What Partners Say About Aurora',
      'cta.title': 'Ready to Transform Your Marketing Strategy?',
      'cta.subtitle':
        'Schedule a strategy call with our growth specialists and receive a custom marketing roadmap.',
      'cta.btn': 'Contact Us Today',
      'footer.brand_desc':
        'Aurora is an innovative marketing agency driving measurable business growth through design, data, and creative storytelling.',
      'footer.quick_links': 'Quick Links',
      'footer.services_heading': 'Core Services',
      'footer.contact_heading': 'Get in Touch',
      'footer.rights':
        'All rights reserved. Designed with passion for excellence.',
    },
    ar: {
      'nav.home': 'الرئيسية',
      'nav.about': 'من نحن',
      'nav.services': 'خدماتنا',
      'nav.clients': 'عملاؤنا وأعمالنا',
      'nav.contact': 'تواصل معنا',
      'nav.cta': 'ابدأ الآن',
      'hero.tag': 'وكالة تسويق مبتكرة من الجيل الجديد',
      'hero.title_1': 'ارتقِ بعلامتك التجارية مع ',
      'hero.title_highlight': 'التسويق الموجه بالبيانات',
      'hero.desc':
        'Aurora هي وكالة تسويق متكاملة تصمم استراتيجيات رقمية عالية التأثير، وهويات تجارية مميزة، وحملات إعلانية مدفوعة تسرّع نمو أعمالك.',
      'hero.btn_primary': 'اطلاق مشروعك الآن',
      'hero.btn_secondary': 'استكشف أعمالنا',
      'hero.trust_text': 'موثوق بنا من أكثر من 150 علامة تجارية رائدة عالمياً',
      'stats.projects': 'مشروع مُنجز',
      'stats.satisfaction': 'نسبة رضا العملاء',
      'stats.roi': 'متوسط زيادة عائد الاستثمار',
      'stats.awards': 'جائزة تسويقية',
      'about_preview.tag': 'من نحن',
      'about_preview.title': 'نحوّل الأفكار الإبداعية إلى قادة في السوق',
      'about_preview.desc':
        'في Aurora، ندمج بين التصميم المبتكر، الاستراتيجية النفسية، ومقاييس الأداء لوضع شركتك في طليعة مجالها.',
      'about_preview.read_more': 'اعرف المزيد عنا',
      'services.tag': 'ماذا نقدم',
      'services.title': 'حلول تسويقية متكاملة',
      'services.subtitle':
        'استراتيجيات مخصصة مصممة لتوسيع نطاق عملك عبر جميع القنوات الرقمية.',
      'portfolio.tag': 'معرض أعمالنا',
      'portfolio.title': 'قصص نجاح مختارة',
      'portfolio.filter_all': 'جميع المشاريع',
      'portfolio.filter_social': 'سوشيال ميديا',
      'portfolio.filter_brand': 'هوية تجارية',
      'portfolio.filter_ads': 'إعلانات مدفوعة',
      'portfolio.filter_web': 'تصميم مواقع',
      'testimonials.tag': 'آراء العملاء',
      'testimonials.title': 'ماذا يقول شركاؤنا عن Aurora',
      'cta.title': 'هل أنت مستعد لتحويل استراتيجيتك التسويقية؟',
      'cta.subtitle':
        'احجز جلسة استشارية مع خبراء النمو لدينا واحصل على خطة تسويقية مخصصة لمشروعك.',
      'cta.btn': 'تواصل معنا اليوم',
      'footer.brand_desc':
        'Aurora هي وكالة تسويق مبتكرة تقود النمو الفعلي للأعمال من خلال التصميم، البيانات، وصناعة المحتوى الإبداعي.',
      'footer.quick_links': 'روابط سريعة',
      'footer.services_heading': 'خدماتنا الرئيسية',
      'footer.contact_heading': 'معلومات التواصل',
      'footer.rights': 'جميع الحقوق محفوظة. صُمم بشغف للتميز.',
    },
  };

  function getSavedLang() {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'ar' || saved === 'en') {
      return saved;
    }
    // Default to English
    return 'en';
  }

  async function loadTranslations(lang) {
    try {
      const response = await fetch(`./locales/${lang}.json`);
      if (response.ok) {
        const data = await response.json();
        translations[lang] = data || fallbackDictionary[lang];
      } else {
        console.warn(`Failed to load ${lang}.json, using fallback`);
        translations[lang] = fallbackDictionary[lang];
      }
    } catch (e) {
      console.warn(`Error loading ${lang}.json:`, e);
      translations[lang] = fallbackDictionary[lang];
    }
  }

  // Nested key lookup helper: e.g. "hero.title_1"
  function getNestedValue(obj, keyPath) {
    if (!obj) return null;
    if (obj[keyPath]) return obj[keyPath];
    return keyPath
      .split('.')
      .reduce(
        (prev, curr) => (prev && prev[curr] !== undefined ? prev[curr] : null),
        obj,
      );
  }

  async function setLanguage(lang) {
    // Ensure valid language
    if (lang !== 'ar' && lang !== 'en') {
      lang = 'en';
    }

    // Save to localStorage FIRST to persist across page loads
    localStorage.setItem(LANG_KEY, lang);

    if (!translations[lang]) {
      await loadTranslations(lang);
    }

    const dict = translations[lang] || fallbackDictionary[lang];

    // Set document direction & lang attributes
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.dispatchEvent(new CustomEvent('aurora:languagechange', { detail: { lang } }));

    // Update text contents with fade effect to prevent overlapping
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach((el, index) => {
      const key = el.getAttribute('data-i18n');
      const val = getNestedValue(dict, key);
      if (val) {
        el.style.opacity = '0';
        setTimeout(() => {
          el.textContent = val;
          el.style.opacity = '1';
        }, index * 5);
      }
    });

    // Update text with transition effect
    const style = document.createElement('style');
    style.textContent = '[data-i18n] { transition: opacity 0.2s ease-in-out; }';
    document.head.appendChild(style);

    // Update input placeholders
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = getNestedValue(dict, key);
      if (val) {
        el.setAttribute('placeholder', val);
      }
    });

    // Update active button state
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const currentLang = getSavedLang();
    setLanguage(currentLang);

    // Language button listeners
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const selectedLang = btn.getAttribute('data-lang');
        if (selectedLang === 'ar' || selectedLang === 'en') {
          setLanguage(selectedLang);
        }
      });
    });

    // Ensure language persists on page navigation
    window.addEventListener('beforeunload', () => {
      const currentLang =
        document.documentElement.getAttribute('lang') || getSavedLang();
      localStorage.setItem(LANG_KEY, currentLang);
    });
  });

  window.setAuroraLanguage = setLanguage;
})();
