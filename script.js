const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');
const enquiryForm = document.getElementById('enquiry-form');
const formFeedback = document.querySelector('.form-feedback');
const yearEl = document.getElementById('current-year');
const billingToggle = document.querySelector('.billing-toggle');
const pricingCards = document.querySelectorAll('.pricing-card[data-plan]');
const faqItems = document.querySelectorAll('.faq-item');
const revealElements = document.querySelectorAll('.reveal');

const setNavState = (expanded) => {
  navToggle.setAttribute('aria-expanded', expanded.toString());
  navMenu.setAttribute('aria-hidden', (!expanded).toString());
};

if (navToggle && navMenu) {
  setNavState(false);

  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    setNavState(!expanded);
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        setNavState(false);
      }
    });
  });
}

const validateForm = (form) => {
  const formData = new FormData(form);
  const entries = Object.fromEntries(formData.entries());
  const errors = [];

  if (!entries.name || entries.name.trim().length < 2) {
    errors.push('Please enter your full name.');
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!entries.email || !emailPattern.test(entries.email)) {
    errors.push('Please enter a valid work email.');
  }

  if (!entries.company || entries.company.trim().length < 2) {
    errors.push('Please tell us your company name.');
  }

  if (!entries.teamSize) {
    errors.push('Select your team size.');
  }

  if (!form.querySelector('#consent').checked) {
    errors.push('Please accept the consent checkbox.');
  }

  return { entries, errors };
};

if (enquiryForm && formFeedback) {
  enquiryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formFeedback.textContent = '';
    formFeedback.style.color = 'var(--color-secondary)';

    const { errors } = validateForm(enquiryForm);

    if (errors.length) {
      formFeedback.textContent = errors[0];
      formFeedback.style.color = '#ff9494';
      return;
    }

    formFeedback.textContent = 'Thanks! A product specialist will reach out shortly.';
    enquiryForm.reset();
    setTimeout(() => {
      formFeedback.textContent = '';
    }, 6000);
  });
}

const priceFormatter = new Intl.NumberFormat('en-GB', {
  maximumFractionDigits: 0,
});

const updateBilling = (billing) => {
  pricingCards.forEach((card) => {
    const priceValue = card.dataset[`${billing}Price`];
    const caption = card.dataset[`${billing}Caption`];
    const priceEl = card.querySelector('.price-value');
    const suffixEl = card.querySelector('.price span:last-child');
    const captionEl = card.querySelector('.price-sub');

    if (priceEl && priceValue) {
      priceEl.textContent = priceFormatter.format(Number(priceValue));
    }

    if (suffixEl) {
      suffixEl.textContent = billing === 'annual' ? '/mo*' : '/mo';
    }

    if (captionEl && caption) {
      captionEl.textContent = caption;
    }
  });
};

if (billingToggle && pricingCards.length) {
  const toggleOptions = billingToggle.querySelectorAll('.toggle-option');

  toggleOptions.forEach((option) => {
    option.addEventListener('click', () => {
      if (option.classList.contains('active')) return;

      toggleOptions.forEach((btn) => {
        btn.classList.toggle('active', btn === option);
      });

      updateBilling(option.dataset.billing || 'monthly');
    });
  });

  updateBilling('monthly');
}

if (faqItems.length) {
  faqItems.forEach((item) => {
    item.addEventListener('click', () => {
      const isExpanded = item.getAttribute('aria-expanded') === 'true';
      faqItems.forEach((faq) => {
        faq.setAttribute('aria-expanded', faq === item && !isExpanded ? 'true' : 'false');
      });
    });
  });
}

if (revealElements.length) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('in-view'));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    revealElements.forEach((element) => observer.observe(element));
  }
}

if (yearEl) {
  yearEl.textContent = new Date().getFullYear().toString();
}
